from ai.svs import cmd,save_inference_logs
notedata = {
  "notes": [
    {"phoneme": "小", "pitch": 49, "duration": 4},
    {"phoneme": "酒", "pitch": 54, "duration": 4},
    {"phoneme": "窝", "pitch": 56, "duration": 4},
    {"phoneme": "SP", "pitch": -1, "duration": 4},
    {"phoneme": "长", "pitch": 58, "duration": 4},
    {"phoneme": "-", "pitch": 54, "duration": 4},
    {"phoneme": "睫", "pitch": 54, "duration": 4},
    {"phoneme": "-", "pitch": 49, "duration": 4},
    {"phoneme": "毛", "pitch": 49, "duration": 4}
  ],
  "config": {
    "tempo": {"count": 90, "beat": 4},
    "key": {"pitch": 0, "tone": 0},
    "time": {"upper": 4, "lower": 4},
    "lang": "cn"
  }
}

notedata = {
  "notes": [
    {"phoneme": "반", "pitch": 49, "duration": 4},
    {"phoneme": "짝", "pitch": 54, "duration": 4},
    {"phoneme": "반", "pitch": 56, "duration": 4},
    # {"phoneme": "SP", "pitch": -1, "duration": 4},
    {"phoneme": "짝", "pitch": 58, "duration": 4},
    {"phoneme": "-", "pitch": 54, "duration": 4},
    {"phoneme": "작", "pitch": 54, "duration": 4},
    {"phoneme": "-", "pitch": 49, "duration": 4},
    {"phoneme": "별", "pitch": 49, "duration": 4}
  ],
  "config": {
    "tempo": {"count": 90, "beat": 4},
    "key": {"pitch": 0, "tone": 0},
    "time": {"upper": 4, "lower": 4},
    "lang": "ko"
  }
}
save_inference_logs(notedata)
model_language = notedata["config"]["lang"]
cmd("sh engine.sh {}".format(model_language))