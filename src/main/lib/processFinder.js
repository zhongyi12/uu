/**
 * Created by alex on 2017/5/6.
 */
const exec = require('child_process').exec;
const os = require('os');

function ParamException(message) {
  this.message = message;
  this.name = 'ParamException';
}

/**
 * @param {object} args
 * @param {number} [args.port]
 * @param {object} [args.logger]
 * @param {bool} [args.listening=true]
 */
function findPIDbyPort(args) {
  return new Promise((resolve, reject) => {
    args.logger = args.logger || console;
    args.listening = args.listening || (args.listening === undefined);
    if (args.port === undefined) {
      // throw new ParamException('args.port is required!');
      console.error('ParamException: args.port is required!');
      return;
    }
    switch (os.platform()) {
      default :
        break;
      case 'win32': {
        // Format Like below
        // TCP    0.0.0.0:18321          0.0.0.0:0              LISTENING       25056
        const command = 'netstat -ano -p TCP';
        exec(command, (error, stdout) => {
          if (error) {
            reject(error);
          }
          else {
            // args.logger.info(stdout);
            const lines = stdout.split(/\r?\n/);
            for (const line of lines) {
              // args.logger.info(line);
              const columns = line.replace(/[\r\n]/g, '').replace(/\s+/g, ',').split(',');
              if (columns[1] === undefined || !columns[1].startsWith('TCP')) {
                // console.log(columns[1])
                // console.log('empty')
                continue;
              }
              // Change to below format
              // TCP,0.0.0.0:18321,0.0.0.0:0,LISTENING,25056
              const pid = columns.pop();
              const listening = columns[4];
              // console.log(`line: ${listening}`);
              let addressPort;
              if (args.listening && listening === 'LISTENING') {
                addressPort = columns[2];
              }
              else if (!args.listening && listening === 'ESTABLISHED') {
                addressPort = columns[3];
              }
              else {
                resolve();
              }
              if (addressPort !== undefined && addressPort.indexOf(args.port) !== -1) {
                args.logger.info(`Find ${args.port} with PID ${pid}`);
                resolve(pid);
                break;
              }
            }
          }
        });
        break;
      }
      case 'darwin': // darwin same as linux.
      case 'linux': {
        const type = args.listening ? 'LISTEN' : 'ESTABLISHED';
        const command = `lsof -n -i4TCP:${args.port} | grep ${type} | awk '{print $2}'`;
        exec(command, (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          const pids = stdout.replace(/[\r\n]/g, ',').split(',');
          while (pids.indexOf('') !== -1) {
            pids.splice(pids.indexOf(''), 1);
          }
          if (pids.length > 0) {
            resolve(pids);
          }
          else {
            resolve();
          }
        });
      }
    }
  });
}

module.exports = findPIDbyPort;

