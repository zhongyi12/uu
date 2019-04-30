/**
 * Created by alex on 2017/7/11.
 */

import CoreProcess from './module/uarmcore';
import VisionProcess from './module/uarmvision';
import { userTracking } from './module/userTracking';

// console.log(`URL: ${AppConfig.MAIN_WINDOW_URL}`);
// global.mainWindow.loadURL(AppConfig.MAIN_WINDOW_URL);
global.mainWindow.on('close', () => {
  if (!global.closeWithoutEvent) {
    global.mainWindow.webContents.send('close-camera-window');
  }
  userTracking.insertTime('closeTime');
});
global.mainWindow.on('closed', () => {
  if (!global.closeWithoutEvent) {
    CoreProcess.stop();
    VisionProcess.stop();
  }
  userTracking.insertTime('closeTime');
});
