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
cp uarmcore/dist/uarmcore resources/bin/mac/uarmcore/
curl -o resources/bin/mac/avrdude.zip http://uarm.studio/releases/avrdude/avrdude-mac.zip
curl -o resources/bin/mac/uarmvision/uarmvision http://uarm.studio/releases/uarmvision/uarmvision-mac
unzip resources/bin/mac/avrdude.zip -d resources/bin/mac/