#!/bin/bash

pip install virtualenv
virtualenv --no-site-packages --python=`which python3` uarmcore-env
source uarmcore-env/bin/activate
cd uarmcore/pyuarm
python setup.py install
cd ..
pip install -r requirements.txt
pip install pyinstaller
pyinstaller build.spec --clean
cd ..
cp uarmcore/dist/uarmcore resources/bin/linux/uarmcore/
curl -o resources/bin/linux/avrdude.zip http://uarm.studio/releases/avrdude/avrdude-linux.zip
curl -o resources/bin/linux/uarmvision/uarmvision http://uarm.studio/releases/uarmvision/uarmvision-linux
unzip resources/bin/linux/avrdude.zip -d resources/bin/linux/