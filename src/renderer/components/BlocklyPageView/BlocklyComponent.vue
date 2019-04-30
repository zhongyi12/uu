<template>
<div class="blockly-wrapper" v-bind:class="{notfull: !toggleSideVisible||sideToggle}">
  <!-- <button style="position:absolute;top:100px;left:100px;width:80px;height:30px;background:yellow;z-index:2000;opacity:0.5;" @click="enablegrov">enable</button>
  <button style="position:absolute;top:150px;left:100px;width:80px;height:30px;background:yellow;z-index:2000;opacity:0.5;" @click="disablegrov">disable</button> -->
  <div class="tabs-bar">
    <mu-tabs :value="activeTab" @change="handleTabChange" class="tabs">
      <mu-tab :value="constData.tabName.BLOCKS" title="Blocks" />
      <mu-tab :value="constData.tabName.JS" title="Javascript" />
      <mu-tab :value="constData.tabName.XML" title="XML" />
    </mu-tabs>
    <div class="tab-title">
      <!--<mu-flat-button :label="displayProjectTitle" class="demo-flat-button" @click="renameProject()" />-->
      <span class="demo-flat-button" @click="renameProject()">{{ displayProjectTitle }}</span>
      <span v-if="!blocklyData.projectSaveStatus">{{$t('editStatus')}}</span>
    </div>
<DeviceConnectionComponent></DeviceConnectionComponent>
  </div>
  <div id="blockly-area" class="blockly-workspace" tabindex="0">
    <div id="tab-blocks" v-show="activeTab === constData.tabName.BLOCKS"></div>
    <div id="tab-js" v-show="activeTab === constData.tabName.JS" class="content-code">
      <pre v-html="jsCode"></pre>
    </div>
    <div id="tab-xml" v-show="activeTab === constData.tabName.XML" class="content-code">
      <pre v-html="xmlCode"></pre>
    </div>
  </div>
<BlockDialogComponent :blocklyData="blocklyData" :moduleName="moduleName"></BlockDialogComponent>

  <div class="toggle-button-fixed" @click="toggleSideClick()" v-show="toggleSideVisible">
    <img v-if="sideToggle" src="../assets/img/toggle_off.svg" alt="hide side bar" />
    <img v-else src="../assets/img/toggle_on.svg" alt="hide side bar" />
  </div>
</div>
</template>
<script>
import { Blockly, init as initBlockly } from './assets/lib/blockly/blockly';
import BlocklyLib from './assets/lib/blockly/uarm/blockly_lib';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import _ from 'lodash';
import eventBus from './eventBus';
import swal from 'sweetalert2';
import beautify from 'js-beautify';
import BlockDialogComponent from './BlockDialogComponent.vue';
import DeviceConnectionComponent from '../CommonPageView/DeviceConnectionComponent.vue';
import eventBusComm from '../CommonPageView/eventBus';
module.exports = {
  props: ['blocklyData', 'moduleName'],
  i18n: {
    messages: {
      en: {
        untitledProject: 'Untitled Project',
        editStatus: 'edited',
      },
      cn: {
        untitledProject: '未命名',
        editStatus: '正在编辑',
      },
    },
  },
  components: {
    BlockDialogComponent,
    DeviceConnectionComponent,
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      constData: {
        tabName: {
          JS: 'Javascript',
          XML: 'XML',
          BLOCKS: 'Blocks',
        },
        untitledProject: this.$t('untitledProject'),
      },
      uiData: {
        snackbar: false,
        snackbarMessage: '',
        projectNameEdit: false,
      },
      activeTab: null,
      projectNameEditing: false,
      currentBlock: null,
      // currentBlockTemp: null,
      currentBlockId: 0,
      sideToggle: true,
      toggleSideVisible: true,
      tagCount: -1,
// 提示框暂存
    };
  },
  activated: function() {
    // this.model.localBlocklyMgr.blocklyHideOrShow();
    console.log('blockly activated');
    // Blockly.onBlocklyProjectLoad();
    if (Blockly.BlockWorkspace !== null) {
      const blocks = Blockly.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block && block.onCreate && block.type.includes('grove')) {
          block.onCreate();
        }
      }
    }
  },
  deactivated: function() {
    console.log('blockly deactivated');
    // Blockly.onBlocklyProjectExit();
    window.UArm.Grove.stopAllGroves();
    // if (Blockly.BlockWorkspace !== null) {
    //   const blocks = Blockly.BlockWorkspace.getAllBlocks();
    //   for (const block of blocks) {
    //     if (block && block.onCreate && block.type.includes('grove')) {
    //       block.onExit();
    //     }
    //   }
    // }
  },
  beforeDestroy() {
    Blockly.removeEndListener(this.endCallback);
    window.removeEventListener('resize', self.resizeWorkspace, false); // avoid fire event listener twice or more
    Blockly.BlockWorkspace.removeChangeListener(self.onChangeEvent);
    this.model.localBlocklyMgr.blockly = null;
    eventBus.$off();
    eventBusComm.$off();
  },
  mounted() {
    const self = this;
    if (this.uarmConnectStatus) {
      window.UArm.set_acceleration({
        printingMoves: 200,
        travelMoves: 200,
        retractMoves: 200,
      });
    }
    // init Blockly
    this.initBlocklyDiv().then(() => {
      self.resizeWorkspace();
      this.model.localBlocklyMgr.blockly = Blockly;
      // this.model.localBlocklyMgr.blocklyHideOrShow();
    });
    window.addEventListener('resize', self.resizeWorkspace, false);
    Blockly.BlockWorkspace.addChangeListener(self.onChangeEvent);
//    Blockly.addEndListener(this.endCallback);
    self.activeTab = self.constData.tabName.BLOCKS;
    // load last project
    const lastProjectName = window.UserConfig.getItem(this.moduleName, 'LastProjectName');
    if (lastProjectName !== undefined && lastProjectName !== null) {
      Blockly.svgResize(Blockly.BlockWorkspace);
      setTimeout(() => {
        self.loadProject(lastProjectName).then(() => {
          Blockly.onBlocklyProjectLoad(false);
        }).catch((err) => console.error(err));
      }, 0);
    }
    // load project
    eventBus.$on('blockly-load-project', (project) => {
      self.loadProject(project).then(() => {
        Blockly.onBlocklyProjectLoad(false);
      }).catch((err) => console.error(err));
    });
    // clear project
    eventBus.$on('blockly-clear-project', () => {
      eventBus.$emit('blockly-exit');
      Blockly.BlockWorkspace.clear();
      eventBus.$emit('js-code-changed', '');
      eventBus.$emit('xml-code-changed', '');
      eventBus.$emit('project-content-changed', null);
      eventBus.$emit('project-save-changed', self.projectSaveStatus());
      eventBus.$emit('project-size-changed', self.blocksLength());
    });
    // Start Project
    eventBus.$on('blockly-start-project', () => {
      Blockly.setBlocksDeletable(false);
      Blockly.onBlocklyProjectStart();
      if (!Blockly.Running) {
        if (this.blocklyData.blocksLength <= 0) {
          swal(this.$t('dialog.runProject.title'), this.$t('dialog.runProject.text'), 'warning');
          return;
        }
        window.UArm.running = true;
        Blockly.executeCode().then().catch((err) => {
          swal({
            type: 'error',
            text: err,
          });
          eventBus.$emit('running-status-changed', false);
          console.log(err);
        });
//        Blockly.Running = true;
        eventBus.$emit('running-status-changed', true);
      }
    });
    // Stop Project
    eventBus.$on('blockly-stop-project', (event, reset) => {
      this.endCallback(reset);
    });
    // Exit Blockly call exit
    eventBus.$on('blockly-exit', () => {
      Blockly.onBlocklyProjectExit();
    });

    // Project Changed Update
    eventBus.$on('project-changed', () => {
      eventBus.$emit('project-content-changed', self.projectContent());
      eventBus.$emit('project-save-changed', self.projectSaveStatus());
      eventBus.$emit('project-size-changed', self.blocksLength());
    });
    eventBusComm.$on('toggle-side-visible', (show) => {
      this.toggleSideVisible = show;
      this.updateSideBar(show).then(() => {
        this.resizeWorkspace();
      });
    });
  },
  methods: {
    initBlocklyDiv() {
      return new Promise((resolve) => {
        initBlockly(window.Studio.AppConfig.LANG);
        const blocklyDiv = document.getElementById('tab-blocks');
        Blockly.initBlockly(blocklyDiv);
        setTimeout(() => {
          this.tagCount = document.getElementsByName('Grove').length;
        }, 1500);
        resolve();
      });
    },
    endCallback() {
      Blockly.setBlocksDeletable(true);
      Blockly.onBlocklyProjectStop();
      // window.UArm.stop_all();
      BlocklyLib.KeyPressEvent.clearEventListener();
      Blockly.Running = false;
      eventBus.$emit('running-status-changed', false);
    },
    toggleSideClick() {
      this.sideToggle = !this.sideToggle;
      this.updateSideBar(this.sideToggle).then(() => {
        this.resizeWorkspace();
      });
    },
    updateSideBar(state) {
      return new Promise((resolve) => {
        eventBus.$emit('sideBarShow', state);
        resolve();
      });
    },
    loadProject(projectName) {
      return new Promise((resolve, reject) => {
        eventBus.$emit('blockly-clear-project');
        window.FileManager.loadProject(this.moduleName, projectName).then((xmlText) => {
          window.UserConfig.setItem(this.moduleName, 'LastProjectName', projectName);
          Blockly.loadWorkspace(xmlText, this.onChangeEvent);
          eventBus.$emit('project-name-changed', projectName);
          eventBus.$emit('project-file-content-changed', xmlText);
          // this.containVisionBlock();
          // this.model.localBlocklyMgr.blocklyHideOrShow();
          resolve();
        }).catch((err) => reject(err));
      });
    },
    renameProject() {
      if (this.blocklyData.projectName !== null) {
        eventBus.$emit('rename-project', this.blocklyData.projectName);
      }
      else {
        eventBus.$emit('save-project');
      }
    },
    resizeWorkspace() {
      const blocklyArea = document.getElementById('blockly-area');
      const blocklyDiv = document.getElementById('tab-blocks');
      let element = blocklyArea;
      let x = 0;
      let y = 0;
      if (element === null) {
        return;
      }
      do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
      } while (element);
      blocklyDiv.style.left = `${x}px`;
      blocklyDiv.style.top = `${y}px`;
      blocklyDiv.style.width = `${blocklyArea.offsetWidth}px`;
      blocklyDiv.style.height = `${blocklyArea.offsetHeight - 3}px`; //
      Blockly.svgResize(Blockly.BlockWorkspace);
      eventBus.$emit('blockly-sidebar-re-size');
    },
    handleTabChange(val) {
      this.activeTab = val;
      if (this.activeTab === this.constData.tabName.BLOCKS) {
        Blockly.BlockWorkspace.setVisible(true);
        setTimeout(() => {
          Blockly.svgResize(Blockly.BlockWorkspace);
        }, 0);
      }
      else {
        Blockly.BlockWorkspace.setVisible(false);
        if (this.activeTab === this.constData.tabName.JS) {
          eventBus.$emit('js-code-changed', Blockly.generateCode());
        }
        else if (this.activeTab === this.constData.tabName.XML) {
          eventBus.$emit('xml-code-changed', Blockly.generateXML());
        }
      }
    },
    onChangeEvent(event) {
      eventBus.$emit('project-content-changed', this.projectContent());
      eventBus.$emit('project-save-changed', this.projectSaveStatus());
      this.currentBlockId = event.blockId;
      const currBlock = Blockly.BlockWorkspace.getBlockById(event.blockId);
      this.currentBlock = currBlock;
      if (event.type === Blockly.Events.UI && event.element === 'category') {
        const showAgain = window.UserConfig.getItem(this.moduleName, `dialog-category-tip-${event.newValue}`);
        // console.log(`Category: ${event.newValue} - ${showAgain}`);
        if (showAgain !== false) eventBus.$emit(`dialog-category-tip-${event.newValue}`);
      }
      eventBus.$emit('project-size-changed', this.blocksLength());

      if (this.currentBlock !== null) {
        if (event.type === Blockly.Events.CREATE) {
          eventBus.$emit('project-size-changed', this.blocksLength());
          const showAgain = window.UserConfig.getItem(this.moduleName, `dialog-tip-${this.currentBlock.type}`);
          eventBus.$emit(`dialog-${this.currentBlock.type}`, currBlock);
          if (showAgain !== false) {
            // console.log(`Block: ${this.currentBlock.type} - ${showAgain}`);
            const type = this.currentBlock.type;
            setTimeout(() => {
              eventBus.$emit(`dialog-tip-${type}`, currBlock);
            }, 100);
          }
        }
      }
      window.Studio.userTracking.insertItem('blocklyBlocksActiveTimes');
    },
    projectContent() {
      const xml = Blockly.generateXML();
      if (xml !== '') {
        return xml;
      }
      return null;
    },
    blocksLength() {
      if (Blockly.BlockWorkspace !== null) {
        return Blockly.BlockWorkspace.getAllBlocks().length;
      }
      return 0;
    },
    projectSaveStatus() {
      const self = this;
      const projectContent = self.blocklyData.projectFileContent;
      let status;
      if (Blockly.BlockWorkspace !== null) {
        if (projectContent === null && self.blocksLength() <= 0) {
          status = true;
        }
        else if (projectContent === null && self.blocksLength() > 0) {
          status = false;
        }
        else {
          status = self.projectContent() === projectContent;
        }
      }
      else {
        status = true;
      }
      eventBus.$emit('project-save-changed', status);
      return status;
    },
  },
  computed: {
    socketConnectStatus() {
      return this.$store.getters.uarmStatus.socketConnection;
    },
    uarmConnectStatus() {
      return this.$store.getters.uarmStatus.usbConnection;
    },
    cameraConnectStatus() {
      return this.$store.getters.uarmStatus.cameraConnection;
    },
    uarmInfo() {
      return this.$store.getters.uarmInfo;
    },
    displayProjectTitle() {
      return this.blocklyData.projectName !== null ?
        this.blocklyData.projectName : this.constData.untitledProject;
    },
    jsCode() {
      let code = this.blocklyData.jsCode;
      const formattingConfig = { indent_size: 2, brace_style: 'collapse-preserve-inline' };
      const re = /\s*highlightBlock.*/g;
      const re_end = /\s*reachCodeEnding.*/g;
      const re_loop = new RegExp(_.escapeRegExp(Blockly.JavaScript.INFINITE_LOOP_TRAP), 'gm');
      // console.log(re_loop);
      code = code.replace(re_loop, '');
      code = code.replace(re, '');
      code = code.replace(re_end, '');
      return Prism.highlight(beautify(code, formattingConfig), Prism.languages.javascript);
    },
    xmlCode() {
      return Prism.highlight(this.blocklyData.xmlCode, Prism.languages.xml);
    },

  },
  watch: {
    uarmConnectStatus() {
      // this.model.localBlocklyMgr.blocklyHideOrShow();
      if (this.uarmConnectStatus) {
        setTimeout(Blockly.onUArmConnect, 5000);
      }
      Blockly.onBlocklyProjectLoad();
    },
  },
};

</script>
<style lang="sass" scoped>
  $themeOrange:#D95E2E;

  /*==========*/
  .blockly-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .blockly-wrapper.notfull{
    width: 80%;
  }
  .page-main {
    display: flex;
    width: 100%;
    flex: 1;
  }

  .project-name {
    display: table-cell;
    width: 10%;
  }

  .content-code {
    padding-bottom:1vw;
    height:94%;
    width:100%;
    overflow: auto;
  }

  .blockoy-workspace {
    flex: 1;
  }

  .blockly-sidebar {
    flex: 0;
  }

  pre.blockoy-workspace {
    border: 1px solid #ccc;
    overflow: scroll;
  }

  #blocklyDiv {
    position: absolute;
  }

  .farSide {
    text-align: right;
  }

  /* Buttons */


  #blockly-page h1 {
    font-weight: normal;
    font-size: 140%;
    margin-left: 5px;
    margin-right: 5px;
  }

  .content {
    visibility: hidden;
    margin: 0;
    padding: 1ex;
    position: absolute;
    direction: ltr;
  }

  pre.content {
    border: 1px solid #ccc;
    overflow: scroll;
  }

  #content_blocks {
    padding: 0;
  }

  .blocklySvg {
    border-top: none !important;
  }

  #content_xml {
    resize: none;
    outline: none;
    border: 1px solid #ccc;
    font-family: monospace;
    overflow: scroll;
  }

  #languageMenu {
    vertical-align: top;
    margin-top: 15px;
    margin-right: 15px;
  }

  /* Sprited icons. */

  .trash {
    background-position: 0px 0px;
  }

  .link {
    background-position: -21px 0px;
  }

  .run {
    background-position: -42px 0px;
  }

  /* add for uarm studio */

  .app-container {
    background: #F6F6F6;
    height: 100%;
    color: #222;
    display: flex;
    flex-direction: row;
  }

  .modal .modal-footer {
    text-align: center;
  }


  .uarm-name img {
    width: 50%;
    margin-top: 14%;
    padding-bottom: 7%;
  }

  input:not([type]) {
    height: auto;
    margin: 0;
    border: none;
    background-color: aliceblue;
  }


  #wrist-canvas:active, #turn-canvas:active, #wrist-canvas:hover, #turn-canvas:hover {
    cursor: move;
  }

  #modal-turn .modal-content, #modal-wrist .modal-content {
    padding-bottom: 0;
  }

  .light-green, .label-success {
    background-color: #B0D586 !important;
    font-size: 90% !important;
    padding: 6px 17px;
    border-radius: 100px;
    font-weight: normal;
    color: white;
  }

  .label-default {
    font-size: 75% !important;
    padding: 6px 17px;
    border-radius: 100px;
    font-weight: normal;
  }

  .sidebar-wrapper button, .hardware-wrapper button {
    width: 52%;
  }

  .sidebar-wrapper table, .hardware-wrapper table {
    margin: 0 20%;
    width: 60%;
    word-wrap: normal;
  }
  .mu-overlay {
    background-color: transparent !important;
  }

  .switch label input[type=checkbox]:checked + .lever {
    background-color: #ccc;
    &:after {
      background-color: #52BF53;
    }
  }

  .mu-menu-list {
    padding: 0;
    overflow: hidden;
    width: 240px;
    .mu-menu-item-wrapper {
      height: 44px;
      font-size: 12px;
      line-height: 44px;
      border-bottom: 1px solid #e6e6e6;
    }
  }

  #blockly-page {
    .mu-card .mu-card-header {
      padding: 10px 16px;
      .mu-card-title {
        font-size: 14px;
        color: #E95516;
        letter-spacing: 0.89px;
      }
    }

    .tabs-bar {
      display: flex;
      background-color: #555;
      color:white;
      min-height: 45px;
      align-items: center;
      justify-content: space-between;
      min-height: 45px;
      .mu-flat-button-label{
        color:white;
      }
    }
    .tab-title {
      height: 45px;
      line-height: 45px;
      text-align: center;
      color: #f9f9f9;
      cursor: pointer;
      .mu-flat-button-label{
        font-size: 14px;
        color:white !important;
        font-family: 'PingFangSC-Light','sans-serif';
      }
      .demo-flat-button{
        margin-right:3vw;
      }
    }
    .tabs {
      height: 45px;
      width: 35%;
      background-color: #555;
      .tab {
        line-height: 45px;
        height: 45px;
        a {
          font-size: 12px;
          color: #555;
          opacity: 0.8;
          &:hover, &.active {
            color: #E95516;
          }
        }
      }
      .indicator {
        background-color: #E95516;
      }
      button {
        color: #fff;
        padding-top: 8px;
        padding-bottom: 8px;
        .mu-tab-text {
          font-size: 12px;
          color:white !important;
          font-family: 'Microsoft YaHei','STXihei';
        }
        .mu-flat-button-label{
          color:white !important;
          font-family: 'Microsoft YaHei','STXihei';
        }
      }
    }
  }

  [type="checkbox"] {
    + label {
      width: 100%;
      padding-left: 0px 16%;
      color: #555;
      font-size: 12px;
      height: 40px;
      line-height: 40px;
      &:before {
        width: 12px;
        height: 12px;
        border: 2px solid #777;
        margin-top: 6px;
        margin: 14px 6%;
      }
    }
    &:not(.filled-in) + label:after {
      width: 12px;
      height: 12px;
      border: 2px solid #777;
      margin-top: 6px;
      margin: 14px 6%;
    }
    &:checked + label {
      color: white;
      background: #5A93D7;
      &:before {
        width: 8px;
        height: 16px;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
      }
    }
  }

  #modal-move img {
    cursor: pointer;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }

  .swal2-modal {
    .swal2-title {
      font-size: 12px;
      color: #555555;
      font-weight: 200;
    }
    .swal2-input {
      height: 30px;
      padding: 0 12px;
    }
    .swal2-styled {
      padding: 1px 10px;
      font-size: 12px;
      font-weight: 300;
    }
    .swal2-confirm {
      background-color: #52BF53;
      border-left-color: #52BF53;
      border-right-color: #52BF53;
    }
  }

  .mu-dialog {
    height: 100%;
    background-color: #fff;
    display:flex;
    flex-direction:column;
    .mu-dialog-title {
      flex-direction: column;
      font-size: 14px;
    }
    .mu-dialog-actions {
      justify-content: center;
    }
  }
  .blockly-workspace {
    flex: 1;
    height:100%;
    width:100%;
  }

  .blockly-sidebar {
    flex: 0;
  }

  pre.blockly-workspace {
    border: 1px solid #ccc;
    overflow: scroll;
  }

  .back-button {
    padding-right: 10px;
    border-right: 2px #505050 solid;
    cursor: pointer;
  }

  .runButton-running {
    border-radius: 0;
    background-color: #0a5;
    &:hover {
      background-color: #dd4b39;
    }
  }

  .runButton-stop {
    border-radius: 0;
    background-color: transparent;
    &:hover {
      background-color: #0a5;
    }
  }

</style>
