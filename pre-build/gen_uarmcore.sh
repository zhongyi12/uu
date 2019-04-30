#!/bin/bash

cd ../../uArm-Python-SDK/
git pull
python setup.py install

cd ../uarm-server/
git pull
pip install -r requirements.txt

# python 3.6+
pip install pyinstaller
pyinstaller build.spec --clean

cd ..

if [[ $1x == "mac"x ]]; then
  mkdir -p uarm-studio/resources/bin/mac/uarmcore
  sudo cp -f uarm-server/dist/uarmcore uarm-studio/resources/bin/mac/uarmcore
elif [[ $1x == "win"x ]]; then
  mkdir -p uarm-studio/resources/bin/win/uarmcore
  sudo cp -f uarm-server/dist/uarmcore uarm-studio/resources/bin/win/uarmcore
elif [[ $1x == "linux"x ]]; then
  mkdir -p uarm-studio/resources/bin/linux/uarmcore
  sudo cp -f uarm-server/dist/uarmcore uarm-studio/resources/bin/linux/uarmcore
fi
