import HomePageView from 'components/HomePageView';
import SettingPageView from 'components/SettingPageView';
import Tutorial3DComponent from 'components/HomePageView/Tutorial3DComponent.vue';
import TutorialComponent from 'components/HomePageView/TutorialComponent.vue';
import StartComponent from 'components/HomePageView/StartComponent.vue';
import LoginPageView from 'components/LoginPageView';
import SelectLoginComponent from 'components/LoginPageView/userLogin';
import ResetPasswordComponent from 'components/LoginPageView/resetPassword';
import RegisterSuccessComponent from 'components/LoginPageView/registerSuccess';
import policyComponent from 'components/LoginPageView/policy';

// import BlocklyPageView from 'components/BlocklyPageView';
// import ControlPageView from 'components/ControlPageView';
// import TeachPageView from 'components/TeachPageView';
// import LeapmotionPageView from 'components/LeapmotionPageView';
// import PaintPageView from 'components/PaintPageView';
const BlocklyPageView = resolve => require(['components/BlocklyPageView'], resolve);
const ControlPageView = resolve => require(['components/ControlPageView'], resolve);
const TeachPageView = resolve => require(['components/TeachPageView'], resolve);
const LeapmotionPageView = resolve => require(['components/LeapmotionPageView'], resolve);
const PaintPageView = resolve => require(['components/PaintPageView'], resolve);

const Pages = {
  Root: {
    path: '*',
    redirect: '/',
  },
  HomePage: {
    path: '/home-page',
    component: HomePageView,
    children: [
      {
        path: 'tutorial',
        name: 'tutorial',
        component: TutorialComponent,
      },
      {
        path: 'start-3d',
        name: 'start-3d',
        component: Tutorial3DComponent,
      },
      {
        path: '',
        name: 'home-page',
        component: StartComponent,
      },
    ],
  },
  BlocklyPage: {
    path: '/blockly',
    name: 'blockly',
    component: BlocklyPageView,
    meta: {
      keepAlive: true, // true 表示需要使用缓存 false表示不需要被缓存
    },
  },
  ControlPage: {
    path: '/control',
    name: 'control',
    component: ControlPageView,
  },
  TeachPage: {
    path: '/teach',
    name: 'teach',
    component: TeachPageView,
  },
  SettingPage: {
    path: '/setting',
    name: 'setting',
    component: SettingPageView,
  },
  LeapMotionPage: {
    path: '/leapmotion',
    name: 'leapmotion',
    component: LeapmotionPageView,
    meta: {
      keepAlive: true, // true 表示需要使用缓存 false表示不需要被缓存
    },
  },
  PaintPage: {
    path: '/paint',
    name: 'paint',
    component: PaintPageView,
  },
  LoginPage: {
    path: '/',
    component: LoginPageView,
    children: [
      {
        path: '/',
        name: 'login',
        component: SelectLoginComponent,
      },
      {
        path: '/resetpassword',
        name: 'resetpassword',
        component: ResetPasswordComponent,
      },
      {
        path: '/registersuccess',
        name: 'registersuccess',
        component: RegisterSuccessComponent,
      },
      {
        path: '/policy',
        name: 'policy',
        component: policyComponent,
      },
    ],
  },
};

const routes = [];
for (const k of Object.keys(Pages)) {
  routes.push(Pages[k]);
}


exports.routes = routes;
exports.pages = Pages;
