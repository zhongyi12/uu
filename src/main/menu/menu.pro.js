/**
 * Created by alex on 12/06/2017.
 */
import openAboutWindow from '../pages/about';
import updater from '../module/updateManager';
import AppConfig from 'appConfig';
import { app, shell } from 'electron';
import LanguageManager from '../module/languageManager';
const LAN = global.LAN.menu;

const aboutItem = {
  label: LAN.about.submenu.about,
  click: () => openAboutWindow(),
};

const updateItem = {
  label: LAN.about.submenu.checkforupdates,
  click: () => updater.studio.checkForUpdatesPrompt(true),
};

const separator = {
  type: 'separator',
};

const aboutMenu = {
  label: LAN.about.label,
  submenu: [
    aboutItem,
    updateItem,
    {
      type: 'separator',
    },
    {
      role: 'services',
      submenu: [],
    },
    {
      type: 'separator',
    },
    {
      role: 'hide',
    },
    {
      role: 'hideothers',
    },
    {
      role: 'unhide',
    },
    {
      type: 'separator',
    },
    {
      label: LAN.about.submenu.quit,
      click: () => app.quit(),
      accelerator: 'Command+Q',
    },
  ],
};

const editMenu = {
  label: LAN.edit.label,
  submenu: [
    {
      role: 'undo',
    },
    {
      role: 'redo',
    },
    {
      type: 'separator',
    },
    {
      role: 'cut',
    },
    {
      role: 'copy',
    },
    {
      role: 'paste',
    },
    {
      role: 'delete',
    },
    {
      role: 'selectall',
    },
  ],
};

const windowMenu = {
  label: LAN.window.label,
  submenu: [
    {
      role: 'resetzoom',
    },
    {
      role: 'zoomin',
    },
    {
      role: 'zoomout',
    },
    {
      type: 'separator',
    },
    {
      role: 'minimize',
    },
    {
      type: 'separator',
    },
    {
      role: 'front',
    },
    {
      type: 'separator',
    },
    {
      role: 'togglefullscreen',
    },
  ],
};

const langMenu = {
  label: LAN.language.label,
  submenu: [
    {
      label: LAN.language.submenu.chinese,
      click: () => LanguageManager.switchLanguage('cn', true),
    },
    {
      label: LAN.language.submenu.english,
      click: () => LanguageManager.switchLanguage('en', true),
    },
  ],
};

const helpMenu = {
  label: LAN.help.label,
  submenu: [
    {
      label: 'FAQ',
      click: () => shell.openExternal(AppConfig.FAQ_URL),
    },
    {
      label: LAN.help.submenu.feedback,
      click: () => {
        // console.log(AppConfig.LANG);
        // console.log(AppConfig.ISSUES_URL);
        shell.openExternal(AppConfig.getIssueUrl());
      },
    },
    {
      label: LAN.help.submenu.troubleshoot,
      click: () => {
        global.mainWindow.webContents.send('router-push', 'setting', { tab: 'troubleTab' });
      },
    },
    {
      label: LAN.help.submenu.homefolder,
      click: () => shell.openItem(AppConfig.STUDIO_DIR_PATH),
    },
  ],
};

function getMenuTemplate() {
  const menu = [];
  switch (process.platform) {
    case 'darwin': {
      menu.push(aboutMenu);
      menu.push(editMenu);
      menu.push(windowMenu);
      menu.push(langMenu);
      menu.push(helpMenu);
      break;
    }
    default: {
      menu.push(editMenu);
      menu.push(langMenu);
      helpMenu.submenu.unshift(separator);
      helpMenu.submenu.unshift(updateItem);
      helpMenu.submenu.unshift(aboutItem);
      menu.push(helpMenu);
      break;
    }
  }
  return menu;
}

exports.getMenuTemplate = getMenuTemplate;
