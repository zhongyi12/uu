/**
 * Created by alex on 2017/5/26.
 */

import { appLogger } from '../lib/log';
import { dialog, shell } from 'electron';
import { download } from 'electron-dl';
import path from 'path';

/**
 *
 * @param url {string} download URL
 */
function downloadUpdates(url) {
  return new Promise((resolve, reject) => {
    global.mainWindow.webContents.send('show-progress-bar', global.LAN.common.dialog.downloadProgressTitle);
    appLogger.info(`Downloading from ${url}`);
    download(global.mainWindow, url, {
      onProgress(progress) {
        const intProgress = Math.round(progress * 100);
        global.mainWindow.webContents.send('update-progress-bar', intProgress);
        appLogger.debug(`downloading... ${intProgress}%`);
      },
    })
      .then((dl) => {
        const savePath = dl.getSavePath();
        global.mainWindow.webContents.send('hide-progress-bar');
        const dialogOptions = {
          type: 'info',
          title: global.LAN.updateManager.downloaded.title,
          message: global.LAN.updateManager.downloaded.message,
          buttons: [global.LAN.Yes, global.LAN.No],
        };
        dialog.showMessageBox(dialogOptions, (index) => {
          if (index === 0) {
            shell.openItem(savePath);
            resolve(savePath);
          }
          else {
            shell.openItem(path.dirname(savePath));
          }
        });
      })
      .catch((error) => {
        dialog.showErrorBox(global.LAN.updateManager.downloadError.title, error);
        reject(error);
        appLogger.error(`Error during download... ${error}`);
        global.mainWindow.webContents.send('hide-progress-bar');
      });
  });
}

module.exports = downloadUpdates;
