/**
 * Created by alex on 19/12/2016.
 */

import AppConfig from 'appConfig';
import UserConfig from './userConfig';
import { FileManager, ModuleDirectory } from './fileManager';
import { appLogger } from '../lib/log';
import { uploadProjects, deleteProject, renameProject, downloadProjects, compareProjects } from '../lib/projectSyncer';

const hosturl = AppConfig.API_HOST_URL;
const getFileListURL = `${hosturl}api/1.0/getprojects`;
const uploadFileURL = `${hosturl}api/1.0/uploadprojects`;
const deleteFileURL = `${hosturl}api/1.0/deleteprojects`;
const renameFileURL = `${hosturl}api/1.0/renameprojects`;

const SyncManager = {
  UserToken: null,
  updateUserToken() {
    const userProfile = UserConfig.getItem('Studio', 'UserProfile');
    if (userProfile !== undefined && userProfile !== null) {
      this.UserToken = userProfile.token;
    }
    return this.UserToken;
  },
  uploadProject(module, options) {
    options = options || {};
    options.projectList = options.projectList || [];
    options.timeout = options.timeout || 60000; // 60 secs
    if (options.force === undefined) options.force = false;
    let projectList = [];
    if (options.projectList.length === 0) {
      projectList = FileManager.listProjectListSync(module, { checksum: true });
    }
    else {
      const tempObjectList = {};
      const tempList = FileManager.listProjectListSync(module, { checksum: true });
      for (const p of tempList) {
        tempObjectList[p.basename] = p;
      }
      for (const n of options.projectList) {
        projectList.push(tempObjectList[n]);
      }
    }
    return new Promise((resolve, reject) => {
      if (SyncManager.UserToken === null) {
        reject({ code: 'token' });
      }
      // console.log(`userToken ${this.UserToken}`);
      uploadProjects(this.UserToken, module, projectList, getFileListURL, uploadFileURL, {
        logger: appLogger,
        force: options.force,
        timeout: options.timeout,
        progressCallback: options.progressCallback,
      }).then(response => resolve(response))
        .catch(error => reject(error));
    });
  },
  downloadProject(module, options) {
    options = options || {};
    options.timeout = options.timeout || 60000; // 10 secs
    if (options.force === undefined) options.force = false;
    return new Promise((resolve, reject) => {
      if (SyncManager.UserToken === null) {
        reject({ code: 'token' });
      }
      const projectList = FileManager.listProjectListSync(module, { checksum: true });
      downloadProjects(SyncManager.UserToken, module, ModuleDirectory[module], projectList, getFileListURL,
        {
          logger: appLogger,
          force: options.force,
          timeout: options.timeout,
          progressCallback: options.progressCallback,
        }).catch(err => reject(err))
        .then(count => resolve(count));
    });
  },
  deleteProject(module, projectNameList) {
    return new Promise((resolve, reject) => {
      if (this.UserToken === null) {
        reject({ code: 'token' });
      }
      deleteProject(this.UserToken, module, deleteFileURL, projectNameList, { logger: appLogger })
          .then(resolve).catch(err => reject(err));
    });
  },
  renameProject(module, oldname, newname) {
    return new Promise((resolve, reject) => {
      if (this.UserToken === null) {
        reject({ code: 'token' });
      }
      renameProject(this.UserToken, module, renameFileURL, oldname, newname, { logger: appLogger })
        .then(resolve).catch(err => reject(err));
    });
  },
  compareProject(module) {
    return new Promise((resolve, reject) => {
      if (this.UserToken === null) {
        reject({ type: 'token' });
      }
      const tempList = FileManager.listProjectListSync(module, { checksum: true });
      compareProjects(this.UserToken, module, tempList, getFileListURL, { logger: appLogger })
        .then((compareList) => {
          resolve(compareList);
        }).catch(err => reject(err));
    });
  },
};

SyncManager.updateUserToken();

exports.SyncManager = SyncManager;
