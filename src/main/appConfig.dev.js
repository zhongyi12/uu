/**
 * Created by alex on 26/04/2017.
 * This file only can be used in Electron Main Process
 * 这个配置只能在 Main 环境下使用，并且在 STUDIO_ENV = development 下生效
 */
import config from '../../config/config';
import os from 'os';
import AppConfig from './appConfig.pro';
import path from 'path';
import fs from 'fs';

AppConfig.UPDATE_URL = 'http://update.ufactory.cc/releases/updates.json';
// AppConfig.UPDATE_URL = 'http://update.ufactory.cc/releases/updates-1.1.20_a.json';
AppConfig.STUDIO_CONFIG_PATH = path.join(AppConfig.STUDIO_DIR_PATH, 'config_dev.json');
// AppConfig.ISSUES_URL = 'http://beta.ufactory.cc/issue.html';
AppConfig.API_HOST_URL = 'http://studio.leanapp.cn/';
let osType;
if (os.platform() === 'darwin') {
  osType = 'mac';
}
else if (os.platform() === 'win32') {
  osType = 'win';
}
AppConfig.Channel = 'dev';
AppConfig.BUILD_ID = `${osType}-${os.arch()}-${AppConfig.Channel}`;

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') { // Only support development environment
  global.closeWithoutEvent = true;
  const projectDir = process.cwd();
  let corePath;
  let avrdudePath;
  let driverPath;
  let curaPath;
  const winBinPath = path.join(projectDir, 'Resources', 'bin', 'win');
  const macBinPath = path.join(projectDir, 'Resources', 'bin', 'mac');
  const linuxBinPath = path.join(projectDir, 'Resources', 'bin', 'linux');
  if (os.platform() === 'darwin') {
    if (process.env.NODE_ENV !== 'production') {
      corePath = path.join(macBinPath, 'uarmcore');
      avrdudePath = path.join(macBinPath, 'avrdude');
      curaPath = path.join(macBinPath, 'cura');
    }
  }
  else if (os.platform() === 'win32') {
    if (process.env.NODE_ENV !== 'production') {
      corePath = path.join(winBinPath, 'uarmcore');
      avrdudePath = path.join(winBinPath, 'avrdude');
      driverPath = path.join(winBinPath, 'driver');
      curaPath = path.join(winBinPath, 'cura');
    }
  }

  AppConfig.UARM_CORE_PATH = corePath;
  AppConfig.AVRDUDE_DIR_PATH = avrdudePath;
  AppConfig.CURA_DIR_PATH = curaPath;
  AppConfig.DRIVER_DIR_PATH = driverPath;
  AppConfig.MAIN_WINDOW_URL = `http://localhost:${config.port}`;
  AppConfig.FIRMWARE_DEFAULT_DIR_PATH = path.join(path.dirname(corePath), 'firmwareDefault');

  const defaultDevConfig = {
    enable: false,
    AppConfig,
  };
// Support development config
  const devConfigPath = path.join(projectDir, '.development');
// eslint-disable-next-line
  console.info(`Loading development config from ${devConfigPath}`);
  if (fs.existsSync(devConfigPath)) {
    try {
      const devConfig = JSON.parse(fs.readFileSync(devConfigPath));
      if (devConfig.enable) { // Inject the config from development config.
        for (const key of Object.keys(devConfig.AppConfig)) {
          AppConfig[key] = devConfig.AppConfig[key];
        }
      }
    }
    catch (e) {
      console.error(`Error when parsing .development config: ${e}`);
      fs.writeFileSync(devConfigPath, JSON.stringify(defaultDevConfig, null, 2), 'utf8');
    }
  }
  else {
    console.error('Can not detect .development config, create a new one');
    fs.writeFileSync(devConfigPath, JSON.stringify(defaultDevConfig, null, 2), 'utf8');
  }
}

module.exports = AppConfig;
