from model.config import Config
from model.note import Note
from pydantic import BaseModel


from model.riff import Riff
from model.config import Config


class Song(BaseModel):
  notes: list(Note)
  config: Config