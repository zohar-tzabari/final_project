import json
import base64
import pathlib
import subprocess
import os
import PIL
import torch
import numpy as np
from PIL import ImageDraw
from starlette.middleware import Middleware
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from PIL import Image, ImageTk
import tkinter as tk
import io
import threading
from PIL import Image, ImageTk , ImageOps

IP = "10.100.102.20"
class name(BaseModel):
    firstName: str

class ImageProcess:
    def __init__(self,model):
        # Load the YOLOv5 model
        self.model= model

        # self.model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
        self.current_photo = None
        self.current_boxes = None

        # Define colors for each object class
        self.colors = [(255, 0, 0),   # red for class 0
                       (0, 255, 0),   # green for class 1
                       (0, 0, 255), # blue for class 2
                       (0, 255, 255),
                       (0, 120, 255),
                       (120, 0, 120),
                       (255, 0, 255)]

    def analyze_photo(self,image_data):
        # Run the model on the image
        results = self.model([image_data])

        # Draw bounding boxes around the detected objects
        image_draw = ImageDraw.Draw(image_data)
        boxes = results.xyxy[0]
        for box in boxes:
            x1, y1, x2, y2 = box[0], box[1], box[2], box[3]
            class_id = int(box[5])
            class_name = results.names[class_id]
            color = self.colors[0]
            label = f'{class_name}: {box[4]:.2f}'
            image_draw.rectangle((x1, y1, x2, y2), outline=color, width=3)
            image_draw.rectangle((x1, y1, x1 + len(label) * 8, y1 - 15), fill=color)
            image_draw.text((x1, y1 - 15), label, fill=(255, 255, 255))

        self.current_photo = image_data
        self.current_boxes = boxes

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

# window = ImageWindow()


def run_server(model):
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    async def websocket_handler(websocket: WebSocket):
        await websocket.accept()
        window = ImageProcess(model)
        while True:
            try:
                data = await websocket.receive_text()
                data = json.loads(data)
                response = None
                if data['type'] == 'image':
                    image_data = base64.b64decode(data['data'])
                    # Try to open the image and log any errors
                    dataBytesIO = io.BytesIO(image_data)
                    image = Image.open(dataBytesIO)
                    # print(type(image))
                    # Display the image in the window
                    window.analyze_photo(image)
                    # run_ml(image)
                # Send a response back to the client
                    if window.current_photo and not isinstance(type(window.current_boxes), type(None)):
                        image = window.current_photo
                        # Compress the image using Pillow-SIMD
                        compressed_image = ImageOps.exif_transpose(image)
                        compressed_image = compressed_image.convert('RGB')
                        # compressed_image = compressed_image.resize((640, 480))
                        compressed_image_bytes = io.BytesIO()
                        compressed_image.save(compressed_image_bytes, 'JPEG', quality=60)
                        compressed_image_bytes.seek(0)

                        # Convert the compressed image data to a base64-encoded string
                        compressed_image_data = base64.b64encode(compressed_image_bytes.read()).decode('utf-8')

                        response = json.dumps({"current_photo": compressed_image_data})
                if not response:
                    response = json.dumps({"status": "ok"})
                await websocket.send_text(response)
            except WebSocketDisconnect:
                print("stop")
                break

    @app.websocket("/stream")
    async def video_stream(websocket: WebSocket):
        await websocket_handler(websocket)

    uvicorn.run(app, host=IP, port=8000)

if __name__ == "__main__":
    # model_path = "runs/train/exp4/weights/last.pt"
    # repo_path = pathlib.Path(os.getcwd()).parent
    # absolute_model_path = os.path.join(repo_path, model_path)
    # model = torch.hub.load('ultralytics/yolov5', 'custom',
    #                             path=absolute_model_path, force_reload=True)
    model_path = "runs/train/exp4/weights/last.pt"
    repo_path = pathlib.Path(os.getcwd()).parent
    absolute_model_path = os.path.join(repo_path, model_path)
    model = torch.hub.load('ultralytics/yolov5', 'custom',
                           path=absolute_model_path, force_reload=True)
    server_thread = threading.Thread(target=lambda :run_server(model))
    server_thread.start()