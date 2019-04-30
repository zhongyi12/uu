/**
 * Created by alex on 2017/5/4.
 */

import os from 'os';

function genOSFileName(filename) {
  let target;
  switch (os.platform()) {
    default: break;
    case 'darwin':
      target = filename;
      break;
    case 'win32':
      target = `${filename}.exe`;
      target = target.replace('.exe.exe', '.exe');
      break;
    case 'linux':
      target = filename;
      break;
  }
  return target;
}

exports.genOSFileName = genOSFileName;
