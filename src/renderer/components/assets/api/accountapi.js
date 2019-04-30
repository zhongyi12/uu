/**
 * Created by alex on 04/07/2017.
 */
import axios from 'axios';
import urljoin from 'url-join';
const Account = {
  api_host: null,
  profile: {
    email: null,
    emailVerified: null,
    nickname: null,
    gender: null,
    birthday: null,
    country: null,
    token: null,
    avatar: null,
    websocket: {
      host: null,
      appId: null,
      objectId: null,
    },
  },
  saveUserProfile: null,
  getUserProfile: null,
  clearUserProfile() {
    const profile = {
      email: null,
      emailVerified: null,
      nickname: null,
      gender: null,
      birthday: null,
      country: null,
      token: null,
      avatar: null,
      websocket: {
        host: null,
        appId: null,
        objectId: null,
      },
    };
    Account.updateProfile(profile);
  },
};

Account.updateProfile = (args) => {
  args = args || {};
  if (args.nickname !== undefined) Account.profile.nickname = args.nickname;
  if (args.email !== undefined) Account.profile.email = args.email;
  if (args.emailVerified !== undefined) Account.profile.emailVerified = args.emailVerified;
  if (args.avatar !== undefined) Account.profile.avatar = args.avatar;
  if (args.token !== undefined) Account.profile.token = args.token;
  if (args.websocket !== undefined) {
    if (args.websocket.host !== undefined) Account.profile.websocket = args.websocket;
  }
  Account.saveUserProfile(Account.profile);
};

Account.init = (api_host, saveUserProfile, getUserProfile) => {
  console.log(`api_host: ${api_host}`);
  Account.api_host = urljoin(api_host, 'api', '1.0');
  Account.saveUserProfile = saveUserProfile;
  Account.getUserProfile = getUserProfile;
  const userProfile = Account.getUserProfile();
  if (userProfile !== null && userProfile !== undefined) {
    if (userProfile.token !== null && userProfile.token !== undefined) {
      Account.updateProfile(userProfile);
      Account.getUserProfile();
    }
  }
};

Account.signIn = (email, password) => new Promise((resolve, reject) => {
  const url = urljoin(Account.api_host, 'signin');
  const form = {
    email,
    password,
  };
  axios.post(url, form).then((response) => {
    const returnBack = response.data === undefined ? response : response.data;
    if (returnBack.code === 0) { // login success
      const returnData = returnBack.data;
      Account.updateProfile({
        nickname: returnData.nickname,
        email: returnData.email,
        emailVerified: returnData.emailVerified,
        avatar: returnData.avatar,
        token: returnData.sessionToken,
      });
      resolve();
    }
    else { // login fail
      reject(1);
    }
  }, (response) => {
    console.log('error', response);
    reject(2);
  });
});

Account.signUp = (args) => new Promise((resolve, reject) => {
  const url = urljoin(Account.api_host, 'signup');
  const newUser = {
    email: args.email,
    password: args.password,
    nickname: args.nickname,
    gender: args.gender,
    birthday: args.birthday,
    country: args.country,
    promotion: args.promotion,
  };
  axios.post(url, newUser).then((response) => {
    const returnData = response.data === undefined ? response : response.data;
    if (returnData.code === 0) {
      Account.updateProfile({
        nickname: newUser.nickname,
        email: newUser.email,
        emailVerified: null,
        avatar: null,
        token: returnData.sessionToken,
      });
      resolve();
    }
    else {
      reject(1);
    }
  }, () => {
    reject(2);
  });
});

Account.validateEmail = (email) => new Promise((resolve, reject) => {
  const url = urljoin(Account.api_host, 'checkemailvalidate');
  axios.post(url, { email }).then((response) => {
    if (response.data.code === 0) {
      resolve();
    }
    else {
      reject(1);
    }
  }, () => {
    reject(2);
  });
});

Account.getUserProfile = () => new Promise((resolve, reject) => {
  const url = urljoin(Account.api_host, 'getuserinfo');
  const options = {
    headers: {
      'X-LC-Session': Account.profile.token,
    },
  };
  axios.get(url, options).then((response) => {
    const returnBack = response.data === undefined ? response : response.data;
    if (returnBack.code === 0) {
      const returnData = returnBack.info;
      // sessionStorage.loginToken = Account.profile.token;
      // sessionStorage.nickname = returnData.nickname;
      Account.updateProfile({
        nickname: returnData.nickname,
        email: returnData.email,
        emailVerified: returnData.emailVerified,
        avatar: returnData.avatar,
        token: Account.profile.token,
      });
      resolve();
    }
    else {
      reject(1);
    }
  }, () => {
    reject(2);
  });
});

Account.getWSAddress = () => new Promise((resolve, reject) => {
  const url = urljoin(Account.api_host, 'message', 'getwebsocketserver');
  console.log(`get ws address url: ${url}`);
  const options = {
    headers: {
      'X-LC-Session': Account.profile.token,
    },
  };
  axios.get(url, options).then((response) => {
    const data = {
      host: response.data.route.server,
      appId: response.data.appid,
      objectId: response.data.installationId,
    };
    console.log(`get ws data: ${data}`);
    Account.profile.websocket.host = response.data.route.server;
    Account.profile.websocket.appId = response.data.appid;
    Account.profile.websocket.objectId = response.data.installationId;
    Account.updateProfile();
    resolve(data);
  }).catch(() => {
    reject(2);
  });
});

export default Account;
