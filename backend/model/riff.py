from pydantic import BaseModel

from backend.model.note import Note


class Riff(BaseModel):
  notes: list(Note)
  
  def duplicate():
     pass