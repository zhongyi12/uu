/**
 * Created by alex on 2017/5/19.
 */
import { webSocketLogger, renderLogger } from './lib/log';
import AppConfig from 'appConfig';
import UserConfig from './module/userConfig';

import LanguageManager from './module/languageManager';
import './module/cura';
import CoreProcess from './module/uarmcore';
import './module/uarmvision';
import DriverManager from './module/driverManager';
import './module/updateManager';
import { SyncManager } from './module/syncManager';
import { userTracking } from './module/userTracking';

LanguageManager.init();

/** init update 在应用打开的时候，检查更新，如果有更新才提示 **/
// import UpdateManager from './module/updateManager';
// appLogger.info('Check for update on Start.');

/** init UArm Studio 初始化 Studio Render 需要使用的对象 **/
import { FileManager } from './module/fileManager';

import { shell, Menu, globalShortcut } from 'electron';

const { getMenuTemplate } = require('menuTemplate');
const menu = Menu.buildFromTemplate(getMenuTemplate());
Menu.setApplicationMenu(menu);

console.log(`URL: ${AppConfig.MAIN_WINDOW_URL}`);
global.mainWindow.loadURL(AppConfig.MAIN_WINDOW_URL);

function openOnBrowser(url) {
  shell.openExternal(url);
}

global.Studio = {
  FileManager,
  CoreProcess,
  SyncManager,
  UserConfig,
  AppConfig,
  DriverManager,
  webSocketLogger,
  renderLogger,
  openOnBrowser,
  userTracking,
};

const shortcut = process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I';
globalShortcut.register(shortcut, () => {
  global.mainWindow.toggleDevTools();
});
