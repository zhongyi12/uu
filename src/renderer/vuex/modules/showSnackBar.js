import {
  SHOW_SNACK_BAR,
  HIDE_SNACK_BAR,
}
  from '../mutation-types';

const state = {
  snackBarData: {
    snackBarDisplayFlag: false,
    // snackBarTimeout: 5000,
    snackBarDisplayMessage: '',
    // snackBarTimer: null,
  },
};

const mutations = {
  [SHOW_SNACK_BAR](state, message) {
    // console.log(`Show Snack Bar: ${message}`);
    state.snackBarData.snackBarDisplayFlag = true;
    state.snackBarData.snackBarDisplayMessage = message;
    // state.snackBarData.snackBarTimer = setTimeout(() => {
    //   state.snackBarData.snackBarDisplayFlag = false;
    // }, state.snackBarData.snackBarTimeout);
  },
  [HIDE_SNACK_BAR](state) {
    // console.log(`Show Snack Bar: ${message}`);
    // state.snackBarData.snackBarDisplayFlag = true;
    // state.snackBarData.snackBarDisplayMessage = message;
    // setTimeout(() => {
    state.snackBarData.snackBarDisplayFlag = false;
    state.snackBarData.snackBarDisplayMessage = '';
    if (window.snackBarTimer) clearTimeout(window.snackBarTimer);
    // if (state.snackBarData.snackBarTimer) clearTimeout(state.snackBarData.snackBarTimer);
    // }, state.snackBarData.snackBarTimeout);
  },
};

export default {
  state,
  mutations,
};
