/**
 * Render 初始化主要模块，主要定义一些全局模块
 */

import Vue from 'vue';
import GlobalUtil from './core/global_util';
window.GlobalUtil = GlobalUtil;
import axios from 'axios';
import Router from 'vue-router';
import App from './App';
import store from './vuex/store';
import { routes } from './routes';
import AccountAPI from './components/assets/api/accountapi';

Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(Router);
// Vue.config.debug = true;

import './components/assets/css/common.scss';
import './components/assets/lib/google/roboto/roboto.css';
import './components/assets/lib/google/material-icons/material-icons.css';
import 'bootstrap-css';

// Muse UI 框架
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-light.css';
Vue.use(MuseUI);

// Studio Electron Main 初始化
import camera from './components/assets/api/camera';
window.Studio = require('electron').remote.getGlobal('Studio');
window.FileManager = window.Studio.FileManager;
window.UserConfig = window.Studio.UserConfig;
window.SyncManager = window.Studio.SyncManager;
window.CameraManager = camera;
window.store = store;

// Account API 用户ID 服务器初始化
AccountAPI.init(window.Studio.AppConfig.API_HOST_URL, (profile) => {
  window.Studio.UserConfig.setItem('Studio', 'UserProfile', profile);
  store.dispatch('updateUserProfile', profile);
}, () => window.Studio.UserConfig.getItem('Studio', 'UserProfile'));

// News.init();

// News.init(AccountAPI.profile.websocket, AccountAPI.getWebsocketAddress);

// UArm API 初始化
const ipcRenderer = require('electron').ipcRenderer;
import UArm from './components/assets/api/uarmapi';
UArm.model = window.GlobalUtil.model;
UArm.init_socket({
  host: window.Studio.AppConfig.UARM_CORE_LISTEN_ADDRESS,
  port: window.Studio.AppConfig.UARM_CORE_LISTEN_PORT,
  logger: window.Studio.webSocketLogger,
});
ipcRenderer.on('stop-core', () => {
  UArm.server_exit();
});
window.UArm = UArm;
Vue.prototype.$uarm = UArm;
window.Grove = UArm.Grove;
import usui from './components/assets/api/ui';
window.usui = usui;
/* uArm Studio */

// Vue I18n
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

// Vue.config.lang = window.Studio.AppConfig.LANG;
import LangEn from '../lang/en';
import LangCn from '../lang/cn';
const i18n = new VueI18n({
  locale: window.Studio.AppConfig.LANG,
  silentTranslationWarn: true,
  messages: {
    en: LangEn,
    cn: LangCn,
  },
});
// Object.keys(locales).forEach((lang) => {
//   Vue.locale(lang, locales[lang]);
// });

// rewrite console
console.log(window.Studio.AppConfig.Channel);
if (window.Studio.AppConfig.Channel !== 'dev') {
  window.console = window.Studio.renderLogger;
}
console.log(`LANG: ${window.Studio.AppConfig.LANG}`);
const router = new Router({
  scrollBehavior: () => ({
    y: 0,
  }),
  routes,
});

/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  ...App,
}).$mount('#app');
