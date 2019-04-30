/* eslint-disable camelcase,no-restricted-syntax */
import colorConvert from 'color-convert';
import ReconnectingWebSocket from './lib/reconnecting-websocket';

// TODO: 日誌打開或者關閉
const UArm = {};
const self = UArm;
UArm.running = true;
UArm.core_info = {
  version: null,
};
UArm.uarm_info = {
  uarm_connected: false,
  power_connection_state: false,
  port_name: null,
  port_serial_number: null,
  firmware_version: null,
  hardware_version: null,
  speed: 1,
  report_position: false,
  current_x: 0,
  current_y: 0,
  current_z: 0,
  current_r: 0,
  pump_status: false,
  gripper_status: false,
  camera_connected: false,
};

UArm.CoreInfo = {
  version: null,
};

UArm.DeviceInfo = {
  usbConnection: false,
  powerConnection: false,
  portName: null,
  portSerialNumber: null,
  deviceSerialNumber: null,
  hardwareVersion: null,
  firmwareVersion: null,
  productType: null,
};

UArm.BasicStatus = {
  running: false,
  pumpOn: false,
  gripperOn: false,
  cameraConnection: false,
};

UArm.Position = {
  eventListener: new Set(),
  initEventListener: new Set(),
  stopEventListener: new Set(),
  addEventListener(type, callback) {
    if (type === 'init') {
      this.initEventListener.add(callback);
    }
    else if (type === 'stop') {
      this.stopEventListener.add(callback);
    }
    else if (type === 'data') {
      this.eventListener.add(callback);
    }
  },
  removeEventListener(type, callback) {
    if (type === 'init') {
      this.initEventListener.delete(callback);
    }
    else if (type === 'stop') {
      this.stopEventListener.delete(callback);
    }
    else if (type === 'data') {
      this.eventListener.delete(callback);
    }
  },
  clearEventListener(type) {
    if (type === 'init') {
      this.initEventListener.length = 0;
    }
    else if (type === 'stop') {
      this.stopEventListener.length = 0;
    }
    else if (type === 'data') {
      this.eventListener.length = 0;
    }
  },
  proceedEvent(position) {
    for (const e of this.eventListener) {
      e(position);
    }
  },
  value: {
    x: 0,
    y: 0,
    z: 0,
    r: 0,
  },
  setValue(axis, value) {
    this.value[axis] = value;
  },
  getValue(axis) {
    return this.value[axis];
  },
  startReport() {
    UArm.start_report_position();
    for (const e of this.initEventListener) {
      e();
    }
  },
  stopReport() {
    UArm.stop_report_position();
    for (const e of this.stopEventListener) {
      e();
    }
  },
};

/**
 *
 * @param {object} [args]
 * @param {object} [args.logger=console]
 * @param {string} [args.host='localhost']
 * @param {string} [args.port='18321']
 */
UArm.init_socket = (args) => {
  // const self = UArm;
  // if (self.socket_info.socket !== null) return;
  args = args || {};
  args.logger = args.logger || console;
  args.host = args.host || 'localhost';
  args.port = args.port || '18321';
  self.socket_info.host = args.host;
  self.socket_info.port = args.port;
  const ws_url = `ws:${self.socket_info.host}:${self.socket_info.port}/ws`;
  console.log(`ws_url = ${ws_url}`);
  self.socket_info.socket = new ReconnectingWebSocket(ws_url, null, {
    debug: true,
    logger: args.logger,
    reconnectInterval: 1000,
  });
  // self.socket_info.socket = new WebSocket(ws_url);

  self.socket_info.socket.onclose = () => {
    self.socket_info.socket_connected = false;
    self.uarm_info.camera_connected = false;
    self.uarm_info.uarm_connected = false;
    // setTimeout(self.init_socket, 1000);
  };

  self.socket_info.socket.onopen = () => {
    self.socket_info.socket_connected = true;
  };

  self.socket_info.socket.onmessage = (evt) => {
    // console.log('evt');
    // console.log(evt);
    try {
      const temp_msg = JSON.parse(evt.data);
      if (temp_msg.type === 'broadcast') {
        self.broadcast_message_process(temp_msg);
      }
      else {
        const id = temp_msg.id;
        self.msg_buffer[id] = temp_msg;
      }
    }
    catch (e) {
      console.error(e);
    }
  };
};
UArm.send_msg = (msg) => {
  // const self = UArm;
  if (self.msgid > 100000) { // restart from 100000
    self.msgid = 0;
  }
  self.msgid += 1;
  msg.id = `${self.msgid}`;
  const js_msg = JSON.stringify(msg);
  if (self.socket_info && self.socket_info.socket) {
    self.model.localCtrlMgr.cData.sendStr = js_msg;
    self.socket_info.socket.send(js_msg);
    return msg.id;
  }
  return -1;
};
UArm.send_msg_promise = msg => new Promise((resolve, reject) => {
  // const self = UArm;
  const id = self.send_msg(msg);
  let count = 0;
  let number_id = null;
  const trigger = setInterval(() => {
    if (self.msg_buffer[id] !== undefined) {
      // console.log(`Message received... ${JSON.stringify(self.msg_buffer[id])}`);
      const temp_msg = self.msg_buffer[id];
      clearInterval(trigger);
      if (temp_msg.status) resolve(temp_msg);
      else reject('error', temp_msg);
      number_id = Number(id);
      if (number_id > 100000) {
        self.msg_buffer = {};
      }
    }
    if (count >= 5000) {
      // console.log(`Message received Timeout: ${id}`);
      reject('timeout', id);
      clearInterval(trigger);
      number_id = Number(id);
      if (number_id > 100000) {
        self.msg_buffer = {};
      }
    }
    count += 10;
  }, 10);
});
UArm.send_and_callback = (msg, callback) => {
  // const self = UArm;
  const id = self.send_msg(msg);
  let count = 0;
  let number_id = null;
  const trigger = setInterval(() => {
    if (self.msg_buffer[id] !== undefined) {
      // console.log(`Message received... ${JSON.stringify(self.msg_buffer[id])}`);
      const temp_msg = self.msg_buffer[id];
      clearInterval(trigger);
      if (callback !== null) {
        callback(temp_msg);
      }
      number_id = Number(id);
      if (number_id > 100000) {
        self.msg_buffer = {};
      }
    }
    if (count >= 8000) {
      // console.log(`Message received Timeout: ${id}`);
      clearInterval(trigger);
      number_id = Number(id);
      if (number_id > 100000) {
        self.msg_buffer = {};
      }
    }
    count += 10;
  }, 10);
};

UArm.printing = {
  state: false,
  total: null,
  stop_flag: false,
  progress: null,
  svgToGcode(data, callback) {
    const msg = {
      cmd: 'svg_to_gcode',
      data,
    };
    UArm.send_and_callback(msg, callback);
  },
  startPrinting(data, setting) {
    setting = setting || {};
    if (setting.canvasMode === undefined) setting.canvasMode = '1';
    if (setting.mode === undefined) setting.mode = '0';
    setting.speed = setting.speed || 100;
    if (setting.zero === undefined) setting.zero = 0;
    const cmdList = {
      1: 'start_grayscale_printing', // 黑白
      2: 'start_outline_printing', // 轮廓
    };
    const cmd = cmdList[setting.canvasMode];
    const endType = {
      0: 'pen',
      1: 'laser',
    };
    const end_type = endType[setting.mode];
    let drawing_feedrate;
    if (setting.mode === '0') {
      drawing_feedrate = 500;
    }
    else {
      drawing_feedrate = setting.speed + 50;
    }
    let config = {};
    config = {
      drawing_feedrate,
      zeropoint_height: Number(setting.zero),
      end_type,
    };
    const msg = {
      id: 1,
      cmd,
      data,
      config,
    };
    // console.log(msg);
    UArm.send_msg(msg);
    UArm.printing.state = true;
  },
  stopPrinting() {
    const msg = {
      cmd: 'stop_printing',
    };
    UArm.send_msg(msg);
    UArm.printing.state = false;
    // UArm.printing.stop3DPrinting();
  },
  stop3DPrinting() {
    const msg = {
      cmd: 'stop_3d_printing',
    };
    UArm.send_msg(msg);
  },
  resumePrinting() {
    const msg = {
      cmd: 'resume_printing',
    };
    UArm.send_msg(msg);
  },
  pausePrinting() {
    const msg = {
      cmd: 'pause_printing',
    };
    UArm.send_msg(msg);
  },
  setZeroPoint() {
    const msg = {
      cmd: 'uarm_set_zeropoint',
      data: {},
    };
    UArm.send_msg(msg);
  },
};
// Event Listener

UArm.Button = {
  value: {
    menu: false,
    play: false,
  },
  setValue(id, value) {
    this.value[id] = Number(value) === 1 || Number(value) === 2;
    // console.log(`set id: ${id} - ${this.value[id]}`);
    setTimeout(() => { this.value[id] = false; }, 100);
  },
  getValue(id) {
    // console.log(`get id: ${id} - ${this.value[id]}`);
    return this.value[id];
  },
  eventListener: [],
  addEventListener(args) {
    /*
     {
     buttonId: "B1",
     buttonValue: 1,
     callback: function (){},
     }
     buttonId: B1 (Menu), B2 (Play)
     buttonValue: 1 (short press), 2 (long press)
     */
    this.eventListener.push(args);
  },
  clearEventListener() {
    this.eventListener.length = 0;
  },
  proceedEvent(buttonId, buttonValue) {
    for (const event of this.eventListener) {
      if (buttonId === event.buttonId && event.buttonValue === buttonValue) {
        event.callback();
      }
    }
  },
};

UArm.TipSensor = {
  value: null,
  setValue(value) {
    this.value = value;
  },
  getValue() {
    return this.value;
  },
  eventListener: [],
  addEventListener(args) {
    /*
     {
     callback: function
     }
     */
    this.eventListener.push(args);
  },
  clearEventListener() {
    this.eventListener.length = 0;
  },
  proceedEvent() {
    for (const event of this.eventListener) {
      event.callback();
    }
  },
};

UArm.FaceDetection = {
  value: null,
  setValue(value) {
    this.value = value;
  },
  getValue() {
    return this.value;
  },
  eventListener: [],
  addEventListener(args) {
    /*
     {
     faceDetected: false,
     callback: function
     }
     */
    args.running = false;
    this.eventListener.push(args);
  },
  clearEventListener() {
    this.eventListener.length = 0;
  },
  proceedEvent(faceDetected) {
    for (const event of this.eventListener) {
      if (faceDetected === event.faceDetected) {
        if (!event.running) {
          event.running = true;
          event.callback().then(() => {
            event.running = false;
          });
        }
      }
    }
  },
  startFaceDetectionReport() {
    // const self = UArm;
    const msg = {
      cmd: 'vision_start_report_face_detected',
      data: '',
    };
    self.send_msg(msg);
  },
  stopFaceDetectionReport() {
    // const self = UArm;
    const msg = {
      cmd: 'vision_stop_report_face_detected',
      data: '',
    };
    self.send_msg(msg);
  },
};

UArm.switch_camera = (is_on) => {
  // const self = UArm;
  const msg = {
    cmd: 'switch_camera',
    data: {
      on: is_on,
    },
  };
  self.send_msg(msg);
  self.uarm_info.camera_connected = is_on;
  if (is_on) {
    self.FaceDetection.startFaceDetectionReport();
  }
  else {
    self.FaceDetection.stopFaceDetectionReport();
  }
};

UArm.stop_all = () => {
  // const self = UArm;
  self.uarm_info.speed = 1;
  if (self.uarm_info.uarm_connected) {
    self.Button.clearEventListener();
    self.TipSensor.clearEventListener();
    self.set_servo_attach({ attachAll: true });
    if (!self.play.is_playing && !self.record.is_recoding) {
      self.reset({
        wait: true,
      });
    }
    if (self.play.is_playing) self.play.stop_playing();
    if (self.record.is_recoding) self.record.stop_recording();
    if (self.teach_standby_mode.standby) self.teach_standby_mode.stop_standby_mode();
  }
  self.FaceDetection.clearEventListener();
  // self.Grove.clearEventListener();
  self.running = false;
};

UArm.socket_info = {
  socket: null,
  host: null,
  port: null,
  socket_connected: false,
};
UArm.msgid = 0;
UArm.msg_buffer = {};
UArm.set_speed = (speed) => {
  // const self = UArm;
  if (speed < 0) {
    self.uarm_info.speed = 1;
  }
  else {
    self.uarm_info.speed = speed;
  }
};
/**
 * @param options
 * @param options.printingMoves
 * @param options.retractMoves
 * @param options.travelMoves
 */
UArm.set_acceleration = (options) => {
  options = options || {};
  options.printingMoves = options.printingMoves || 200;
  options.retractMoves = options.retractMoves || 200;
  options.travelMoves = options.travelMoves || 200;
  const msg = {
    cmd: 'uarm_set_acceleration',
    data: {
      printing_moves: options.printingMoves,
      retract_moves: options.retractMoves,
      travel_moves: options.travelMoves,
    },
  };
  UArm.send_msg(msg);
};
UArm.server_exit = () => {
  // const self = UArm;
  const msg = {
    cmd: 'stop_core',
    data: '',
  };
  if (UArm.socket_info.socket_connected) self.send_msg(msg);
};
UArm.list_ports = () => new Promise((resolve, reject) => {
  // const self = UArm;
  const msg = {
    cmd: 'uarm_list_ports',
    data: '',
  };
  self.send_msg_promise(msg).then(data => resolve(data.data)).catch(err => reject(err));
});
UArm.connect = port => new Promise((resolve, reject) => {
  // const self = UArm;
  port = port || null;
  let msg;
  if (port) {
    msg = {
      cmd: 'uarm_connect',
      data: {
        port,
      },
    };
  }
  else {
    msg = {
      cmd: 'uarm_connect',
      data: {
      },
    };
  }
  self.send_msg_promise(msg).then(resolve).catch(reject);
});

UArm.disconnect = () => new Promise((resolve, reject) => {
  // const self = UArm;
  const msg = {
    cmd: 'uarm_disconnect',
    data: '',
  };
  self.send_msg_promise(msg).then(resolve).catch(reject);
});
UArm.is_connected = (callback) => {
  // const self = UArm;
  const msg = {
    cmd: 'uarm_is_connected',
    data: '',
  };
  self.send_and_callback(msg, callback);
};
UArm.reset = async (args) => {
  // const self = UArm;
  args = args || {};
  args.wait = args.wait !== undefined ? args.wait : true;
  await self.set_position({
    x: 200,
    y: 0,
    z: 100,
    speed: 10000,
    relative: false,
    wait: args.wait,
  });
  await self.set_pump({
    ON: false,
    wait: args.wait,
  });
  await self.set_gripper({
    ON: false,
    wait: args.wait,
  });
  await self.set_servo_angle({
    angle: 90,
    wait: args.wait,
    servoNumber: 3,
  });
  // self.wrist_turn({
  //   'orientation': 'left',
  //   'angle': 0,
  //   'wait': args.wait,
  // });
};

/**
 * Enum for mode types
 * @readonly
 * @enum {number}
 */
UArm.Mode = {
  Normal: 0,
  LASER: 1,
  '3D_Printing': 2,
};

/**
 * @param {number} [mode] UArm.Mode
 */
UArm.set_mode = (mode) => {
  const msg = {
    cmd: 'uarm_set_mode',
    data: {
      mode,
    },
  };
  UArm.send_msg(msg);
};

UArm.set_step_out_check = (is_open, callback) => {
  is_open = (is_open === true || is_open === 1) ? 1 : 0;
  const msg = {
    cmd: 'uarm_set_step_out_check',
    data: {
      is_open,
    },
  };
  UArm.send_and_callback(msg, callback);
};

UArm.set_position = (args) => {
  // const self = UArm;
  args = args || {};
  args.x = args.x || 0;
  args.y = args.y || 0;
  args.z = args.z || 0;
  args.cmd = args.cmd || 'G0';
  args.page = args.page || null;
  args.timeout = args.timeout || null;
  args.relative = args.relative !== undefined ? args.relative : false; // default is false
  args.wait = args.wait !== undefined ? args.wait : true; // default is true
  args.speed = args.speed || (args.wait ? self.uarm_info.speed * 6000 : self.uarm_info.speed * 10);
  args.mode = args.mode || 0; // default is 0
  self.uarm_info.current_x = Number(args.x);
  self.uarm_info.current_y = Number(args.y);
  self.uarm_info.current_z = Number(args.z);
  const msg = {
    cmd: 'uarm_set_position',
    data: {
      position: [Number(`${args.x}`), Number(`${args.y}`), Number(`${args.z}`)],
      speed: Number(`${args.speed}`),
      relative: args.relative,
      wait: args.wait,
      mode: args.mode,
      cmd: args.cmd,
      timeout: args.timeout,
      page: args.page,
    },
  };
  if (args.wait) {
    // return new Promise((resolve, reject) => {
    return new Promise((resolve) => {
      self.send_and_callback(msg, () => {
        // console.log(`UArm.running: ${UArm.running}`);
        if (UArm.running) {
          resolve();
        }
        // else if (reject()) reject();
      });
    });
  }

  return self.send_msg(msg);
};
UArm.set_polar = (args) => {
  // const self = UArm;
  args = args || {};
  args.rotation = args.rotation || 0.0;
  args.stretch = args.stretch || 0.0;
  args.height = args.height || 0.0;
  args.page = args.page || null;
  args.relative = args.relative !== undefined ? args.relative : false;
  args.wait = args.wait !== undefined ? args.wait : true;
  args.speed = args.speed || (args.wait ? self.uarm_info.speed * 6000 : self.uarm_info.speed * 10);
  const msg = {
    cmd: 'uarm_set_polar',
    data: {
      position: [Number(`${args.rotation}`), Number(`${args.stretch}`), Number(`${args.height}`)],
      speed: Number(`${args.speed}`),
      relative: args.relative,
      wait: args.wait,
      page: args.page,
    },
  };
  if (args.wait) {
    // return new Promise((resolve, reject) => {
    return new Promise((resolve) => {
      self.send_and_callback(msg, () => {
        if (UArm.running) {
          resolve();
        }
        // else {
        //   reject();
        // }
      });
    });
  }
  return self.send_msg(msg);
};
UArm.set_servo_angle = (args) => {
  // const self = UArm;
  args = args || {};
  args.servoNumber = args.servoNumber || 0;
  args.angle = args.angle || (args.angle === undefined ? 90 : 0);
  args.angle = Math.min(Math.max(args.angle, 1), 179);
  args.wait = args.wait !== undefined ? args.wait : true;
  const default_speed = args.wait ? self.uarm_info.speed * 6000 : 0;
  args.speed = args.speed !== undefined ? args.speed : default_speed;
  // console.log(`args.speed: ${args.speed === undefined}`);
  const msg = {
    cmd: 'uarm_set_servo_angle',
    data: {
      angle: Number(args.angle),
      servo_num: Number(args.servoNumber),
      speed: args.speed,
      wait: args.wait,
    },
  };
  return new Promise((resolve, reject) => {
    self.send_msg_promise(msg).then(resolve).catch(reject);
    // if (UArm.running) self.send_msg_promise(msg).then(resolve).catch(reject);
    // else reject();
  });
};
UArm.base_turn = args => new Promise((resolve, reject) => {
  // const self = UArm;
  args = args || {};
  args.angle = args.angle || (args.angle === undefined ? 90 : 0);
  // args.orientation = args.orientation.toLowerCase() || 'clockwise';
  args.wait = args.wait !== undefined ? args.wait : true;
  args.speed = args.speed || (args.wait ? self.uarm_info.speed * 3000 : self.uarm_info.speed * 10);
  const new_args = {
    angle: args.angle,
    servoNumber: 0,
    speed: args.speed,
    relative: true,
    wait: true,
  };
  self.set_servo_angle(new_args).then(resolve).catch(reject);
});
UArm.set_pump = (args) => {
  // const self = UArm;
  args = args || {};
  args.ON = args.ON !== undefined ? args.ON : false;
  args.wait = args.wait !== undefined ? args.wait : true;
  const msg = {
    cmd: 'uarm_set_pump',
    data: {
      on: Boolean(args.ON),
      wait: args.wait,
    },
  };
  if (args.wait) {
    // return new Promise((resolve, reject) => {
    return new Promise((resolve) => {
      self.send_and_callback(msg, () => {
        if (self.running) {
          self.uarm_info.pump_status = args.ON;
          resolve();
        }
        // else {
        //   reject();
        // }
      });
    });
  }
  return self.send_msg(msg);
};
UArm.set_gripper = (args) => {
  // const self = UArm;
  args = args || {};
  args.ON = args.ON !== undefined ? args.ON : false;
  args.wait = args.wait !== undefined ? args.wait : true;
  const msg = {
    cmd: 'uarm_set_gripper',
    data: {
      on: Boolean(args.ON),
      wait: args.wait,
    },
  };
  if (args.wait) {
    // return new Promise((resolve, reject) => {
    return new Promise((resolve) => {
      self.send_and_callback(msg, () => {
        if (self.running) {
          self.uarm_info.gripper_status = args.ON;
          resolve();
        }
        // else {
        //   reject();
        // }
      });
    });
  }
  return self.send_msg(msg);
};
UArm.get_is_moving = (callback) => {
  // const self = UArm;
  const msg = {
    cmd: 'uarm_is_moving',
    data: '',
  };
  self.send_and_callback(msg, callback);
};

UArm.wrist_turn = args => new Promise((resolve, reject) => {
  // const self = UArm;
  args.angle = args.angle || (args.angle === undefined ? 90 : 0);
  args.angle = Math.min(Math.max(args.angle, 0), 180);
  args.wait = args.wait !== undefined ? args.wait : true;
  self.uarm_info.current_r = args.angle;
  const new_args = {
    servoNumber: 3,
    angle: 180 - args.angle,
    wait: args.wait,
  };
  self.set_servo_angle(new_args).then(resolve).catch(reject);
});
UArm.set_buzzer = (args) => {
  // const self = UArm;
  args.frequency = args.frequency || 1000;
  args.duration = args.duration || 0.1;
  if (args.wait === undefined) args.wait = true;
  const msg = {
    cmd: 'uarm_set_buzzer',
    data: {
      frequency: Number(args.frequency),
      duration: Number(args.duration),
      wait: args.wait,
    },
  };
  if (args.wait) {
    return new Promise((resolve, reject) => {
      self.send_msg_promise(msg).then(() => {
        if (self.running) {
          resolve();
        }
        else {
          reject();
        }
      }).catch(reject);
    });
  }
  return self.send_msg(msg);
};
UArm.get_position = (callback) => {
  // const self = UArm;
  const msg = {
    cmd: 'uarm_get_position',
    data: '',
  };
  self.send_and_callback(msg, callback);
};
UArm.set_servo_detach = (args) => {
  // const self = UArm;
  args.servoNumber = args.servoNumber || null;
  args.detachAll = args.detachAll !== undefined ? args.detachAll : false;
  args.startPositionReport = args.startPositionReport !== undefined ? args.startPositionReport : false;
  args.wait = args.wait !== undefined ? args.wait : true;
  const msg = {
    cmd: 'uarm_set_servo_detach',
    data: {
      servo_num: args.servoNumber,
      detach_all: args.detachAll,
      wait: args.wait,
    },
  };
  if (args.wait) {
    return new Promise((resolve) => {
      self.send_and_callback(msg, () => {
        resolve();
      });
    });
  }

  return self.send_msg(msg);
};
UArm.set_servo_attach = (args) => {
  // const self = UArm;
  args.servoNumber = args.servoNumber || null;
  args.attachAll = args.attachAll !== undefined ? args.attachAll : false;
  args.wait = args.wait !== undefined ? args.wait : true;

  const msg = {
    cmd: 'uarm_set_servo_attach',
    data: {
      servo_num: args.servoNumber,
      attach_all: args.attachAll,
      wait: args.wait,
    },
  };
  if (args.wait) {
    return new Promise((resolve) => {
      self.send_and_callback(msg, () => {
        resolve();
      });
    });
  }
  return self.send_msg(msg);
};

UArm.start_report_position = () => {
  // const self = UArm;
  const msg = {
    cmd: 'uarm_start_report_position',
    data: {},
  };
  self.send_msg(msg);
  self.uarm_info.report_position = true;
};
UArm.stop_report_position = () => {
  // const self = UArm;
  const msg = {
    cmd: 'uarm_stop_report_position',
    data: {},
  };
  self.send_msg(msg);
  self.uarm_info.report_position = false;
};

UArm.teach_standby_mode = {
  standby: false,
  start_standby_mode() {
    // const self = UArm;
    const msg = {
      cmd: 'uarm_start_teach_standby_mode',
      data: '',
    };
    self.send_msg(msg);
  },
  stop_standby_mode() {
    // const self = UArm;
    const msg = {
      cmd: 'uarm_stop_teach_standby_mode',
      data: '',
    };
    self.send_msg(msg);
  },
};
UArm.record = {
  is_recoding: false,
  progress: null,
  start_recording() {
    // const self = UArm;
    const msg = {
      cmd: 'uarm_start_recording',
      data: '',
    };
    self.send_msg(msg);
    // this.is_recoding = true;
  },
  stop_recording() {
    // const self = UArm;
    const msg = {
      cmd: 'uarm_stop_recording',
      data: '',
    };
    // this.is_recoding = false;
    self.send_msg(msg);
  },
  statusEventListener: new Set(),
  progressEventListener: new Set(),
  addEventListener(type, callback) {
    if (type === 'status') this.statusEventListener.add(callback);
    else if (type === 'progress') this.progressEventListener.add(callback);
  },
  clearEventListener(type) {
    if (type === 'status') this.statusEventListener.length = 0;
    else if (type === 'progress') this.progressEventListener.length = 0;
  },
  removeEventListener(type, callback) {
    if (type === 'status') this.statusEventListener.delete(callback);
    else if (type === 'progress') this.progressEventListener.delete(callback);
  },
  proceedStatusEvent(status) {
    for (const event of this.statusEventListener) {
      event(status);
    }
  },
  proceedProgressEvent(progress) {
    for (const event of this.progressEventListener) {
      event(progress);
    }
  },

};
UArm.play = {
  is_playing: false,
  stop_flag: false,
  progress: null,
  total: null,
  start_playing(args) {
    args = args || {};
    args.speed = args.speed || 1;
    args.wait = args.wait !== undefined ? args.wait : true;
    if (args.times === undefined || args.times === null) args.times = 1;
    return new Promise((resolve) => {
      const completedCallback = () => {
        resolve();
      };
      this.startPlay({
        completedCallback,
        speed: args.speed,
        wait: args.wait,
      });
    });
  },
  set_play_speed(speed) {
    // const self = UArm;
    const msg = {
      cmd: 'uarm_set_play_speed',
      data: {
        speed: Number(speed),
      },
    };
    self.send_msg(msg);
  },
  startPlay(args) {
    // const self = UArm;
    args.progressCallback = args.progressCallback || (() => {});
    args.startCallback = args.startCallback || (() => {});
    args.completedCallback = args.completedCallback || (() => {});
    args = args || {};
    args.speed = args.speed || 1;
    args.filepath = args.filepath || null;
    args.wait = args.wait !== undefined ? args.wait : true;
    if (args.times === undefined || args.times === null) args.times = 1;
    const msg = {
      cmd: 'uarm_start_playing',
      data: {
        speed: Number(args.speed),
        times: Number(args.times),
        filepath: args.filepath,
      },
    };
    self.send_msg(msg);
    const completedCallback = (status, data) => {
      if (!status) {
        args.completedCallback();
        this.removeEventListener('progress', args.progressCallback);
        this.removeEventListener('status', completedCallback);
      }
      else {
        args.startCallback(data);
      }
    };
    this.addEventListener('progress', args.progressCallback);
    this.addEventListener('status', completedCallback);
  },
  stopPlay() {
    // const self = UArm;
    const msg = {
      cmd: 'uarm_stop_playing',
      data: '',
    };
    self.send_msg(msg);
    this.clearEventListener('status');
    this.clearEventListener('progress');
  },
  statusEventListener: new Set(),
  progressEventListener: new Set(),
  addEventListener(type, callback) {
    if (type === 'status') this.statusEventListener.add(callback);
    else if (type === 'progress') this.progressEventListener.add(callback);
  },
  clearEventListener(type) {
    if (type === 'status') this.statusEventListener.length = 0;
    else if (type === 'progress') this.progressEventListener.length = 0;
  },
  removeEventListener(type, callback) {
    if (type === 'status') this.statusEventListener.delete(callback);
    else if (type === 'progress') this.progressEventListener.delete(callback);
  },
  proceedStatusEvent(status, data) {
    for (const event of this.statusEventListener) {
      event(status, data);
    }
  },
  proceedProgressEvent(times, progress) {
    for (const event of this.progressEventListener) {
      event(times, progress);
    }
  },
};

// function convertHEX(r, g, b) { // ['R255', 'G255', 'B255'] to #FFFFFF
//   r = r.toString(16).toUpperCase();
//   g = g.toString(16).toUpperCase();
//   b = b.toString(16).toUpperCase();
//   r = r.length === 1 ? `0${r}` : r;
//   g = g.length === 1 ? `0${g}` : g;
//   b = b.length === 1 ? `0${b}` : b;
//   // console.log(`#${r}${g}${b}`);
//   return `${r}${g}${b}`;
// }

UArm.Grove = {
  ChianableLED: 1,
  Button: 2,
  SlidePotentiometer: 3,
  ColorSensor: 10,
  GestureSensor: 11,
  UltrasonicSensor: 12,
  MiniFan: 13,
  TemperatureSensor: 15,
  PIRMotionSensor: 16,
  Electromagnet: 14,
  values: {},
  initStatus: {}, // { init: true, groveID: 1 }
  setValue(pin, values) {
    // this.values[pin]
    // console.log(`set value before values = ${JSON.stringify(values)}`)
    const groveID = this.initStatus[pin].groveID;
    if (groveID === this.UltrasonicSensor) {
      values = values[1].substr(1);
    }
    else if (groveID === this.PIRMotionSensor) {
      values = values[1].substr(1);
      values = Number(values);
    }
    else if (groveID !== this.TemperatureSensor && groveID !== this.ColorSensor && groveID !== 9) {
      values = values[1];
    }
    // console.log(`set value after values = ${JSON.stringify(values)}`)
    this.values[pin] = values;
    if (groveID === this.GestureSensor) {
      setTimeout(() => {
        this.values[pin] = 'V0';
      }, 100);
      setTimeout(() => {
        this.proceedEvent(pin, 'V0');
      }, 1000);
    }
    // console.log(`grove set value groveID = ${groveID}, pin = ${pin}, values = ${JSON.stringify(values)}`);
    if (groveID === this.Button) {
      if (this.values[pin] === 'V0') {
        this.values[pin] = true;
      }
      else if (this.values[pin] === 'V1' || this.values[pin] === 'V2') {
        this.values[pin] = false;
      }
    }
    // console.log(`this.values = ${JSON.stringify(this.values)}`)
  },
  getValue(pin, options, values) {
    // console.log(`grove get value options = ${optionsStr}`)
    // console.log(`grove get value values = ${valuesStr}`)
    if (values === undefined) {
      values = this.values[pin];
    }
    console.log(values);
    if (this.initStatus[pin] === {}) {
      return null;
    }
    const groveID = this.initStatus[pin].groveID;
    // console.log(`grove get value groveID = ${groveID}`)
    if (groveID === this.UltrasonicSensor) {
    }
    else if (groveID === this.PIRMotionSensor) {
    }
    else if (groveID !== this.TemperatureSensor && groveID !== this.ColorSensor && groveID !== 9) {
      values = values[1]
    }
    const valuesStr = JSON.stringify(values);
    const thisvaluesStr = JSON.stringify(this.values);
    const optionsStr = JSON.stringify(options);
    // console.log(`grove get value options = ${optionsStr}, values = ${valuesStr}, this.values = ${thisvaluesStr}`);
    switch (groveID) {
      default: {
        if (values !== undefined) {
          const v = Number(values[0].substr(1, values[0].length));
          // console.log(`show v:${v}`);
          return v;
        }
        break;
      }
      case this.Button: {
        if (values === undefined) return false;
        // console.log(`pin:${pin}, options:${options}, values[0]:${values[0]}`);
        if (options === 'UP' && values[0] === 'V1' && values[0] === 'V2') return true;
        else if (options === 'DOWN' && values[0] === 'V0') return true;
        else if (options === undefined) return values[0];
        return false;
      }
      case this.ColorSensor: {
        console.log(values)
        if (values === undefined) return [0, 0, 0];
        if (values.length === 0) return [0, 0, 0];
        // const r = Number(values[0].substr(1, values[0].length));
        // const g = Number(values[1].substr(1, values[1].length));
        // const b = Number(values[2].substr(1, values[2].length));
        const r = Number(values[1].substr(1, values[0].length));
        const g = Number(values[2].substr(1, values[1].length));
        const b = Number(values[3].substr(1, values[2].length));
        if (options === 'hue') {
          const rgb_hsl = colorConvert.rgb.hsl(r, g, b)[0];
          // console.log(`grove color sensor rgb = ${r},${g},${b} hue = ${rgb_hsl}`);
          return rgb_hsl;
        }
        else if (options === 'hex') {
          const rgb_hex = colorConvert.rgb.hex(r, g, b);
          // console.log(`grove color sensor rgb = ${r},${g},${b} hex = ${rgb_hex}`);
          return rgb_hex;
        }
        // console.log(`grove color sensor r = ${r}, g = ${g}, b = ${b}`);
        return [r, g, b];
      }
      case this.PIRMotionSensor: {
        const val = values ? Number(values) : 0; // Number(values[0].substr(1, values[0].length));
        // console.log(`PIRMotionSensor val = ${val}`);
        if (val === 0) return false;
        if (val === 1) return true;
        break;
      }
      case this.UltrasonicSensor: {
        const val = values ? Number(values) : 0;
        // console.log(`UltrasonicSensor val = ${val}`);
        return val;
      }
      case 18: {
        const val = values ? Number(isNaN(values) ? values.substring(1) : values) : 0; // Number(values[0].substr(1, values[0].length));
        // console.log(`line finder ${val}`);
        if (val === 0) return false;
        if (val === 1) return true;
        break;
      }
      case this.TemperatureSensor: {
        // console.log('grove get value TemperatureSensor 1');
        // console.log('grove get value TemperatureSensor t');
        // console.log('grove get value TemperatureSensor h');
        // console.log(h)
        const t = values ? Number(values[1].substring(1)) : 0;
        const h = values ? Number(values[2].substring(1)) : 0;
        if (options === 'temperature') {
          // console.log(t)
          // console.log(`grove get value TemperatureSensor t = ${t}`);
          return t;
        }
        else if (options === 'humidity') {
          // console.log(h)
          // console.log(`grove get value TemperatureSensor h = ${h}`);
          return h;
        }
        return [t, h];
      }
      case 9: {
        const x = Number(values[0].substr(1, values[0].length));
        const y = Number(values[1].substr(1, values[1].length));
        const z = Number(values[2].substr(1, values[1].length));
        const t = Number(values[3].substr(1, values[1].length));
        const h = Number(values[4].substr(1, values[1].length));
        if (options === 'X') return x;
        else if (options === 'Y') return y;
        else if (options === 'Z') return z;
        else if (options === 'T') return t;
        else if (options === 'H') return h;
        return [x, y, z, t, h];
      }
    }
    return values;
  },
  init(groveID, pin, values, times) {
    if (groveID === 1) values = 'V16';
    return new Promise((resolve, reject) => {
      if (times === undefined) times = 0;
      else if (times >= 3) reject('failed');
      const msg = {
        cmd: 'uarm_init_grove',
        data: {
          pin: Number(pin),
          grove_id: groveID,
          values,
        },
      };
      UArm.send_msg_promise(msg).then(() => {
        this.initStatus[pin] = {
          init: true,
          groveID,
        };
        resolve();
      }).catch((err, data) => {
        console.log(err, data);
        // if (data.error_code === 'E25') {
        //
        // }
        if (err !== 'timeout') this.init(groveID, pin, values, times + 1).then(resolve).catch(reject);
        else reject(err, data);
      });
    });
  },
  startReporting(pin, interval) {
    const groveID = this.initStatus[pin].groveID;
    if (interval === undefined) interval = 1;
    return new Promise((resolve, reject) => {
      const msg = {
        cmd: 'uarm_report_grove',
        data: {
          interval,
          pin: Number(pin),
        },
      };
      UArm.send_msg_promise(msg).then(() => {
        resolve();
        if (this.initEventListener[groveID] !== undefined) {
          this.initEventListener[groveID].forEach((callback) => {
            callback();
          });
        }
      }).catch(reject);
    });
  },
  stop(pin) {
    return new Promise((resolve, reject) => {
      const groveID = this.initStatus[pin].groveID;
      const msg = {
        cmd: 'uarm_close_grove',
        data: {
          pin: Number(pin),
        },
      };
      UArm.send_msg_promise(msg).then(() => {
        resolve();
        this.initStatus[pin] = {};
        this.values[pin] = null;
        if (this.stopEventListener[groveID] !== undefined) {
          for (const p of Object.keys(this.initStatus)) {
            if (groveID === this.initStatus[p].groveID) {
              return;
            }
          }
          this.stopEventListener[groveID].forEach((callback) => {
            callback();
          });
        }
      }).catch(reject);
    });
  },
  control(pin, value, options) {
    options = options || {};
    options.wait = options.wait !== undefined ? options.wait : true;
    // console.log(JSON.stringify(this.initStatus));
    const groveID = this.initStatus[pin].groveID;
    switch (groveID) {
      default:
        break;
      case 1: {
        options.type = options.type || 'RGB';
        if (options.type === 'RGB') {
          const number = `V${value[0]}`;
          const rgb = value[1];
          value = `${number} R${rgb[0]} G${rgb[1]} B${rgb[2]}`;
        }
        else if (options.type === 'HSL') {
          const number = `V${value[0]}`;
          const hsl = value[1];
          const rgb = colorConvert.hsl.rgb(hsl[0], hsl[1], hsl[2]);
          value = `${number} R${rgb[0]} G${rgb[1]} B${rgb[2]}`;
        }
        break;
      }
    }
    const msg = {
      cmd: 'uarm_control_grove',
      data: {
        pin: Number(pin),
        value,
      },
    };
    if (options.wait) {
      return new Promise((resolve, reject) => {
        UArm.send_and_callback(msg, () => {
          // console.log(`UArm.running: ${UArm.running}`);
          if (UArm.running) {
            resolve();
          }
          else {
            reject();
          }
        });
      });
    }
    return UArm.send_msg(msg);
  },
  eventListener: {}, // key 是 grove 的序号，value是数组，里面存放的格式 {running: false, callback: function}
  initEventListener: {}, // 初始化用的 Event listener
  stopEventListener: {}, // 停止
  addEventListener(type, callback, options) {
    if (options === undefined) {
      if (type === undefined) {
        // throw Error('type is required');
        console.error('type is required');
        return;
      }
      callback = callback || (() => {
      });
      if (this.eventListener[type] === undefined) {
        this.eventListener[type] = [];
        this.eventListener[type].push({ running: false, callback });
      }
      else {
        this.eventListener[type].push({ running: false, callback });
      }
    }
    else if (options === 'init') {
      if (this.initEventListener[type] === undefined) this.initEventListener[type] = [];
      this.initEventListener[type].push(callback);
    }
    else if (options === 'stop') {
      if (this.stopEventListener[type] === undefined) this.stopEventListener[type] = [];
      this.stopEventListener[type].push(callback);
    }
  },
  stopAllGroves() {
    // console.log('Stop All Groves');
    // console.log(`initStatus: ${JSON.stringify(this.initStatus)}`);
    for (const pin of Object.keys(this.initStatus)) {
      // console.log(`initStatus: ${this.initStatus[pin]}`);
      if (this.initStatus[pin] === {}) return;
      const groveID = this.initStatus[pin].groveID;
      // console.log(`groveID:${groveID}`);
      if (this.stopEventListener[groveID] !== undefined) {
        // for (const p of Object.keys(this.initStatus)) {
        //   if (groveID === this.initStatus[p].groveID) {
        //     return;
        //   }
        // }
        this.stopEventListener[groveID].forEach((callback) => {
          callback();
        });
      }
      window.UArm.Grove.stop(pin);
      this.initStatus[pin] = {};
      this.values[pin] = null;
    }
  },
  removeEventListener(type, callback, options) {
    if (options === undefined) {
      if (this.eventListener[type] !== undefined) {
        const index = this.eventListener[type].indexOf(callback);
        if (index !== -1) {
          this.eventListener[type].splice(index, 1);
        }
      }
    }
    else if (options === 'init') {
      if (this.initEventListener[type] !== undefined) {
        const index = this.initEventListener[type].indexOf(callback);
        if (index !== -1) {
          this.initEventListener[type].splice(index, 1);
        }
      }
    }
    else if (options === 'stop') {
      if (this.stopEventListener[type] !== undefined) {
        const index = this.stopEventListener[type].indexOf(callback);
        if (index !== -1) {
          this.stopEventListener[type].splice(index, 1);
        }
      }
    }
  },
  proceedEvent(pin, values) {
    const type = this.initStatus[pin].groveID;
    // console.log(1);
    // console.log(`grove proceed event type = ${type}, this.eventListener[type] = ${JSON.stringify(this.eventListener[type])}, pin = ${pin}, values = ${JSON.stringify(values)}`);
    // console.log(`proceedEvent before values = ${JSON.stringify(values)}`)
    if (type === this.UltrasonicSensor) {
      values = values[1].substr(1);
    }
    else if (type === this.PIRMotionSensor) {
      values = values[1].substr(1);
      values = Number(values);
    }
    else if (type !== this.TemperatureSensor && type !== this.ColorSensor && type !== 9) {
      values = values[1]
    }
    // console.log(`proceedEvent after values = ${JSON.stringify(values)}`)
    // console.log(2);
    if (this.eventListener[type] === undefined) {
      return;
    }
    // console.log(3);
    for (const event of this.eventListener[type]) {
      // console.log(`4 event.running = ${event.running}, values = ${JSON.stringify(values)}`);
      event.callback(pin, values).then(() => {
        event.running = false;
      });
      // if (!event.running) { // 确保当前 callback 没有在执行中
      //   event.running = true;
      //   event.callback(pin, values).then(() => {
      //     event.running = false;
      //   });
      // }
    }
  },
  clearEventListener(type) {
    if (type === undefined) {
      for (const key of Object.keys(this.eventListener)) {
        if (this.eventListener[key] !== undefined) {
          this.eventListener[key].length = 0;
          this.eventListener[key] = undefined;
        }
        if (this.initEventListener[key] !== undefined) {
          this.initEventListener[key].length = 0;
          this.initEventListener[key] = undefined;
        }
        if (this.stopEventListener[key] !== undefined) {
          this.stopEventListener[key].length = 0;
          this.stopEventListener[key] = undefined;
        }
        this.stopGrove(key);
      }
    }
    else {
      this.stopGrove(type);
      if (this.eventListener[type] !== undefined) {
        this.eventListener[type].length = 0;
        this.eventListener[type] = undefined;
      }
      if (this.initEventListener[type] !== undefined) {
        this.initEventListener[type].length = 0;
        this.initEventListener[type] = undefined;
      }
      if (this.stopEventListener[type] !== undefined) {
        this.stopEventListener[type].length = 0;
        this.stopEventListener[type] = undefined;
      }
    }
  },
};


// TODO: 使用 function 来替换 switch

// TODO: 去掉 vuex 中的 syncStatus，全部使用 callback 来处理事件

// TODO: 分离 uarmapi.js，分成 vision, teach, printing, basic

UArm.broadcast_message_process = (response) => {
  // const self = UArm;
  // console.log(response)
  const type = response.cmd;
  const data = response.data;
  switch (type) {
    default: break;
    case 'greeting':
      self.core_info.version = data.core_version;
      break;
    case 'uarm_connection':
      self.uarm_info.uarm_connected = data.connection_state;
      if (self.uarm_info.uarm_connected) {
        self.uarm_info.port_serial_number = data.port_serial_number;
        self.uarm_info.port_name = data.port_name;
        self.uarm_info.firmware_version = data.firmware_version;
        self.uarm_info.hardware_version = data.hardware_version;
      }
      else {
        UArm.running = false;
        self.printing.state = false;
        self.printing.stop_flag = true;
        self.printing.total = null;
        self.play.is_playing = false;
        self.play.stop_flag = true;
        self.play.total = null;
        self.Grove.stopAllGroves();
      }
      break;
    case 'uarm_connecting':
      break;
    case 'uarm_play_progress':
      self.play.progress = data.progress;
      UArm.play.proceedProgressEvent(data.times, data.progress);
      break;
    case 'uarm_record_progress':
      self.record.progress = data.progress;
      UArm.record.proceedProgressEvent(data.status);
      break;
    case 'uarm_stop_playing':
      self.play.is_playing = false;
      self.play.stop_flag = true;
      self.play.total = null;
      // UArm.reset();
      // UArm.play.proceedStatusEvent(data.data.status);
      break;
    case 'uarm_report_position':
      self.uarm_info.current_x = data.position[0];
      self.uarm_info.current_y = data.position[1];
      self.uarm_info.current_z = data.position[2];
      self.uarm_info.current_r = data.position[3];
      UArm.Position.proceedEvent(data.position);
      UArm.Position.setValue('x', data.position[0]);
      UArm.Position.setValue('y', data.position[1]);
      UArm.Position.setValue('z', data.position[2]);
      UArm.Position.setValue('r', data.position[3]);
      break;
    case 'vision_report_face_detected':
      UArm.FaceDetection.setValue(data.face_detected);
      UArm.FaceDetection.proceedEvent(data.face_detected);
      break;
    case 'uarm_button_report':
      UArm.Button.setValue(data.button_id, data.button_value);
      UArm.Button.proceedEvent(data.button_id, data.button_value);
      break;
    case 'uarm_teach_status_report':
      switch (data.type) {
        default: break;
        case 'play':
          self.play.is_playing = data.status;
          if (self.play.is_playing) {
            self.play.total = data.count;
          }
          else {
            self.play.total = null;
          }
          UArm.play.proceedStatusEvent(data.status, data.count);
          break;
        case 'record':
          self.record.is_recoding = data.status;
          UArm.record.proceedStatusEvent(data.status);
          break;
        case 'standby':
          self.teach_standby_mode.standby = data.status;
          break;
      }
      break;
    case 'uarm_power_connection_report':
      self.uarm_info.power_connection_state = data.status;
      break;
    case 'uarm_tip_sensor_state_report':
      // console.log('uarm_tip_sensor_state_report');
      UArm.TipSensor.setValue(data.status);
      if (data.status) {
        UArm.TipSensor.proceedEvent();
      }
      break;
    case 'uarm_stop_printing':
      self.printing.state = false;
      // self.printing.stopPrinting();
      self.printing.stop_flag = true;
      self.printing.total = null;
      self.printing.progress = null;
      break;
    case 'uarm_printing_progress':
      self.printing.progress = data.progress;
      break;
    case 'uarm_report_grove_sensor':
      // console.log(`uarm report grove sensor = ${JSON.stringify(data)}`);
      // console.log(data);
      UArm.Grove.setValue(data.pin, data.data);
      UArm.Grove.proceedEvent(data.pin, data.data);
      break;
  }
};

// setTimeout(UArm.init_socket, 0);
export default UArm;
