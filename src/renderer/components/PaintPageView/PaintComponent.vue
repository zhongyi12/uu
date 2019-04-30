<template lang="html">
  <div class="paint-wrapper">
    <div class="toggle-button-fixed" @click="toggleSideClick()" v-show="toggleSideVisible">
      <img v-if="sideToggleState" src="../assets/img/toggle_off.svg" alt="hide side bar" />
      <img v-else src="../assets/img/toggle_on.svg" alt="hide side bar" />
    </div>
    <div class="project-name">
      <span v-if="!cData.editingProjectName">{{$t('untitled')}}</span>
      <span v-else v-text="cData.editingProjectName"></span>
      <span v-if="!savedStatus"> - {{$t('paintApp.edited')}}</span>
    </div>
    <div class="content-wrapper paint-canvas" id="fabric-wrapper" @drop="dragAdd">
        <div class="canvas-mode">
          {{$t('paintApp.dailog.setting.mode')}}:<span v-show="ui_data.canvasMode === '1'" v-text="$t('paintApp.dailog.addImage.option1')"></span>
          <span v-show="ui_data.canvasMode === '2'" v-text="$t('paintApp.dailog.addImage.option2')"></span>
        </div>
        <!-- <canvas v-show="edgeDetection" id="leaser"></canvas> -->
        <canvas id="fabric" tabindex='1' width="800" height="400"></canvas>
        <div class="disable-area"></div>
    </div>
    <div class="progress-btn-wrapper">
      <div class="progress-value" v-show="uarmPrintingState">{{uarmPrintingProgress}}%</div>
      <mu-linear-progress v-show="uarmPrintingState" :value="uarmPrintingProgress" mode="determinate"/>
      <nav class="bottomNav navbar  navbar-fixed-bottom" >

           <ul class="button-wrapper">
              <li>
                 <mu-icon-button @click="undoEvent()">
                   <img src="./assets/img/tool-undo.svg" alt="undo">
                 <span>{{ $t('paintApp.toolHint.undo') }}</span>
                 </mu-icon-button>
              </li>
              <li >
                <mu-icon-button @click="redoEvent()">
              <img src="./assets/img/tool-redo.svg" alt="redo">
                 <span>{{ $t('paintApp.toolHint.redo') }}</span>
            </mu-icon-button>
              </li>
              <li >
                <mu-icon-button @click="addTextClick()">
                  <img src="./assets/img/tool-text.svg" alt="text">
                  <span>{{ $t('paintApp.toolHint.text') }}</span>
                </mu-icon-button>
              </li>
              <li>
                <mu-icon-button  @click="addImageClick()">
                    <img src="./assets/img/tool-image.svg" alt="image">
                 <span>{{ $t('paintApp.toolHint.image') }}</span>
                </mu-icon-button>
              </li>
              <li>
                <mu-icon-button  @click="copyEvent()">
                    <img src="./assets/img/tool-copy.svg" alt="copy">
                 <span>{{ $t('paintApp.toolHint.copy') }}</span>
                </mu-icon-button>
              </li>
              <li @mouseenter="onDeleteSelect">
                 <mu-icon-button @click="removeSelected()"  :disabled="disable.deleteSelected">
                    <img src="./assets/img/tool-delete.svg" alt="delete">
                 <span>{{ $t('paintApp.toolHint.delete') }}</span>
                 </mu-icon-button>
              </li>
              <li >
                <mu-icon-button @click="show.deleteModal = true" :disabled="disable.deleteAll">
                    <img src="./assets/img/tool-clear.svg" alt="clear">
                 <span>{{ $t('paintApp.toolHint.clear') }}</span>
                </mu-icon-button>
              </li>
              <!-- <li >
                <mu-icon-button @click="testClick">
                    <img src="./assets/img/tool-clear.svg" alt="clear">
                 <span>test</span>
                </mu-icon-button>
              </li> -->
           </ul>
            <!-- <mu-icon-button tooltip="log" @click="exportGcode()">
              svg
            </mu-icon-button>
            <mu-icon-button tooltip="png" @click="exportDataURL()">
              png
            </mu-icon-button> -->
            <!-- <button type="button" name="button" @click="undoEvent">undo</button>
            <button type="button" name="button" @click="redoEvent">redo</button>
            <button type="button" name="button" @click="textModal=true">Add Text</button>
            <label for="upload-image" class="btn btn-default">Add Image</label>
            <button type="button" name="button" @click="removeSelected">Delete</button>
            <button type="button" name="button" @click="removeAll">Clear</button> -->

        </nav>
    </div>
    <input type="file" class="hide" id="upload-image" />​​​​​​​​​​​​​​
    <mu-dialog :open="textModal" @close="textModal=false" dialogClass="modal-custom font-change-dialog" @show="textAutoFocus()">
        <h3 class="paint-dialog-title">{{ $t('paintApp.dailog.addText.title') }}</h3>
        <div class="font-select">
            <mu-text-field v-model="textInput" id="textInputDom" multiLine :rows="5" :rowsMax="5" :underlineShow="false" class="text-input"/>
            <mu-select-field class="select-field" v-model="config.textFont" label="" >
                <mu-menu-item  v-for="(value, index) in fontlist" :value="index" :title="value.name"/>
            </mu-select-field>
        </div>
        <mu-raised-button class="com-fixed-size-btn" slot="actions" @click="textModal=false" :label="$t('paintApp.dailog.cancelBtn')" backgroundColor="#ccc"/>
        <mu-raised-button class="com-fixed-size-btn" slot="actions" primary @click="addTextAsPath()" :label="$t('paintApp.dailog.okBtn')" backgroundColor="#52BF53"/>
    </mu-dialog>
    <mu-dialog :open="show.deleteModal" title="" @close="show.deleteModal = false" dialogClass="model-fixed-width" >
      <div class="delete-all" v-html="$t('paintApp.dailog.deleteall.msg')"></div>
      <mu-raised-button class="com-fixed-size-btn" slot="actions" @click="show.deleteModal = false" primary :label="$t('paintApp.dailog.cancelBtn')" backgroundColor="#ccc"/>
      <mu-raised-button class="com-fixed-size-btn" slot="actions" primary @click="removeAll" :label="$t('paintApp.dailog.okBtn')" backgroundColor="#52BF53"/>
    </mu-dialog>
    <mu-dialog :open="show.selectMode" title="" dialogClass="model-fixed-width modal-custom" @close="closeSelectMode">
      <p class="selectMode-title">{{ $t('selectMode.title') }}</p>
      <div class="image-option">
        <div class="common-wrapper" @click="setCanvasMode('2')">
            <div class="common-line" v-bind:class="{active:ui_data.canvasMode ==='2'}">
                <img src="./assets/img/outline_a.svg"/>
                <img v-show="ui_data.canvasMode ==='2'" class="selected" src="./assets/img/icon_selected.svg"/>
                <!--<mu-radio name="group" nativeValue="1" v-model="ui_data.canvasMode" class="demo-radio" />-->
            </div>
            <div class="common-text">{{$t('selectMode.outline')}}</div>
        </div>
         <div class="common-wrapper" @click="setCanvasMode('1')">
            <div class="common-line" v-bind:class="{active:ui_data.canvasMode ==='1'}">
                <img src="./assets/img/grayscale_a.svg"/>
                <img v-show="ui_data.canvasMode ==='1'" class="selected" src="./assets/img/icon_selected.svg"/>
                <!--<mu-radio name="group" nativeValue="2" v-model="ui_data.canvasMode"  class="demo-radio" />-->
            </div>
            <div class="common-text">{{$t('selectMode.grayscale')}}</div>
        </div>
      </div>
       <mu-raised-button class="com-fixed-size-btn" slot="actions" primary @click="show.selectMode = false" :label="$t('selectMode.ok')" backgroundColor="#52BF53"/>
    </mu-dialog>
    <mu-snackbar v-if="ui_data.snackbar" action="Close" :message="ui_data.snackbar_message" @actionClick="hideSnackbar" @close="hideSnackbar"/>

  </div>
</template>
<script>
// import { fabric } from './assets/lib/fabric';
import { fabric } from 'fabric-webpack';
import eventBus from './eventBus';
import './assets/lib/canny';
import Potrace from './assets/lib/potrace';
import opentype from 'opentype.js';
import swal from 'sweetalert2';
import eventBusComm from '../CommonPageView/eventBus';
export default {
  props: ['cData', 'svgPathlist', 'uarmPrintingState', 'moduleName', 'uarmConnectState'],
  i18n: {
    messages: {
      en: {
        selectMode: {
          title: 'How would you want your patterns to be drawn/engraved? ',
          outline: 'Outline',
          grayscale: 'Grayscale',
          ok: 'OK',
        },
        untitled: 'Untitled',
      },
      cn: {
        selectMode: {
          title: '请选择一个模式',
          outline: '轮廓',
          grayscale: '灰度',
          ok: '确定',
        },
        untitled: '未命名',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      projectName: '',
      startChecking: false,
      mainCanvas: null,
      textModal: false,
      textInput: '',
      stateArray: [],
      savedStatus: true,
      printable: false,
      zeroChanged: false,
      insertText: false,
      backStep: 0,
      imageFile: null,
      sideToggleState: true,
      draggingShape: 0,
      toggleSideVisible: true,
      shortcutKey: {
        ctrl: false,
      },
      config: {
        textFont: '2',
        left: 350,
        top: 70,
        width: 100,
      },
      show: {
        deleteModal: false,
        selectMode: false,
        settingModal: false,
      },
      ui_data: {
        snackbar: false,
        snackbar_message: null,
        printMode: '0',
        canvasMode: '1', // 1: black&white, 2: outline
      },
      disable: {
        deleteAll: false,
        deleteSelected: false,
      },
      fontFaces: {
        2: 'black-light',
        3: 'xing-kai',
        4: 'lan-ting',
        5: 'kan-ti',
      },
      fontlist: {
        2: {
          name: this.$t('paintApp.fontNameList.blacklight'),
          src: require('../assets/fonts/blackLight.ttf'),
        },
        3: {
          name: this.$t('paintApp.fontNameList.xingkai'),
          src: require('../assets/fonts/STXingkai-SC-Bold.ttf'),
        },
        4: {
          name: this.$t('paintApp.fontNameList.lanting'),
          src: require('../assets/fonts/lanting.ttf'),
        },
        5: {
          name: this.$t('paintApp.fontNameList.kaiti'),
          src: require('../assets/fonts/kanti.ttf'),
        },
      },
    };
  },
  mounted() {
    const self = this;
    setTimeout(() => {
      self.startChecking = true;
    }, 2000);
    // Do some initializing stuff
    // fabric.Canvas.prototype.set({
    //     backgroundColor:'#fff'
    // });
    // create a wrapper around native canvas element
    this.mainCanvas = new fabric.Canvas('fabric', {
      fireRightClick: true,
    });
    this.updateModifications(true);
    this.savedStatus = true;
    this.printable = false;
    window.URL = window.URL || window.webkitURL || window.mozURL;
    // load last project
    const lastProjectName = window.UserConfig.getItem(this.moduleName, 'LastProjectName');
    if (lastProjectName !== undefined && lastProjectName !== null) {
      setTimeout(() => {
        this.loadProject(lastProjectName);
      }, 0);
    }
    else {
      this.show.selectMode = true;
    }
    document.getElementById('upload-image').onchange = () => {
      // let url = URL.createObjectURL(this.files[0]);
      // self.addImageEvent(url);
      if (document.getElementById('upload-image').files[0] !== '') {
        this.imageFile = document.getElementById('upload-image').files[0];
        this.addImageAsPath();
      }
    };
    this.mainCanvas.on(
      'object:modified', () => {
        // console.log('modified');
        self.updateModifications(true);
      },
    );
    this.mainCanvas.on(
      'object:added', (options) => {
        // console.log('added');
        options.target.bringToFront();
        self.updateModifications(true);
      },
    );
    // this.mainCanvas.on( // removed, cause selectionStart bug in production
    //   'object:selected', (options) => {
    //     console.log('selected', options);
    //     // if (this.mainCanvas.getActiveObject() !== null) {
    //     //   // bringToFront() meet duplicate bug when apply to group
    //     //   options.target.bringToFront();
    //     // }
    //     this.disable.deleteSelected = false;
    //   },
    // );
    // this.mainCanvas.on(
    //   'selection:cleared', (options) => {
    //     console.log('selected', options);
    //     this.disable.deleteSelected = true;
    //   },
    // );
    // this.mainCanvas.on('object:scaling', (e) => {
    //   const obj = e.target;
    //   obj.strokeWidth = obj.strokeWidth / ((obj.scaleX + obj.scaleY) / 2);
    //   const activeObject = this.mainCanvas.getActiveObject();
    //   activeObject.set('strokeWidth', obj.strokeWidth);
    // });
    // const canvasObj = document.getElementById('fabric');
    window.addEventListener('keydown', self.keydownEvent, true);
    window.addEventListener('keyup', self.keyupEvent, true);

    eventBus.$on('addShapes', (index) => {
      self.addSVG(index);
    });
    eventBus.$on('dragging', (index) => {
      this.draggingShape = index;
    });
    eventBus.$on('settingShow', (show) => {
      this.show.settingModal = show;
    });
    eventBus.$on('genGcode', () => {
      self.genGcode();
    });
    eventBus.$on('startPrint', (setting) => {
      this.mainCanvas.discardActiveObject();
      if (!this.printable) {
        this.showSnackbar(this.$t('paintApp.dailog.empty'));
      }
      else if (!this.uarmConnectState) {
        this.showSnackbar(this.$t('common.dialog.snackDisconnect'));
      }
      else {
        this.ui_data.printMode = setting.mode;
        eventBus.$emit('print-start');
        this.startPrinting(setting);
      }
    });
    eventBus.$on('stopPrint', () => {
      self.stopPrinting();
    });
    eventBus.$on('pausePrint', () => {
      self.pausePrinting();
    });
    eventBus.$on('resumePrint', () => {
      self.resumePrinting();
    });
    eventBus.$on('save-project', () => {
      self.saveProject();
    });
    eventBus.$on('save-project-as', () => {
      self.saveProjectAs();
    });
    eventBus.$on('load-project', (name) => {
      if (self.savedStatus) {
        self.loadProject(name);
      }
      else {
        self.promptSaveOnLoad(name);
      }
    });
    eventBus.$on('import-project', () => {
      self.addImageClick();
    });
    eventBus.$on('new-project', () => {
      self.newProject(() => {
        this.clearCanvas();
        this.savedStatus = true;
        this.show.selectMode = true;
        window.UserConfig.setItem(this.moduleName, 'LastProjectName', null);
      });
    });
    eventBus.$on('prompt-save-on-quit', (callback) => {
      if (this.uarmPrintingState) {
        this.showSnackbar(this.$t('paintApp.dailog.quitWhilePrint'));
      }
      else {
        self.promptSaveOnQuit(callback);
      }
    });
    eventBusComm.$on('toggle-side-visible', (show) => {
      this.toggleSideVisible = show;
    });
    this.checkEmpty();
  },
  methods: {
    testClick() {
      console.log(this.mainCanvas.toSVG());
    },
    onDeleteSelect() {
      if (this.mainCanvas.getActiveObject() !== null) {
        this.disable.deleteSelected = false;
      }
      else {
        this.disable.deleteSelected = true;
      }
    },
    setCanvasMode(value) {
      this.ui_data.canvasMode = value;
      eventBus.$emit('canvas-mode-change', value);
    },
    closeSelectMode() {
      this.show.selectMode = false;
    },
    toggleSideClick() {
      this.sideToggleState = !this.sideToggleState;
      eventBus.$emit('sideBarShow', this.sideToggleState);
    },
    addTextClick() {
      this.textModal = true;
    },
    textAutoFocus() {
      document.getElementById('textInputDom').focus();
    },
    addImageClick() {
      document.getElementById('upload-image').click();
    },
    addRect() {
      // create a rectangle object
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'white',
        width: 20,
        height: 20,
        stroke: 'black',
      });
      // "add" rectangle onto canvas
      this.mainCanvas.add(rect);
      this.updateModifications(true);
    },
    addCircle() {
      const config = this.config;
      const circle = new fabric.Circle({
        stroke: 'black',
        left: config.left,
        top: config.top,
        fill: 'white',
        radius: 50,
      });
      this.mainCanvas.add(circle);
      this.updateModifications(true);
    },
    addText() {
      if (this.textInput !== '') {
        const text = new fabric.Text(this.textInput, {
          left: this.config.left,
          top: this.config.top,
          fontFamily: this.fontFaces[this.config.textFont],
          fontSize: 100,
        });
        text.setStrokeWidth(2);
        text.setStroke('black');
        // text.setFill('white');
        // text.setColor('white');
        this.mainCanvas.add(text);
        this.textModal = false;
        this.textInput = '';
        this.updateModifications(true);
      }
    },
    addTextAsPath() {
      const self = this;
      if (this.textInput !== '') {
        opentype.load(this.fontlist[this.config.textFont].src, (err, font) => {
          // window.Studio.userTracking.insertData(font);
          if (err) {
//            console.log(`Font could not be loaded: ${err}`);
          }
          else {
            const textpath = font.getPath(self.textInput, 0, 150, 72);
            // console.log(textpath)
            const path = new fabric.Path(textpath.toPathData(2));
            // const scale = 100 / path.width;
            path.set({
              left: self.config.left,
              top: self.config.top,
              fontSize: 20,
              // scaleX: scale,
              // scaleY: scale,
              fill: 'black',
              stroke: 'black',
              strokeWidth: 1,
            });
            self.mainCanvas.add(path);
            self.insertText = true;
            self.textModal = false;
            self.textInput = '';
            self.updateModifications(true);
          }
          // console.log(font);
        });
      }
    },
    addImageEvent() {
      const self = this;
//      const f = fabric.Image.filters;
      const canvas = this.mainCanvas;
      const url = URL.createObjectURL(this.imageFile);
      fabric.Image.fromURL(url, (oImg) => {
        oImg.filters.push(
          //new f.Grayscale()
          //new f.Canny()
        );
        oImg.applyFilters(() => {
          oImg.scaleToWidth(200);
          oImg.setLeft(self.config.left - 50);
          oImg.setTop(self.config.top);
          canvas.add(oImg);
          canvas.renderAll();
          self.updateModifications(true);
        });
        // self.updateModifications(true);
      });
    },
    addImageAsPath() {
      const fileType = this.imageFile.type;
      if (fileType === 'image/svg+xml') {
        const url = URL.createObjectURL(this.imageFile);
        fabric.loadSVGFromURL(url, (objects, options) => {
          const svg = fabric.util.groupSVGElements(objects, options);
          svg.scaleToWidth(this.config.width);
          svg.scaleToHeight(this.config.width);
          svg.set({ left: this.config.left, top: this.config.top });
          this.mainCanvas.add(svg);
          this.updateModifications(true);
        });
      }
      else if (fileType.match('image.*')) { // not svg
        let imageEdgeOption = false;
        if (this.ui_data.canvasMode === '2') {
          imageEdgeOption = true;
        }
        const self = this;
        Potrace.loadImageFromFile(this.imageFile);
        Potrace.setParameter({
          optcurve: true,
          opttolerance: 0.8,
          alphamax: 5,
          edge: imageEdgeOption,
          // greyscale: true,
        });
        Potrace.process(() => {
          const pathstr = Potrace.getSVGPath(1);
          const path = new fabric.Path(pathstr);
          const scale = 100 / path.width;
          path.set({
            left: self.config.left,
            top: self.config.top,
            scaleX: scale,
            scaleY: scale,
            fill: 'black',
          });
          self.mainCanvas.add(path);
          self.updateModifications(true);
        });
      }
      else {
        this.showSnackbar(this.$t('paintApp.dailog.onlysvg'));
      }
      document.getElementById('upload-image').value = '';
    },
    addSVG(index) {
      const self = this;
      fabric.loadSVGFromURL(this.svgPathlist[index], (objects, options) => {
        Object.keys(objects).forEach((key) => {
          if (objects.hasOwnProperty(key)) {
            objects[key].set({
              strokeWidth: 0.3,
            });
          }
        });
        // this code lag in windows
        const obj = fabric.util.groupSVGElements(objects, options);
        const scale = 150 / obj.width;
        obj.set({
          left: self.config.left,
          top: self.config.top,
          scaleX: scale,
          scaleY: scale,
          viewBox: {
            x: 0,
            y: 0,
            width: 36,
            height: 35,
          },
        });
        self.mainCanvas.add(obj);
        self.updateModifications(true);
      });
    },
    dragAdd() {
      if (this.draggingShape > 0) {
        this.addSVG(this.draggingShape);
      }
      this.draggingShape = 0;
    },
    getSeletion() {
      if (this.mainCanvas.getActiveObject() === null) {
        return this.mainCanvas.getActiveGroup();
      }
      return this.mainCanvas.getActiveObject();
    },
    copyEvent() {
      // console.log(this.getSeletion());
      // console.log(this.mainCanvas.getActiveGroup());
      const activeObject = this.mainCanvas.getActiveObject();
      const activeGroup = this.mainCanvas.getActiveGroup();
      // console.log(1, this.mainCanvas._activeGroup.getObjects());
      if (activeObject === null) {
        const objects = activeGroup.getObjects();
        this.mainCanvas.discardActiveGroup();
        objects.forEach((obj) => { // forEachObject
          const objTop = obj.originalTop + 5;
          const objLeft = obj.originalLeft + 5;
          obj.clone((o) => {
            o.set('left', objLeft);
            o.set('top', objTop);
            this.mainCanvas.add(o);
            this.mainCanvas.discardActiveGroup();
          });
        });
        this.mainCanvas.discardActiveGroup().renderAll();
      }
      else {
        activeObject.clone((obj) => {
          console.log(obj);
          obj.set('left', obj.left + 8);
          obj.set('top', obj.top + 8);
          this.mainCanvas.add(obj);
          // this.mainCanvas.discardActiveGroup().renderAll();
        });
      }
    },
    removeSelected() {
      this.mainCanvas.remove(this.getSeletion());
      this.updateModifications(true);
    },
    removeAll() {
      this.mainCanvas.clear().renderAll();
      this.updateModifications(true);
      this.show.deleteModal = false;
      // this.savedStatus = true;
    },
    updateModifications(saveHistroy) {
      if (saveHistroy) {
        const myjson = JSON.stringify(this.mainCanvas);
        this.stateArray.push(myjson);
        this.savedStatus = false;
        // fabric.log(myjson);
      }
      this.checkEmpty();
      if (this.mainCanvas.isEmpty()) {
        this.printable = false;
      }
      else {
        this.printable = true;
      }
//      console.log(this.stateArray.length, this.backStep);
    },
    checkEmpty() {
      if (this.mainCanvas.isEmpty()) {
        this.disable.deleteAll = true;
      }
      else {
        this.disable.deleteAll = false;
      }
    },
    undoEvent() {
      const arrSize = this.stateArray.length;
      const canvas = this.mainCanvas;
      const self = this;
      if (this.backStep < arrSize - 1) {
        this.mainCanvas.clear().renderAll();
        // console.log(arrSize-1-this.backStep-1)
        // console.log(this.stateArray[arrSize-1-this.backStep-1]);
        const loadJsonStr = this.stateArray[arrSize - 1 - this.backStep - 1];
        this.mainCanvas.loadFromJSON(loadJsonStr, canvas.renderAll.bind(canvas));
        self.backStep += 1;
//        console.log(self.stateArray.length, self.backStep);
      }
    },
    redoEvent() {
      const arrSize = this.stateArray.length;
      const canvas = this.mainCanvas;
      const self = this;
      if (this.backStep > 0) {
        this.mainCanvas.clear().renderAll();
        // console.log(arrSize-1-this.backStep+1)
        // console.log(this.stateArray[arrSize-1-this.backStep+1]);
        const loadJsonStr = this.stateArray[arrSize - 1 - this.backStep + 1];
        this.mainCanvas.loadFromJSON(loadJsonStr, canvas.renderAll.bind(canvas));
        self.backStep -= 1;
//        console.log(self.stateArray.length, self.backStep);
      }
    },
    keydownEvent(event) {
      this.shortcutKey.ctrl = event.keyCode === 17;
      const obj = this.mainCanvas.getActiveObject();
      if (obj && !this.show.settingModal && !this.textModal) { // s
        const movestep = 5;
        const arrowKey = {
          37: obj.left - movestep,
          38: obj.top - movestep,
          39: obj.left + movestep,
          40: obj.top + movestep,
        };
        if (event.keyCode > 36 && event.keyCode < 41) {
          // arrowKey.hasOwnProperty(event.keyCode)
          // console.log(arrowKey[event.keyCode]);
          if (event.keyCode === 37 || event.keyCode === 39) {
            obj.setLeft(arrowKey[event.keyCode]);
          }
          if (event.keyCode === 38 || event.keyCode === 40) {
            obj.setTop(arrowKey[event.keyCode]);
          }
          this.mainCanvas.renderAll();
        }
      }
    },
    keyupEvent(event) {
      // delete
//      console.log(event.keyCode);
      if (!this.show.settingModal && !this.textModal) {
        if (event.keyCode === 46 || event.keyCode === 8) {
          this.removeSelected(); // delete or backspace
        }
      }
      // ctrl+c, copy
      // if(this.shortcutKey.ctrl && (event.keyCode===67))
    },
    showSnackbar(message) {
      this.ui_data.snackbar = true;
      this.ui_data.snackbar_message = message;
      if (this.snackTimer) clearTimeout(this.snackTimer);
      this.snackTimer = setTimeout(() => {
        this.snackbar = false;
      }, 1000);
    },
    hideSnackbar() {
      this.ui_data.snackbar = false;
      this.ui_data.snackbar_message = '';
      if (this.snackTimer) clearTimeout(this.snackTimer);
    },
    genGcode() {
      const self = this;
      if (!self.socketConnectState) {
        swal({
          type: 'warning',
          title: 'uArm Server not connected!',
        });
        return;
      }
      swal({
        title: 'Please input the gcode file name!',
        input: 'text',
        type: 'succeed',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Submit',
      }).then((projectName) => {
        window.UArm.printing.svgToGcode(self.exportGcode(), (data) => {
//          console.log(data.gcode);
          window.FileManager.saveProjectSync(this.moduleName, projectName, data.gcode);
          swal({
            type: 'success',
            title: 'Export Completed!',
          });
        });
      });
    },
    startPrinting(setting) {
      setting.canvasMode = this.ui_data.canvasMode;
      // console.log(setting);
      let sendData;
      if (setting.mode === '0') { // pen mode
        setting.zero = setting.zero0;
        window.Studio.userTracking.insertItem('drawTimes');
      }
      else { // laser mode
        setting.zero = setting.zero1;
        window.Studio.userTracking.insertItem('laserTimes');
      }
      if (setting.canvasMode === '1') { // black white mode
        sendData = this.mainCanvas.toDataURL('png');
      }
      else { // outline mode setting.canvasMode === 2
        sendData = this.mainCanvas.toSVG();
      }
      // console.log(sendData, setting);
      window.UArm.printing.startPrinting(sendData, setting);
      sendData = null;
    },
    stopPrinting() {
      let stopText;
      if (this.ui_data.printMode === '0') {
        stopText = this.$t('common.dialog.stopPrint0');
      }
      else {
        stopText = this.$t('common.dialog.stopPrint1');
      }
      if (!this.socketConnectState) {
        swal({
          type: 'warning',
          title: this.$t('common.dialog.serverDisconnect.content'),
        });
        // return;
      }
      if (!this.uarmConnectState) {
        swal({
          type: 'warning',
          title: this.$t('common.dialog.snackDisconnect'),
        });
        // return;
      }
      swal({
        title: stopText,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonColor: window.usui.okBtnColor,
        cancelButtonColor: window.usui.cancelButtonColor,
        confirmButtonText: this.$t('common.dialog.continuingPrintBtn'),
        cancelButtonText: this.$t('common.dialog.stopPrintBtn'),
        allowOutsideClick: false,
      }).then(() => {}, () => {
        window.UArm.printing.stopPrinting();
      });
    },
    pausePrinting() {
      window.UArm.printing.pausePrinting();
    },
    resumePrinting() {
      window.UArm.printing.resumePrinting();
    },
//    exportDataURL() {
//      const imgData = this.mainCanvas.toDataURL('png');
//      console.log(imgData);
//    },
    exportGcode() {
      this.mainCanvas.toSVG({
      });
    },
    getProjectData() {
      let projectData = this.stateArray[this.stateArray.length - 1]; // get project json
      const projectJSON = JSON.parse(projectData);
      projectJSON.canvasMode = this.ui_data.canvasMode;
      projectData = JSON.stringify(projectJSON);
      return projectData;
    },
    saveProjectAs(okCallback) {
      okCallback = okCallback || (() => {});
      const self = this;
      swal({
        text: this.$t('dialog.saveProject.inputName'),
        input: 'text',
        showCancelButton: true,
        confirmButtonText: this.$t('dialog.saveProject.okBtn'),
        cancelButtonText: self.$t('dialog.saveProject.cancelBtn'),
        confirmButtonColor: window.usui.okBtnColor,
        cancelButtonColor: window.usui.cancelBtnColor,
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        reverseButtons: true,
        width: window.usui.width,
        preConfirm: text => new Promise((resolve, reject) => {
          const projects = window.FileManager.listProjectListSync(this.moduleName);
          const projectNameList = [];
          for (const p of projects) {
            projectNameList.push(p.basename);
          }
          // console.log(projects);
          if (text.length === 0) {
            reject(`${self.$t('dialog.saveProject.faila')} ${text}.`);
          }
          else if (projectNameList.indexOf(text) >= 0) {
            reject(`${text} ${self.$t('dialog.saveProject.failb')}`);
          }
          else {
            resolve();
          }
        }),
      }).then((text) => {
        const filename = text;
        const projectData = this.getProjectData();
        window.FileManager.saveProjectSync(this.moduleName, filename, projectData);
        window.Studio.userTracking.insertItem('drawLaserFilesSaveTimes');
        eventBus.$emit('editing-project-name-changed', filename);
        this.savedStatus = true;
        // eventBus.$emit('project-file-content-changed', projectData);
        swal({
          type: 'success',
          title: self.$t('dialog.saveProject.title'),
          html: `${self.$t('dialog.saveProject.newname')}: ${text}`,
          allowOutsideClick: true,
          onClose: () => {
            this.saveCallback(okCallback);
          },
        });
      });
    },
    saveProject(okCallback) {
      okCallback = okCallback || (() => {});
      // this.savedStatus = true;
      if (this.stateArray.length < 1) {
        return;
      }
      if (this.cData.editingProjectName === '') {
        this.saveProjectAs(okCallback);
      }
      else {
        const filename = this.cData.editingProjectName;
        const projectData = this.getProjectData();
        window.FileManager.saveProjectSync(this.moduleName, filename, projectData);
        window.Studio.userTracking.insertItem('drawLaserFilesSaveTimes');
        this.savedStatus = true;
        eventBus.$emit('project-file-content-changed', projectData);
        swal({
          type: 'success',
          title: this.$t('dialog.saveProject.success'),
          allowOutsideClick: true,
          onClose: () => {
            this.saveCallback(okCallback);
          },
        });
      }
    },
    promptSaveProject(okCallback, cancelCallback) {
      okCallback = okCallback || (() => {});
      cancelCallback = cancelCallback || (() => {});
      const self = this;
      swal({
        html: self.$t('dialog.save.html'),
//          type: 'warning',
        width: window.usui.width,
        showCancelButton: true,
        confirmButtonColor: window.usui.okBtnColor,
        cancelButtonColor: window.usui.cancelBtnColor,
        confirmButtonText: self.$t('dialog.save.okButton'),
        cancelButtonText: self.$t('dialog.save.cancelButton'),
        allowEnterKey: true,
        allowOutsideClick: false,
        showCloseButton: true,
        reverseButtons: true,
      }).then(okCallback, cancelCallback);
    },
    promptSaveOnLoad(name) {
      const self = this;
      if (name !== this.cData.editingProjectName) {
        swal({
          html: self.$t('dialog.save.html'),
  //          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: window.usui.okBtnColor,
          cancelButtonColor: window.usui.cancelBtnColor,
          confirmButtonText: self.$t('dialog.save.okButton'),
          cancelButtonText: self.$t('dialog.save.cancelButton'),
          allowEnterKey: true,
          allowOutsideClick: false,
          showCloseButton: true,
          reverseButtons: true,
        }).then(() => {
          self.saveProject(() => {
            self.loadProject(name);
          });
        }, (dismiss) => {
          if (dismiss === 'cancel') {
            self.loadProject(name);
          }
        });
      }
    },
    promptSaveOnQuit(okCallback, cancelCallback) {
      okCallback = okCallback || (() => {});
      cancelCallback = cancelCallback || (() => {});
      console.log(cancelCallback);
      const self = this;
      if (this.savedStatus) {
        okCallback();
      }
      else {
        swal({
          html: self.$t('dialog.quitSave.html'),
          showCancelButton: true,
          width: window.usui.width,
          confirmButtonColor: window.usui.okBtnColor,
          cancelButtonColor: window.usui.cancelBtnColor,
          confirmButtonText: self.$t('dialog.quitSave.okButton'),
          cancelButtonText: self.$t('dialog.quitSave.cancelButton'),
          allowEnterKey: true,
          allowOutsideClick: true,
          showCloseButton: true,
          reverseButtons: true,
        }).then(() => {
          self.saveProject(okCallback);
        }, (dismiss) => {
          if (dismiss === 'cancel') {
            okCallback();
          }
        });
      }
    },
    saveCallback(okCallback) {
      okCallback = okCallback || (() => {});
      eventBus.$emit('refresh-project-list');
      okCallback();
    },
    loadProject(name) {
      // console.log(name, 'load');
      const jsonData = window.FileManager.loadProjectSync(this.moduleName, name);
      const mode = JSON.parse(jsonData).canvasMode;
      if (mode === '1' || mode === '2') {
        this.setCanvasMode(mode);
      }
      else {
        this.show.selectMode = true;
        console.log('unknow mode', mode);
      }
      this.mainCanvas.clear().renderAll();
      // console.log(arrSize-1-this.backStep-1)
      // console.log(this.stateArray[arrSize-1-this.backStep-1]);
      this.mainCanvas.loadFromJSON(jsonData, this.mainCanvas.renderAll.bind(this.mainCanvas));
      this.stateArray = [];
      this.stateArray.push(jsonData);
      this.savedStatus = true;
      this.printable = true;
      eventBus.$emit('editing-project-name-changed', name);
    },
    newProject(okCallback) {
      if (this.savedStatus) {
        okCallback();
      }
      else {
        this.promptSaveProject(() => {
          this.saveProject(okCallback);
        }, (dismiss) => {
          if (dismiss === 'cancel') {
            okCallback();
          }
        });
      }
    },
    clearCanvas() {
      this.savedStatus = true;
      this.mainCanvas.clear().renderAll();
      this.stateArray = [];
      eventBus.$emit('editing-project-name-changed', '');
    },
  },
  beforeDestroy() {
    this.mainCanvas.dispose();
  },
  watch: {
    uarmPrintingState() {
      let stopedText;
      if (this.ui_data.printMode === '0') {
        stopedText = this.$t('common.dialog.printStopped0');
      }
      else {
        stopedText = this.$t('common.dialog.printStopped1');
      }
      if (!this.uarmPrintingState) {
        this.showSnackbar(stopedText);
        // swal({
        //   type: 'info',
        //   title: stopedText,
        //   confirmButtonColor: window.usui.okBtnColor,
        // });
      }
    },
    uarmConnectState() {
//      console.log(`startChecking: ${this.startChecking}`);
      if (this.startChecking) {
        if (!this.uarmConnectState) {
          this.showSnackbar(this.$t('common.dialog.snackDisconnect'));
        }
        else {
          this.showSnackbar(this.$t('common.dialog.snackConnect'));
        }
      }
    },
    // socketConnectState() {
    //   if (this.startChecking) {
    //     if (!this.socketConnectState) {
    //       swal(
    //         this.$t('common.dialog.serverDisconnect.title'),
    //         this.$t('common.dialog.serverDisconnect.content'),
    //         'error',
    //       );
    //     }
    //     else {
    //       swal(
    //         this.$t('common.dialog.serverConnect.title'),
    //         this.$t('common.dialog.serverConnect.content'),
    //         'success',
    //       );
    //     }
    //   }
    // },
  },
  computed: {
    socketConnectState() {
      return this.$store.getters.socketConnectState;
    },
    uarmPrintingProgress() {
      if (this.$store.getters.uarmPrintingProgress === null) {
        return 0;
      }
      return Number(this.$store.getters.uarmPrintingProgress);
    },
  },
};

</script>
<style lang="sass">
.font-change-dialog {
    width:280px !important;
    padding-bottom:16px;
}
.model-fixed-width {
    width:450px !important;
    padding-bottom: 16px;
}
</style>

<style lang="sass" scoped>
$canvasRadius: 380px;
$disableRadius: $canvasRadius/1;
$themeOrange: #D95E2E;
.paint-wrapper {
  width:100%;
  height:100%;
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  position:relative;
}

.project-name {
  margin: 0 auto;
  padding-top: 30px;
  text-align: center;
  font-size: 18px;
}
.paint-canvas img{
    /*display: none !important;*/
}
.content-wrapper {
    position: relative;
    justify-content: center;
    text-align: center;
    display: flex;
    margin: 0 auto;
    background-image: url(./assets/img/bg_canvas.svg);
    background-size: 100% 100%;
    .canvas-mode{
      position: absolute;
      left: 0;
      color: $themeOrange;
      border:1px solid #EFF3F5;
      border-radius: 50px;
      padding:5px 1vw;
      font-weight:800;
      font-size:14px;
    }
    .canvas-container {
        margin: auto;
    }
    .disable-area{
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      align-items: flex-start;
      /*padding-bottom: 2vw;*/
      /*padding-left: 9vw;*/
      bottom: -1px;
      width: $disableRadius;
      height: $disableRadius/2;
      background-color: #fafafa;
      position: absolute;
      border: none;
      border-top-right-radius: $disableRadius;
      border-top-left-radius: $disableRadius;
    }
    #fabric,
    .upper-canvas {

        border: none;
        border-top-right-radius: $canvasRadius;
        border-top-left-radius: $canvasRadius;
        margin: auto;
        overflow: hidden;
        /* this fixes the overflow:hidden in Chrome/Opera */
        -webkit-mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC");

    }

}
.progress-btn-wrapper {
    position: absolute;
    bottom: 6vh;
    width: 100%;
    text-align: center;
    .mu-linear-progress {
        background-color: #bdbdbd;
        width: 764px;
        margin: 10px auto 0;
    }
}
.navbar-fixed-bottom {
    display: flex;
    text-align: center;
    position:relative !important;
    margin-top:30px;
    .button-wrapper {
        margin:0 auto;
        border: 1px solid #ccc;
        display:flex;
        height:70px;
        padding:0;
        li {
            list-style: none;
            width:110px;
            text-align: center;
            cursor: pointer;
            .mu-icon-button {
                width: 100% !important;
                padding:0 !important;
                height:100% !important;
                line-height: 0 !important;
            }
        }
        li:hover {
            background-color:rgba(85,85,85,.1);
        }
        span {
          display:block;
          color: #787878;
          font-size:12px;
            padding-top: 14px;
        }
    }
}
.modal-custom{
    max-width:900px;
    width: 35vw !important;
    .paint-dialog-title {
        color:#555 !important;
        font-size:1rem;
        text-align: center;
    }
  .font-select{
    display:flex;
    flex-direction:column;
    justify-content:space-around;
    text-align: center;
    #textInputDom{
      background-color: #DFE0E3;
      width:90% !important;
      height:123px;
      margin:5px auto 20px;
    }
    .select-field {
       width:90% !important;
       margin:0 auto 20px;
    }
  }
    .selectMode-title {
        padding-top:22px;
        font-size: 14px;
        color: #555555;
        text-align: center;
    }
    .image-option{
      display:flex;
      justify-content: space-around;
      text-align: center;
      text-align:center;
      padding-top:23px;
      margin: 0 50px;
      .common-wrapper {
        cursor: pointer;
        .common-line {
           width:100px;
           height:100px;
           padding:30px;
            background-color:rgb(178, 181, 188);
           img:first-child {
            margin:0 auto;
            width:100%;
            height:100%;
           }
            .selected {
            width:1vw;
            min-width: 15px;
            bottom:1vw;
           }
        }
        .common-text {
           margin:0 auto;
           text-align: center;
           padding:3px 0;
           margin-top:20px;
           margin-bottom: 14px;
            font-size: 14px;
            color: #555555;
        }
        .active {
            background-color:#61656F;
            color:#fff;
        }
      }
    }

}

.common-btn {
    height: 2vw !important;
    line-height: 2vw !important;
    background: #52BF53;
    color: #fff;
    width: 6vw;
}
.delete-all {
    padding:20px 0;
    text-align: center;
}
@media screen and (max-width: 1440px) {
#fabric-wrapper {
    -webkit-transform : scale(0.9);
    -webkit-transform-origin : center center;
}
}
@media screen and (min-width: 1440px) and (min-height: 800px) {
#fabric-wrapper {
    -webkit-transform : scale(1.2);
    -webkit-transform-origin : center center;
}
}
@media screen and (min-width: 1440px) and (min-height: 1000px) {
#fabric-wrapper {
    -webkit-transform : scale(1.3);
    -webkit-transform-origin : center center;
}
}

 
@media screen and (min-width: 1920px) and (min-height: 1000px) {
  #fabric-wrapper {
    -webkit-transform : scale(1.5);
    -webkit-transform-origin : center center;
    }
}

</style>
