import { Blockly, init as initBlockly } from '../components/BlocklyPageView/assets/lib/blockly/blockly';
import os from 'os';

const LocalBlocklyMgr = {};
const self = LocalBlocklyMgr;

// self.blocklyHideOrShow = () => {
  // const isNewFirmwareVersion = window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
  // // fix blockly
  // const trees = document.getElementsByClassName('blocklyTreeRow');
  // for (let i = 0; i < trees.length; i++) {
  //   const tree = trees[i];
  //   const spans = tree.children;
  //   // console.log("spans count = " + spans.length);
  //   for (let j = 0; j < spans.length; j++) {
  //     const span = spans[j];
  //     if (span.className === 'blocklyTreeLabel') {
  //       const innerHTML = span.innerHTML;
  //       tree.style.display = 'block';
  //       switch (innerHTML) {
  //         case 'Grove': {
  //           // tree.style.display = isNewFirmwareVersion ? 'none' : 'block';
  //           break;
  //         }
  //         default:
  //           break;
  //       }
  //     }
  //   }
  // }

  // const divs = document.getElementsByTagName('div');
  // for (let i = 0; i < divs.length; i++) {
  //   const aDiv = divs[i];
  //   const innerHTML = aDiv.innerHTML;
  //   if (innerHTML === '识别到人脸') {
  //     aDiv.style.display = 'none';
  //   }
  // }

  // self.enableAllGroveBlocks();
  // self.enableOrDisableFaceBlocks();
// } // end of blocklyFix

self.groveBlocksStr = [];
self.groveBlocksStr.push('control_grove_fan');
self.groveBlocksStr.push('control_grove_electromagnet');
self.groveBlocksStr.push('get_grove_ultrasonic');
self.groveBlocksStr.push('grove_color_hue_range');
self.groveBlocksStr.push('get_grove_color');
self.groveBlocksStr.push('color_hue');
self.groveBlocksStr.push('grove_gesture_type');
self.groveBlocksStr.push('get_grove_gesture');
self.groveBlocksStr.push('get_grove_temperature');
self.groveBlocksStr.push('get_grove_humidity');
self.groveBlocksStr.push('get_grove_pir_motion');
self.groveBlocksStr.push('control_grove_chainable_led_rgb');
self.groveBlocksStr.push('rgb_array');
self.groveBlocksStr.push('control_grove_chainable_led_hsl');
self.groveBlocksStr.push('hsl_array');
self.groveBlocksStr.push('get_grove_button');
self.groveBlocksStr.push('get_grove_slide');
self.groveBlocksStr.push('grove_slided_to');
self.groveBlocksStr.push('control_grove_slide_led');
self.groveBlocksStr.push('get_grove_rotary');
self.groveBlocksStr.push('grove_rotary_to');
self.groveBlocksStr.push('get_grove_light');
self.groveBlocksStr.push('get_grove_sound');
self.groveBlocksStr.push('get_grove_air');
self.groveBlocksStr.push('get_grove_accelerometer');
self.groveBlocksStr.push('get_grove_compass');
self.groveBlocksStr.push('get_grove_emg');
self.groveBlocksStr.push('get_grove_line_finder');
self.groveBlocksStr.push('control_grove_vibration');
self.groveBlocksStr.push('control_grove_oled');
self.groveBlocksStr.push('pixels');
self.groveBlocksStr.push('control_grove_oled_clear');
self.groveBlocksStr.push('control_grove_lcd_display');
self.groveBlocksStr.push('ascii_text');
self.groveBlocksStr.push('control_grove_lcd_display_clear');
// button
// self.groveBlocksStr.push('event_tip_sensor');
// self.groveBlocksStr.push('event_button_pressed');
// self.groveBlocksStr.push('event_button_pressed_stop');

self.faceBlocksStr = [];
self.faceBlocksStr.push('condition_face_detection');
self.faceBlocksStr.push('event_face_detection');
self.faceBlocksStr.push('event_face_detection_stop');

// self.enableOrDisableFaceBlocks = () => {
//   const usbConnection = window.store.state.syncConnectStatus.uarmStatus.usbConnection;
//   const isMac = os.platform() === 'darwin' && usbConnection;
  // if (self.blockly && self.blockly.BlockWorkspace !== null) {
  //   const blocks = Blockly.BlockWorkspace.getAllBlocks();
  //   for (const block of blocks) {
  //     if (block.type && self.faceBlocksStr.includes(block.type) && isMac) {
  //       block.setDisabled(true);
  //     }
  //     else {
  //       block.setDisabled(false);
  //     }
  //   }
  // }

  // 判断摄像头是否隐藏 mac不支持摄像头
  // const nodeTexts = document.getElementsByClassName('blocklyText');
  // for (let i = 0; i < nodeTexts.length; i++) {
  //   const nodeText = nodeTexts[i];
  //   const innerHTML = nodeText.innerHTML;
  //   const containText = innerHTML.includes(Blockly.Msg.CONDITION_FACE_DETECTION)
  //     || innerHTML.includes(Blockly.Msg.events.face)
  //     || innerHTML.includes(Blockly.Msg.events.stopface)
  //     || innerHTML.includes(Blockly.Msg.events.stopface);
  //   if (containText && isMac) {
  //     nodeText.parentNode.style.display = 'none';
  //   }
  //   else {
  //     nodeText.parentNode.style.display = 'block';
  //   }
  // }
// };

// self.enableAllGroveBlocks = () => {
  // 新固件Grove Button tip_sensor 不可用
  // const isNewFirmwareVersion = window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
  // if (self.blockly && self.blockly.BlockWorkspace !== null) {
  //   const blocks = Blockly.BlockWorkspace.getAllBlocks();
  //   for (const block of blocks) {
  //     if (block.type && self.groveBlocksStr.includes(block.type) && isNewFirmwareVersion) {
  //       block.setDisabled(false);
  //     }
  //     else {
  //       block.setDisabled(true);
  //     }
  //   }
  // }

  // 判断按钮是否隐藏 新固件不支持按钮
  // const nodeTexts = document.getElementsByClassName('blocklyText');
  // for (let i = 0; i < nodeTexts.length; i++) {
  //   const nodeText = nodeTexts[i];
  //   const innerHTML = nodeText.innerHTML;
  //   const containText = innerHTML.includes(Blockly.Msg.events.button.press)
  //     || innerHTML.includes(Blockly.Msg.events.stopbutton);
  //   // const containText = innerHTML.includes('位置');
  //   if (containText && isNewFirmwareVersion) {
  //     nodeText.parentNode.style.display = 'none';
  //   }
  //   else {
  //     nodeText.parentNode.style.display = 'block';
  //   }
  // }
// };

export default self;
