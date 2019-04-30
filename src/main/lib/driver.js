/**
 * Created by alex on 2017/5/9.
 */

import { spawn, exec } from 'child_process';
import path from 'path';

const elevateBin = 'elevate.exe';
const dpinstBin = 'dpinst-amd64.exe';
const driverKeyword = 'usbser';

/**
 *
 * @param {object} [args]
 * @param {object} [args.logger]
 * @param {string} [args.keyword='usbser']
 */
function driverQuery(args) {
  // args.successCallback = args.successCallback || (() => {});
  // args.failCallback = args.failCallback || (() => {});
  return new Promise((resolve, reject) => {
    args.logger = args.logger || console;
    args.keyword = args.keyword || driverKeyword;
    const command = 'driverquery';
    args.logger.info('Checking driver installation...');
    exec(command, (error, stdout) => {
      if (error) {
        args.logger.error(`Driver query fail ${error}`);
        reject('error', error);
      }
      // args.logger.info(stdout);
      const lines = stdout.split(/\r?\n/);
      for (const line of lines) {
        const op = line.replace(/[\r\n]/g, '').split(' ');
        const driver = op.shift();
        if (driver === args.keyword) {
          args.logger.info('Driver installed');
          resolve(driver);
          break;
        }
      }
      reject('driverNotFound');
    });
  });
}

/**
 *
 * @param {object} [args]
 * @callback [args.successCallback]
 * @callback [args.failCallback]
 * @param {object} [args.logger]
 * @param {string} [args.driverPath]
 */
function driverInstall(args) {
  args.successCallback = args.successCallback || (() => {});
  args.failCallback = args.failCallback || (() => {});
  args.logger = args.logger || console;
  const argvs = ['-w', path.join(args.driverPath, dpinstBin), '/A', '/SE', '/SW', '/SA'];
  const command = `${elevateBin} ${argvs.join(' ')}`;
  args.logger.log(` Install Driver ${command}`);
  const driverInstaller = spawn(path.join(args.driverPath, elevateBin), argvs);
  driverInstaller.on('exit', (code) => {
    if (code === 1) {
      args.logger.error(`Driver install fail ${code}`);
      args.failCallback('Security');
      return;
    }
    driverQuery({
      logger: args.logger,
      successCallback() {
        args.logger.info('Driver install Complete');
        args.successCallback();
      },
      failCallback() {
        args.failCallback('driverNotFound');
      },
    });
    driverInstaller.on('error', (err) => {
      args.logger.error(err);
      args.failCallback('error', err);
    });
  });
}

exports.driverQuery = driverQuery;
exports.driverInstall = driverInstall;
