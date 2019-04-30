function initBlocklyCode(Blockly, genFuncCode) {
  Blockly.JavaScript.wait_until = (block) => {
    const condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { condition };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.position = (block) => {
    const x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
    const y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
    const z = Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { x, y, z };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.move_to = (block) => {
    const position = Blockly.JavaScript.valueToCode(block, 'position', Blockly.JavaScript.ORDER_ATOMIC);
    // console.log(`position: ${position}`);
    const params = { position };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.move = (block) => {
    const orientation = block.getFieldValue('orientation');
    const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { orientation, value };
    return genFuncCode(params, block);
  };

  // Blockly.JavaScript.stretch = (block) => {
  //   const orientation = block.getFieldValue('orientation');
  //   const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
  //   const params = { orientation, value };
  //   return genFuncCode(params, block);
  // };

  Blockly.JavaScript.base_turn = (block) => {
    // const orientation = block.getFieldValue('orientation');
    const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { value };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.set_pump = (block) => {
    const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { value: value === undefined ? false : value };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.set_gripper = (block) => {
    const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { value: value === undefined ? false : value };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.wrist_turn = (block) => {
    // const orientation = block.getFieldValue('orientation');
    const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
    // const params = { value, orientation };
    const params = { value };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.wait = (block) => {
    const value = Blockly.JavaScript.valueToCode(block, 'sec', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { value: value || 0 };
    return genFuncCode(params, block);
  };

  // Blockly.JavaScript.servo_angle = (block) => {
  //   const value = block.getFieldValue('angle');
  //   // console.log(`servo_angle: angle ${JSON.parse(value)}`);
  //   const params = { value };
  //   return genFuncCode(params, block);
  // };

  Blockly.JavaScript.ON = (block) => {
    const checkboxON = block.getFieldValue('on_off') === 'TRUE';
    const params = { checkboxON };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.set_buzzer = (block) => {
    const frequency = Blockly.JavaScript.valueToCode(block, 'frequency', Blockly.JavaScript.ORDER_ATOMIC);
    const duration = Blockly.JavaScript.valueToCode(block, 'duration', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { frequency, duration };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.buzzer_beats = (block) => {
    const beat = block.getFieldValue('beat');
    const params = { beat };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.buzzer_notes = (block) => {
    const note = block.getFieldValue('note');
    const params = { note };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.set_speed = (block) => {
    const speed = block.getFieldValue('speed');
    const params = { speed };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.reset = block => genFuncCode(null, block);

  /* ******************************* Repeat ********************************************************************/
  Blockly.JavaScript.loop_run_forever = (block) => {
    const statement = Blockly.JavaScript.statementToCode(block, 'statement');
    const params = { statement };
    return genFuncCode(params, block);
  };
  // Blockly.JavaScript.loop_repeat_times = (block) => {
  //   const times = Blockly.JavaScript.valueToCode(block, 'times', Blockly.JavaScript.ORDER_ATOMIC);
  //   const statement = Blockly.JavaScript.statementToCode(block, 'statement');
  //   const params = { times, statement };
  //   return genFuncCode(params, block);
  // };
  // Blockly.JavaScript.loop_repeat_while = (block) => {
  //   const condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC);
  //   const statement = Blockly.JavaScript.statementToCode(block, 'statement');
  //   const type = block.getFieldValue('type');
  //   const params = { condition, statement, type };
  //   return genFuncCode(params, block);
  // };

  Blockly.JavaScript.loop_break = block => genFuncCode(null, block);
  /* ******************************* Condition ********************************************************************/

  Blockly.JavaScript.condition_tip_sensor = (block) => {
    const params = {};
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.condition_face_detection = (block) => {
    const params = {};
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.condition_key_pressed = (block) => {
    const keycode = block.getFieldValue('keycode');
    const params = { keycode };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.condition_current_position = (block) => {
    const axis = block.getFieldValue('axis');
    const params = { axis };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.condition_button_pressed = (block) => {
    const button_id = block.getFieldValue('button_id');
    const params = { button_id };
    return genFuncCode(params, block);
  };
  /* ******************************* Studio Only ********************************************************************/

  Blockly.JavaScript.console = (block) => {
    const msg = Blockly.JavaScript.valueToCode(block, 'msg', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { msg };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.event_keypressed = (block) => {
    const keycode = block.getFieldValue('keycode');
    const statement = Blockly.JavaScript.statementToCode(block, 'statement');
    const params = { keycode, statement };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.event_keypressed_stop = block => genFuncCode(null, block);

  Blockly.JavaScript.event_tip_sensor = (block) => {
    const statement = Blockly.JavaScript.statementToCode(block, 'statement');
    const params = { statement };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.event_tip_sensor_stop = block => genFuncCode(null, block);

  Blockly.JavaScript.event_face_detection = (block) => {
    const statement = Blockly.JavaScript.statementToCode(block, 'statement');
    const params = { statement };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.event_face_detection_stop = block => genFuncCode(null, block);

  Blockly.JavaScript.studio_play_recording = (block) => {
    const filename = block.getFieldValue('filename');
    // const speed = block.getFieldValue('speed');
    const params = { filename };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.event_button_pressed = (block) => {
    const value = block.getFieldValue('button_id');
    const statement = Blockly.JavaScript.statementToCode(block, 'statement');
    const params = { value, statement };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.event_button_pressed_stop = block => genFuncCode(null, block);

  /* ******************************* Grove ********************************************************************/
  Blockly.JavaScript.get_grove_color = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.grove_color_hue_range = (block) => {
    const pin = block.getFieldValue('pin');
    const min = Blockly.JavaScript.valueToCode(block, 'min', Blockly.JavaScript.ORDER_ATOMIC);
    const max = Blockly.JavaScript.valueToCode(block, 'max', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { pin, min, max };
    return genFuncCode(params, block);
  };

  // Blockly.JavaScript.grove_color_in_hue_range = (block) => {
  //   const color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  //   const color_range = Blockly.JavaScript.valueToCode(block, 'color_range', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
  //   const params = { color, color_range };
  //   return genFuncCode(params, block);
  // };

  Blockly.JavaScript.color_hue = (block) => {
    const hue = block.getFieldValue('hue');
    const params = { hue };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.grove_gesture_type = (block) => {
    const pin = block.getFieldValue('pin');
    const gesture = block.getFieldValue('gesture');
    const params = { pin, gesture };
    return genFuncCode(params, block);
  };


  Blockly.JavaScript.get_grove_gesture = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_ultrasonic = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_temperature = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_humidity = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_pir_motion = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.control_grove_fan = (block) => {
    const speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
    const pin = block.getFieldValue('pin');
    const params = { speed, pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.stop_grove_fan = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.control_grove_electromagnet = (block) => {
    const pin = block.getFieldValue('pin');
    const on = Blockly.JavaScript.valueToCode(block, 'on', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { on, pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.control_grove_chainable_led_rgb = (block) => {
    const pin = block.getFieldValue('pin');
    const number = Blockly.JavaScript.valueToCode(block, 'number', Blockly.JavaScript.ORDER_ATOMIC);
    const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ASSIGNMENT) || '[]';
    const params = { number, value, pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.control_grove_chainable_led_hsl = (block) => {
    const pin = block.getFieldValue('pin');
    const number = Blockly.JavaScript.valueToCode(block, 'number', Blockly.JavaScript.ORDER_ATOMIC);
    const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ASSIGNMENT) || '[]';
    const params = { number, value, pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.rgb_array = (block) => {
    const r = Blockly.JavaScript.valueToCode(block, 'r', Blockly.JavaScript.ORDER_ATOMIC);
    const g = Blockly.JavaScript.valueToCode(block, 'g', Blockly.JavaScript.ORDER_ATOMIC);
    const b = Blockly.JavaScript.valueToCode(block, 'b', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { r, g, b };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.hsl_array = (block) => {
    const h = Blockly.JavaScript.valueToCode(block, 'h', Blockly.JavaScript.ORDER_ATOMIC);
    const s = Blockly.JavaScript.valueToCode(block, 's', Blockly.JavaScript.ORDER_ATOMIC);
    const l = Blockly.JavaScript.valueToCode(block, 'l', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { h, s, l };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_button = (block) => {
    const pin = block.getFieldValue('pin');
    const hold = block.getFieldValue('hold');
    const params = { pin, hold };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.grove_slided_to = (block) => {
    const pin = block.getFieldValue('pin');
    const target = block.getFieldValue('target');
    const params = { pin, target };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_slide = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.control_grove_slide_led = (block) => {
    const pin = block.getFieldValue('pin');
    const turn = block.getFieldValue('turn');
    const params = { pin, turn };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_rotary = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.grove_rotary_to = (block) => {
    const pin = block.getFieldValue('pin');
    const target = block.getFieldValue('target');
    const params = { pin, target };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_light = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_air = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_sound = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_emg = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_accelerometer = (block) => {
    const pin = block.getFieldValue('pin');
    const axis = block.getFieldValue('axis');
    const params = { pin, axis };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_compass = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.get_grove_line_finder = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.control_grove_vibration = (block) => {
    const pin = block.getFieldValue('pin');
    const on = Blockly.JavaScript.valueToCode(block, 'on', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { on, pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.control_grove_oled = (block) => {
    const pin = block.getFieldValue('pin');
    const pixels = Blockly.JavaScript.valueToCode(block, 'pixels', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { pixels, pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.pixels = (block) => {
    const params = { data: block.data };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.control_grove_lcd_display = (block) => {
    const pin = block.getFieldValue('pin');
    const line = block.getFieldValue('line');
    const text = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { text, pin, line };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.ascii_text = (block) => {
    const text = block.getFieldValue('text');
    const params = { text };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.control_grove_lcd_display_clear = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.control_grove_oled_clear = (block) => {
    const pin = block.getFieldValue('pin');
    const params = { pin };
    return genFuncCode(params, block);
  };
  /* ******************************* Leap ********************************************************************/
  Blockly.JavaScript.event_leap_gesture = (block) => {
    const gesture = block.getFieldValue('gesture');
    const statement = Blockly.JavaScript.statementToCode(block, 'statement');
    const params = { gesture, statement };
    return genFuncCode(params, block);
  };
}

export default initBlocklyCode;
