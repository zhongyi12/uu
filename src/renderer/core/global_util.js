import Model from './model';

import winston from 'winston';
// import AppConfig from 'appConfig';
import path from 'path';
import fs from 'fs'
import os from 'os';

const homeDir = path.join(os.homedir(), 'uarm');
const studioDir = path.join(homeDir, 'studio');
const logDir = path.join(studioDir, 'log');

winston.loggers.add('debugApp', {
  console: {
    level: 'debug',
    colorize: true,
    label: 'debugApp',
  },
  file: {
    json: false,
    filename: path.join(logDir, 'debugApp.log'),
  },
});

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const GlobalUtil = {};
const self = GlobalUtil;
window.GlobalUtil = self;
self.model = Model;

GlobalUtil.debugApp = winston.loggers.get('debugApp');

console.log = (msg) => {
  GlobalUtil.debugApp.info(`${msg}`);
}

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.warn = () => {};
}

// if (process.env.NODE_ENV === 'production') {
//   GlobalUtil.debugApp = () => {};
// }
// else {
//   GlobalUtil.debugApp = winston.loggers.get('debugApp');
// }


/* Control the module show or not */
self.modules = {
  blockly: true,
  control: true,
  teach: true,
  leapmotion: true,
  paint: true,
  print3d: true,
  allList: false,
}

self.autoSizeScale = 0;

self.bubbleSort = (arr, callback) => {
  const len = arr.length;
  for (let i = 0; i < len; i += 1) {
    for (let j = 0; j < len - 1 - i; j += 1) {
      // if (arr[j].ctime_secs < arr[j + 1].ctime_secs) {
      if (callback(arr[j], arr[j + 1])) {
        const temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
};

self.getMinWidth = () => {
  const min_width = Math.min(screen.width, screen.height);
  self.min_width = Math.min(min_width, 480);
  return self.min_width;
};
self.uniqueArr = (arr) => {
  const result = [];
  const hash = {};
  for (let i = 0, elem; (elem = arr[i]) != null; i += 1) {
    if (!hash[elem]) {
      result.push(elem);
      hash[elem] = true;
    }
  }
  return result;
}

self.randomNumber = (begin, end) => {
  return Math.floor(Math.random() * (end - begin)) + begin;
}

self.getMinWidth();

self.getScreenWidth = () => {
  self.screen_width = window.screen.width;
  return self.screen_width;
};
self.getScreenWidth();

self.adaptSize = (x) => {
  return x * self.autoSizeScale;
};

self.fixSize = () => {
  // GlobalUtil.min_width = 480;
  const div = document.getElementById('index-page');
  div.style.width = `${self.min_width / 9.0 * 16.0}px`;
  div.style.height = `${self.min_width}px`;
};

self.pad = (num, n) => {
  let len = num.toString().length;
  while (len < n) {
    num = `0${num}`;
    len += 1;
  }
  return num;
};

self.setInputFocus = () => {
  setTimeout(() => {
    const inputs = document.getElementsByClassName('input-focus');
    for (let i = 0; i < inputs.length; i += 1) {
      const input = inputs[i];
      input.focus();
    }
  });
};

self.getUrlParam = (lan) => {
  const s1 = '(^|&)';
  const s2 = '=([^&]*)(&|$)';
  const reg = new RegExp(`${s1}${lan}${s2}`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r === null || r.length < 2) {
    return '';
  }
  return unescape(r[2]);
};
self.checkFileName = (name) => {
  return /^[\w-]+$/g.test(name)
}
export default self;
