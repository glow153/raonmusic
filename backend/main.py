import os
import json
from typing import Union

from ai.svs import cmd,save_inference_logs
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def index():
    return {"Hello": "World"}

@app.get("/example")
def example(lyric: str):
    return {"lyric": lyric}

@app.post("/generate")
async def generate(request: Request):
    notedata = await request.json()
    file_id = save_inference_logs(notedata)
    model_language = notedata["config"]["lang"]
    cmd("sh engine.sh {}".format(model_language))
    return {"result": "true", 'song': "/result/{}.wav".format(file_id)}

@app.get('/result/{wav_file}')
def result(wav_file: str):
    curr_dir = os.getcwd()
    filepath = f'{curr_dir}/ai/DiffSinger/infer_out/{wav_file}'
    return FileResponse(filepath)
