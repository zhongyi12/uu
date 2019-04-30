/**
 * Created by alex on 07/07/2017.
 */

const UArmConnection = {
  checkUArmCoreExisted(CoreProcess) {
    return CoreProcess.checkCoreExist();
  },
  checkUArmCoreRunning(CoreProcess) {
    return CoreProcess.running;
  },
  checkSocketConnection(UArmSocket) {
    return UArmSocket.socket_info.socket_connected;
  },
  checkUSBConnection(UArmSocket) {
    return UArmSocket.uarm_info.uarm_connected;
  },
  checkDriverInstallation(DriverManager) {
    return new Promise((resolve) => {
      DriverManager.checkDriverInstalled().then(() => resolve(true)).catch(() => resolve(false));
    });
  },
  checkUArmSerialPortExited() {
    return new Promise((resolve, reject) => {
      window.UArm.list_ports().then((data) => {
        resolve(data);
      }).catch((err) => reject(err));
    });
  },
};

export default UArmConnection;
