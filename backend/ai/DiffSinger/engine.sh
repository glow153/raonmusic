#!/bin/bash
export PYTHONPATH=.
# export PYTHONPATH="/home/raondata/SVS/raonmusic/backend/ai/DiffSinger/"
# CUDA_VISIBLE_DEVICES=0 python data_gen/tts/bin/binarize.py --config usr/configs/midi/cascade/opencs/aux_rel.yaml 

if [ $1 = "ko" ];then
    echo "selected_model: ko"
    export MY_DS_EXP_NAME=0925namjin70
    /home/raondata/SVS/raonmusic/backend/diff_env/diff_py38/bin/python inference/svs/ds_e2e.py --config usr/configs/midi/e2e/opencpop/ds100_adj_rel.yaml --exp_name $MY_DS_EXP_NAME
elif [ $1 = "cn" ];then
    echo "selected_model: cn"
    export MY_DS_EXP_NAME=0228_opencpop_ds100_rel
    /home/raondata/SVS/raonmusic/backend/diff_env/diff_py38/bin/python inference/svs/ds_e2e.py --config usr/configs/midi/e2e/opencpop/ds100_adj_rel.yaml --exp_name $MY_DS_EXP_NAME
else
    echo "model language error!!!!![cn or ko]"
fi
