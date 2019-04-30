/**
 * Created by alex on 2017/5/10.
 */

import { appLogger } from '../lib/log';
import AppConfig from 'appConfig';
import os from 'os';
import { shell, ipcMain, dialog } from 'electron';
import fs from 'fs';
import VersionFetcher from '../lib/versionFecther';
import downloadUpdates from './downloadManager';

const CuraProcess = {
  init() {
    ipcMain.on('start-cura', () => {
      CuraProcess.open(
      ).then(path => {
        appLogger.info(`succeed to open Cura on ${path}`);
      }).catch(targetPath => {
        const dialogOptions = {
          type: 'info',
          title: global.LAN.cura.failTitle,
          message: global.LAN.cura.failText,
          buttons: [global.LAN.Yes, global.LAN.No],
        };
        dialog.showMessageBox(dialogOptions, (index) => {
          if (index === 0) {
            CuraProcess.download();
          }
        });
        // dialog.showErrorBox(global.LAN.init.cura.failTitle, `${global.LAN.init.cura.failText} - ${targetPath}`);
        appLogger.warn(`Can not open cura in ${targetPath}`);
      });
    });
    ipcMain.on('download-cura', () => {
      const dialogOptions = {
        type: 'info',
        message: global.LAN.cura.downloadText,
        buttons: [global.LAN.Yes, global.LAN.No],
      };
      dialog.showMessageBox(dialogOptions, (index) => {
        if (index === 0) {
          CuraProcess.download();
        }
      });
    });
  },
  open() {
    return new Promise((resolve, reject) => {
      if (os.platform() === 'darwin') {
        if (!fs.existsSync(AppConfig.CURA_DIR_PATH)) {
          appLogger.error(`cura Not exist ${AppConfig.CURA_DIR_PATH}`);
          reject(AppConfig.CURA_DIR_PATH);
          return;
        }
        if (shell.openItem(AppConfig.CURA_DIR_PATH)) {
          resolve(AppConfig.CURA_DIR_PATH);
        }
        else {
          reject(AppConfig.CURA_DIR_PATH);
        }
      }
      else if (os.platform() === 'win32') {
        if (!fs.existsSync(AppConfig.CURA_DIR_PATH)) {
          appLogger.error(`cura not exist ${AppConfig.CURA_DIR_PATH}`);
          reject(AppConfig.CURA_DIR_PATH);
          return;
        }
        if (shell.openItem(AppConfig.CURA_DIR_PATH)) {
          resolve(AppConfig.CURA_DIR_PATH);
        }
        else {
          reject(AppConfig.CURA_DIR_PATH);
        }
      }
      else if (os.platform() === 'linux') {
        const dialogOptions = {
          type: 'warning',
          title: global.LAN.cura.linuxTitle,
          message: global.LAN.cura.linuxText,
        };
        dialog.showMessageBox(dialogOptions);
      }
    });
  },
  download() {
    const key = 'CuraForuArm';
    VersionFetcher.init({
      url: AppConfig.UPDATE_URL,
      logger: appLogger,
    }).then(versionInfo => {
      const url = versionInfo[key].url[AppConfig.OS_TYPE];
      console.info(`download cura log :${url}`);
      downloadUpdates(url);
    }).catch(err => { appLogger.info(`Fetching version info 2 error: ${err}`); });
  },
};

CuraProcess.init();
module.exports = CuraProcess;
