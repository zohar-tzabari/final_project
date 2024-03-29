from model_handler import LocalModel, ImportedModel, YoloModel
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageTk, ImageOps
from PIL import ImageDraw
from pathlib import Path
import tkinter as tk
import threading
import uvicorn
import base64
import json
import io

IP = "10.100.102.20"


class ImageProcess:
    def __init__(self, item: str, model: YoloModel):
        self.item = item
        self.item_found = False
        self.get_item_to_search = None
        self.model = model
        self.current_photo = None
        self.current_boxes = None

        # Define colors for each object class
        self.colors = [(255, 0, 0),  # red for class 0
                       (0, 255, 0),  # green for class 1
                       (0, 0, 255),  # blue for class 2
                       (0, 255, 255),
                       (0, 120, 255),
                       (120, 0, 120),
                       (255, 0, 255)]
        self.item_to_search = None

    def analyze_photo(self, image_data) -> None:
        # Run the model on the image
        boxes = self.model.analyze_photo(image_data,self.item)
        # Draw bounding boxes around the detected objects
        image_draw = ImageDraw.Draw(image_data)
        self.item_found = len(boxes) > 0
        for box in boxes:
            x1, y1, x2, y2 = box[0], box[1], box[2], box[3]
            color = self.colors[0]
            label = f'{self.item}: {box[4]:.2f}'
            image_draw.rectangle((x1, y1, x2, y2), outline=color, width=3)
            image_draw.rectangle((x1, y1, x1 + len(label) * 8, y1 - 15), fill=color)
            image_draw.text((x1, y1 - 15), label, fill=(255, 255, 255))
        self.current_photo = image_data
        self.current_boxes = boxes

    def set_item_to_search(self, item: str) -> None:
        self.item_to_search = item

    def get_item_to_search(self) -> str:
        return self.item_to_search


class ImageWindow:
    def __init__(self):
        self.root = tk.Tk()
        self.label = tk.Label(self.root)
        self.label.pack()

    def show_image(self, image_data):
        photo = ImageTk.PhotoImage(image_data)
        self.label.configure(image=photo)
        self.label.image = photo

    def run(self):
        self.root.mainloop()



class ModelManager:
    def __init__(self):
        self.keys_model = LocalModel(Path('keys_model/best.pt'))
        self.coins_model = LocalModel(Path('coins_model/best.pt'))
        self.coco_model = ImportedModel('yolov5s')
        print("keys model")
        self.keys_model.load_my_model()
        print("coins model")
        self.coins_model.load_my_model()
        print("coco model")
        self.coco_model.load_coco_model()
        self._item_to_model = {"key": self.keys_model, "coin": self.coins_model}

    def get_model_by_item(self, item: str) -> YoloModel:
        if item not in self._item_to_model.keys():
            return self.coco_model
        return self._item_to_model[item]


class RunServer:
    def __init__(self):
        self.model_manager = ModelManager()
        app = FastAPI()
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        async def websocket_handler(websocket: WebSocket, item: str):
            await websocket.accept()

            ImageProcessCls = ImageProcess(item, self.model_manager.get_model_by_item(item))

            while True:
                try:
                    data = await websocket.receive_text()
                    data = json.loads(data)
                    response = None
                    image_data = base64.b64decode(data['data'])
                    # Try to open the image and log any errors
                    dataBytesIO = io.BytesIO(image_data)
                    image = Image.open(dataBytesIO)
                    # Display the image in the window
                    ImageProcessCls.analyze_photo(image)
                    window.show_image(image)
                    # Send a response back to the client
                    if ImageProcessCls.current_photo and not isinstance(type(ImageProcessCls.current_boxes),
                                                                        type(None)):
                        image = ImageProcessCls.current_photo
                        # Compress the image using Pillow-SIMD
                        compressed_image = ImageOps.exif_transpose(image)
                        compressed_image = compressed_image.convert('RGB')
                        compressed_image_bytes = io.BytesIO()
                        compressed_image.save(compressed_image_bytes, 'JPEG', quality=60)
                        compressed_image_bytes.seek(0)

                        # Convert the compressed image data to a base64-encoded string
                        compressed_image_data = base64.b64encode(compressed_image_bytes.read()).decode('utf-8')

                        response = json.dumps({"current_photo": compressed_image_data,
                                               "isItemFound": str(ImageProcessCls.item_found).lower()})
                    if not response:
                        response = json.dumps({"status": "ok"})
                    await websocket.send_text(response)
                except WebSocketDisconnect:
                    print("stop")
                    break

        @app.websocket("/stream/{item}")
        async def video_stream(websocket: WebSocket, item: str):
            await websocket_handler(websocket, item)

        uvicorn.run(app, host=IP, port=8000)


if __name__ == "__main__":
    window = ImageWindow()
    server_thread = threading.Thread(target=lambda: RunServer())
    server_thread.start()
    window.run()
