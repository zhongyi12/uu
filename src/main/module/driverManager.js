/**
 * Created by alex on 2017/5/9.
 * This module windows 64 bit only.
 */

import AppConfig from 'appConfig';
import { driverQuery, driverInstall } from '../lib/driver';
import { appLogger } from '../lib/log';
import { dialog } from 'electron';
import os from 'os';

const DriverManager = {
  init() {
    /** checking driver windows Only, 检查是否有安装驱动, 只有windows 需要 **/
    if (os.platform() === 'win32') {
      appLogger.info('Init Driver Manager');
      DriverManager.checkDriverInstallation(false);
    }
  },
  checkDriverInstalled() {
    return new Promise((resolve, reject) => {
      if (os.platform() === 'win32') {
        driverQuery({ logger: appLogger }).then(resolve).catch((err) => reject(err));
      }
      else {
        resolve();
      }
    });
  },
  checkDriverInstallation(prompt = false) {
    driverQuery({ logger: appLogger }).then(() => {
      if (prompt) {
        dialog.showMessageBox({
          type: 'info',
          title: 'No driver install',
          message: 'You already install driver!',
        });
      }
    }).catch((failType, err) => {
      if (failType === 'driverNotFound') {
        const options = {
          type: 'info',
          title: 'No driver installed',
          message: 'We detect you didn\'t install driver, would you like to install?',
          buttons: ['Yes', 'No'],
        };

        dialog.showMessageBox(options, (index) => {
          if (index === 0) {
            // LoadingWindow.open(global.mainWindow);
            driverInstall({
              logger: appLogger,
              driverPath: AppConfig.DRIVER_DIR_PATH,
              successCallback() {
                dialog.showMessageBox({
                  type: 'info',
                  title: 'Completed!',
                  message: 'Driver install completed!',
                });
                // LoadingWindow.close();
              },
              failCallback(failType, err) {
                if (err) {
                  dialog.showErrorBox('Error',
                    `Fail to install driver with error ${err}`);
                }
                if (failType === 'driverNotFound') {
                  dialog.showErrorBox('Warning',
                    'Driver will be effective until uArm is plug in.');
                }
                else if (failType === 'security') {
                  dialog.showErrorBox('Security Warning',
                    'Driver need administrator privilege to proceed');
                }
                // LoadingWindow.close();
              },
            });
          }
        });
      }
      else if (failType === 'error') {
        appLogger.error(`Error during checking driver. ${err}`);
      }
    });
  },
};

export default DriverManager;
