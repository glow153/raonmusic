import json
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from model.song import Song

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
def generate(song: Song):
    return {"result": "true", 'song': json.dumps(song)}