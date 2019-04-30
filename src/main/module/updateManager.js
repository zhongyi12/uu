/**
 * Created by alex on 22/04/2017.
 * This file is for Auto Update, using electron-simple-updater
 */

import AppConfig from 'appConfig';
import { FirmwareConfig } from 'firmwareProperty';
import { app, dialog, ipcMain } from 'electron';
import { appLogger, firmwareLogger } from '../lib/log';
import request from 'request';
import CoreProcess from './uarmcore';
import fs from 'fs';
import path from 'path';
import flashFirmware from '../lib/firmwareFlasher';
import VersionFetcher from '../lib/versionFecther';
import downloadUpdates from './downloadManager';

const UpdateManager = {
  init() {
    ipcMain.on('fetch-version-info', (event) => {
      VersionFetcher.init({
        url: AppConfig.UPDATE_URL,
        logger: appLogger,
      }).then((updatesJson) => event.sender.send('fetch-version-info-reply', null, updatesJson))
        .catch((failMsg) => event.sender.send('fetch-version-info-reply', failMsg));
    });
    UpdateManager.studio.init();
    UpdateManager.firmware.init();
    VersionFetcher.init({
      url: AppConfig.UPDATE_URL,
      logger: appLogger,
    });
  },
  studio: {
    init() {
      ipcMain.on('check-for-updates', () => {
        VersionFetcher.init({
          url: AppConfig.UPDATE_URL,
          logger: appLogger,
        }).then(() => UpdateManager.studio.checkForUpdatesPrompt(true))
          .catch((error) => appLogger.info(`Fetching version info 4 error: ${error}`));
      });
    },
    prompt: true,
    checkForUpdatesPrompt(prompt) {
      UpdateManager.studio.prompt = prompt;
      appLogger.info(`check for update, current version is ${AppConfig.APP_VERSION}`);
      const key = AppConfig.APP_NAME;
      VersionFetcher.checkForUpdates(key, AppConfig.APP_VERSION,
        {
          logger: appLogger,
        }).then((updatesJson) => {
          appLogger.info(`New Version available ${updatesJson.version}`);
          const options = {
            type: 'info',
            title: global.LAN.updateManager.available.title,
            message: global.LAN.updateManager.available.message,
            buttons: [global.LAN.Yes, global.LAN.No],
          };
          dialog.showMessageBox(options, (index) => {
            if (index === 0) {
              downloadUpdates(updatesJson.url[AppConfig.OS_TYPE]).then(app.quit);
            }
          });
        }).catch(() => {
          if (UpdateManager.studio.prompt) {
            dialog.showErrorBox(global.LAN.updateManager.notAvailable.title,
              global.LAN.updateManager.notAvailable.message.replace('{}', AppConfig.APP_VERSION));
          }
        });
    },
  },
  firmware: {
    async init() {
      ipcMain.on('firmware-upgrade-to-3', async (event, uarmPort) => {
        appLogger.info(`Firmware Upgrade 3 on - ${uarmPort}`);
        const firmware3Path = path.join(AppConfig.FIRMWARE_DEFAULT_DIR_PATH, 'swiftpro-prod-3.2.0.hex');
        const firmwarePath = firmware3Path; // AppConfig.FIRMWARE_3_PATH; // await UpdateManager.firmware.download(uarmType);
        appLogger.info(`firmwarePath 3 is ${firmwarePath}`);
        global.mainWindow.webContents.send('show-progress-bar', global.LAN.updateManager.firmwareUpgradingTo3);
        const uarmType = 'swiftpro';
        await UpdateManager.firmware.upgrade(uarmType, uarmPort, firmwarePath, {
          progressCallback(progress) {
            console.log(`progress is ${progress}`);
            global.mainWindow.webContents.send('update-progress-bar', parseInt(progress));
          },
        });
        global.mainWindow.webContents.send('hide-progress-bar');
        // successCallback();
        global.mainWindow.webContents.send('firmware-upgrade-completed');
      });
      ipcMain.on('firmware-upgrade-to-4', async (event, uarmPort) => {
        appLogger.info(`Firmware Upgrade 4 on - ${uarmPort}`);
        const firmware4Path = path.join(AppConfig.FIRMWARE_DEFAULT_DIR_PATH, 'swiftpro-prod-{cur_new_firmware_ver}.hex'.replace('{cur_new_firmware_ver}', AppConfig.cur_new_firmware_ver));
        const firmwarePath = firmware4Path; // AppConfig.FIRMWARE_4_PATH; // await UpdateManager.firmware.download(uarmType);
        appLogger.info(`firmwarePath 4 is ${firmwarePath}`);
        console.log(`firmwarePath is ${firmwarePath}`);
        global.mainWindow.webContents.send('show-progress-bar', global.LAN.updateManager.firmwareUpgradingTo4.replace('{cur_new_firmware_ver}', AppConfig.cur_new_firmware_ver));
        const uarmType = 'swiftpro';
        await UpdateManager.firmware.upgrade(uarmType, uarmPort, firmwarePath, {
          progressCallback(progress) {
            global.mainWindow.webContents.send('update-progress-bar', parseInt(progress));
          },
        });
        global.mainWindow.webContents.send('hide-progress-bar');
        // successCallback();
        global.mainWindow.webContents.send('firmware-upgrade-completed');
      });
      ipcMain.on('firmware-upgrade', async (event, uarmType, uarmPort) => {
        appLogger.info(`Firmware Upgrade on ${uarmType} - ${uarmPort}`);
        try {
          await VersionFetcher.init({
            url: AppConfig.UPDATE_URL,
            logger: appLogger,
          });
          global.mainWindow.webContents.send('show-progress-bar', global.LAN.updateManager.firmwareUpgrading);
          const firmwarePath = await UpdateManager.firmware.download(uarmType);
          console.log(`firmwarePath is ${firmwarePath}`);
          await UpdateManager.firmware.upgrade(uarmType, uarmPort, firmwarePath, {
            progressCallback(progress) {
              global.mainWindow.webContents.send('update-progress-bar', parseInt(progress));
            },
          });
          global.mainWindow.webContents.send('hide-progress-bar');
          // successCallback();
          global.mainWindow.webContents.send('firmware-upgrade-completed');
        }
        catch (err) {
          global.mainWindow.webContents.send('hide-progress-bar');
          appLogger.info(`Fetching version info 1 error: ${err}`);
          // failedCallback(e);
          global.mainWindow.webContents.send('firmware-upgrade-failed', err);
        }
      });
    },
    download(uarmType) {
      return new Promise((resolve, reject) => {
        if (VersionFetcher.versionInfo === undefined) {
          reject('Version Info not found');
        }
        else {
          // const isNewFirmwareVersion = window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
          console.log(`download uarmType = ${uarmType}`);
          const updateJson = VersionFetcher.versionInfo[uarmType];
          appLogger.info(updateJson);
          const firmwarePath = path.join(AppConfig.FIRMWARE_DIR_PATH,
            uarmType, `${uarmType}-${updateJson.version}.hex`);
          if (!fs.existsSync(path.dirname(firmwarePath))) {
            fs.mkdirSync(path.dirname(firmwarePath));
          }
          const updateJsonPath = path.join(AppConfig.FIRMWARE_DIR_PATH,
            uarmType, 'release.json');
          firmwareLogger.info(`Firmware download to ${firmwarePath}`);
          const stream = request.get(updateJson.url)
            .on('error', (err) => {
              firmwareLogger.error(`Fail to download Firmware update json file ${updateJson.url}`);
              reject(err);
            })
            .pipe(fs.createWriteStream(firmwarePath));
          stream.on('finish', () => {
            firmwareLogger.info(`download json file completed ${updateJson.url}`);
            resolve(firmwarePath);
          });
          fs.writeFile(updateJsonPath, JSON.stringify(updateJson, null, 2));
        }
      });
    },
    /**
     * @param uarmType {string}
     * @param uarmPort {string}
     * @param firmwarePath {string}
     * @param args {object}
     * @param args.progressCallback {function}
     * @param args.port {string}
     */
    async upgrade(uarmType, uarmPort, firmwarePath, args) {
      return new Promise(async(resolve, reject) => {
        try {
          const _args = {
            port: uarmPort,
            chipType: FirmwareConfig[uarmType].chip,
            programmer: FirmwareConfig[uarmType].programmer,
            avrdudePath: AppConfig.AVRDUDE_DIR_PATH,
            progressCallback: args.progressCallback,
            logger: firmwareLogger,
          };
          firmwareLogger.info('_args');
          // firmwareLogger.info(_args);
          _args.firmwarePath = firmwarePath;
          firmwareLogger.info('Download Completed 1');
          const stopCallback = () => {
            flashFirmware(_args).then(() => {
              firmwareLogger.info('Flash Completed');
              CoreProcess.init();
              resolve();
            }).catch((error) => {
              firmwareLogger.info('Flash error 2');
              CoreProcess.init();
              reject(error);
            });
          };
          firmwareLogger.info('Download Completed 2');
          await CoreProcess.stop(stopCallback);
        }
        catch (e) {
          firmwareLogger.info(`Flash Error 3 ${e}`);
          // add by self
          // global.mainWindow.webContents.send('hide-progress-bar');
          // appLogger.info(`Fetching version info 3 error: ${e}`);
          // // failedCallback(e);
          // global.mainWindow.webContents.send('firmware-upgrade-failed', e);
          // // add by self end
        }
      });
    },
  },
};

UpdateManager.init();
module.exports = UpdateManager;
