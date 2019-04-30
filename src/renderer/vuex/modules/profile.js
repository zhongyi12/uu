import {
  SET_USER_PROFILE,
}
  from '../mutation-types';

const state = {
  user: {
    nickname: '',
    email: '',
    token: '',
    emailVerified: false,
    avatar: '',
    isLogin: false,
  },
};

const mutations = {
  [SET_USER_PROFILE](state, message) {
    console.log(`nickname: ${message.nickname}`);
    if (message.nickname) {
      state.user.nickname = message.nickname;
    }
    if (message.email) {
      state.user.email = message.email;
    }
    if (message.token) {
      state.user.token = message.token;
    }
    if (message.emailVerified) {
      state.user.emailVerified = message.emailVerified;
    }
    if (message.avatar) {
      state.user.avatar = message.avatar;
    }
    // else {
    //   state.user.avatar = '';
    // }
  },
};

export default {
  state,
  mutations,
};
