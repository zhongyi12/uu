const LocalCtrlMgr = {};
const self = LocalCtrlMgr;

self.cData = {
  x: 0,
  y: 160,
  z: 150,
  r: 90,
  speed: 1,
  armFinger: {
    x: 0,
    y: 160,
  },
};
self.quit = false;
self.counter = 0;
// self.cToggle = false;
self.suctionToggle = false;
self.gripperToggle = false;
self.radianAngle = -Math.PI / 2;

self.curIntervals = [];
self.positionInterval = null;
self.positionIntervalTimer = null;
self.onMovePosition = null;

// const imagePath = '../components/assets/img/';
// self.images = {
//   switchon: require(`${imagePath}btn_switch_on.png`),
//   switchoff: require(`${imagePath}btn_switch_off.png`),
//   gripperoff: require(`${imagePath}btn_switch_gripper_off.png`),
//   gripperon: require(`${imagePath}btn_switch_gripper_on.png`),
//   reset: require(`${imagePath}btn_reset.png`),
//   mouse: require(`${imagePath}icon_mouse.png`),
// };

self.initPositionInterval = () => {
  if (self.cData.positionInterval === null) {
    self.positionInterval = window.setInterval(() => {
      if (self.positionIntervalTimer) {
        self.positionIntervalTimer();
      }
    }, 100);
  }
};

self.resetPositionInterval = () => {
  if (self.curIntervals.length === 0) {
    window.clearInterval(self.positionInterval);
    self.positionInterval = null;
    return true;
  }
  return false;
};

self.addIntervalCtrl = (name) => {
  let curIntervals = self.curIntervals;
  curIntervals.push(name);
  curIntervals = Array.from(new Set(curIntervals));
  self.curIntervals = curIntervals;
};

self.removeIntervalCtrl = (name) => {
  let curIntervals = self.curIntervals;
  curIntervals.splice(curIntervals.findIndex(item => item === name), 1);
  curIntervals = Array.from(new Set(curIntervals));
  self.curIntervals = curIntervals;
};

const PI2 = Math.PI * 2;

function controlShortcut(e) {
  const delta = 2;
  self.cData.keyupShortcut = e.keyCode;

  let tempX = self.cData.x;
  let tempY = self.cData.y;
  if (e.keyCode === 87) { // w
    tempY = Number(tempY) + Number(delta);
  }
  else if (e.keyCode === 65) { // a
    tempX = Number(tempX) + Number(delta);
  }
  else if (e.keyCode === 83) { // s
    tempY = Number(tempY) - Number(delta);
  }
  else if (e.keyCode === 68) { // d
    tempX = Number(tempX) - Number(delta);
  }

  const limitXY = self.model.localCtrlMgr.limitXY(tempX, tempY);
  self.cData.x = self.cData.armFinger.x = limitXY.x;
  self.cData.y = self.cData.armFinger.y = limitXY.y;

  if (self.cData.r >= 0 && self.cData.r <= 180) {
    if (e.keyCode === 37 && self.cData.r < 180) { // left
      self.model.localCtrlMgr.radianAngle = -PI2 * ++self.cData.r / 360;
    }
    else if (e.keyCode === 39 && self.cData.r > 0) { // right
      self.model.localCtrlMgr.radianAngle = -PI2 * --self.cData.r / 360;
    }
  }
  // currentZ =$("#slider-vertical").slider("value");
  if (e.keyCode === 38) { // up
    self.cData.z = self.cData.z < 150 ? self.cData.z + 1 : self.cData.z;
    // $("#slider-vertical").slider("value", currentZ + 1);
  }
  else if (e.keyCode === 40) { // down
    self.cData.z = self.cData.z > -50 ? self.cData.z - 1 : self.cData.z;
    // $("#slider-vertical").slider("value", currentZ - 1);
  }

  if ([87, 65, 83, 68, 38, 40].includes(e.keyCode)) {
    if (self.model.localCtrlMgr.onMovePosition) {
      self.model.localCtrlMgr.onMovePosition();
    }
  }
}

function keyupShortcut(e) {
  // if (e.keyCode === 32) { // space
  //   self.model.localCtrlMgr.suctionToggle = !self.model.localCtrlMgr.suctionToggle;
  // }
  // else
  if (e.keyCode === 82) {
    if (this.model.localCtrlMgr.resetAction) {
      this.model.localCtrlMgr.resetAction();
    }
  }
}

self.addKeyboardEvent = () => {
  window.addEventListener('keydown', controlShortcut, true);
  window.addEventListener('keyup', keyupShortcut, true);
};

let eventW;

function callbackW(event) {
  if (event.wheelDelta > 0) {
    self.cData.z = self.cData.z < 150 ? self.cData.z + 1 : self.cData.z;
  }
  else {
    self.cData.z = self.cData.z > -50 ? self.cData.z - 1 : self.cData.z;
  }
  if (self.model.localCtrlMgr.onMovePosition) {
    self.model.localCtrlMgr.onMovePosition();
  }
  // $("#slider-vertical").slider("value", nextZ);
}

self.addWheelEvent = () => {
  // let eventW = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
  if ('onwheel' in document) {
    eventW = 'wheel';
  }
  else if ('onmousewheel' in document) {
    eventW = 'mousewheel';
  }
  else {
    eventW = 'DOMMouseScroll';
  }
  window.addEventListener(eventW, callbackW);
  self.cData.event = `${eventW} 12`;
};

self.removeEvent = () => {
  window.removeEventListener(eventW, callbackW);
  window.removeEventListener('keydown', controlShortcut);
  window.removeEventListener('keyup', keyupShortcut);
};

export default self;
