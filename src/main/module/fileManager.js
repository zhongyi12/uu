/**
 * Created by alex on 19/12/2016.
 */

import fs from 'fs';
import path from 'path';
import { shell, session } from 'electron';
import AppConfig from 'appConfig';
// import UserConfig from './userConfig';
import { FileManager, ModuleName as Module } from '../lib/fileLib';

function openModuleFolder(module) {
  if (this.Module.indexOf(module) !== -1) {
    shell.showItemInFolder(this.ModulePath[module]);
    return true;
  }
  return false;
}

let ModuleDirectory = {};

// console.log('sizes');
const ses = session.fromPartition('persist:name');
ses.getCacheSize((size) => {
  console.log('size', size);
});
function init() {
  const temp_record_filepath = path.join(AppConfig.HOME_DIR_PATH, 'temp', 'temp.rec');
  const user_config_path = AppConfig.STUDIO_DIR_PATH;
  const app_support_path = AppConfig.CACHE_DIR_PATH;
  const blockly_dir = path.join(AppConfig.STUDIO_DIR_PATH, Module.Blockly.toLowerCase());
  const teach_dir = path.join(AppConfig.STUDIO_DIR_PATH, Module.TeachMode.toLowerCase());
  const paint_dir = path.join(AppConfig.STUDIO_DIR_PATH, Module.Paint.toLowerCase());
  const tracking_dir = path.join(AppConfig.STUDIO_DIR_PATH, Module.Tracking.toLowerCase());
  if (!fs.existsSync(blockly_dir)) {
    fs.mkdirSync(blockly_dir);
  }
  if (!fs.existsSync(teach_dir)) {
    fs.mkdirSync(teach_dir);
  }
  if (!fs.existsSync(paint_dir)) {
    fs.mkdirSync(paint_dir);
  }
  if (!fs.existsSync(tracking_dir)) {
    fs.mkdirSync(tracking_dir);
  }
  ModuleDirectory = {
    Blockly: blockly_dir,
    TeachMode: teach_dir,
    Paint: paint_dir,
    Tracking: tracking_dir,
    TeachTempFilePath: temp_record_filepath,
    Cache: {
      file: user_config_path,
      folder: app_support_path,
    },
  };
  FileManager.init(ModuleDirectory);
  FileManager.openFolder = openModuleFolder;
}

init();
exports.FileManager = FileManager;
exports.ModuleDirectory = ModuleDirectory;
exports.ModuleName = Module;
// exports.openModuleFolder = openModuleFolder;
