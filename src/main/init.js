/**
 * Created by alex on 2017/5/3.
 */

/** init Logger 初始化日志 **/
import { appLogger } from './lib/log';
appLogger.info(`uArm Studio Launch on Process ID: ${process.pid}`);

import { app } from 'electron';

/** Make sure singleton APP 确认只有一个应用打开 **/
if (process.env.NODE_ENV === 'production') {
  const shouldQuit = app.makeSingleInstance(() => {
    // Someone tried to run a second instance, we should focus our window.
    if (global.mainWindow) {
      if (global.mainWindow.isMinimized()) global.mainWindow.restore();
      global.mainWindow.focus();
    }
  });
  if (shouldQuit) {
    appLogger.info('uArm Studio Only allow one application');
    global.closeWithoutEvent = true;
    app.quit();
  }
}
/** END 单例程序 **/
