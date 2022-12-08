from enum import Enum

from pydantic import BaseModel


class Time:
  numerator: int
  denominator: int


class Lang(Enum):
  KO = 'ko'
  CH = 'ch'


class Config(BaseModel):
  bpm: int
  key: str
  time: Time
  lang: Lang
