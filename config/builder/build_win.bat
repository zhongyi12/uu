cd uarmcore\pyuarm
python setup.py install
cd ..
pip install -r requirements.txt
pyinstaller build.spec --clean
cd ..
cp uarmcore\dist\uarmcore.exe resources\bin\win\uarmcore\
curl -o resources/bin/win/uarmvision/uarmvision.exe http://uarm.studio/releases/uarmvision/uarmvision-win
curl -o resources/bin/win/avrdude.zip http://uarm.studio/releases/avrdude/avrdude-win.zip
curl -o resources/bin/win/driver.zip http://uarm.studio/releases/driver/driver-win.zip
curl -o resources/bin/win/vc++.zip http://uarm.studio/releases/vc++/vc++.zip
unzip resources/bin/win/driver.zip -d resources/bin/win/
unzip resources/bin/win/avrdude.zip -d resources/bin/win/
unzip resources/bin/win/vc++.zip -d resources/bin/win/