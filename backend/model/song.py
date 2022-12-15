from pydantic import BaseModel


from model.riff import Riff
from model.config import Config


class Song(BaseModel):
  riff: Riff
  config: Config
