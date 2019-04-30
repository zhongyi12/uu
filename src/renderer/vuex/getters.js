// export const uarmConnectStatus = state => state.syncConnectStatus.uarmConnectStatus;
// export const socketConnectStatus = state => state.syncConnectStatus.socketConnectStatus;
// export const cameraConnectStatus = state => state.syncConnectStatus.cameraConnectStatus;
export const uarmStatus = state => state.syncConnectStatus.uarmStatus;
export const uarmInfo = state => state.syncConnectStatus.uarmInfo;
export const snackBarData = state => state.showSnackBar.snackBarData;
export const progressBarData = state => state.showProgressBar;

export const socketConnectState = state => state.syncConnectStatus.socketConnectState;
export const uarmPrintingProgress = state => state.syncConnectStatus.uarmPrintingProgress;
export const uarmPrintingState = state => state.syncConnectStatus.uarmPrintingState;
export const uarmConnectState = state => state.syncConnectStatus.uarmConnectState;
export const userProfile = state => state.profile.user;
