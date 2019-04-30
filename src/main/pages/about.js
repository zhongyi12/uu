import AppConfig from 'appConfig';
import { default as aboutWindow } from './about-window';
import path from 'path';
import { CompatibleVersion, FirmwareConfig } from '../../property/firmware.json';
import os from 'os';

function openAboutWindow() {
  const versions = [];
  versions.push(global.LAN.about.versionInfo);
  versions.push(['uArm Core', `: ${AppConfig.UARM_CORE_VERSION}`]);
  versions.push(global.LAN.about.supportList);
  // versions.push([hardware, firmware]);
  for (const k of Object.keys(CompatibleVersion)) {
    versions.push([FirmwareConfig[k].productName, CompatibleVersion[k]]);
  }
  versions.push(global.LAN.about.systemInfo);
  versions.push([global.LAN.about.osInfo, `: ${os.platform()} ${os.arch()} ${os.release()}`]);
  aboutWindow({
    icon_path: path.join(__dirname, 'static', 'about', 'logo.png'),
    copyright: AppConfig.APP_COPYRIGHT,
    versions,
    homepage: AppConfig.HOME_PAGE_URL,
    use_inner_html: true,
    adjust_window_size: true,
    open_devtools: false,
    win_options: {
      resizable: false,
      center: true,
      alwaysOnTop: true,
    },
  });
}

module.exports = openAboutWindow;
