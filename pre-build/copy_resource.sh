#!/bin/bash

mkdir -p ../resources/bin/win/firmwareDefault
mkdir -p ../resources/bin/linux/firmwareDefault
mkdir -p ../resources/bin/mac/firmwareDefault

cp firmwareDefault/* ../resources/bin/win/firmwareDefault
cp firmwareDefault/* ../resources/bin/linux/firmwareDefault
cp firmwareDefault/* ../resources/bin/mac/firmwareDefault
