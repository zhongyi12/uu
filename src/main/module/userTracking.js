import AppConfig from 'appConfig';
import { FileManager } from '../module/fileManager';
import UserConfig from './userConfig';
import request from 'request';

const hosturl = AppConfig.API_HOST_URL;
const uploadTrackingURL = `${hosturl}api/1.0/uploadusesituation`;

const userTracking = {
  insertItem(clickType) {
    FileManager.checkExistedProject('Tracking', 'clickData').then((existed) => {
      if (existed) {
        FileManager.loadProject('Tracking', 'clickData').then((fileData) => {
          try {
            if (fileData && fileData.length > 2) {
              console.log(fileData);
              if (fileData === '' || fileData === undefined || fileData === null) {
                fileData = {};
              }
              const fileJSON = JSON.parse(fileData);
              if (fileJSON[clickType] === undefined) {
                fileJSON[clickType] = 1;
              }
              else {
                fileJSON[clickType] = fileJSON[clickType] + 1;
              }
              // fileJSON.userClicks.push(clickType);
              FileManager.saveProjectSync('Tracking', 'clickData', JSON.stringify(fileJSON));
            }
          }
          catch (e) {
            console.error(e);
          }
        }).catch((err) => console.log(err));
      }
      else {
        const initJSON = {};
        initJSON[clickType] = 1;
        FileManager.saveProjectSync('Tracking', 'clickData', JSON.stringify(initJSON));
      }
    }).catch((err) => console.log(err));
  },
  insertTime(clickType) {
    const nowTime = new Date().toLocaleString();
    FileManager.checkExistedProject('Tracking', 'clickData').then((existed) => {
      if (existed) {
        FileManager.loadProject('Tracking', 'clickData').then((fileData) => {
          if (fileData && fileData.length > 2) {
            try {
              console.log(fileData);
              if (fileData === '' || fileData === undefined || fileData === null) {
                fileData = {};
              }
              const fileJSON = JSON.parse(fileData);
              fileJSON[clickType] = nowTime;
              // fileJSON.userClicks.push(clickType);
              FileManager.saveProjectSync('Tracking', 'clickData', JSON.stringify(fileJSON));
            }
            catch (e) {
              console.error(e);
            }
          }
        }).catch((err) => console.log(err));
      }
      else {
        const initJSON = {};
        initJSON[clickType] = nowTime;
        FileManager.saveProjectSync('Tracking', 'clickData', JSON.stringify(initJSON));
      }
    }).catch((err) => console.log(err));
  },
  insertData(dataString) {
    FileManager.checkExistedProject('Tracking', 'clickData').then((existed) => {
      if (existed) {
        FileManager.loadProject('Tracking', 'clickData').then((fileData) => {
          try {
            if (fileData === '' || fileData === undefined || fileData === null) {
              fileData = {};
            }
            const fileJSON = JSON.parse(fileData);
            fileJSON.fileData = dataString;
            // fileJSON.userClicks.push(clickType);
            FileManager.saveProjectSync('Tracking', 'clickData', JSON.stringify(fileJSON));
          }
          catch (e) {
            console.error(e);
          }
        }).catch((err) => console.log(err));
      }
      else {
        const initJSON = {};
        initJSON.fileData = dataString;
        FileManager.saveProjectSync('Tracking', 'clickData', JSON.stringify(initJSON));
      }
    }).catch((err) => console.log(err));
  },
  uploadTrackData() {
    return new Promise((resolve, reject) => {
      FileManager.checkExistedProject('Tracking', 'clickData').then((existed) => {
        if (existed) {
          FileManager.loadProject('Tracking', 'clickData').then((fileData) => {
            this.postTrackData(fileData).then(() => {
              FileManager.deleteProject('Tracking', 'clickData')
              .then(resolve).catch((err) => reject(err));
            });
          });
        }
        else {
          reject('No Tracking Data');
        }
      });
    });
  },
  UserToken: null,
  postTrackData(fileData) {
    // console.log('post', uploadTrackingURL, this.UserToken);
    console.log(fileData);
    this.updateUserToken();
    return new Promise((resolve, reject) => {
      request.post({
        url: uploadTrackingURL,
        headers: {
          'X-LC-Session': this.UserToken,
        },
        form: fileData,
      }, (err, response, body) => {
        if (err) {
          reject(err);
        }
        else {
          try {
            const rData = JSON.parse(body);
            if (rData.code === 0) {
              resolve();
            }
            else {
              console.log('code', rData.code, 'msg', rData.message);
            }
          }
          catch (e) {
            reject(e);
          }
        }
        let failMsg;
        if (response !== undefined) {
          failMsg = `HTTP error: ${response.statusCode}`;
        }
        else {
          failMsg = 'HTTP error: response null';
        }
        reject(failMsg);
      });
    });
  },
  updateUserToken() {
    const userProfile = UserConfig.getItem('Studio', 'UserProfile');
    if (userProfile !== undefined && userProfile !== null) {
      this.UserToken = userProfile.token;
    }
  },
};

userTracking.updateUserToken();

exports.userTracking = userTracking;
