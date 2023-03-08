import json

from starlette.middleware import Middleware
from fastapi import FastAPI, Request, WebSocket, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

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

# async def parse_map():
#     contents = await file.read()
#     return map_handler.parse_map_from_file(contents)
@app.post("/firstTry")
async def video_stream(name_i:name):
    return json.dumps({"status": "ok"})

if __name__ == "__main__":
    uvicorn.run(app, host="10.100.102.20", port=8000)
