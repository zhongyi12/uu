/**
 * Created by alex on 26/04/2017.
 * This file only can be used in Electron Main Process
 * 这个配置只能在 Main 环境下使用，并且在 STUDIO_ENV = beta 下生效
 */
import os from 'os';
import AppConfig from './appConfig.pro';
import path from 'path';

// AppConfig.UPDATE_URL = 'http://beta.ufactory.cc/releases/updates.json';
AppConfig.UPDATE_URL = 'http://update.ufactory.cc/releases/updates.json',
AppConfig.STUDIO_CONFIG_PATH = path.join(AppConfig.STUDIO_DIR_PATH, 'config_beta.json');
let osType;
if (os.platform() === 'darwin') {
  osType = 'mac';
}
else if (os.platform() === 'win32') {
  osType = 'win';
}
else if (os.platform() === 'linux') {
  osType = 'linux';
}
AppConfig.Channel = 'beta';
AppConfig.BUILD_ID = `${osType}-${os.arch()}-${AppConfig.Channel}`;
AppConfig.ISSUES_URL = 'http://beta.ufactory.cc/issue.html';

export default AppConfig;
