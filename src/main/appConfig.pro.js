/**
 * Created by alex on 26/04/2017.
 * This file only can be used in Electron Main Process
 * 这个配置只能在 Main Process (Node 环境下使用）
 */
import { version, name, homepage, copyright, issueUrl, socialUrl, faq, minimumFirmware } from '../../package.json';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Path Init 环境初始化
const homeDir = path.join(os.homedir(), 'uarm');
// ~/your name/uarm 主目录
const studioDir = path.join(homeDir, 'studio');
// ~/your name/uarm/studio studio 目录
if (!fs.existsSync(homeDir)) {
  fs.mkdirSync(homeDir);
}
if (!fs.existsSync(studioDir)) {
  fs.mkdirSync(studioDir);
}

// 固件目录
const firmwareDir = path.join(homeDir, 'firmware');
if (!fs.existsSync(firmwareDir)) {
  fs.mkdirSync(firmwareDir);
}

// 日志目录
const logDir = path.join(studioDir, 'log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// uArmCore 的 Websocket 设置
const UARM_CORE_LISTEN_ADDRESS = '127.0.0.1';
const UARM_CORE_LISTEN_PORT = '18321';
const CAMERA_LISTEN_URL = `http://${UARM_CORE_LISTEN_ADDRESS}:${UARM_CORE_LISTEN_PORT}/video`;
const WEBSOCKET_SERVER_ADDRESS = `ws://${UARM_CORE_LISTEN_ADDRESS}:${UARM_CORE_LISTEN_PORT}/ws`;

// Cura 目录
let CURA_DIR_PATH;
let CACHE_DIR_PATH;
if (os.platform() === 'darwin') {
  CURA_DIR_PATH = path.join('/', 'Applications', 'CuraForuArm.app');
  CACHE_DIR_PATH = path.join(process.env.HOME, 'Library/Application Support/uarmStudio');
}
else if (os.platform() === 'win32') {
  CURA_DIR_PATH = path.join(process.env.PROGRAMFILES, 'CuraForuArm', 'Cura.exe');
  CACHE_DIR_PATH = path.join(process.env.APPDATA, 'uarmStudio');
}
else if (os.platform() === 'linux') {
  CURA_DIR_PATH = path.join('~', 'CuraForuArm');
  CACHE_DIR_PATH = path.join('/var/local', 'uarmStudio');
}

let OS_TYPE;
if (os.platform() === 'darwin') {
  OS_TYPE = 'mac';
}
else if (os.platform() === 'win32') {
  OS_TYPE = 'win';
}
else if (os.platform() === 'linux') {
  OS_TYPE = 'linux';
}

const Channel = 'prod';
const RESOURCES_PATH = path.join(process.resourcesPath, 'studio');
const OS_ARCH = os.arch() === 'x64' ? 'x64' : 'x86';

console.log(`process.resourcesPath = ${process.resourcesPath}`);

// 程序设置
const AppConfig = {
  APP_NAME: name,
  APP_VERSION: version,
  Channel,
  CATEGORY: 'software',
  LANG: 'en', // 默认为英语
  OS_INFO: `${os.platform()} ${os.arch()} ${os.release()}`,
  OS_TYPE,
  OS_ARCH,
  MAIN_WINDOW_URL: `file://${__dirname}/index.html`, // 主窗口的链接
  FAQ_URL: faq,
  HOME_PAGE_URL: homepage,
  getIssueUrl() {
    return issueUrl[AppConfig.LANG];
  },
  SOCIAL_URL: socialUrl,
  APP_COPYRIGHT: copyright,
  UPDATE_URL: 'http://update.ufactory.cc/releases/updates.json',
  // UPDATE_URL: 'http://update.ufactory.cc/releases/hk_updates.json',
  // RESOURCES_PATH: RESOURCES_PATH,
  FIRMWARE_DEFAULT_DIR_PATH: path.join(RESOURCES_PATH, 'firmwareDefault'),
  UARM_CORE_PATH: path.join(RESOURCES_PATH, 'uarmcore'),
  UARM_VISION_PAH: path.join(RESOURCES_PATH, 'uarmvision'),
  UARM_VISION_LISTEN_PORT: '18322',
  UARM_VISION_VERSION: null,
  UARM_CORE_LISTEN_ADDRESS,
  UARM_CORE_LISTEN_PORT,
  UARM_CORE_VERSION: null,
  WEBSOCKET_SERVER_ADDRESS,
  CAMERA_LISTEN_URL,
  STUDIO_DIR_PATH: studioDir,
  MINIMUM_FIRMWARE_VERSION: minimumFirmware,
  HOME_DIR_PATH: homeDir,
  STUDIO_CONFIG_PATH: path.join(studioDir, 'config.json'),
  FIRMWARE_DIR_PATH: firmwareDir,
  // FIRMWARE_DEFAULT_DIR_PATH: firmwareDefaultDir,
  // FIRMWARE_3_PATH: firmware3Path,
  // FIRMWARE_4_PATH: firmware4Path,
  AVRDUDE_DIR_PATH: path.join(RESOURCES_PATH, 'avrdude'),
  LOG_DIR_PATH: logDir,
  DRIVER_DIR_PATH: path.join(RESOURCES_PATH, 'driver'),
  CURA_DIR_PATH,
  CACHE_DIR_PATH,
  API_HOST_URL: 'http://studio.avosapps.us/',
};

AppConfig.cur_new_firmware_ver = '4.3.2';

module.exports = AppConfig;
