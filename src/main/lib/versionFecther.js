/**
 * Created by alex on 2017/5/24.
 */
import request from 'request';
import versionCompare from 'general-version-compare';

const VersionFetcher = {
  versionInfo: null,
  logger: null,
  /**
   *
   * @param {object} args
   * @param {string} args.url
   * @param {object} args.logger
   */
  init(args) {
    return new Promise((resolve, reject) => {
      this.logger = args.logger || console;
      args.logger.info(`Fetching version Info 1 from url: ${args.url}`);
      request(`${args.url}?v=${Math.random()}`, (error, response, body) => {
        if (error) {
          args.logger.error(`Version Info not found 2, url: ${args.url}, error: ${error}`);
          reject(error);
        }
        let failMsg;
        if (response !== undefined && response.statusCode === 200) {
          try {
            this.versionInfo = JSON.parse(body);
            console.info('this.versionInfo 2');
            // for test
            // this.versionInfo.swiftpro4.version = '4.2.0';
            // this.versionInfo.swiftpro.version = '3.2.1';
            // this.versionInfo.software.firmware.swiftpro4.version = '4.2.0';
            // this.versionInfo.software.firmware.swiftpro.version = '3.2.1';
            // console.info(this.versionInfo);
            resolve(this.versionInfo);
            // for test end
          }
          catch (e) {
            reject(e);
          }
        }
        else {
          if (response !== undefined) {
            failMsg = `HTTP error: ${response.statusCode}`;
          }
          else {
            failMsg = 'HTTP error: response null';
          }
          this.logger.error(`Version Info, error: ${failMsg}`);
          reject(failMsg);
        }
      });
    });
  },
  /**
   * @param {string} key
   * @param {string} currentVersion
   * @param {object} args
   * @param {object} args.logger
   */
  checkForUpdates(key, currentVersion, args) {
    return new Promise((resolve, reject) => {
      args = args || {};
      args.logger = args.logger || console;
      const versionInfo = VersionFetcher.versionInfo;
      let failMsg;
      if (versionInfo !== undefined && versionInfo !== null) {
        if (Object.keys(versionInfo).indexOf(key) !== -1) {
          const updateJson = versionInfo[key];
          const version = updateJson.version;
          if (versionCompare(currentVersion, version) === 1) {
            args.logger.info(`Update available ${version}`);
            resolve(updateJson);
          }
          else {
            failMsg = 'Update not available';
          }
        }
        else {
          failMsg = `Update not available, key ${key} not found`;
        }
      }
      else {
        failMsg = 'Update not available, versionInfo not found';
      }
      args.logger.warn(failMsg);
      if (failMsg !== undefined) {
        args.logger.warn(failMsg);
        reject(failMsg);
      }
    });
  },
};

export default VersionFetcher;
