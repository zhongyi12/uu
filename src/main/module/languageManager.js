/**
 * Created by alex on 2017/5/26.
 */
/** Language Support  多语言支持，只能在 electron ready 的时候才能正确加载语言
 * https://github.com/electron/electron/blob/master/docs/api/app.md#appgetlocale
 * **/
import { appLogger } from '../lib/log';
import AppConfig from 'appConfig';
import { app } from 'electron';
import UserConfig from './userConfig';
import en from '../../lang/en';
import cn from '../../lang/cn';

function init() {
  appLogger.info(`System Locale: ${app.getLocale()}`);

  let LANG = UserConfig.getItem('Studio', 'LanguageCode');
  if (LANG === undefined) { // no language code from user config.
    if (app.getLocale().substring(0, 2) === 'zh') {
      LANG = 'cn';
    }
    else {
      LANG = 'en';
    }
    UserConfig.setItem('Studio', 'LanguageCode', LANG);
  }

  AppConfig.LANG = LANG;
  if (AppConfig.LANG === 'cn') {
    global.LAN = cn;
  }
  else {
    global.LAN = en;
  }
}

/**
 *
 * @param LanCode: String Language Short Code, eg. English: en, Chinese: cn
 * @param restart: Boolean, if True will Restart Application
 */
function switchLanguage(LanCode, restart) {
  UserConfig.setItem('Studio', 'LanguageCode', LanCode);
  if (restart) {
    app.relaunch();
    app.exit(0);
  }
}

export default {
  init,
  switchLanguage,
};
