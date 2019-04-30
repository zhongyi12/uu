import { FirmwareConfig, HardwareVersionMapping } from 'firmwareProperty';
import {
  SYNC_CONNECT_STATUS,
}
from '../mutation-types';

const state = {
  uarmStatus: {
    socketConnection: false,
    usbConnection: false,
    cameraConnection: false,
    powerConnection: false,
    teach: {
      playStatus: false,
      recordStatus: false,
      standbyStatus: false,
      playProgress: false,
      playTotalCount: false,
    },
  },
  uarmInfo: {
    portName: null,
    firmwareVersion: null,
    hardwareVersion: null,
    productName: null,
    productType: null,
    portSerialNumber: null,
    currentX: null,
    currentY: null,
    currentZ: null,
    currentR: null,
  },
  socketConnectState: false,
  uarmPrintingProgress: null,
  uarmPrintingState: false,
  uarmConnectState: false,
};

const mutations = {
  [SYNC_CONNECT_STATUS](state) {
    state.uarmStatus.socketConnection = window.UArm.socket_info.socket_connected;
    state.uarmStatus.usbConnection = window.UArm.uarm_info.uarm_connected;
    state.uarmStatus.cameraConnection = window.UArm.uarm_info.camera_connected;
    state.uarmStatus.teach.playStatus = window.UArm.play.is_playing;
    state.uarmStatus.teach.recordStatus = window.UArm.record.is_recoding;
    state.uarmStatus.teach.standbyStatus = window.UArm.teach_standby_mode.standby;
    state.uarmStatus.teach.playProgress = window.UArm.play.progress;
    state.uarmStatus.teach.playTotalCount = window.UArm.play.total;
    if (window.UArm.uarm_info.uarm_connected) {
      state.uarmStatus.powerConnection = window.UArm.uarm_info.power_connection_state;
      state.uarmInfo.portName = window.UArm.uarm_info.port_name;
      state.uarmInfo.firmwareVersion = window.UArm.uarm_info.firmware_version;
      state.uarmInfo.hardwareVersion = window.UArm.uarm_info.hardware_version;
      state.uarmInfo.portSerialNumber = window.UArm.uarm_info.port_serial_number;
      const mapping = HardwareVersionMapping;
      if (Object.keys(mapping).indexOf(state.uarmInfo.hardwareVersion) !== -1) {
        const productType = mapping[state.uarmInfo.hardwareVersion];
        state.uarmInfo.productType = productType;
        state.uarmInfo.productName = FirmwareConfig[productType].productName;
      }

      state.uarmInfo.currentX = window.UArm.uarm_info.current_x;
      state.uarmInfo.currentY = window.UArm.uarm_info.current_y;
      state.uarmInfo.currentZ = window.UArm.uarm_info.current_z;
      state.uarmInfo.currentR = window.UArm.uarm_info.current_r;
    }
    else {
      state.uarmInfo.portName = null;
      state.uarmInfo.firmwareVersion = null;
      state.uarmInfo.hardwareVersion = null;
      state.uarmInfo.currentX = null;
      state.uarmInfo.currentY = null;
      state.uarmInfo.currentZ = null;
      state.uarmInfo.currentR = null;
      state.uarmInfo.productType = null;
      state.uarmInfo.productName = null;
    }
    // from git paint branch
    state.socketConnectState = window.UArm.socket_info.socket_connected;
    state.uarmConnectState = window.UArm.uarm_info.uarm_connected;
    state.uarmPrintingProgress = window.UArm.printing.progress;
    state.uarmPrintingState = window.UArm.printing.state;
  },
};

state.func = {};
state.func.isNewFirmwareVersion = () => {
  const firmware_version = state.uarmInfo.firmwareVersion;
  if (firmware_version === undefined || firmware_version === null) {
    return false;
  }
  const flag1 = firmware_version.indexOf('0.') === 0 || firmware_version.indexOf('1.') === 0;
  const flag2 = firmware_version.indexOf('2.') === 0 || firmware_version.indexOf('3.') === 0;
  return !(flag1 || flag2);
};

export default {
  state,
  mutations,
};
