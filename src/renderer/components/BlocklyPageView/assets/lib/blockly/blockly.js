/* eslint-disable arrow-body-style */

/**
 * Created by alex on 2017/1/19.
 */
import Blockly from 'node-blockly/browser';
import initBlocklyCode from './uarm/blocks_code';
import CodeGenerator from './uarm/code_generator';
import initBlocklyDefine from './uarm/blocks_define';
import swal from 'sweetalert2';
import { transform } from 'babel-core';
import es2015 from 'babel-preset-es2015';
import transformRuntime from 'babel-plugin-transform-runtime';
import BlocklyLib from './uarm/blockly_lib';
import { BlocklyDefaultColor, initBlocklyColor } from './uarm/blocks_color';
import toolbox from './toolbox.xml';
import format from 'string-format';
import '../../css/blockly.scss';

function callOnDelete(blockXml) {
  let blockType;
  if (blockXml.nodeName.toLowerCase() === 'block') {
    for (const attr of blockXml.attributes) {
      // console.log(`${blockXml.nodeName} - name:${attr.name}, value:${attr.nodeValue}`);
      if (attr.name === 'type') blockType = attr.nodeValue;
    }
    if (blockType !== undefined) {
      if (Blockly.Blocks[blockType] !== undefined) {
        if (Blockly.Blocks[blockType].onDelete !== undefined) {
          Blockly.Blocks[blockType].onDelete(blockXml);
        }
      }
    }
  }
  if (blockXml.childNodes !== undefined) {
    // console.log(`${blockXml.nodeName} - childNodes: ${blockXml.childNodes.length}`);
    for (const child of blockXml.childNodes) {
      callOnDelete(child);
    }
    // console.log(`${blockXml.nodeName} - after get childs`);
  }
}

const onChangeEvent = (event) => {
  // console.log(event.type);
  // window.GlobalUtil.model.localBlocklyMgr.blocklyHideOrShow();
  const currBlock = Blockly.BlockWorkspace.getBlockById(event.blockId);
  if (currBlock !== null) {
    if (event.type === Blockly.Events.CREATE) {
      if (currBlock.onCreate !== undefined) {
        console.log(`oncreate: ${currBlock.type}`);
        if (!currBlock.isShadow()) currBlock.onCreate();
      }
    }
    else if (event.type === Blockly.Events.MOVE) {
      if (currBlock.onMove !== undefined) {
        currBlock.onMove();
      }
    }
    else if (event.type === Blockly.Events.CHANGE) {
      if (event.element === 'disabled') {
        if (currBlock.onDisabled !== undefined) {
          currBlock.onDisabled(event.newValue);
        }
      }
    }
  }
  if (event.type === Blockly.Events.DELETE) {
    // console.log(event.oldXml);
    console.log('Delete Event');
    callOnDelete(event.oldXml);
  }
};

function init(languageCode) {
  if (languageCode === 'cn') {
    const { initBlocklyMsg } = require('./i18n/cn');
    initBlocklyMsg(Blockly);
  }
  else {
    const { initBlocklyMsg } = require('./i18n/en');
    initBlocklyMsg(Blockly);
  }
  const formatKeys = {
    MSG: Blockly.Msg,
    COLOR: BlocklyDefaultColor,
  };
  const toolboxText = format(toolbox, formatKeys);
  Blockly.Version = '1.1';
  Blockly.BlockWorkspace = null;
  Blockly.Running = false;

  // Blockly End Events
  Blockly.EndEvents = [];

  Blockly.addEndListener = (callback) => {
    Blockly.EndEvents.push(callback);
  };

  Blockly.removeEndListener = (callback) => {
    const index = Blockly.EndEvents.indexOf(callback);
    if (index !== -1) Blockly.EndEvents.splice(index, 1);
  };

  // highlight block
  window.highlightBlock = (id) => {
    Blockly.BlockWorkspace.highlightBlock(id);
  };

  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  Blockly.HSV_SATURATION = 0.22;
  Blockly.HSV_VALUE = 0.65;
  console.log(`Blockly.Blocks.logic.HUE: ${Blockly.Constants.Logic.HUE}`);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if(!BlocklyLib.Blockly.Running) return;';

  // init Blockly
  initBlocklyDefine(Blockly);
  initBlocklyCode(Blockly, CodeGenerator);
  initBlocklyColor(Blockly);
  BlocklyLib.init(Blockly);
  window.BlocklyLib = BlocklyLib;

  Blockly.JavaScript.scrub_ = (block, code) => {
    const commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      // Collect comment for this block.
      // var comment = block.getCommentText();
      // if (comment) {
      //   commentCode += Blockly.JavaScript.prefixLines(comment, '// ') + '\n';
      // }
      // Collect comments for all value arguments.
      // Don't collect comments for nested statements.
      for (let x = 0; x < block.inputList.length; x++) {
        if (block.inputList[x].type === Blockly.INPUT_VALUE) {
          const childBlock = block.inputList[x].connection.targetBlock();
          if (childBlock) {
            // var comment = Blockly.JavaScript.allNestedComments(childBlock);
            // if (comment) {
            //   commentCode += Blockly.JavaScript.prefixLines(comment, '// ');
            // }
          }
        }
      }
    }
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = Blockly.JavaScript.blockToCode(nextBlock);
    return commentCode + code + nextCode;
  };

  Blockly.JavaScript.procedures_defnoreturn = (block) => {
    // Define a procedure with a return value.
    const funcName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    let branch = Blockly.JavaScript.statementToCode(block, 'STACK');
    if (Blockly.JavaScript.STATEMENT_PREFIX) {
      branch = Blockly.JavaScript.prefixLines(
        Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g, `'${block.id}a'`), Blockly.JavaScript.INDENT) + branch;
    }
    if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
      branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g, `'${block.id}a'`) + branch;
    }
    let returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN',
      Blockly.JavaScript.ORDER_NONE) || '';
    if (returnValue) {
      // returnValue = '  return ' + returnValue + ';\n';
      returnValue = `  return ${returnValue};\n`;
    }
    const args = [];
    for (let x = 0; x < block.arguments_.length; x++) {
      args[x] = Blockly.JavaScript.variableDB_.getName(block.arguments_[x],
        Blockly.Variables.NAME_TYPE);
    }
    // let code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
    //   branch + returnValue + '}';
    let code = `function ${funcName}(${args.join(', ')}) {\n${branch}${returnValue}}`;
    code = Blockly.JavaScript.scrub_(block, code);
    if (code.indexOf('await ') !== -1) {
      code = `async ${code}`;
    }
    Blockly.JavaScript.definitions_[funcName] = code;
    return null;
  };

  if (Blockly.JavaScript._procedures_callnoreturn === undefined) {
    Blockly.JavaScript._procedures_callnoreturn = Blockly.JavaScript.procedures_callnoreturn;
  }
  Blockly.JavaScript.procedures_callnoreturn = (block) => {
    // Call a procedure with no return value.
    const funcName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    const code = Blockly.JavaScript._procedures_callnoreturn.call(Blockly.JavaScript, block);
    const defs = Blockly.JavaScript.definitions_;
    if (defs[funcName] && defs[funcName].indexOf('async ') === 0) {
      return `await ${code}`;
    }
    return code;
  };

  if (Blockly.JavaScript._procedures_callreturn === undefined) {
    Blockly.JavaScript._procedures_callreturn = Blockly.JavaScript.procedures_callreturn;
  }

  Blockly.JavaScript.procedures_callreturn = (block) => {
    // Call a procedure with a return value.
    const funcName = Blockly.JavaScript.constiableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    const codes = Blockly.JavaScript._procedures_callreturn.call(Blockly.JavaScript, block);
    const defs = Blockly.JavaScript.definitions_;
    if (defs[funcName] && defs[funcName].indexOf('async ') === 0) {
      return [`await ${codes[0]}`, codes[1]];
    }
    return codes;
  };

  // Blockly.JavaScript._procedures_callnoreturn = Blockly.JavaScript.procedures_callnoreturn;

  if (Blockly.JavaScript._workspaceToCode === undefined) {
    Blockly.JavaScript._workspaceToCode = Blockly.JavaScript.workspaceToCode;
  }

  Blockly.JavaScript.workspaceToCode = (workspace) => {
    let code = Blockly.JavaScript._workspaceToCode.call(Blockly.JavaScript, workspace);
    // code += 'reachCodeEnding();';
    if (code.indexOf('await ') === -1) {
      code = code.replace(new RegExp('async function', 'g'), 'function');
    }
    else {
      code = `(async function () {\n\n${code}\n}());`;
    }
    return code;
  };

  Blockly.generateCode = () => {
    if (Blockly.BlockWorkspace !== null) {
      const count = Blockly.BlockWorkspace.getAllBlocks().length;
      if (count <= 0) {
        return '';
      }
      return Blockly.JavaScript.workspaceToCode(Blockly.BlockWorkspace);
    }
    return '';
  };

  // window.reachCodeEnding = () => {
  //   // Blockly.Running = false;
  //   // console.log('Stop');
  //   if (!Blockly.containEventBlock()) {
  //     console.log('Blockly-Stop');
  //     Blockly.EndEvents.forEach((item) => {
  //       item();
  //     });
  //   }
  //   else {
  //     console.log('Blockly-Event-no-stop');
  //   }
  // };

  Blockly.generateXML = (save) => {
    if (Blockly.BlockWorkspace !== null) {
      if (save && Blockly.Running) Blockly.setBlocksDeletable(true);
      const xmlDom = Blockly.Xml.workspaceToDom(Blockly.BlockWorkspace);
      // const version = xmlDom.getAttribute('version');
      // console.log(`Blockly: ${version}`);
      // xmlDom.setAttribute('version', Blockly.Version);
      const prettyText = Blockly.Xml.domToPrettyText(xmlDom);
      if (save && Blockly.Running) Blockly.setBlocksDeletable(false);
      return prettyText;
    }
    return '';
  };

  Blockly.exportXMLtoSave = () => {
    if (Blockly.Running) {
      Blockly.setBlocksDeletable(true);
    }
  };

  function loadWorkspace(xmlDom, disableEvent) {
    Blockly.BlockWorkspace.removeChangeListener(disableEvent);
    Blockly.Xml.domToWorkspace(xmlDom, Blockly.BlockWorkspace);
    Blockly.setBlocksDeletable(true);
    setTimeout(() => {
      Blockly.BlockWorkspace.addChangeListener(disableEvent);
      // Blockly.Events.enable();
    }, 1000);
  }

  Blockly.loadWorkspace = (xmlText, disableEvent) => {
    const xmlDom = Blockly.Xml.textToDom(xmlText);
    loadWorkspace(xmlDom, disableEvent);
    // const version = xmlDom.getAttribute('version');
    // if (version !== Blockly.Version) {
    //   Blockly.messageBox('confirm', Blockly.Msg.MSG_CONFIRM, Blockly.Msg.VERSION_INCOMPATIBLE).then(() => {
    //     loadWorkspace(xmlDom, disableEvent);
    //     return;
    //   });
    // }
    // else {
    //   loadWorkspace(xmlDom, disableEvent);
    // }
  };

  /* eslint-disable no-eval */
  Blockly.executeCode = () => {
    return new Promise((resolve, reject) => {
      const code = Blockly.generateCode();
      // transform ES2015 code to ES5
      const _code = transform(code, {
        presets: [es2015],
        plugins: [transformRuntime],
      }).code;
      try {
        Blockly.Running = true;
        eval(_code);
        resolve();
      }
      catch (e) {
        console.log(`Error when RunCode: ${e.toString()}`);
        reject(e.toString());
        Blockly.Running = false;
      }
    });
  };

  /** Override Blockly.alert() with custom implementation. */
  Blockly.alert = (message) => {
    swal({
      title: 'Alert!',
      text: message,
    });
  };

  /** Override Blockly.confirm() with custom implementation. */
  Blockly.confirm = (message, callback) => {
    // console.log(`Confirm: ${message}`);
    swal({
      title: 'Confirm',
      text: message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK',
    }).then(() => {
      callback(true);
    }, (dismiss) => {
      if (dismiss === 'cancel') {
        callback(false);
      }
    });
  };

  /** Override Blockly.prompt() with custom implementation. */
  Blockly.prompt = (message, defaultValue, callback) => {
    swal({
      title: message,
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    }).then((text) => {
      callback(text);
    }, (dismiss) => {
      if (dismiss === 'cancel') {
        callback(false);
      }
    });
  };

  Blockly.initBlockly = (blocklyDiv) => {
    Blockly.BlockWorkspace = Blockly.inject(blocklyDiv, {
      media: './media/',
      toolbox: toolboxText,
      zoom: {
        controls: true,
        wheel: false,
      },
      grid: {
        spacing: 25,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
    });
    setTimeout(() => {
      Blockly.BlockWorkspace.addChangeListener(onChangeEvent);
    }, 1000);
  };

  Blockly.containEventBlock = () => {
    if (Blockly.BlockWorkspace !== null) {
      const blocks = Blockly.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.type.startsWith('event') || block.type.startsWith('loop')) return true;
      }
    }
    return false;
  };

  Blockly.onUArmConnect = () => {
    if (Blockly.BlockWorkspace !== null) {
      const blocks = Blockly.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.onConnect) block.onConnect();
      }
    }
  };
  Blockly.onBlocklyProjectLoad = () => {
    if (Blockly.BlockWorkspace !== null) {
      const blocks = Blockly.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.onCreate) block.onCreate();
      }
    }
  };
  Blockly.onBlocklyProjectStart = () => {
    if (Blockly.BlockWorkspace !== null) {
      const blocks = Blockly.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.onStart) block.onStart();
      }
    }
  };
  Blockly.onBlocklyProjectStop = () => {
    if (Blockly.BlockWorkspace !== null) {
      const blocks = Blockly.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.onStop) block.onStop();
      }
    }
  };
  Blockly.onBlocklyProjectExit = () => {
    if (Blockly.BlockWorkspace !== null) {
      const blocks = Blockly.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.onExit) block.onExit();
      }
    }
  };
  Blockly.setBlocksDeletable = (deletable) => {
    if (Blockly.BlockWorkspace !== null) {
      const blocks = Blockly.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        block.setDeletable(deletable);
      }
    }
  };
  Blockly.messageBox = (type, title, text) => new Promise((resolve, reject) => {
    if (type === 'confirm') {
      swal({
        title,
        text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: Blockly.Msg.MSG_CONFIRM,
      }).then(resolve).catch(reject);
    }
    else {
      swal({
        type,
        title,
        text,
      }).then(resolve);
    }
  });
}

module.exports = {
  Blockly,
  init,
};
