/**
 * Created by alex on 2017/5/9.
 */

import { spawn } from 'child_process';
import { genOSFileName } from './util';
import path from 'path';

function genFlashCmd(args) {
  const cmd = [];
  const avrdudeBin = genOSFileName('avrdude');
  cmd.push(path.join(args.avrdudePath, avrdudeBin));
  cmd.push(`-C${path.join(args.avrdudePath, 'avrdude.conf')}`);
  cmd.push(`-P${args.port}`);
  cmd.push(`-p${args.chipType}`);
  cmd.push('-b115200');
  cmd.push(`-c${args.programmer}`);
  cmd.push('-D');
  cmd.push(`-Uflash:w:${args.firmwarePath}:i`);
  cmd.push('-v');
  if (!args.logger) {
    args.logger = console;
  }
  args.logger.info(`Executing Flash command: ${cmd.join(' ')}`);
  return cmd;
}

function flashSpawn(args) { // TODO 获取失败时的avrdude 输出的信息
  return new Promise((resolve, reject) => {
    args.logger = args.logger || console;
    const cmd = genFlashCmd(args);
    const flashSpawn = spawn(cmd.shift(), cmd);
    let count = 0;
    const total = 150;

    setTimeout(() => {
      if (count !== 151) reject('timeout', args.port);
    }, 600000);

    flashSpawn.stderr.on('data', (data) => {
      if (data.toString() !== '#') args.logger.info(data.toString());
      const m = data.toString().match(/#/gi);
      if (m !== null) {
        count += m.length;
        const progress = (count / total) * 100;
        if (progress <= 100 && progress >= 0) {
          args.progressCallback(progress);
        }
      }
    });

    flashSpawn.on('exit', (code) => {
      args.logger.info(`child process exited with code ${code}, count: ${count}`);
      if (code === 0 && count === 151) resolve();
      else if (code === 0 && count === 0) {
        reject('failed', args.port);
      }
      else if (code === 0 && count === 51) {
        reject('invalid', args.port);
      }
    });
  });
}

export default flashSpawn;
