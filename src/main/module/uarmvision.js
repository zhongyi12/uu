/**
 * Created by alex on 24/04/2017.
 * This File is for running uArm Core under child process
 */

import { spawn } from 'child_process';
import AppConfig from 'appConfig';
import { appLogger, uArmVision as log } from '../lib/log';
import readline from 'readline';
import { genOSFileName } from '../lib/util';
import path from 'path';
import findPIDbyPort from '../lib/processFinder';
import os from 'os';

const VisionProcess = {
  exeSpawn: null,
  stopCallback: null,
  exeVersion: null,
  running: false,
  exePath: null,
  init() {
    this.exePath = path.join(AppConfig.UARM_VISION_PAH, genOSFileName('uarmvision'));
    log.info(`Loading uArm Core, ${this.exePath}`);
    // kill exist process before start up
    const startExe = () => {
      this.exeSpawn = spawn(this.exePath);
      this.running = true;
      this.stopCallback = () => {
      }; // clear stopCallback

      readline.createInterface({
        input: this.exeSpawn.stdout,
        terminal: false,
      }).on('line', (line) => {
        if (line.startsWith('Version:')) {
          const vals = line.split(':');
          if (vals.length > 1) {
            this.exeVersion = vals[1];
            AppConfig.UARM_VISION_VERSION = this.exeVersion;
          }
        }
        log.info(line);
      });

      readline.createInterface({
        input: this.exeSpawn.stderr,
        terminal: false,
      }).on('line', (line) => {
        log.error(line);
      });
      this.exeSpawn.on('exit', (code) => {
        if (code !== undefined) {
          log.warn(`child process exited with code ${code}`);
        }
        this.stopCallback(code);
        this.exeSpawn = null;
        this.exeVersion = null;
        this.running = false;
      });

      this.exeSpawn.on('error', (err) => {
        log.error(`${err}`);
      });
    };
    this.stop().then(startExe).catch(startExe);
  },
  checkPortExist() {
    return new Promise((resolve, reject) => {
      findPIDbyPort({ port: AppConfig.UARM_VISION_LISTEN_PORT }).then((pid) => { resolve(pid); }).catch((error) => {
        reject(error);
        log.error(`Error during Check Port Exist ${error}`);
      });
    });
  },
  stop(stoppedCallback) {
    return new Promise((resolve, reject) => {
      this.stopCallback = stoppedCallback || (() => {});
      if (global.mainWindow !== undefined && global.mainWindow !== null) {
        global.mainWindow.webContents.send('stop-vision'); // call stop core command
      }
      try {
        // find uarmcore and kill
        findPIDbyPort({
          port: AppConfig.UARM_VISION_LISTEN_PORT,
          logger: log,
          listening: true,
        }).then((pid) => {
          log.info(`Kill uArmVision Process by PID: ${pid}`);
          process.kill(pid);
        }).catch((error) => {
          log.error(`Error during Stop Vision Process ${error}`);
          reject(error);
        });
      }
      catch (e) {
        reject(e);
        log.error(`Error during Stop Vision Process ${e}`);
      }
    });
  },
};

const isMac = os.platform() === 'darwin';

if (process.env.NODE_ENV === 'production' && !isMac) {
  appLogger.info('Init uArm Vision Process');
  VisionProcess.init();
}

export default VisionProcess;
