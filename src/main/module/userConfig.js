/**
 * Created by alex on 26/04/2017.
 */

import AppConfig from 'appConfig';
import fs from 'fs';
// import { appLogger } from '../lib/log';

const defaultUserConfig = {
  Studio: {},
  connection: {},
  Firmware: {},
  TeachMode: {},
  Blockly: {},
  Paint: {},
  LeapMotion: {},
  lastStatus: { isStepOutCheck: false },
};

const userConfigPath = AppConfig.STUDIO_CONFIG_PATH;

let userConfig;

function writeConfig() {
  fs.writeFile(userConfigPath, JSON.stringify(userConfig, null, 2));
}

function readConfig() {
  if (!fs.existsSync(userConfigPath)) {
    // appLogger.info(`Create user config with ${userConfigPath}`);
    fs.writeFileSync(userConfigPath, JSON.stringify(defaultUserConfig, null, 2), 'utf8');
  }
  const text = fs.readFileSync(userConfigPath, 'utf8');
  try {
    userConfig = JSON.parse(text);
  }
  catch (e) {
    fs.writeFileSync(userConfigPath, JSON.stringify(defaultUserConfig, null, 2), 'utf8');
    userConfig = defaultUserConfig;
  }
  const keys = Object.keys(defaultUserConfig);
  const uKeys = Object.keys(userConfig);
  for (const key of keys) {
    if (uKeys.indexOf(key) === -1) {
      userConfig[key] = {}; // Make Sure has this key.
      writeConfig();
    }
  }
}


const UserConfig = {
  modules: {
    Studio: 'Studio',
    Blockly: 'Blockly',
    TeachMode: 'TeachMode',
    LeapMotion: 'LeapMotion',
    Paint: 'Paint',
  },
  setItem(module, key, value) {
    if (!(module in userConfig)) {
      return;
    }
    userConfig[module][key] = value;
    writeConfig();
  },
  getItem(module, key) {
    if (module in userConfig) {
      if (key in userConfig[module]) {
        return userConfig[module][key];
      }
    }
    return undefined;
  },
  getItemSync(type, key) { // This will load config again.
    readConfig();
    return this.getItem(type, key);
  },
  clean(module) {
    userConfig[module] = {};
    writeConfig();
  },
};

readConfig();
export default UserConfig;
