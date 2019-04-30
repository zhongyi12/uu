import {
  SHOW_PROGRESS_BAR,
  HIDE_PROGRESS_BAR,
  UPDATE_PROGRESS,
}
  from '../mutation-types';

const state = {
  progressBarShowFlag: false,
  progressBarTitle: '',
  progress: 0,
  showCloseButton: false,
};

const mutations = {
  [SHOW_PROGRESS_BAR](state, title, showCloseButton) {
    state.progressBarShowFlag = true;
    state.progressBarTitle = title;
    state.showCloseButton = showCloseButton;
  },
  [HIDE_PROGRESS_BAR](state) {
    state.progressBarShowFlag = false;
    state.progressBarTitle = '';
    state.progress = 0;
  },
  [UPDATE_PROGRESS](state, progress) {
    state.progress = progress;
  },
};

export default {
  state,
  mutations,
};
