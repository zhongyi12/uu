/**
 * Created by alex on 19/06/2017.
 */
const crypto = require('crypto');
const fs = require('fs');

const BUFFER_SIZE = 8192;

function md5FileSync(filename) {
  const fd = fs.openSync(filename, 'r');
  const hash = crypto.createHash('md5');
  const buffer = new Buffer(BUFFER_SIZE);

  try {
    let bytesRead;

    do {
      bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE);
      hash.update(buffer.slice(0, bytesRead));
    } while (bytesRead === BUFFER_SIZE);
  }
  finally {
    fs.closeSync(fd);
  }

  return hash.digest('hex');
}

function md5File(filename, cb) {
  if (typeof cb !== 'function') {
    // throw new TypeError('Argument cb must be a function');
    console.error('TypeError: Argument cb must be a function');
    return;
  }

  const output = crypto.createHash('md5');
  const input = fs.createReadStream(filename);

  input.on('error', (err) => {
    cb(err);
  });

  output.once('readable', () => {
    cb(null, output.read().toString('hex'));
  });

  input.pipe(output);
}

// function md5FileAsPromised(filename) {
//   return new Promise((resolve, reject) => {
//     md5File(filename, (err, hash) => {
//       if (err) reject(err);
//       resolve(hash);
//     });
//   });
// }

module.exports = md5File;
module.exports.sync = md5FileSync;
