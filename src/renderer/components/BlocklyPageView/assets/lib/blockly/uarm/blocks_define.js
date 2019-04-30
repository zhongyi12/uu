import { BlocklyDefaultColor } from './blocks_color';
import BlocklyLib from './blockly_lib';
import format from 'string-format';
import defaultPixelsData from './pixels_default';
import colorConvert from 'color-convert';
import os from 'os';

// function onBlockChange(block, event) {
//   if (event.type === 'change' && event.blockId === block.id) {
//     if (event.name === 'pin' && event.element === 'field') {
//       return true;
//     }
//   }
//   return false;
// }

function isChildBlock(childBlockId, parentBlock) {
  const children = parentBlock.getChildren();
  for (const c of children) {
    if (c.id === childBlockId) return true;
  }
  return false;
}

function isNewFirmwareVersion() {
  const isNewFirmwareVersion = window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
  return isNewFirmwareVersion;
}

function checkDisableButton(block) {
  const isNewFirmwareVersion = window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
  // 新固件Grove Button tip_sensor 不可用
  // window.GlobalUtil.debugApp.info(`check Disable Button ${block.type} = ${isNewFirmwareVersion}`);
  block.setDisabled(isNewFirmwareVersion);
}

function checkDisableGrove(block) {
  const isNewFirmwareVersion = window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
  // 新固件Grove Button tip_sensor 不可用
  // window.GlobalUtil.debugApp.info(`check Disable Grove Button ${block.type} = ${isNewFirmwareVersion}`);
  block.setDisabled(isNewFirmwareVersion);
}

function checkDisableFace(block) {
  // const isNewFirmwareVersion = window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
  // 判断到连接上是 Mac 的时候, Face 不可用
  const usbConnection = window.store.state.syncConnectStatus.uarmStatus.usbConnection;
  const isMac = os.platform() === 'darwin' && usbConnection;
  block.setDisabled(isMac);
}

function initBlocklyDefine(Blockly) {
  function stopGrovePIN(pin) {
    pin = Number(pin);
    const Grove = window.Grove;
    if (pin !== 'null') {
      // console.log(`Grove.initStatus[pin]: ${Grove.initStatus[pin]}`);
      if (Grove.initStatus[pin] !== undefined) {
        if (Grove.initStatus[pin].init) {
          Grove.stop(pin);
        }
      }
      return true;
    }
    return false;
  }

  function checkSaveGroupBlock(blockGroup, pin) {
    const blocks = Blockly.BlockWorkspace.getAllBlocks();
    for (const b of blocks) {
      // console.log(`b.type: ${b.type}, b.blockGroup: ${b.blockGroup}, pin1: ${pin}, pin:${b.getFieldValue('pin')}`);
      if (b.blockGroup === undefined) continue;
      if (b.blockGroup === blockGroup && b.getFieldValue('pin') === pin) return true;
    }
    return false;
  }

  function releaseGrovePIN(xml, blockGroup) {
    // let blockId;
    // for (const attr of xml.attributes) {
    //   if (attr.name === 'id') blockId = attr.nodeValue;
    // }
    let pin;
    for (const child of xml.childNodes) {
      if (child.nodeName.toLowerCase() === 'field') {
        for (const attr of child.attributes) {
          if (attr.name === 'name' && attr.nodeValue === 'pin') pin = child.textContent;
        }
      }
    }
    if (pin === 'null') return;
    if (!checkSaveGroupBlock(blockGroup, pin)) {
      stopGrovePIN(pin);
    }
  }

  function checkGrovePIN(block) {
    const pin = block.getFieldValue('pin');
    const blocks = Blockly.BlockWorkspace.getAllBlocks();
    for (const b of blocks) {
      if (b.id === block.id) continue;
      if (b.blockGroup === undefined) continue;
      if (b.blockCategory !== 'GROVE') continue;
      if (b.blockGroup !== block.blockGroup) {
        if (pin === b.getFieldValue('pin')) {
          Blockly.messageBox('warning', Blockly.Msg.WARNING, format(Blockly.Msg.MSG_GROVE_PIN, { PIN: pin }));
          return false;
        }
      }
    }
    return true;
  }

  function initGrovePIN(block) {
    console.log(`init Grove PIN type = ${block.type} 1`);
    const Grove = window.Grove;
    const groveID = block.groveID;
    const pin = block.getFieldValue('pin');
    if (checkGrovePIN(block)) {
      console.log(`createGroveBlock block: ${block.type} - ${Grove.initStatus[pin] === undefined} 2`);
      if (Grove.initStatus[pin] !== undefined) {
        console.log(`init Grove PIN type = ${block.type} 3`);
        if (Grove.initStatus[pin].groveID === block.groveID) return true;
      }
      if (stopGrovePIN(pin)) {
        console.log(`init Grove groveID = ${groveID}, pin= ${pin} 4`);
        Grove.init(groveID, pin).then(() => {
          console.log(`init Grove success 5 block.groveType = ${block.groveType}`);
          if (block.groveType === 'SENSOR') {
            console.log('init Grove PIN type start Reporting 4');
            Grove.startReporting(pin);
          }
        });
      }
      return true;
    }
    return false;
  }

  function createGroveBlock(block) {
    if (block.disabled) return;
    const pin = block.getFieldValue('pin');
    if (pin !== 'null') {
      if (!initGrovePIN(block)) block.dispose(true, true);
    }
  }

  function changeGrovePIN(block, event) {
    if (event.type === 'change' && event.blockId === block.id) {
      if (event.name === 'pin' && event.element === 'field') {
        const pin = event.newValue;
        const old_pin = event.oldValue;
        // console.log(`change pin: ${pin}, ${old_pin}`);
        if (pin !== 'null') {
          if (!initGrovePIN(block)) {
            block.setFieldValue(event.oldValue, 'pin');
          }
          else {
            if (old_pin !== 'null') {
              if (!checkSaveGroupBlock(block.blockGroup, old_pin)) {
                // console.log('check save group');
                stopGrovePIN(old_pin);
              }
            }
          }
        }
      }
    }
  }


  function disableGrove(block, disabled) {
    if (disabled) {
      // console.log('stop grove');
      const pin = block.getFieldValue('pin');
      // stopGrove(block, groveType, pin);
      if (pin !== '0') window.Grove.stopGrove(pin);
      block.setDisabled(true);
    }
    else {
      block.setDisabled(!checkGrovePIN(block));
    }
  }

  // function changeGrovePIN(block, event) {
  //   // const groveType = block.groveType;
  //   if (event.type === 'change' && event.blockId === block.id) {
  //     if (event.name === 'pin' && event.element === 'field') {
  //       // console.log(`${this.type} - value: ${event.oldValue}`);
  //       const Grove = window.Grove;
  //       const groveID = block.groveID;
  //       const pin = event.newValue;
  //       console.log(`change pin: ${pin}`);
  //       if (pin !== 'null') {
  //         if (checkGrovePIN(block)) {
  //           // console.log(`createGroveBlock block: ${block.type}`);
  //           if (Grove.initStatus[pin].groveID === block.groveID) return;
  //           if (stopGrovePIN(pin)) {
  //             Grove.init(groveID, pin).then(() => {
  //               if (block.groveType === 'SENSOR') {
  //                 Grove.startReporting(pin);
  //               }
  //             });
  //           }
  //         }
  //         else block.setFieldValue(event.oldValue, 'pin');
  //       }
  //     }
  //   }
  // }

  Blockly.Blocks.console = {
    init() {
      this.appendValueInput('msg')
        .setCheck('String')
        .appendField(Blockly.Msg.TEXT_CONSOLE);
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_TEXT);
      this.setTooltip('');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks.position = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.motion.position);
      this.appendValueInput('x')
        .setCheck('Number')
        .appendField('X');
      this.appendValueInput('y')
        .setCheck('Number')
        .appendField('Y');
      this.appendValueInput('z')
        .setCheck('Number')
        .appendField('Z');
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    },
    onchange(event) {
      if (event.type === 'change' && isChildBlock(event.blockId, this)) {
        for (const item of this.inputList) {
          if (item.connection !== null) {
            const value = item.connection.targetBlock().getFieldValue('NUM');
            switch (item.name) {
              default:
                break;
              case 'x':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 300), 'NUM');
                break;
              case 'y':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, -300), 300), 'NUM');
                break;
              case 'z':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, -150), 150), 'NUM');
                break;
            }
          }
        }
      }
    },
  };

  Blockly.Blocks.move_to = {
    init() {
      this.appendValueInput('position')
        .setCheck('Array')
        .appendField(Blockly.Msg.motion.moveto);
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    },
    setValue(positions) {
      const posChildBlock = this.getChildren();
      if (posChildBlock.length > 0) {
        for (const item of posChildBlock[0].inputList) {
          if (item.connection !== null) {
            switch (item.name) {
              default:
                break;
              case 'x':
                item.connection.targetBlock().setFieldValue(Math.round(positions[0]).toString(), 'NUM');
                break;
              case 'y':
                item.connection.targetBlock().setFieldValue(Math.round(positions[1]).toString(), 'NUM');
                break;
              case 'z':
                item.connection.targetBlock().setFieldValue(Math.round(positions[2]).toString(), 'NUM');
                break;
            }
          }
        }
      }
    },
  };

  Blockly.Blocks.move = {
    init() {
      this.appendValueInput('value')
        .setCheck('Number')
        .appendField(Blockly.Msg.motion.move)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.direction.forward, 'forward'],
          [Blockly.Msg.direction.backward, 'backward'], [Blockly.Msg.direction.left, 'left'],
          [Blockly.Msg.direction.right, 'right'], [Blockly.Msg.direction.up, 'up'],
          [Blockly.Msg.direction.down, 'down']]), 'orientation');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    },
  };

  // Blockly.Blocks.stretch = {
  //   init() {
  //     this.appendValueInput('value')
  //       .setCheck('Number')
  //       .appendField(Blockly.Msg.motion.stretch)
  //       .appendField(new Blockly.FieldDropdown([['forward', 'forward'], ['backward', 'backward']]), 'orientation');
  //     this.setInputsInline(false);
  //     this.setPreviousStatement(true, null);
  //     this.setNextStatement(true, null);
  //     this.setColour(BlocklyDefaultColor.COLOR_MOTION);
  //     this.setTooltip('');
  //     this.setHelpUrl('');
  //     this.setCommentText(Blockly.Msg.comment.stretch);
  //   },
  // };

  Blockly.Blocks.turn = {
    init() {
      this.appendValueInput('value')
        .setCheck('Number')
        .appendField('Turn')
        .appendField(new Blockly.FieldDropdown([['left', 'left'], ['right', 'right']]), 'orientation');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    },
  };

  Blockly.Blocks.wrist_turn = {
    init() {
      this.appendValueInput('value')
        .setCheck('Number')
        .appendField(Blockly.Msg.motion.wristturn);
      // .appendField(new Blockly.FieldDropdown([['clockwise', 'clockwise'],
      //   ['counterclockwise', 'counterclockwise']]), 'orientation');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    },
    onchange(event) {
      if (event.type === 'change' && isChildBlock(event.blockId, this)) {
        for (const item of this.inputList) {
          if (item.connection !== null) {
            const value = item.connection.targetBlock().getFieldValue('NUM');
            switch (item.name) {
              default:
                break;
              case 'value':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 180), 'NUM');
                break;
            }
          }
        }
      }
    },
  };

  // Blockly.Blocks.get_position = {
  //   init() {
  //     this.appendDummyInput()
  //       .appendField('Get Current Coordinate');
  //     this.appendDummyInput()
  //       .appendField(new Blockly.FieldDropdown([['x', 'x'], ['y', 'y'], ['z', 'z'], ['wrist', 'r']]), 'axis');
  //     this.setInputsInline(true);
  //     this.setOutput(true, null);
  //     this.setColour(BlocklyDefaultColor.COLOR_MOTION);
  //     this.setTooltip('');
  //     this.setHelpUrl('');
  //   },
  // };

  Blockly.Blocks.base_turn = {
    init() {
      this.appendValueInput('value')
        .setCheck('Number')
        .appendField(Blockly.Msg.motion.baseturn);
      // .appendField(new Blockly.FieldDropdown([['clockwise', 'clockwise'],
      //   ['counterclockwise', 'counterclockwise']]), 'orientation');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    },
    onchange(event) {
      if (event.type === 'change' && isChildBlock(event.blockId, this)) {
        for (const item of this.inputList) {
          if (item.connection !== null) {
            const value = item.connection.targetBlock().getFieldValue('NUM');
            switch (item.name) {
              default:
                break;
              case 'value':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 180), 'NUM');
                break;
            }
          }
        }
      }
    },
  };

  // Blockly.Blocks.servo_angle = {
  //   init() {
  //     this.appendDummyInput()
  //       .appendField('Angle')
  //       .appendField(new Blockly.FieldAngle(30), 'angle');
  //     this.setInputsInline(false);
  //     this.setOutput(true, null);
  //     this.setColour(BlocklyDefaultColor.COLOR_MOTION);
  //     this.setTooltip('');
  //     this.setHelpUrl('');
  //   },
  // };

  Blockly.Blocks.set_speed = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.motion.speed)
        .appendField(new Blockly.FieldDropdown([['1x', '1'], ['2x', '2'],
          ['4x', '4']]), 'speed');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    },
  };

  Blockly.Blocks.reset = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.motion.reset);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    },
  };
  Blockly.Blocks.ON = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.motion.on)
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'on_off');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    },
    onStop() {
      window.UArm.set_gripper({ ON: false, wait: true });
    },
  };

  Blockly.Blocks.set_pump = {
    init() {
      this.appendValueInput('value')
        .setCheck('Boolean')
        .appendField(Blockly.Msg.motion.suction);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
      this.setTooltip('');
      this.setHelpUrl('');
    },
    onStop() {
      window.UArm.set_pump({ ON: false, wait: true });
    },
  };

  Blockly.Blocks.set_gripper = {
    init() {
      this.appendValueInput('value')
        .setCheck('Boolean')
        .appendField(Blockly.Msg.motion.gripper);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    },
  };
  /* ******************************* LOGIC **********************************************************/
  Blockly.Blocks.wait_until = {
    init() {
      this.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField(Blockly.Msg.LOGIC_WAIT_UNTIL);
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_LOGIC);
    },
    onStop() {
      BlocklyLib.waitUntilTrigger.forEach((trigger) => {
        clearInterval(trigger);
      });
    },
  };

  Blockly.Blocks.wait = {
    init() {
      this.appendValueInput('sec')
        .setCheck('Number')
        .appendField(Blockly.Msg.motion.wait);
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_LOGIC);
    },
  };

  /* ******************************* SOUND **********************************************************/

  Blockly.Blocks.set_buzzer = {
    init() {
      this.appendValueInput('frequency')
        .setCheck('Number')
        .appendField(new Blockly.FieldLabel(Blockly.Msg.BEEP), 'beep');
      this.appendValueInput('duration')
        .setCheck('Number')
        .appendField(new Blockly.FieldLabel(Blockly.Msg.HZ), 'hz')
        .appendField(new Blockly.FieldLabel(Blockly.Msg.LAST), 'last');
      this.appendDummyInput()
        .appendField(new Blockly.FieldLabel(Blockly.Msg.SEC), 'sec');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_SOUND);
    },
    onchange(event) {
      // console.log(this.getFieldValue('beep'));
      if (event.type === 'change' && event.blockId === this.id) {
        if (((event.name === 'frequency') || (event.name === 'duration')) && event.element === 'field') {
          for (const item of this.inputList) {
            if (item.connection !== null) {
              const b = item.connection.targetBlock();
              // console.log(b.type);
              if (b !== null) {
                switch (b.type) {
                  case 'buzzer_notes':
                    this.setFieldValue(Blockly.Msg.PLAY, 'beep');
                    this.setFieldValue('', 'hz');
                    break;
                  case 'buzzer_beats':
                    this.setFieldValue('', 'sec');
                    break;
                  default:
                    break;
                }
              }
            }
          }
        }
      }
    },
  };

  Blockly.Blocks.buzzer_notes = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.NOTE)
        .appendField(new Blockly.FieldDropdown([['C3', '261.6'], ['D3', '293.7'], ['E3', '329.6'], ['F3', '349.2'],
          ['G3', '392.0'], ['A3', '440'], ['B3', '493.3'], ['C4', '523.3']]), 'note');
      this.setInputsInline(false);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_SOUND);
    },
  };

  Blockly.Blocks.buzzer_beats = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.BEAT)
        .appendField(new Blockly.FieldDropdown([['1/4', '0.125'], ['1/2', '0.25'], ['1', '0.5'], ['2', '1']]), 'beat');
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_SOUND);
    },
  };
  /* ******************************* Loop **********************************************************/
  // Blockly.Blocks.loop_repeat_times = {
  //   init() {
  //     this.appendValueInput('times')
  //       .setCheck('Number')
  //       .appendField(Blockly.Msg.LOOP_REPEAT);
  //     this.appendDummyInput()
  //       .appendField(Blockly.Msg.LOOP_TIMES);
  //     this.appendStatementInput('statement')
  //       .setCheck(null);
  //     this.setInputsInline(true);
  //     this.setPreviousStatement(true, null);
  //     this.setNextStatement(true, null);
  //     this.setColour(BlocklyDefaultColor.COLOR_LOOP);
  //     this.setTooltip('');
  //     this.setHelpUrl('');
  //   },
  // };
  // Blockly.Blocks.loop_repeat_while = {
  //   init() {
  //     this.appendValueInput('condition')
  //       .setCheck('Boolean')
  //       .appendField(Blockly.Msg.LOOP_REPEAT)
  //       .appendField(new Blockly.FieldDropdown([['while', Blockly.Msg.LOOP_WHILE],
  //         ['until', Blockly.Msg.LOOP_UNTIL]]), 'type');
  //     this.appendStatementInput('statement')
  //       .setCheck(null)
  //       .appendField(Blockly.Msg.LOOP_DO);
  //     this.setInputsInline(false);
  //     this.setPreviousStatement(true, null);
  //     this.setNextStatement(true, null);
  //     this.setColour(BlocklyDefaultColor.COLOR_LOOP);
  //     this.setTooltip('');
  //     this.setHelpUrl('');
  //   },
  // };

  Blockly.Blocks.loop_run_forever = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.LOOP_FOREVER);
      this.appendStatementInput('statement')
        .setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_LOOP);
    },
  };

  Blockly.Blocks.loop_break = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.LOOP_BREAK);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_LOOP);
      this.setTooltip('');
      this.setHelpUrl('');
    },
    onMove() {
      // console.log('onMove');
      const parent = this.getParent();
      if (!this.isInFlyout) {
        if (parent !== null) {
          switch (parent.type) {
            case 'controls_whileUntil':
              this.setDisabled(false);
              return;
            case 'controls_repeat_ext':
              this.setDisabled(false);
              return;
            case 'controls_for':
              this.setDisabled(false);
              return;
            case 'controls_forEach':
              this.setDisabled(false);
              return;
            default:
              Blockly.messageBox('warning', Blockly.Msg.WARNING, Blockly.Msg.MSG_LOOP_BREAK);
              this.setDisabled(true);
          }
        }
        Blockly.messageBox('warning', Blockly.Msg.WARNING, Blockly.Msg.MSG_LOOP_BREAK);
        this.setDisabled(true);
      }
    },
  };
  /* ******************************* Condition **********************************************************/
  Blockly.Blocks.condition_tip_sensor = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.CONDITION_TIP_SENSOR);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_CONDITION);
      this.setTooltip('');
      this.setHelpUrl('');
    },
  };

  Blockly.Blocks.condition_face_detection = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.CONDITION_FACE_DETECTION);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_CONDITION);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableFace(this);
    },
    onCreate() {
      checkDisableFace(this);
      window.CameraManager.openWindow();
    },
    onStart() {
      this.onCreate();
    },
    onDelete() {
      const blocks = Blockly.BlockWorkspace.getAllBlocks();
      for (const b of blocks) {
        if (b.id === this.id) continue;
        if (b.type === this.type || b.type === 'event_face_detection') return;
      }
      window.CameraManager.closeWindow();
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.condition_key_pressed = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.CONDITION_KEY)
        .appendField(new Blockly.FieldDropdown([
          ['A', '65'],
          ['B', '66'],
          ['C', '67'],
          ['D', '68'],
          ['E', '69'],
          ['F', '70'],
          ['G', '71'],
          ['H', '72'],
          ['I', '73'],
          ['J', '74'],
          ['K', '75'],
          ['L', '76'],
          ['M', '77'],
          ['N', '78'],
          ['O', '79'],
          ['P', '80'],
          ['Q', '81'],
          ['R', '82'],
          ['S', '83'],
          ['T', '84'],
          ['U', '85'],
          ['V', '86'],
          ['W', '87'],
          ['X', '88'],
          ['Y', '89'],
          ['Z', '90'],
          ['SPACE', '32'],
          ['UP', '38'],
          ['DOWN', '40'],
          ['LEFT', '37'],
          ['RIGHT', '39'],
          ['0', '48'],
          ['1', '49'],
          ['2', '50'],
          ['3', '51'],
          ['4', '52'],
          ['5', '53'],
          ['6', '54'],
          ['7', '55'],
          ['8', '56'],
          ['9', '57'],
        ]), 'keycode');
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_CONDITION);
      this.setTooltip('');
      this.setHelpUrl('');
    },
    onStart() {
      BlocklyLib.KeyPressEvent.init();
    },
    onStop() {
      BlocklyLib.KeyPressEvent.clearValue();
      BlocklyLib.KeyPressEvent.stop();
    },
  };

  Blockly.Blocks.condition_button_pressed = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.CONDITION_BUTTON)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.BUTTON_MENU, 'menu'],
          [Blockly.Msg.BUTTON_PLAY, 'play']]), 'button_id');
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_CONDITION);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
    },
  };

  Blockly.Blocks.condition_current_position = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.CONDITION_CURRENT_POSITION)
        .appendField(new Blockly.FieldDropdown([['X', 'x'],
          ['Y', 'y'], ['Z', 'z']]), 'axis');
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_CONDITION);
      this.setTooltip('');
      this.setHelpUrl('');
    },
    onCreate() {
      if (!this.disabled) window.UArm.Position.startReport();
    },
    onExit() {
      window.UArm.Position.stopReport();
    },
    onDelete() {
      if (Blockly.BlockWorkspace !== null) {
        const blocks = Blockly.BlockWorkspace.getAllBlocks();
        for (const block of blocks) {
          if (block.type === this.type) {
            return;
          }
        }
        window.UArm.Position.stopReport();
      }
    },
  };

  /** ****************************** Event **********************************************************/
  Blockly.Blocks.event_face_detection = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.events.face);
      this.appendStatementInput('statement')
        .setCheck(null);
      this.setColour(BlocklyDefaultColor.COLOR_EVENT);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('');
      this.setHelpUrl('https://github.com/google/blockly/');
      checkDisableFace(this);
    },
    onCreate() {
      checkDisableFace(this);
      window.CameraManager.openWindow();
    },
    onStart() {
      this.onCreate();
    },
    onStop() {
      window.UArm.FaceDetection.clearEventListener();
    },
    onDelete() {
      const blocks = Blockly.BlockWorkspace.getAllBlocks();
      for (const b of blocks) {
        if (b.id === this.id) continue;
        if (b.type === this.type || b.type === 'condition_face_detection') return;
      }
      window.CameraManager.closeWindow();
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.event_face_detection_stop = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.events.stopface);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_EVENT);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('');
      checkDisableFace(this);
    },
    onCreate() {
      checkDisableFace(this);
    },
  };

  Blockly.Blocks.event_tip_sensor = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.events.suction);
      this.appendStatementInput('statement');
      this.setColour(BlocklyDefaultColor.COLOR_EVENT);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('');
      this.setHelpUrl('https://github.com/google/blockly/');
      this.setCommentText(Blockly.Msg.comment.tipsensor);
    },
    onStop() {
      window.UArm.TipSensor.clearEventListener();
    },
  };

  Blockly.Blocks.event_tip_sensor_stop = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.events.stoptipsensor);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_EVENT);
      this.setTooltip('');
    },
  };

  Blockly.Blocks.event_keypressed_stop = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.events.stopkeyboard);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_EVENT);
      this.setTooltip('');
    },
  };

  Blockly.Blocks.event_keypressed = {
    init() {
      this.appendStatementInput('statement')
        .appendField(Blockly.Msg.events.key.press, 'IF')
        .appendField(new Blockly.FieldDropdown([
          ['A', '65'],
          ['B', '66'],
          ['C', '67'],
          ['D', '68'],
          ['E', '69'],
          ['F', '70'],
          ['G', '71'],
          ['H', '72'],
          ['I', '73'],
          ['J', '74'],
          ['K', '75'],
          ['L', '76'],
          ['M', '77'],
          ['N', '78'],
          ['O', '79'],
          ['P', '80'],
          ['Q', '81'],
          ['R', '82'],
          ['S', '83'],
          ['T', '84'],
          ['U', '85'],
          ['V', '86'],
          ['W', '87'],
          ['X', '88'],
          ['Y', '89'],
          ['Z', '90'],
          ['SPACE', '32'],
          ['UP', '38'],
          ['DOWN', '40'],
          ['LEFT', '37'],
          ['RIGHT', '39'],
          ['0', '48'],
          ['1', '49'],
          ['2', '50'],
          ['3', '51'],
          ['4', '52'],
          ['5', '53'],
          ['6', '54'],
          ['7', '55'],
          ['8', '56'],
          ['9', '57'],
        ]), 'keycode')
        .appendField(Blockly.Msg.events.key.do, '，EXCUTE：');
      this.setTooltip('');
      this.setColour(BlocklyDefaultColor.COLOR_EVENT);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    },
    onStart() {
      BlocklyLib.KeyPressEvent.init();
    },
    onStop() {
      BlocklyLib.KeyPressEvent.clearEventListener();
    },
    onDelete() {
      BlocklyLib.KeyPressEvent.clearEventListener();
    },
  };

  function recordingOptions() {
    const options = [];
    const file_items = window.FileManager.listProjectListSync('TeachMode', { sortOrderDesc: true });
    for (let i = 0; i < file_items.length; i++) {
      options.push([file_items[i].basename, file_items[i].basename]);
    }
    if (file_items.length <= 0) {
      options.push([Blockly.Msg.motion.playrecord.choose, 'null']);
    }
    return options;
  }

  Blockly.Blocks.studio_play_recording = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.motion.playrecord.play)
        .appendField(new Blockly.FieldDropdown(recordingOptions), 'filename');
      // .appendField(Blockly.Msg.motion.playrecord.speed)
      // .appendField(new Blockly.FieldDropdown([['1x', '1'], ['2x', '2']]), 'speed');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_MOTION);
      this.setTooltip('');
      this.setHelpUrl('');
    },
    onStop() {
      window.UArm.play.stopPlay();
    },
  };

  Blockly.Blocks.event_button_pressed = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.events.button.press)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.events.button.menu, 'menu'],
          [Blockly.Msg.events.button.play, 'play']]), 'button_id')
        .appendField(Blockly.Msg.events.button.do);
      this.appendStatementInput('statement')
        .setCheck(null);
      this.setColour(BlocklyDefaultColor.COLOR_EVENT);
      this.setTooltip('');
      this.setHelpUrl('');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setCommentText(Blockly.Msg.comment.press);
      checkDisableButton(this);
    },
    onStop() {
      window.UArm.Button.clearEventListener();
    },
    onCreate() {
      checkDisableButton(this);
    },
  };

  Blockly.Blocks.event_button_pressed_stop = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.events.stopbutton);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_EVENT);
      this.setTooltip('');
      checkDisableButton(this);
    },
    onCreate() {
      checkDisableButton(this);
    },
  };
  /** ***************************************** Grove ******************************************/
  Blockly.Blocks.grove_gesture_type = {
    blockCategory: 'GROVE',
    blockGroup: 'GESTURE',
    groveType: 'SENSOR',
    groveID: 11,
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
        .appendField(Blockly.Msg.GROVE_GESTURE)
        .appendField(Blockly.Msg.grove.gesture.is)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.direction.right, '1'],
          [Blockly.Msg.direction.left, '2'], [Blockly.Msg.direction.up, '4'],
          [Blockly.Msg.direction.down, '8'], [Blockly.Msg.direction.forward, '16'],
          [Blockly.Msg.direction.backward, '32'], [Blockly.Msg.direction.clockwise, '64'],
          [Blockly.Msg.direction.counterclockwise, '128']]), 'gesture');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_gesture = {
    blockCategory: 'GROVE',
    blockGroup: 'GESTURE',
    groveType: 'SENSOR',
    groveID: 11,
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
        .appendField(Blockly.Msg.GROVE_GET_GESTURE);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_ultrasonic = {
    blockCategory: 'GROVE',
    blockGroup: 'ULTRASONIC',
    groveType: 'SENSOR',
    groveID: 12,
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['4', '4'],
        ['8', '8'], ['9', '9']]), 'pin')
        .appendField(Blockly.Msg.grove.ultrasonic.distance);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_color = {
    blockCategory: 'GROVE',
    blockGroup: 'COLOR',
    groveType: 'SENSOR',
    groveID: 10,
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
        .appendField(Blockly.Msg.GROVE_GET_COLOR_HUE);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.grove_color_hue_range = {
    blockCategory: 'GROVE',
    blockGroup: 'COLOR',
    groveType: 'SENSOR',
    groveID: 10,
    init() {
      this.appendDummyInput()
      .appendField(Blockly.Msg.PIN)
      .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
      .appendField(Blockly.Msg.GROVE_COLOR_HUE);
      this.appendValueInput('min')
      .setCheck('Number')
      .appendField(Blockly.Msg.BETWEEN);
      this.appendValueInput('max')
      .setCheck('Number')
      .appendField(Blockly.Msg.AND);
      this.setOutput(true, null);
      this.setInputsInline(true);
      this.setTooltip('');
      this.setHelpUrl('');
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
    setValue(min, max) {
      for (const item of this.inputList) {
        if (item.connection !== null) {
          switch (item.name) {
            default:
              break;
            case 'min':
              item.connection.targetBlock().setFieldValue(min, 'hue');
              break;
            case 'max':
              item.connection.targetBlock().setFieldValue(max, 'hue');
              break;
          }
        }
      }
    },
  };

  Blockly.Blocks.color_hue = {
    init() {
      this.appendDummyInput()
        .appendField('Hue')
        .appendField(new Blockly.FieldNumber(120, 0, 360), 'hue');
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
      this.setColour(this.getFieldValue('hue'));
    },
    onchange(event) {
      if (event.type === 'change' && event.blockId === this.id) {
        if (event.name === 'hue' && event.element === 'field') {
          this.setColour(this.getFieldValue('hue'));
        }
      }
    },
  };

  Blockly.Blocks.get_grove_temperature = {
    blockCategory: 'GROVE',
    blockGroup: 'TEMPERATURE',
    groveType: 'SENSOR',
    groveID: 15,
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
        .appendField(Blockly.Msg.TEMPERATURE_GET);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_humidity = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
        .appendField(Blockly.Msg.HUMIDITY_GET);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'TEMPERATURE',
    groveType: 'SENSOR',
    groveID: 15,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_pir_motion = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['3', '3'], ['4', '4'], ['5', '5'],
        ['8', '8'], ['9', '9']]), 'pin')
        .appendField(Blockly.Msg.MOTION_DECTECTED);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'PIR_MOTION',
    groveType: 'SENSOR',
    groveID: 16,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.control_grove_fan = {
    blockCategory: 'GROVE',
    blockGroup: 'MINIFAN',
    groveType: 'CONTROL',
    groveID: 13,
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['4', '4'],
                 ['8', '8'], ['9', '9']]), 'pin')
        .appendField(Blockly.Msg.grove.fan.label);
      this.appendValueInput('speed')
        .setCheck('Number')
        .appendField(Blockly.Msg.grove.fan.speed);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onStop() {
      const pin = this.getFieldValue('pin');
      if (pin === 'null') return;
      window.Grove.control(Number(pin), 'V0');
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
    onConnect() {
      this.onCreate();
    },
    onchange(event) {
      changeGrovePIN(this, event);
      if (event.type === 'change' && isChildBlock(event.blockId, this)) {
        for (const item of this.inputList) {
          if (item.connection !== null) {
            const value = item.connection.targetBlock().getFieldValue('NUM');
            switch (item.name) {
              default:
                break;
              case 'speed':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 255), 'NUM');
                break;
            }
          }
        }
      }
    },
  };

  Blockly.Blocks.stop_grove_fan = {
    blockCategory: 'GROVE',
    blockGroup: 'MINIFAN',
    groveType: 'CONTROL',
    groveID: 13,
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['3', '3'], ['4', '4'], ['5', '5'],
        ['8', '8'], ['9', '9']]), 'pin')
        .appendField(Blockly.Msg.grove.fan.stop);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
    },
    onStop() {
      const pin = this.getFieldValue('pin');
      if (pin === 'null') return;
      window.Grove.control(Number(pin), 'V0');
    },
    onCreate() {
      createGroveBlock(this);
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
    onConnect() {
      this.onCreate();
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
  };

  Blockly.Blocks.control_grove_electromagnet = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['3', '3'], ['4', '4'], ['5', '5'],
        ['8', '8'], ['9', '9']]), 'pin')
        .appendField(Blockly.Msg.ELECTRONMAGNET);
      this.appendValueInput('on')
        .setCheck('Boolean');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'ELECTROMAGNET',
    groveType: 'CONTROL',
    groveID: 14,
    onStop() {
      const pin = this.getFieldValue('pin');
      if (pin === 'null') return;
      window.Grove.control(Number(pin), 'V0');
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
    onConnect() {
      this.onCreate();
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
  };

  Blockly.Blocks.rgb_array = {
    init() {
      this.appendValueInput('r')
          .setCheck('Number')
          .appendField('R');
      this.appendValueInput('g')
          .setCheck('Number')
          .appendField('G');
      this.appendValueInput('b')
          .setCheck('Number')
          .appendField('B');
      this.setInputsInline(true);
      this.setOutput(true, 'Array');
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
    },
    onchange(event) {
      if (event.type === 'change' && isChildBlock(event.blockId, this)) {
        for (const item of this.inputList) {
          if (item.connection !== null) {
            const value = item.connection.targetBlock().getFieldValue('NUM');
            if (item.connection.targetBlock().type !== 'math_number') return;
            // console.log(`connection type: ${item.connection.targetBlock().type}`);
            switch (item.name) {
              default:
                break;
              case 'r':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 255), 'NUM');
                break;
              case 'g':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 255), 'NUM');
                break;
              case 'b':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 255), 'NUM');
                break;
            }
          }
        }
        const r = Blockly.JavaScript.valueToCode(this, 'r', Blockly.JavaScript.ORDER_ATOMIC);
        const g = Blockly.JavaScript.valueToCode(this, 'g', Blockly.JavaScript.ORDER_ATOMIC);
        const b = Blockly.JavaScript.valueToCode(this, 'b', Blockly.JavaScript.ORDER_ATOMIC);
        // console.log(`rgb(${r}, ${g}, ${b})`);
        const hex = `#${colorConvert.rgb.hex(r, g, b)}`;
        this.setColour(hex);
      }
    },
    setValue(r, g, b) {
      for (const item of this.inputList) {
        if (item.connection !== null) {
          switch (item.name) {
            default:
              break;
            case 'r':
              item.connection.targetBlock().setFieldValue(r, 'NUM');
              break;
            case 'g':
              item.connection.targetBlock().setFieldValue(g, 'NUM');
              break;
            case 'b':
              item.connection.targetBlock().setFieldValue(b, 'NUM');
              break;
          }
        }
      }
    },
  };

  Blockly.Blocks.hsl_array = {
    init() {
      this.appendValueInput('h')
        .setCheck('Number')
        .appendField('H');
      this.appendValueInput('s')
        .setCheck('Number')
        .appendField('S');
      this.appendValueInput('l')
        .setCheck('Number')
        .appendField('L');
      this.setInputsInline(true);
      this.setOutput(true, 'Array');
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
    },
    onchange(event) {
      if (event.type === 'change' && isChildBlock(event.blockId, this)) {
        for (const item of this.inputList) {
          if (item.connection !== null) {
            const value = item.connection.targetBlock().getFieldValue('NUM');
            if (item.connection.targetBlock().type !== 'math_number') return;
            // console.log(`connection type: ${item.connection.targetBlock().type}`);
            switch (item.name) {
              default:
                break;
              case 'h':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 360), 'NUM');
                break;
              case 's':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 100), 'NUM');
                break;
              case 'l':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 100), 'NUM');
                break;
            }
          }
        }
        const h = Blockly.JavaScript.valueToCode(this, 'h', Blockly.JavaScript.ORDER_ATOMIC);
        const s = Blockly.JavaScript.valueToCode(this, 's', Blockly.JavaScript.ORDER_ATOMIC);
        const l = Blockly.JavaScript.valueToCode(this, 'l', Blockly.JavaScript.ORDER_ATOMIC);
        const hex = `#${colorConvert.hsl.hex(h, s, l)}`;
        // console.log(`rgb(${r}, ${g}, ${b})`);
        // this.setColour(BlocklyLib.rgb2hex(h, s, l));
        this.setColour(hex);
      }
    },
    setValue(r, g, b) {
      const hsl = colorConvert.rgb.hsl(r, g, b);
      for (const item of this.inputList) {
        if (item.connection !== null) {
          switch (item.name) {
            default:
              break;
            case 'h':
              item.connection.targetBlock().setFieldValue(hsl[0], 'NUM');
              break;
            case 's':
              item.connection.targetBlock().setFieldValue(hsl[1], 'NUM');
              break;
            case 'l':
              item.connection.targetBlock().setFieldValue(hsl[2], 'NUM');
              break;
          }
        }
      }
    },
  };

  Blockly.Blocks.control_grove_chainable_led_rgb = {
    blockCategory: 'GROVE',
    blockGroup: 'CHAINABLE_LED',
    groveType: 'CONTROL',
    groveID: 1,
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'],
        ['3', '3'], ['4', '4'], ['5', '5']]), 'pin')
        .appendField(Blockly.Msg.GROVE_LED);
      this.appendValueInput('number')
      .setCheck('Number')
      .appendField(Blockly.Msg.NUMBER);
      this.appendValueInput('value')
        .appendField('RGB')
        .setCheck('Array');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onStop() {
      const pin = this.getFieldValue('pin');
      if (pin === 'null') return;
      for (const item of this.inputList) {
        if (item.connection !== null) {
          const value = item.connection.targetBlock().getFieldValue('NUM');
          if (item.connection.targetBlock().type !== 'math_number') return;
          // console.log(`connection type: ${item.connection.targetBlock().type}`);
          switch (item.name) {
            default:
              break;
            case 'number':
              window.Grove.control(Number(pin), [value - 1, [0, 0, 0]]);
              break;
          }
        }
      }
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
    onConnect() {
      this.onCreate();
    },
    onchange(event) {
      if (event.type === 'change' && event.blockId === this.id) {
        changeGrovePIN(this, event);
      }
      else if (event.type === 'change' && isChildBlock(event.blockId, this)) {
        for (const item of this.inputList) {
          if (item.connection !== null) {
            const value = item.connection.targetBlock().getFieldValue('NUM');
            if (item.connection.targetBlock().type !== 'math_number') return;
            // console.log(`connection type: ${item.connection.targetBlock().type}`);
            switch (item.name) {
              default:
                break;
              case 'number':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 16), 'NUM');
                break;
            }
          }
        }
      }
    },
    setValue(r, g, b) {
      for (const item of this.inputList) {
        if (item.connection !== null) {
          switch (item.name) {
            default:
              break;
            case 'value':
              item.connection.targetBlock().setValue(r, g, b);
              break;
          }
        }
      }
    },
  };

  Blockly.Blocks.control_grove_chainable_led_hsl = {
    blockCategory: 'GROVE',
    blockGroup: 'CHAINABLE_LED',
    groveType: 'CONTROL',
    groveID: 1,
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'],
          ['3', '3'], ['4', '4'], ['5', '5']]), 'pin')
        .appendField(Blockly.Msg.GROVE_LED);
      this.appendValueInput('number')
        .setCheck('Number')
        .appendField(Blockly.Msg.NUMBER);
      this.appendValueInput('value')
        .appendField('HSL')
        .setCheck('Array');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onStop() {
      const pin = this.getFieldValue('pin');
      if (pin === 'null') return;
      for (const item of this.inputList) {
        if (item.connection !== null) {
          const value = item.connection.targetBlock().getFieldValue('NUM');
          if (item.connection.targetBlock().type !== 'math_number') return;
          // console.log(`connection type: ${item.connection.targetBlock().type}`);
          switch (item.name) {
            default:
              break;
            case 'number':
              window.Grove.control(Number(pin), [value - 1, [0, 0, 0]]);
              break;
          }
        }
      }
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
    onConnect() {
      this.onCreate();
    },
    onchange(event) {
      if (event.type === 'change' && event.blockId === this.id) {
        changeGrovePIN(this, event);
      }
      else if (event.type === 'change' && isChildBlock(event.blockId, this)) {
        for (const item of this.inputList) {
          if (item.connection !== null) {
            const value = item.connection.targetBlock().getFieldValue('NUM');
            if (item.connection.targetBlock().type !== 'math_number') return;
            // console.log(`connection type: ${item.connection.targetBlock().type}`);
            switch (item.name) {
              default:
                break;
              case 'number':
                item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, 0), 16), 'NUM');
                break;
            }
          }
        }
      }
    },
    setValue(r, g, b) {
      for (const item of this.inputList) {
        if (item.connection !== null) {
          switch (item.name) {
            default:
              break;
            case 'value':
              item.connection.targetBlock().setValue(r, g, b);
              break;
          }
        }
      }
    },
  };

  Blockly.Blocks.get_grove_button = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['3', '3'], ['4', '4'], ['5', '5'],
        ]), 'pin')
        .appendField(Blockly.Msg.GROVE_BUTTON)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.KEY_DOWN, 'DOWN'], [Blockly.Msg.KEY_UP, 'UP']]), 'hold');
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'BUTTON',
    groveType: 'SENSOR',
    groveID: 2,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_slide = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['1', '1'], ['2', '2'],
        ]), 'pin')
        .appendField(Blockly.Msg.GROVE_POTENTIOMETER);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'SLIDE_POTENTIOMETER',
    groveType: 'SENSOR',
    groveID: 3,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.grove_slided_to = {
    init() {
      this.appendDummyInput()
      .appendField(Blockly.Msg.PIN)
      .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['1', '1'], ['2', '2'],
      ]), 'pin')
      .appendField(Blockly.Msg.GROVE_SLIDED_TO)
      .appendField(new Blockly.FieldDropdown([['GND', 'GND'], ['VCC', 'VCC']]), 'target');
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'SLIDE_POTENTIOMETER',
    groveType: 'SENSOR',
    groveID: 3,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.control_grove_slide_led = {
    init() {
      this.appendDummyInput()
      .appendField(Blockly.Msg.PIN)
      .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['1', '1'], ['2', '2'],
      ]), 'pin')
      .appendField(Blockly.Msg.GROVE_SLIDE_LED)
      .appendField(new Blockly.FieldDropdown([['ON', 'V1'], ['OFF', 'V0']]), 'turn');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'SLIDE_POTENTIOMETER',
    groveType: 'SENSOR',
    groveID: 3,
    onStop() {
      const pin = this.getFieldValue('pin');
      if (pin === 'null') return;
      window.Grove.control(Number(pin), 'V0');
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_rotary = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['1', '1'], ['2', '2'],
        ]), 'pin')
        .appendField(Blockly.Msg.GROVE_GET_ROTARY);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'ROTARY_ANGLE',
    groveType: 'SENSOR',
    groveID: 6,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.grove_rotary_to = {
    init() {
      this.appendDummyInput()
      .appendField(Blockly.Msg.PIN)
      .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['1', '1'], ['2', '2'],
      ]), 'pin')
      .appendField(Blockly.Msg.GROVE_SLIDED_TO)
      .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_MIN, 'MIN'], [Blockly.Msg.GROVE_MAX, 'MAX']]), 'target');
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'ROTARY_ANGLE',
    groveType: 'SENSOR',
    groveID: 6,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_light = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['1', '1'], ['2', '2'],
        ]), 'pin')
        .appendField(Blockly.Msg.GROVE_LIGHT_LEVEL);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'LIGHT',
    groveType: 'SENSOR',
    groveID: 5,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_air = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['1', '1'], ['2', '2'],
        ]), 'pin')
        .appendField(Blockly.Msg.GROVE_AIR_QUALITY);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'AIR_QUAILITY',
    groveType: 'SENSOR',
    groveID: 7,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_sound = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['1', '1'], ['2', '2'],
        ]), 'pin')
        .appendField(Blockly.Msg.GROVE_SOUND_LEVEL);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'SOUND',
    groveType: 'SENSOR',
    groveID: 8,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_emg = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['1', '1'], ['2', '2'],
        ]), 'pin')
        .appendField(Blockly.Msg.GROVE_EMG_DETECTOR);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'EMG_DETECTOR',
    groveType: 'SENSOR',
    groveID: 20,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_accelerometer = {
    blockCategory: 'GROVE',
    blockGroup: 'ACCELEROMETER_COMPASS',
    groveType: 'SENSOR',
    groveID: 9,
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
        .appendField(Blockly.Msg.GROVE_ACCELEROMETER)
        .appendField(new Blockly.FieldDropdown([['X', 'X'], ['Y', 'Y'], ['Z', 'Z']]), 'axis');
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.get_grove_compass = {
    blockCategory: 'GROVE',
    blockGroup: 'ACCELEROMETER_COMPASS',
    groveType: 'SENSOR',
    groveID: 9,
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
        .appendField(Blockly.Msg.GROVE_COMPASS);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.control_grove_vibration = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['3', '3'], ['4', '4'], ['5', '5'],
        ['8', '8'], ['9', '9']]), 'pin')
        .appendField(Blockly.Msg.GROVE_VIBRATION_MOTOR);
      this.appendValueInput('on')
        .setCheck('Boolean');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'VIBRATION_MOTOR',
    groveType: 'CONTROL',
    groveID: 4,
    onStop() {
      const pin = this.getFieldValue('pin');
      if (pin === 'null') return;
      window.Grove.control(Number(pin), 'V0');
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
    onConnect() {
      this.onCreate();
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
  };

  Blockly.Blocks.get_grove_line_finder = {
    init() {
      this.appendDummyInput()
        .appendField(Blockly.Msg.PIN)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.GROVE_CHOOSE, 'null'], ['3', '3'], ['4', '4'], ['5', '5'],
        ['8', '8'], ['9', '9']]), 'pin')
        .appendField(Blockly.Msg.GROVE_LINE_FINDER);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'LINE_FINDER',
    groveType: 'SENSOR',
    groveID: 18,
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onConnect() {
      this.onCreate();
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
  };

  Blockly.Blocks.control_grove_oled = {
    init() {
      this.appendValueInput('pixels')
      .setCheck('Array')
      .appendField(Blockly.Msg.PIN)
      .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
      .appendField(Blockly.Msg.GROVE_OLED_SHOW_PIXELS);
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'OLED_DISPLAY',
    groveType: 'CONTROL',
    groveID: 21,
    onStop() {
      const pin = this.getFieldValue('pin');
      if (pin === 'null') return;
      window.Grove.control(Number(pin), '');
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
    onConnect() {
      this.onCreate();
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
    setValue(pixelData, base64) {
      const children = this.getChildren();
      for (const child of children) {
        if (child.type === 'pixels') {
          child.setValue(pixelData, base64);
        }
      }
    },
  };

  Blockly.Blocks.control_grove_oled_clear = {
    init() {
      this.appendDummyInput()
      .appendField(Blockly.Msg.PIN)
      .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
      .appendField(Blockly.Msg.GROVE_OLED_HIDE_PIXELS);
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'OLED_DISPLAY',
    groveType: 'CONTROL',
    groveID: 21,
    onStop() {
      // const pin = this.getFieldValue('pin');
      // if (pin === 'null') return;
      // window.Grove.control(Number(pin), '');
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
    onConnect() {
      this.onCreate();
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
  };

  Blockly.Blocks.pixels = {
    init() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldImage(defaultPixelsData.base64, 120, 60, '*'), 'preview');
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setOutput(true, null);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
    },
    setValue(pixelData, base64) {
      this.data = pixelData;
      // console.log(`base64: ${base64}`);
      // console.log(`preview: ${this.getFieldValue('preview')}`);
      this.setFieldValue(base64, 'preview');
    },
  };

  Blockly.Blocks.control_grove_lcd_display = {
    init() {
      this.appendValueInput('text')
      .setCheck('String')
      .appendField(Blockly.Msg.PIN)
      .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
      .appendField(Blockly.Msg.GROVE_LCD_DISPLAY)
      .appendField(Blockly.Msg.LINE)
      .appendField(new Blockly.FieldDropdown([['1', '0'], ['2', '1']]), 'line');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'LCD_DISPLAY',
    groveType: 'CONTROL',
    groveID: 17,
    onStop() {
      const pin = this.getFieldValue('pin');
      if (pin === 'null') return;
      window.Grove.control(Number(pin), 'T2');
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
    onConnect() {
      this.onCreate();
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
  };

  Blockly.Blocks.ascii_text = {
    init() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldTextInput('hello'), 'text');
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setOutput(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    onCreate() {
      checkDisableGrove(this);
    },
    onchange(event) {
      if (event.type === 'change' && event.blockId === this.id) {
        if (event.name === 'text' && event.element === 'field') {
          let text = this.getFieldValue('text');
          if (!BlocklyLib.isAsciiOnly(text)) {
            this.setFieldValue(event.oldValue, 'text');
          }
          if (text.length > 16) {
            text = text.substring(0, 16);
            this.setFieldValue(text, 'text');
          }
        }
      }
    },
  };

  Blockly.Blocks.control_grove_lcd_display_clear = {
    init() {
      this.appendDummyInput()
      .appendField(Blockly.Msg.PIN)
      .appendField(new Blockly.FieldDropdown([['I2C', '0']]), 'pin')
      .appendField(Blockly.Msg.GROVE_LCD_DISPLAY_CLEAR);
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BlocklyDefaultColor.COLOR_GROVE);
      this.setTooltip('');
      this.setHelpUrl('');
      checkDisableGrove(this);
    },
    blockCategory: 'GROVE',
    blockGroup: 'LCD_DISPLAY',
    groveType: 'CONTROL',
    groveID: 17,
    onStop() {
      // const pin = this.getFieldValue('pin');
      // if (pin === 'null') return;
      // window.Grove.control(Number(pin), 'V0');
    },
    onCreate() {
      checkDisableGrove(this);
      createGroveBlock(this);
    },
    onDelete(xml) {
      releaseGrovePIN(xml, this.blockGroup);
    },
    onDisabled(disabled) {
      disableGrove(this, disabled);
    },
    onExit() {
      this.onDelete();
    },
    onConnect() {
      this.onCreate();
    },
    onchange(event) {
      changeGrovePIN(this, event);
    },
  };

  /** ***************************************** Leap Motion ******************************************/

  Blockly.Blocks.event_leap_gesture = {
    init() {
      this.appendDummyInput()
        .appendField('Leap Motion Gesture');
      this.appendStatementInput('statement')
        .setCheck(null)
        .appendField(new Blockly.FieldDropdown([['circle', 'circle'],
          ['keyTap', 'keyTap'], ['screenTap', 'screenTap'], ['swipe', 'swipe']]), 'gesture');
      this.setInputsInline(false);
      this.setColour(BlocklyDefaultColor.COLOR_EVENT);
      this.setTooltip('');
      this.setHelpUrl('');
    },
  };
}

export default initBlocklyDefine;
