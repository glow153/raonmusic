import os
import subprocess
import datetime

pitch_code = {
  -2:"rest",
  -1:"rest",
  0:"C0",
  1:"C#0/Db0",
  2:"D0",
  3:"D#0/Eb0",
  4:"E0",
  5:"F0",
  6:"F#0/Gb0",
  7:"G0",
  8:"G#0/Ab0",
  9:"A0",
  10:"A#0/Bb0",
  11:"B0",
  12:"C1",
  13:"C#1/Db1",
  14:"D1",
  15:"D#1/Eb1",
  16:"E1",
  17:"F1",
  18:"F#1/Gb1",
  19:"G1",
  20:"G#1/1",
  21:"A1",
  22:"A#1/Bb1",
  23:"B1",
  24:"C2",
  25:"C#2/Db2",
  26:"D2",
  27:"D#2/Eb2",
  28:"E2",
  29:"F2",
  30:"F#2/Gb2",
  31:"G2",
  32:"G#2/Ab2",
  33:"A2",
  34:"A#2/Bb2",
  35:"B2",
  36:"C3",
  37:"C#3/Db3",
  38:"D3",
  39:"D#3/Eb3",
  40:"E3",
  41:"F3",
  42:"F#3/Gb3",
  43:"G3",
  44:"G#3/Ab3",
  45:"A3",
  46:"A#3/Bb3",
  47:"B3",
  48:"C4",
  49:"C#4/Db4",
  50:"D4",
  51:"D#4/Eb4",
  52:"E4",
  53:"F4",
  54:"F#4/Gb4",
  55:"G4",
  56:"G#4/Ab4",
  57:"A4",
  58:"A#4/Bb4",
  59:"B4",
  60:"C5",
  61:"C#5/Db5",
  62:"D5",
  63:"D#5/Eb5",
  64:"E5",
  65:"F5",
  66:"F#5/Gb5",
  67:"G5",
  68:"G#5/Ab5",
  69:"A5",
  70:"A#5/Bb5",
  71:"B5",
  72:"C6",
  73:"C#6/Db6",
  74:"D6",
  75:"D#6/Eb6",
  76:"E6",
  77:"F6",
  78:"F#6/Gb6",
  79:"G6",
  80:"G#6/Ab6",
  81:"A6",
  82:"A#6/Bb6",
  83:"B6",
  84:"C7",
  85:"C#7/Db7",
  86:"D7",
  87:"D#7/Eb7",
  88:"E7",
  89:"F7",
  90:"F#7/Gb7",
  91:"G7",
  92:"G#7/Ab7",
  93:"A7",
  94:"A#7/Bb7",
  95:"B7",
  96:"C8"
}

cwd="/home/raondata/SVS/raonmusic/backend/ai/DiffSinger"
myenv = dict(os.environ)
myenv["PATH"] = myenv["PATH"] + ";" + cwd


def cmd(command):
    subp = subprocess.Popen(command,shell=True,stdout=subprocess.PIPE,cwd=cwd, env=myenv)
    try:
        subp.wait()
    except:
        print("ERR")
        os.killpg(os.getpgid(subp.pid),9)
    if subp.poll()==0:
        logs = subp.stdout.read()
        logs = bytes.decode(logs)
        print(logs)

def save_inference_logs(notedata):
    infer_logs = "/home/raondata/SVS/raonmusic/backend/ai/infer_logs/infer.log"
    # notes list
    notes_info = notedata['notes']
    # config dict
    config = notedata["config"]
    #file_id (currenttime)
    file_id = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    # bpm int
    bpm_count = config["tempo"]["count"]
    bpm_beat = config["tempo"]["beat"]
    # language string
    model_language = config["lang"]
    text_list = [x["phoneme"] for x in notes_info]
    text = ''.join(text_list)
    notes_list = [pitch_code[x["pitch"]] for x in notes_info]
    notes_duration_list = [x["duration"]*60/(bpm_beat*bpm_count) for x in notes_info]
    notes_legato = []
    notes_duration_legato = []

    for i in text_list:
      if i !='-':
        notes_legato.append(notes_list.pop(0))
        notes_duration_legato.append(str(notes_duration_list.pop(0)))
      else:
        notes_legato[-1] = notes_legato[-1]+" "+notes_list.pop(0)
        notes_duration_legato[-1] = str(notes_duration_legato[-1])+" "+str(notes_duration_list.pop(0))
    notes = ' | '.join(notes_legato)
    notes_duration = ' | '.join(notes_duration_legato)
    input_type = 'word'
    saved_log = [model_language,file_id,text,notes,notes_duration,input_type]
    log = '%'.join(saved_log)
    with open(infer_logs,'a+') as f:
        f.write("\n"+log)






