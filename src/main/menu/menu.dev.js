/**
 * Created by alex on 12/06/2017.
 */
import { getMenuTemplate as getProdMenu } from './menu.pro';
// import AppConfig from 'appConfig';
import CuraProcess from '../module/cura';

const LAN = global.LAN.menu.debug;
const debugMenu = {
  label: LAN.label,
  submenu: [
    {
      role: 'toggledevtools',
    },
    {
      label: LAN.submenu.killcore,
      click: () => global.mainWindow.webContents.send('stop-core'),
    },
    {
      label: LAN.submenu.cura,
      click: () => CuraProcess.open(),
    },
  ],
};

function getMenuTemplate() {
  const menu = getProdMenu();
  menu.push(debugMenu);
  return menu;
}

exports.getMenuTemplate = getMenuTemplate;
