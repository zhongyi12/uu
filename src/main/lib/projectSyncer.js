/**
 * Created by alex on 15/06/2017.
 */
import request from 'request';
import fs from 'fs';
import path from 'path';
import Bagpipe from 'bagpipe';

function fetchFileList(userToken, fileListURL, options) {
  if (userToken === undefined) {
    // throw Error('User Token is required!');
    console.error('User Token is required!');
    return null;
  }
  if (fileListURL === undefined) {
    // throw Error('URL is required!');
    console.error('URL is required!');
    return null;
  }
  options = options || {};
  options.logger = options.logger || console;
  return new Promise((resolve, reject) => {
    request({
      url: fileListURL,
      headers: {
        'X-LC-Session': userToken,
      },
    }, (error, response, body) => {
      if (error) {
        options.logger.error(`Error when get File List ${fileListURL}, error: ${error}`);
        reject(error);
      }
      else {
        let failMsg;
        if (response !== undefined && response.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            // options.logger.info(body);
            if (data.code !== 0) {
              reject(data.message);
              options.logger.error(`Error when get File List ${fileListURL}, error: ${data.message}`);
            }
            else {
              try {
                const fileList = JSON.parse(body).projects;
                resolve(fileList);
              }
              catch (e) {
                reject(e);
              }
            }
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
          options.logger.error(`Get Files, error: ${failMsg}`);
          reject(failMsg);
        }
      }
    });
  });
}

function uploadFiles(userToken, uploadFileURL, projectFileList, projectFileContent, options) {
  if (userToken === undefined) {
    // throw Error('User Token is required!');
    console.error('User Token is required!');
    return null;
  }
  if (projectFileList === undefined) {
    // throw Error('Project File List is required!');
    console.error('Project File List is required!');
    return null;
  }
  if (projectFileContent === undefined) {
    // throw Error('Project File Content is required!');
    console.error('Project File Content is required!');
    return null;
  }
  if (uploadFileURL === undefined) {
    // throw Error('URL is required!');
    console.error('URL is required!');
    return null;
  }
  options = options || {};
  options.logger = options.logger || console;
  const postData = {
    projects: projectFileList,
    file: projectFileContent,
  };
  // options.logger.info('send data:', JSON.stringify(postData));
  return new Promise((resolve, reject) => {
    request.post({
      url: uploadFileURL,
      headers: {
        'X-LC-Session': userToken,
      },
      formData: postData,
    }, (err, response, body) => {
      if (err) {
        options.logger.error('upload failed:', err);
        reject(err);
        return;
      }
      let failMsg;
      if (response !== undefined && response.statusCode === 200) {
        try {
          const data = JSON.parse(body);
          // options.logger.info(body);
          if (data.code !== 0) {
            reject(data.message);
            options.logger.error(`Error when Upload Files ${uploadFileURL}, error: ${data.message}`);
          }
          else {
            try {
              resolve(JSON.parse(body).data.projects);
            }
            catch (e) {
              reject(e);
            }
          }
        }
        catch (e) {
          reject(e);
        }
        return;
      }

      if (response !== undefined) {
        failMsg = `HTTP error: ${response.statusCode}`;
      }
      else {
        failMsg = 'HTTP error: response null';
      }
      options.logger.error(`Upload Files, error: ${failMsg}`);
      reject(failMsg);
    });
  });
}

function downloadFile(url, filename, dirpath, logger, callback) {
  const targetPath = path.join(dirpath, filename);
  logger.info(`downloading Project ${filename} - ${url} - ${targetPath}`);
  request.get(url)
  .on('error', (err) => {
    logger.error(`Error when request file url: ${url}, filename: ${filename}, error: ${err}`);
    try {
      const stat = fs.statSync(targetPath);
      console.log(`filename: ${filename}, stat.size: ${stat.size}`);
      if (stat.size === 0) {
        fs.unlinkSync(targetPath);
      }
    }
    catch (err) {
      logger.error(`Error stat file ${targetPath}`);
    }
    finally {
      callback(err);
    }
  })
  .pipe(fs.createWriteStream(targetPath))
  .on('error', (err) => {
    logger.error(`Error when pipe url: ${url}, filename: ${filename}, error: ${err}`);
    try {
      const stat = fs.statSync(targetPath);
      console.log(`filename: ${filename}, stat.size: ${stat.size}`);
      if (stat.size === 0) {
        fs.unlinkSync(targetPath);
      }
    }
    catch (err) {
      logger.error(`Error stat file ${targetPath}`);
    }
    finally {
      callback(err);
    }
  })
  .on('finish', callback);
}

function checkExistedFile(compareFileItem, compareFileList) {
  for (const item of compareFileList) {
    if (item.basename === compareFileItem.basename) { // obj.name fileitem.name
      if (item.checksum === compareFileItem.checksum) {
        return 1; // no action
      }
      return 2; // update file content (same file name will be rewrite)
    }
    // if (fileitem.file.metadata._checksum === localFile.checksum) {
    //   return 3; // file rename
    // }
  }
  return 4; // upload new file
}

function compareProjects(userToken, module, projectList, getFileListURL, options) {
  options = options || {};
  options.logger = options.logger || console;
  options.timeout = options.timeout || 10000; // 10 secs
  if (options.force === undefined) options.force = false;
  return new Promise((resolve, reject) => {
    if (userToken === undefined) {
      reject('User Token is required!');
    }
    if (module === undefined) {
      reject('Module is required!');
    }
    if (projectList === undefined) {
      reject('projectList is required!');
    }
    fetchFileList(userToken, getFileListURL, {
      logger: options.logger,
    }).then((remoteFileList) => {
      const compareProjectList = [];
      const remoteFileListFormat = [];
      for (const item of remoteFileList) {
        if (module === item.module) {
          remoteFileListFormat.push({
            basename: item.name,
            checksum: item.resources[0].file.metadata._checksum,
            url: item.resources[0].file.url,
          });
        }
      }
      remoteFileListFormat.forEach((item) => {
        const syncRS = checkExistedFile(item, projectList);
        if (syncRS === 2) {
          compareProjectList.push({ name: item.basename, url: item.url });
        }
      });
      resolve(compareProjectList);
    });
  });
}

function downloadProjects(userToken, module, dirpath, projectList, getFileListURL, options) {
  options = options || {};
  options.logger = options.logger || console;
  options.timeout = options.timeout || 60000; // 60 secs
  options.progressCallback = options.progressCallback || ((transferSize, totalSize) => {
    console.log(`download progress: ${transferSize}, ${totalSize}`);
  });
  if (options.force === undefined) options.force = false;
  return new Promise((resolve, reject) => {
    if (userToken === undefined) {
      reject({ code: 'token' });
    }
    if (module === undefined) {
      reject('Module is required!');
    }
    if (projectList === undefined) {
      reject('projectList is required!');
    }
    fetchFileList(userToken, getFileListURL, {
      logger: options.logger,
    }).then((remoteFileList) => {
      // console.log(remoteFileList);
      const downloadProjectList = [];
      const remoteFileListFormat = [];
      for (const item of remoteFileList) {
        if (module === item.module) {
          remoteFileListFormat.push({
            basename: item.name,
            filename: item.resources[0].file.name,
            checksum: item.resources[0].file.metadata._checksum,
            url: item.resources[0].file.url,
          });
        }
      }
      remoteFileListFormat.forEach((item) => {
        const syncRS = checkExistedFile(item, projectList);
        if (syncRS === 4 || ((syncRS === 2) && options.force)) {
          downloadProjectList.push({ name: item.filename, url: item.url });
        }
      });
      console.log(`download Project list ${downloadProjectList.length}`);
      // if (downloadProjectList.length <= 0) resolve('No files download');
      const downloadedFileList = [];
      const failedFileList = [];
      let timeout = 0;
      const bagpipe = new Bagpipe(10);
      for (const p of downloadProjectList) {
        bagpipe.push(downloadFile, p.url, p.name, dirpath, options.logger, (err) => {
          if (err) {
            options.logger.error(`Error when download file ${p.name} - ${err}`);
            failedFileList.push(p.name);
            return;
          }
          downloadedFileList.push(p.name);
          options.progressCallback(downloadedFileList.length, downloadProjectList.length);
        });
      }
      const checkDownloadCompleted = setInterval(() => {
        if (downloadedFileList.length === downloadProjectList.length) {
          clearInterval(checkDownloadCompleted);
          resolve(downloadedFileList);
          options.logger.info(`Downloaded Files count ${downloadedFileList.length} - ${downloadedFileList.join(', ')}`);
        }
        else if ((failedFileList.length + downloadedFileList.length) === downloadProjectList.length) {
          reject({ code: 'failed', data: { failed: failedFileList, succeed: downloadedFileList } });
          clearInterval(checkDownloadCompleted);
          options.logger.info(`Downloaded Files count ${downloadedFileList.length} - ${downloadedFileList.join(', ')}`);
          options.logger.info(`Failed Files count ${failedFileList.length} - ${failedFileList.join(', ')}`);
        }
        else {
          if (timeout >= options.timeout) {
            const _failedFileList = [];
            downloadProjectList.forEach((p) => {
              if (downloadedFileList.indexOf(p.name) === -1) _failedFileList.push(p.name);
            });
            reject({ code: 'timeout', data: { failed: failedFileList, succeed: downloadedFileList } });
            clearInterval(checkDownloadCompleted);
            options.logger.info(`Downloaded Files count ${downloadedFileList.length} - ${downloadedFileList.join(', ')}`);
            options.logger.info(`Failed Files count ${failedFileList.length} - ${failedFileList.join(', ')}`);
          }
        }
        timeout += 100;
      }, 100);
    }).catch(err => reject({ code: 'error', desc: err }));
  });
}

function uploadProjects(userToken, module, projectList, getFileListURL, uploadFileURL, options) {
  options = options || {};
  options.logger = options.logger || console;
  if (options.force === undefined) options.force = false;
  options.progressCallback = options.progressCallback || ((transferSize, totalSize) => {
    console.log(`Upload progress: ${transferSize}, ${totalSize}`);
  });
  return new Promise((resolve, reject) => {
    if (userToken === undefined) {
      reject('User Token is required!');
    }
    if (module === undefined) {
      reject('Module is required!');
    }
    if (projectList === undefined) {
      reject('projectList is required!');
    }

    fetchFileList(userToken, getFileListURL, { // TODO: timeout handle
      logger: options.logger,
    }).then((remoteFileList) => {
      const remoteFileListFormat = [];
      for (const item of remoteFileList) {
        if (module === item.module) {
          remoteFileListFormat.push({
            basename: item.name,
            checksum: item.resources[0].file.metadata._checksum,
          });
        }
      }
      const uploadProjectList = []; // to be uploaded project name
      const uploadProjectContent = []; // to be uploaded project content
      const tempUploadProjectName = [];
      let filesTotalSize = 0;
      let transferredSize = 0;
      projectList.forEach((localFile) => {
        const syncRS = checkExistedFile(localFile, remoteFileListFormat);
        if (syncRS === 4 || ((syncRS === 2) && options.force)) {
          const projectData = {
            name: localFile.basename,
            module,
            files: [localFile.basename + localFile.extname],
          };
          // console.log('push data:', JSON.stringify(projectData));
          uploadProjectList.push(JSON.stringify(projectData));
          uploadProjectContent.push(fs.createReadStream(localFile.filePath).on('data', (chunk) => {
            transferredSize += chunk.length;
            options.progressCallback(transferredSize, filesTotalSize);
          }));
          filesTotalSize += fs.statSync(localFile.filePath).size;
          tempUploadProjectName.push(localFile.basename);
        }
      });
      // if (uploadProjectList.length <= 0) reject('No files to be uploaded');
      options.logger.info(`To be Upload files, ${tempUploadProjectName.join(', ')}`);
      uploadFiles(userToken, uploadFileURL, uploadProjectList, uploadProjectContent, {
        logger: options.logger,
        totalSize: filesTotalSize,
      }).then((response) => {
        resolve(response);
        options.logger.info(`Upload files ${response.join(', ')}`);
      }).catch((error) => { reject(error); });
    }).catch((error) => {
      reject(error);
    });
  });
}

function deleteProject(userToken, module, deleteFileURL, projectNameList, options) {
  options = options || {};
  options.logger = options.logger || console;
  return new Promise((resolve, reject) => {
    if (userToken === undefined) {
      reject('User Token is required!');
    }
    if (module === undefined) {
      reject('Module is required!');
    }
    if (deleteFileURL === undefined) {
      reject('deleteFileURL is required!');
    }
    if (projectNameList === undefined) {
      reject('projectNameList is required!');
    }
    options.logger.info(`To be Delete files, ${projectNameList.join(',')}`);
    // const strData = JSON.stringify({
    //   name: projectNameList,
    //   module,
    // });
    const deleteProjects = [];
    for (const p of projectNameList) {
      deleteProjects.push({
        name: p,
        module,
      });
    }
    const form = {
      projects: JSON.stringify(deleteProjects),
    };
    request.post({
      url: deleteFileURL,
      form,
      headers: {
        'X-LC-Session': userToken,
      },
    }, (err, response, body) => {
      if (err) {
        options.logger.error('delete failed:', err);
        reject(err);
      }
      let failMsg;
      if (response !== undefined && response.statusCode === 200) {
        try {
          const data = JSON.parse(body);
          if (data.code !== 0) {
            options.logger.error(`Error when delete file ${deleteFileURL}, error: ${data.message}`);
            reject(data.message);
          }
          else {
            const projectNameList = [];
            for (const p of data.projects) {
              projectNameList.push(p.name);
            }
            options.logger.info(`Delete files, ${projectNameList.join(',')}`);
            resolve(data.projects);
          }
        }
        catch (e) {
          reject(e);
        }
        return;
      }

      if (response !== undefined) {
        failMsg = `HTTP error: ${response.statusCode}`;
      }
      else {
        failMsg = 'HTTP error: response null';
      }
      options.logger.error(`Delete File error: ${failMsg}`);
      reject(failMsg);
    });
  });
}

function renameProject(userToken, module, renameFileURL, oldname, newname, options) {
  options = options || {};
  options.logger = options.logger || console;
  return new Promise((resolve, reject) => {
    if (userToken === undefined) {
      reject('User Token is required!');
    }
    if (module === undefined) {
      reject('Module is required!');
    }
    if (renameFileURL === undefined) {
      reject('deleteFileURL is required!');
    }
    if (oldname === undefined) {
      reject('oldname is required!');
    }
    if (newname === undefined) {
      reject('newname is required!');
    }
    options.logger.debug(`to be rename file, ${oldname} - ${newname}`);
    const strData = JSON.stringify({
      module,
      old_name: oldname,
      new_name: newname,
    });
    const form = {
      projects: strData,
    };
    request.post({
      url: renameFileURL,
      form,
      headers: {
        'X-LC-Session': userToken,
      },
    }, (err, response, body) => {
      if (err) {
        options.logger.error('rename failed:', err);
        reject(err);
      }
      let failMsg;
      if (response !== undefined && response.statusCode === 200) {
        try {
          const data = JSON.parse(body);
          if (data.code !== 0) {
            options.logger.error(`Error when rename file ${renameFileURL}, error: ${data.message}`);
            reject(data.message);
          }
          else {
            const projectNameList = [];
            for (const p of data.projects) {
              projectNameList.push(p.name);
            }
            options.logger.debug(`Rename files, ${projectNameList.join(',')}`);
            resolve(data.projects);
          }
        }
        catch (e) {
          reject(e);
        }
        return;
      }

      if (response !== undefined) {
        failMsg = `HTTP error: ${response.statusCode}`;
      }
      else {
        failMsg = 'HTTP error: response null';
      }
      options.logger.error(`rename File error: ${failMsg}`);
      reject(failMsg);
    });
  });
}


exports.fetchFileList = fetchFileList;
exports.uploadFiles = uploadFiles;
exports.checkExistedFile = checkExistedFile;
exports.uploadProjects = uploadProjects;
exports.deleteProject = deleteProject;
exports.renameProject = renameProject;
exports.downloadProjects = downloadProjects;
exports.compareProjects = compareProjects;
