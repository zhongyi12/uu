/**
 * Created by alex on 24/04/2017.
 * This File is for running uArm Core under child process
 */

import { spawn } from 'child_process';
import AppConfig from 'appConfig';
import { appLogger, uArmCoreLogger as log } from '../lib/log';
import readline from 'readline';
import { genOSFileName } from '../lib/util';
import path from 'path';
import findPIDbyPort from '../lib/processFinder';
import fs from 'fs';

const CoreProcess = {
  coreSpawn: null,
  stopCallback: null,
  coreVersion: null,
  running: false,
  // corePath: null,
  coreFiles: [],
  run: null,
  init() {
    log.info('CoreProcess init');
    const self = this;
    // const corePath2 = path.join(AppConfig.UARM_CORE_PATH, genOSFileName('uarmcore'));
    const coreFiles = fs.readdirSync(AppConfig.UARM_CORE_PATH).filter((aPath) => {
      return aPath.includes('uarmcore');
    });
    this.coreFiles = coreFiles;

    const startCore = (corePath) => {
      log.info(`Loading uArm Core, ${corePath}`);
      this.running = false;
      // if (corePath.includes('uarmcore-1')) {
      //   this.coreSpawn = null;
      //   throw false;
      // }
      this.coreSpawn = spawn(corePath);
      // log.info(this.coreSpawn);
      // if (!this.coreSpawn) {
      //   throw false;
      // }
      this.stopCallback = () => {
      }; // clear stopCallback

      readline.createInterface({
        input: this.coreSpawn.stdout,
        terminal: false,
      }).on('line', (line) => {
        if (line.includes('App Listen')) {
          this.running = true;
        }
        if (line.startsWith('uArmCore Version:')) {
          const vals = line.split(':');
          if (vals.length > 1) {
            this.coreVersion = vals[1];
            AppConfig.UARM_CORE_VERSION = this.coreVersion;
          }
        }
        log.info(`uarmcore running = ${this.running}`);
        log.info(line);
      });

      readline.createInterface({
        input: this.coreSpawn.stderr,
        terminal: false,
      }).on('line', (line) => {
        log.error(line);
      });
      this.coreSpawn.on('exit', (code) => {
        if (code !== undefined) {
          log.warn(`child process exited with code ${code}`);
        }
        this.stopCallback(code);
        this.coreSpawn = null;
        this.coreVersion = null;
        log.error(`exit self.running = ${self.running}`);
        if (!self.running) {
          self.run();
        }
        else {
          this.running = false;
        }
      });

      this.coreSpawn.on('error', (err) => {
        log.error(`${err}`);
      });
    };

    let fileIndex = 0;
    self.run = () => {
      if (fileIndex < self.coreFiles.length) {
        const fileName = self.coreFiles[fileIndex];
        fileIndex += 1;
        if (fileName.includes('uarmcore')) {
          const aPath = path.join(AppConfig.UARM_CORE_PATH, genOSFileName(fileName));
          self.stop().then(() => {
            startCore(aPath);
          }).catch(() => {
            startCore(aPath);
          });
        }
      }
    };
    self.run();
  },
  checkPortExist() {
    log.info('CoreProcess checkPortExist');
    return new Promise((resolve, reject) => {
      findPIDbyPort({ port: AppConfig.UARM_CORE_LISTEN_PORT }).then((pid) => { resolve(pid); }).catch((error) => {
        reject(error);
        log.error(`Error during Check Port Exist ${error}`);
      });
    });
  },
  checkCoreExist() {
    const isExist = this.coreFiles.length > 0; // fs.existsSync(this.corePath);
    log.info(`CoreProcess checkCoreExist coreFiles.length = ${this.coreFiles.length}, isExist = ${isExist}`);
    return isExist
  },
  async stop(stoppedCallback) {
    log.info('CoreProcess stop 1');
    return new Promise(async (resolve, reject) => {
      log.info('CoreProcess stop 2');
      this.stopCallback = stoppedCallback || (() => {});
      if (global.mainWindow !== undefined && global.mainWindow !== null) {
        log.info('CoreProcess stop 2');
        global.mainWindow.webContents.send('stop-core'); // call stop core command
      }
      try {
        // find uarmcore and kill
        const pid = await findPIDbyPort({
          port: AppConfig.UARM_CORE_LISTEN_PORT,
          logger: log,
          listening: true,
        });
        log.info('CoreProcess stop 3');
        log.info(`Kill uArmCore Process by PID: ${pid}`);
        if (pid !== undefined) {
          process.kill(pid);
          resolve(pid);
        }
        else {
          resolve();
        }
      }
      catch (e) {
        reject(e);
        log.error(`Error during Stop Core Process 2 ${e}`);
      }
    });
  },
};

if (process.env.NODE_ENV === 'production' || true) {
  appLogger.info('Init uArm Core Process');
  CoreProcess.init();
}

// if (process.env.NODE_ENV === 'production') {
//   appLogger.info('Init uArm Core Process');
//   CoreProcess.init();
// }

export default CoreProcess;
