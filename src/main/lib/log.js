/**
 * Created by alex on 26/04/2017.
 * This file is part of uArmStudio.
 * For Logging module.
 */

import winston from 'winston';
import AppConfig from 'appConfig';
import path from 'path';
import fs from 'fs';
import UserConfig from '../module/userConfig';

let logLevel = UserConfig.getItem('studio', 'LogLevel');

if (logLevel === undefined) {
  logLevel = 'debug';
  UserConfig.setItem('studio', 'LogLevel', 'debug');
}

// TODO: house keep on day.
if (!fs.existsSync(AppConfig.LOG_DIR_PATH)) {
  fs.mkdirSync(AppConfig.LOG_DIR_PATH);
}

winston.loggers.add('uArmCore', {
  console: {
    level: 'warn',
    colorize: true,
    label: 'APP',
  },
  file: {
    json: false,
    filename: path.join(AppConfig.LOG_DIR_PATH, 'uarmcore.log'),
  },
});

winston.loggers.add('uArmVision', {
  console: {
    level: 'warn',
    colorize: true,
    label: 'APP',
  },
  file: {
    json: false,
    filename: path.join(AppConfig.LOG_DIR_PATH, 'uarmvision.log'),
  },
});

winston.loggers.add('app', {
  console: {
    level: logLevel,
    colorize: true,
    label: 'APP',
  },
  file: {
    json: false,
    filename: path.join(AppConfig.LOG_DIR_PATH, 'app.log'),
  },
});

winston.loggers.add('firmware', {
  console: {
    level: logLevel,
    colorize: true,
    label: 'Firmware',
  },
  file: {
    level: logLevel,
    json: false,
    filename: path.join(AppConfig.LOG_DIR_PATH, 'firmware.log'),
  },
});

winston.loggers.add('render', {
  console: {
    level: logLevel,
    colorize: true,
    label: 'render',
  },
  file: {
    json: false,
    filename: path.join(AppConfig.LOG_DIR_PATH, 'render.log'),
  },
});

winston.loggers.add('websocket', {
  console: {
    level: 'warn',
    colorize: true,
    label: 'websocket',
  },
  file: {
    json: false,
    level: logLevel,
    filename: path.join(AppConfig.LOG_DIR_PATH, 'websocket.log'),
  },
});


exports.uArmCoreLogger = winston.loggers.get('uArmCore');
exports.appLogger = winston.loggers.get('app');
exports.firmwareLogger = winston.loggers.get('firmware');
exports.renderLogger = winston.loggers.get('render');
exports.webSocketLogger = winston.loggers.get('websocket');
exports.uArmVision = winston.loggers.get('uArmVision');
// TODO: daily log seperate
