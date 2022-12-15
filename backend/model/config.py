from enum import Enum

from pydantic import BaseModel

class Tempo:
  count: int
  beat: int

class Key:
  pitch: int
  tone: int

class Time:
  upper: int
  lower: int


class Lang(Enum):
  KO = 'ko'
  CH = 'ch'


class Config(BaseModel):
  tempo: Tempo
  key: Key
  time: Time
  lang: str
