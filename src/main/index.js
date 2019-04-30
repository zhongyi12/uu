require('./init'); // Load something before 预加载

// import AppConfig from 'appConfig';

import { app, BrowserWindow } from 'electron';
global.mainWindow = null;

function createWindow() {
  /**
   * Initial window options
   */
  global.mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 746,
    'web-preferences': { 'web-security': false },
  });
  require('./ready'); // 只有ready 之后才加载
  require('./close');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (global.mainWindow === null) {
    createWindow();
  }
});
