/**
 * Created by alex on 2017/4/14.
 */
const BrowserWindow = require('electron').remote.BrowserWindow;
const ipcRenderer = require('electron').ipcRenderer;
const { remote } = require('electron');
import os from 'os';

const Camera = {
  cameraWindow: null,
  openWindow() {
    const isMac = os.platform() === 'darwin';
    if (isMac) {
      return;
    }
    if (this.cameraWindow === null) {
      window.UArm.switch_camera(true);
      const mainWindow = remote.getCurrentWindow();
      this.cameraWindow = new BrowserWindow({ parent: mainWindow, width: 400, height: 320 });
      this.cameraWindow.on('close', () => {
        window.UArm.switch_camera(false);
        this.cameraWindow = null;
      });
      this.cameraWindow.on('move', () => {
        mainWindow.focus();
      });
      this.cameraWindow.on('resize', () => {
        mainWindow.focus();
      });
      this.cameraWindow.on('restore', () => {
        mainWindow.focus();
      });
      this.cameraWindow.on('minimize', () => {
        mainWindow.focus();
      });
      this.cameraWindow.on('unmaximize', () => {
        mainWindow.focus();
      });
      this.cameraWindow.loadURL('http://localhost:18321/video?frame');
      this.cameraWindow.show();
    }
  },
  closeWindow() {
    if (this.cameraWindow !== null) {
      window.UArm.switch_camera(false);
      this.cameraWindow.close();
      this.cameraWindow = null;
    }
  },
};

// ipc event
ipcRenderer.on('close-camera-window', () => {
  Camera.closeWindow();
});

module.exports = Camera;
