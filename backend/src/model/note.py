from pydantic import BaseModel


class Note(BaseModel):
  phoneme: str
  pitch: int
  duration: int