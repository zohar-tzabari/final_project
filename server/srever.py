import json
import base64
from starlette.middleware import Middleware
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from PIL import Image, ImageTk
import tkinter as tk
import io
import threading


class ImageWindow:
    def __init__(self):
        self.root = tk.Tk()
        self.label = tk.Label(self.root)
        self.label.pack()

    def show_image(self, image_data):
        image = Image.open(io.BytesIO(base64.b64decode(image_data)))
        photo = ImageTk.PhotoImage(image)
        self.label.configure(image=photo)
        self.label.image = photo

    def run(self):
        self.root.mainloop()

window = ImageWindow()

def run_server():
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    class name(BaseModel):
        firstName: str


    async def websocket_handler(websocket: WebSocket):
        await websocket.accept()
        while True:
            try:
                data = await websocket.receive_text()
                data = json.loads(data)
                if data['type'] == 'image':
                    image_data = base64.b64decode(data['data'])
                    # Try to open the image and log any errors
                    dataBytesIO = io.BytesIO(image_data)
                    image = Image.open(dataBytesIO)
                    # Display the image
                    # Display the image in the window
                    window.show_image(data['data'])
                    print("hi zohar")
                # Send a response back to the client
                response = json.dumps({"status": "ok"})
                await websocket.send_text(response)
            except WebSocketDisconnect:
                print("stop")
                break

    @app.websocket("/stream")
    async def video_stream(websocket: WebSocket):
        await websocket_handler(websocket)

    uvicorn.run(app, host="192.168.197.186", port=8000)

if __name__ == "__main__":
    server_thread = threading.Thread(target=run_server)
    server_thread.start()

    window.run()