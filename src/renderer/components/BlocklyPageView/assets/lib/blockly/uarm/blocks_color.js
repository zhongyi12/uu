

const BlocklyDefaultColor = {
  COLOR_MOTION: '#71CB8C',
  COLOR_GROVE: '#E37D7D',
  COLOR_EVENT: '#FFBE53',
  COLOR_INPUT: '#FFBE53',
  COLOR_CONDITION: '#FFBE53',
  COLOR_LOGIC: '#58C9B9',
  COLOR_LOOP: '#5A93D7',
  COLOR_MATH: '#94BD86',
  COLOR_LIST: '#B96BA7',
  COLOR_TEXT: '#FF8657',
  COLOR_ADVANCE: '#C65146',
  COLOR_VARIABLE: '#8283A7',
  COLOR_FUNCTION: '#E98CB1',
  COLOR_SOUND: '#6AAFE6',
};

function initBlocklyColor(Blockly) {
  Blockly.Msg.LOGIC_HUE = BlocklyDefaultColor.COLOR_LOGIC;
  Blockly.Msg.VARIABLES_HUE = BlocklyDefaultColor.COLOR_VARIABLE;
  Blockly.Msg.PROCEDURES_HUE = BlocklyDefaultColor.COLOR_FUNCTION;
  Blockly.Msg.LISTS_HUE = BlocklyDefaultColor.COLOR_LIST;
  Blockly.Msg.LOOPS_HUE = BlocklyDefaultColor.COLOR_LOOP;
  Blockly.Msg.MATH_HUE = BlocklyDefaultColor.COLOR_MATH;
  Blockly.Msg.TEXTS_HUE = BlocklyDefaultColor.COLOR_TEXT;

  Blockly.Blocks.lists.HUE = BlocklyDefaultColor.COLOR_LIST;
  Blockly.Blocks.procedures.HUE = BlocklyDefaultColor.COLOR_FUNCTION;
  Blockly.Blocks.texts.HUE = BlocklyDefaultColor.COLOR_TEXT;
}

export {
  initBlocklyColor,
  BlocklyDefaultColor,
};
