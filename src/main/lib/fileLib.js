/**
 * Created by alex on 15/06/2017.
 */

import fs from 'fs';
import path from 'path';
import md5File from './md5File';

function getTimestamp(time) {
  if (time === null) {
    time = '';
  }
  return new Date(time).getTime();
}

function sortTime(a, b) {
  return getTimestamp(a) - getTimestamp(b);
}

function sortString(a, b) {
  return a.localeCompare(b);
}

function sortFiles(fileItemList, sortCondition, sortOrderDesc) {
  let sortList = [];
  switch (sortCondition) {
    case 'modify': {
      sortList = fileItemList.sort((a, b) => sortTime(a.modifiedTime, b.modifiedTime));
      break;
    }
    case 'create': {
      sortList = fileItemList.sort((a, b) => sortTime(a.createTime, b.createTime));
      break;
    }
    case 'name': {
      sortList = fileItemList.sort((a, b) => sortString(a.basename, b.basename));
      break;
    }
    default: {
      sortList = fileItemList.sort((a, b) => sortTime(a.modifiedTime, b.modifiedTime));
      break;
    }
  }
  if (sortOrderDesc) {
    return sortList.reverse();
  }
  return sortList;
}

function listDirectory(dirPath, extname, options) {
  options = options || {};
  options.sortConidition = options.sortConidition || 'modify'; // modify, name, create
  if (options.sortOrderDesc === undefined) {
    options.sortOrderDesc = false;
  }
  if (options.checksum === undefined) {
    options.checksum = false;
  }
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, null, (err, files) => {
      if (err) {
        reject(`error with read dir ${dirPath} - ${err}`);
      }
      const fileItemList = [];
      let counter = 0;
      let uncounter = 0;
      if (files.length === 0) {
        resolve({});
      }
      else {
        files.forEach((file) => {
          const fileExtension = path.extname(file);
          function handleFileList() {
            if (counter + uncounter === files.length) {
              if (counter === 0) {
                resolve({});
              }
              else if (counter === 1) {
                resolve(fileItemList);
              }
              else {
                resolve(sortFiles(fileItemList, options.sortConidition, options.sortOrderDesc));
              }
            }
          }
          if (fileExtension === extname) {
            counter++;
            const new_path = path.join(dirPath, file);
            // console.log('new_path');
            // console.log(new_path);
            fs.stat(new_path, (err, stats) => {
              if (err) {
                reject(`error with stat file ${file} - ${err}`);
              }
              let createTime;
              let modifiedTime;
              if (stats) {
                createTime = stats.birthtime;
                modifiedTime = stats.mtime;
              }
              const fileItem = {
                basename: path.basename(file, extname),
                extname: fileExtension,
                filePath: new_path,
                createTime,
                modifiedTime,
              };
              if (options.checksum) {
                md5File(new_path, (err, hash) => {
                  if (err) reject(`error with get checksum ${fileItem.basename}`);
                  fileItem.checksum = hash;
                  fileItemList.push(fileItem);
                  handleFileList();
                });
              }
              else {
                fileItemList.push(fileItem);
                handleFileList();
              }
            });
          }
          else {
            uncounter++;
            handleFileList();
          }
        });
      }
    });
  });
}

function listDirectorySync(dirPath, extname, options) {
  options = options || {};
  options.sortConidition = options.sortConidition || 'modify'; // modify, name, create
  if (options.sortOrderDesc === undefined) {
    options.sortOrderDesc = false;
  }
  if (options.checksum === undefined) {
    options.checksum = false;
  }
  const files = fs.readdirSync(dirPath);
  const fileItemList = [];
  for (const file of files) {
    const fileExtension = path.extname(file);
    if (fileExtension === extname) {
      const new_path = path.join(dirPath, file);
      const stats = fs.statSync(new_path);
      const fileItem = {
        basename: path.basename(file, extname),
        extname: fileExtension,
        filePath: new_path,
        birthTime: stats.birthtime,
        modifiedTime: stats.mtime,
      };
      if (options.checksum) {
        fileItem.checksum = md5File.sync(new_path);
      }
      fileItemList.push(fileItem);
    }
  }
  return sortFiles(fileItemList, options.sortConidition, options.sortOrderDesc);
}

function checkFileExistedSync(dirPath, extname, projectName) {
  const projectFiles = listDirectorySync(dirPath, extname);
  for (const item of projectFiles) {
    if (item.basename === projectName) return true;
  }
  return false;
}

function checkFileExisted(dirPath, extname, projectName) {
  return new Promise((resolve, reject) => {
    listDirectory(dirPath, extname).then((projectFiles) => {
      if (projectFiles.length > 0) {
        for (const item of projectFiles) {
          if (item.basename === projectName) resolve(true);
        }
      }
      else {
        resolve(false);
      }
      resolve(false);
    }).catch((error) => { reject(error); });
  });
}
const Module = {
  Blockly: 'Blockly',
  TeachMode: 'TeachMode',
  Paint: 'Paint',
  Tracking: 'Tracking',
};
const FileExtension = {
  Blockly: '.xml',
  TeachMode: '.rec',
  Paint: '.json',
  Tracking: '.json',
};

const FileManager = {
  init(dirList) {
    this.ModulePath = dirList;
  },
  ModulePath: {},
  saveProjectSync(module, projectName, content) {
    if (!(module in Module)) {
      return false;
    }
    const dir = this.ModulePath[module];
    const extension = FileExtension[module];
    const filePath = path.join(dir, projectName + extension);
    if (module === Module.TeachMode) {
      const tempRecord = fs.readFileSync(this.ModulePath.TeachTempFilePath, 'utf8');
      return fs.writeFileSync(filePath, tempRecord);
    }
    return fs.writeFileSync(filePath, content);
  },
  saveProject(module, projectName, content) {
    return new Promise((resolve, reject) => {
      if (!(module in Module)) {
        reject(false);
      }
      const dir = this.ModulePath[module];
      const extension = FileExtension[module];
      const filePath = path.join(dir, projectName + extension);
      fs.writeFile(filePath, content, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  },
  loadProjectSync(module, projectName) {
    if (!(module in Module)) {
      return false;
    }
    const dir = this.ModulePath[module];
    const extension = FileExtension[module];
    const filePath = path.join(dir, projectName + extension);
    // UserConfig.setItem(module, 'LastProjectName', projectName);
    if (module === Module.TeachMode) {
      const tempRecord = fs.readFileSync(filePath, 'utf8');
      fs.writeFileSync(this.ModulePath.TeachTempFilePath, tempRecord);
      return tempRecord;
    }
    return fs.readFileSync(filePath, 'utf8');
  },
  loadProject(module, projectName) {
    return new Promise((resolve, reject) => {
      if (!(module in Module)) {
        reject(false);
      }
      const dir = this.ModulePath[module];
      const extension = FileExtension[module];
      const filePath = path.join(dir, projectName + extension);
      this.checkExistedProject(module, projectName).then(() => {
        // console.log(`Project: ${projectName}, not existed: ${existed}`);
        if (module === Module.TeachMode) {
          fs.readFile(filePath, 'utf8', (err, data) => {
            fs.writeFile(this.ModulePath.TeachTempFilePath, data, (err) => {
              if (err) reject(err);
              resolve(data);
            });
          });
        }
        else {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data);
          });
        }
      }).catch((err) => reject(err));
    });
      // UserConfig.setItem(module, 'LastProjectName', projectName);
  },
  renameProject(module, oldProjectName, newProjectName) {
    return new Promise((resolve, reject) => {
      if (!(module in Module)) {
        reject(false);
      }
      const dir = this.ModulePath[module];
      const extension = FileExtension[module];
      const oldFilePath = path.join(dir, oldProjectName + extension);
      const newFilePath = path.join(dir, newProjectName + extension);
      fs.rename(oldFilePath, newFilePath, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  },
  renameProjectSync(module, oldProjectName, newProjectName) {
    if (!(module in Module)) {
      return false;
    }
    const dir = this.ModulePath[module];
    const extension = FileExtension[module];
    const oldFilePath = path.join(dir, oldProjectName + extension);
    const newFilePath = path.join(dir, newProjectName + extension);
    return fs.renameSync(oldFilePath, newFilePath);
  },
  deleteProjectSync(module, projectName) {
    if (!(module in Module)) {
      return false;
    }
    const dir = this.ModulePath[module];
    const extension = FileExtension[module];
    const filePath = path.join(dir, projectName + extension);
    return fs.unlinkSync(filePath);
  },
  deleteProject(module, projectName) {
    return new Promise((resolve, reject) => {
      if (!(module in Module)) {
        reject(false);
      }
      const dir = this.ModulePath[module];
      const extension = FileExtension[module];
      const filePath = path.join(dir, projectName + extension);
      fs.unlink(filePath, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  },
  checkExistedProjectSync(module, projectName) {
    if (!(module in Module)) {
      return false;
    }
    const dir = this.ModulePath[module];
    const extension = FileExtension[module];
    return checkFileExistedSync(dir, extension, projectName);
  },
  checkExistedProject(module, projectName) {
    return new Promise((resolve, reject) => {
      if (!(module in Module)) {
        reject(false);
      }
      const dir = this.ModulePath[module];
      const extension = FileExtension[module];
      checkFileExisted(dir, extension, projectName)
        .then(existed => resolve(existed))
        .catch(error => reject(error));
    });
  },
  listProjectListSync(module, options) {
    if (!(module in Module)) {
      return false;
    }
    const dir = this.ModulePath[module];
    const extension = FileExtension[module];
    return listDirectorySync(dir, extension, options);
  },
  listProjectList(module, options) {
    return new Promise((resolve, reject) => {
      if (!(module in Module)) {
        reject(false);
      }
      const dir = this.ModulePath[module];
      const extension = FileExtension[module];
      listDirectory(dir, extension, options)
        .then(projectList => resolve(projectList))
        .catch(error => reject(error));
    });
  },
};

exports.FileManager = FileManager;
exports.ModuleName = Module;
exports.ModuleFileExtension = FileExtension;
