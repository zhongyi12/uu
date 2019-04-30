import * as types from './mutation-types';

export const syncConnectStatus = ({
  commit,
}) => {
  setInterval(() => {
    commit(types.SYNC_CONNECT_STATUS);
  }, 100);
};

export const showSnackBar = ({
  commit,
}, args) => {
  args = args || {};
  args.message = args.message || '';
  if (args.timeout === undefined) {
    args.timeout = 2000;
  }
  commit(types.SHOW_SNACK_BAR, args.message);
  if (args.timeout !== 0) {
    window.snackBarTimer = setTimeout(() => {
      commit(types.HIDE_SNACK_BAR);
    }, args.timeout);
  }
};

export const hideSnackBar = ({
 commit,
}) => {
  commit(types.HIDE_SNACK_BAR);
};

export const showProgressBar = ({
  commit,
}, title, showCloseButton) => {
  commit(types.SHOW_PROGRESS_BAR, title, showCloseButton);
};

export const hideProgressBar = ({
 commit,
}) => {
  commit(types.HIDE_PROGRESS_BAR);
};

export const updateProgressBar = ({
  commit,
}, progress) => {
  commit(types.UPDATE_PROGRESS, progress);
};

export const updateUserProfile = ({
    commit,
  }, profile) => {
  commit(types.SET_USER_PROFILE, profile);
};
