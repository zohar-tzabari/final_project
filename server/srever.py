import json
from PIL import ImageTk
from PIL import Image
import io
from starlette.middleware import Middleware
from fastapi import FastAPI, Request, WebSocket, File, UploadFile, Form,WebSocketDisconnect
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
import tkinter as tk

middleware = [
    Middleware(CORSMiddleware, allow_origins=['*'])
]

app = FastAPI(middleware=middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class name(BaseModel):
    firstName: str


@app.post("/firstTry")
async def video_stream(name_i:name):
    return json.dumps({"status": "ok"})


@app.post("/stream")
async def video_stream(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    print(image)
    return json.dumps({"status": "ok"})


if __name__ == "__main__":
    uvicorn.run(app, host="10.100.102.20", port=8000)
