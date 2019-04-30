<template lang="html">
<div class="header-wrapper-left">
  <mu-appbar title="" >
      <a @click="backToHome()" slot="left"><img src="../assets/img/btn_back.svg" class="back-button-paint" ></a>
      <img :src="titleImage"  slot="left" class="brand-logo-paint">
      <!-- <mu-icon-button icon='file_upload' slot="right" /> -->
      <!-- <mu-icon-button icon='file_download' slot="right" @click="genGcode()"/> -->
      <mu-icon-button :tooltip="$t('common.tooltip.new')" class="paint" slot="right" @click="newProject()" > <img src="../assets/img/icon_new_project.svg" alt="New Project"></mu-icon-button>
      <mu-icon-button :tooltip="$t('common.tooltip.save')" class="paint"  slot="right" @click="saveProject()" ><img src="../assets/img/icon_save.svg" alt=""> </mu-icon-button>
      <mu-icon-button :tooltip="$t('common.tooltip.saveas')" slot="right" @click="saveAsProject()" ><img src="./assets/img/icon_Save as.svg" alt="icon_Save as"></mu-icon-button>
      <mu-icon-button :tooltip="$t('common.tooltip.stop')" class="paint redbg" v-show="uarmPrintingState" slot="right" @click="stopPrint()"  backgroundColor="red"><img style="transform: scale(1.4);" src="../assets/img/icon_stop.svg" alt="" ></mu-icon-button>
      <mu-icon-button :tooltip="$t('common.tooltip.paused')" class="paint redbg" v-if="show.pause && uarmPrintingState" slot="right" @click="pausePrint()"  backgroundColor="#FFBE53"> <img style="transform: scale(1.4);" src="../assets/img/icon_paused.svg" /></mu-icon-button>
      <mu-icon-button :tooltip="$t('common.tooltip.run')" class="paint" v-else slot="right" @click="playClick()" ><img src="../assets/img/icon_start.svg" alt=""> </mu-icon-button>

      <!--<mu-icon-button icon='add' slot="right" @click="newProject()"/>
      <mu-icon-button icon='save' slot="right" @click="saveProject()"/>
      <mu-icon-button icon='devare_forever' slot="right" @click="discardProject()"/>
      <mu-icon-button :icon="blockly_data.running ? 'stop'  : 'play_arrow' "
                      slot="right" @click="runProject()"
                      :class="blockly_data.running ? 'runButton-running' : 'runButton-stop'"/> -->
  </mu-appbar>
  <mu-dialog :open="show.settingModal" @hide="resetMode()" dialogClass="modal-setting modal-custom" bodyClass="tooltipBody">
      <h3 class="paint-dialog-title">{{ $t('paintApp.dailog.setting.title') }}</h3>
      <div class="config-wrapper">

          <div class="form-group mode-select">
            <div class="control-label tooltipdiv">
              {{$t('paintApp.dailog.setting.mode')}}
              <div class="demo-icon-tip" ref="demo" @mouseenter="show.tipshow = true" @mouseleave="show.tipshow = false">
                <mu-icon value="help_outline" :size="20" />
                <mu-tooltip :label="tipTexts" :show="show.tipshow"/>
              </div>
            </div>
            <div class="label-select">
              <input type="radio" class="form-radio" id="radio1" value="0" v-model="setting.mode">
              <label for="radio1" v-bind:class="radioClass.radio1">{{$t('paintApp.dailog.setting.draw')}}</label>
              <input type="radio" class="form-radio" id="radio2" value="1" v-model="setting.mode">
              <label for="radio2" v-bind:class="radioClass.radio2">{{$t('paintApp.dailog.setting.laser')}}</label>
            </div>
          </div>
          <div v-show="setting.mode=='0'" class="mode-setting draw">
            <div class="mode-item">
              <label for="input3">{{$t('paintApp.dailog.setting.adjustzero')}}</label>
              <div>
                <mu-slider v-model="setting.zero0" :step="1" :max="100" :min="-100" class="demo-slider"/>
                <input type="number" class="form-control" id="input3" v-model="setting.zero0">
              </div>
            </div>
          </div>
          <div v-show="setting.mode=='1'" class="mode-setting laser">
            <div class="mode-item">
              <label for="input4">{{$t('paintApp.dailog.setting.adjustzero')}}</label>
              <div>
                <mu-slider v-model="setting.zero1" :step="1" :max="100" :min="-100" class="demo-slider"/>
                <input type="number" class="form-control" id="input4" v-model="setting.zero1">
              </div>
            </div>
            <div class="mode-item tooltipdiv">
              <label>{{$t('paintApp.dailog.setting.speed')}}</label>
              <div>
                <mu-slider v-model="setting.speed" :min="speed.min" :max="speed.max" :step="1" class="demo-slider"/>
                <div class="speed-percent">{{setting.speed}}</div>
              </div>
            </div>
            <div class="mode-item">
              <label>{{ $t('is_laser') }}</label>
              <mu-switch label="" v-model="isLaser" labelBottom class="demo-switch" />
              <!-- <button @click="setLaser(true)">打开激光</button>
              <button @click="setLaser(false)">关闭激光</button> -->
            </div>
            <span style="text-align:left;color:red;width:350px;height:15px;font-size:12px;padding-left:70px;">
              <span v-show="!isLaser">
                <!-- 温馨提示: 激光已打开,请记得做好台面安全防护措施 -->
                {{ $t('laser_open_tips') }}
              </span>
            </span>
          </div>
      </div>
      <div class="btn-wrapper">
          <mu-raised-button slot="actions" @click="cancelPrintEvent" :label="$t('paintApp.dailog.cancelBtn')" backgroundColor="#e4e4e4" color="#fff"  class="lableBtn common-btn"/>
          <mu-raised-button v-if="uarmPrintingState" slot="actions" label="pringting" class="common-btn" />
          <mu-raised-button v-if="uarmPrintingState" slot="actions" @click="stopPrint()" :label="$t('paintApp.dailog.setting.stopButton')" class="common-btn"/>
          <mu-raised-button v-else-if="radioClass.radio1 ==='selected'" slot="actions" @click="startPrintEvent()" primary  :label="$t('paintApp.dailog.setting.startButton')" backgroundColor="#52BF53" class="common-btn"/>
          <mu-raised-button v-show="radioClass.radio2 ==='selected'" slot="actions" @click="startPrintEvent()" primary  :label="$t('paintApp.dailog.setting.startButton')" backgroundColor="#52BF53" class="common-btn"/>
      </div>
  </mu-dialog>
  <!-- <mu-dialog :open="show.penUp" title="Tips: Pen Up Setting" dialogClass="modal-setting modal-custom">
      <div class="config-wrapper tips-wrapper">
          <img src="./assets/img/Drag_Penup.svg" alt="">
          <div class="">
            1. Drag uArm to get the current height(Z value).
          </div>
          <div class="">
            2. Click<img src="./assets/img/Icon_unlock.svg" alt="">to save it as Pen Up value.
          </div>

      </div>
      <mu-raised-button slot="actions" @click="gobackSetting()" label="Got it" backgroundColor="#52BF53"  class="lableBtn"/>
  </mu-dialog>
  <mu-dialog :open="show.penDown" title="Tips: Pen Down Setting" dialogClass="modal-setting modal-custom">
      <div class="config-wrapper tips-wrapper">
          <img src="./assets/img/Drag_Pendown.svg" alt="">
          <div class="">
          1. Drag uArm to get the current height(Z value).<br>
          <img src="./assets/img/Icon_warning.svg" alt="">Please ensure the Pen touch the object.
          </div>
          <div class="">
          2. Click<img src="./assets/img/Icon_unlock.svg" alt="">to save it as Pen Up value.
          </div>
      </div>
      <mu-raised-button slot="actions" @click="gobackSetting()" label="Got it" backgroundColor="#52BF53"  class="lableBtn"/>
  </mu-dialog> -->
  <!-- <mu-dialog :open="show.setLaser" :title="$t('paintApp.dailog.setLaser.title')" dialogClass="modal-setting modal-custom">
      <div class="config-wrapper tips-wrapper">
          <img src="./assets/img/Drag_laserdown.svg" alt="">
      </div>
      <mu-raised-button slot="actions" @click="gobackSetting()" :label="$t('paintApp.dailog.setLaser.backButton')" backgroundColor="#e4e4e4" color="#fff"  class="lableBtn"/>
      <mu-raised-button slot="actions" @click="startPrintEvent()" :label="$t('paintApp.dailog.setting.startButton')" backgroundColor="#52BF53"  class="lableBtn"/>
  </mu-dialog> -->
  <mu-dialog :open="show.installTip" :title="$t('paintApp.dailog.installTip.title')" dialogClass="modal-setting modal-custom" >
      <div class="tips-wrapper">
        <div class="">
          {{$t('paintApp.dailog.installTip.subtitle')}}
        </div>
        <div class="install-step">
          <div class="step-block">
            <div class="step-img">
              <img src="./assets/img/install-step_suctioncup.svg" alt="">
              <span id="step1">{{$t('paintApp.dailog.installTip.step1')}}</span>
            </div>
            <div class="step-text">{{$t('paintApp.dailog.installTip.step1text')}}</div>
          </div>
          <div class="step-block">
            <div class="step-img">
              <img src="./assets/img/install-step_holder.svg" alt="">
              <span id="step2">{{$t('paintApp.dailog.installTip.step2')}}</span>
            </div>
            <div class="step-text">{{$t('paintApp.dailog.installTip.step2text')}}</div>
          </div>
          <div class="step-block">
            <div class="step-img">
              <img src="./assets/img/install-step_laser.svg" alt="">
              <span id="step3a">{{$t('paintApp.dailog.installTip.step3')}}</span>
              <span id="step3b">{{$t('paintApp.dailog.installTip.step3b')}}</span>
            </div>
            <div class="step-text">{{$t('paintApp.dailog.installTip.step3text')}}</div>
          </div>
        </div>
      </div>
      <mu-raised-button slot="actions"
                        @click="closeTipDialog()"
                        :label="$t('OK')" backgroundColor="#4A90E2"  class="lableBtn"/>
      <br/>
      <mu-checkbox :label="$t('dont_show_again')" class="demo-checkbox" v-model="show.installTipDontShowAgain"/>
  </mu-dialog>
</div>
</template>

<script>
import eventBus from './eventBus';
const _ = require('lodash');
// const storage = window.localStorage;
export default {
  props: ['uarmPrintingState', 'moduleName', 'uarmConnectState'],
  i18n: {
    messages: {
      en: {
        dont_show_again: 'Don\'t show again',
        OK: 'OK',
        is_laser: 'Laser',
        laser_open_tips: 'Tips: please do the protection for your countertop before the laser is on',
      },
      cn: {
        dont_show_again: '不要再显示',
        OK: '确认',
        is_laser: '激光',
        laser_open_tips: '温馨提示: 激光打开前, 请记得做好台面安全防护措施',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      show: {
        settingModal: false,
        penUp: false,
        penDown: false,
        setLaser: false,
        installTip: false,
        installTipDontShowAgain: false,
        tipshow: false,
        pause: false,
      },
      setting: {
        mode: '0',
        material: '1',
        power: 1,
        speed: 200,
        zero0: 50,
        zero1: 50,
      },
      speed: {
        min: 50,
        max: 500,
      },
      radioClass: {
        radio1: 'selected',
        radio2: '',
      },
      lockState: {
        up: true,
        down: true,
      },
      titleImage: require(`${this.$t('paintApp.titleImagePath')}`),
      tipTexts: this.$t('paintApp.tipDrawMode'),
      savedDataLoaded: false,
    };
  },
  mounted() {
    // window.UArm.set_mode(window.UArm.Mode.LASER); // set to mode 1
    eventBus.$on('canvas-mode-change', (mode) => {
      const MODE_LIST = {
        1: 500, // blackwhite
        2: 250, // outline
      };
      this.speed.max = MODE_LIST[mode];
    });
    eventBus.$on('print-start', () => {
      this.onPrintStart();
    });
    const savedZero0 = window.UserConfig.getItem(this.moduleName, 'zeroPoint0');
    const savedZero1 = window.UserConfig.getItem(this.moduleName, 'zeroPoint1');
    if (savedZero0 && (savedZero0 !== this.setting.zero0)) {
      this.setting.zero0 = savedZero0;
    }
    if (savedZero1 && (savedZero1 !== this.setting.zero1)) {
      this.setting.zero1 = savedZero1;
    }
    this.modeChangeDo();

    if (this.isLaser) {
      this.setLaser(true);
    }
    else {
      this.setLaser(false);
    }
  },
  methods: {
    cancelPrintEvent() {
      this.show.settingModal = false;
      this.isLaser = false;
      this.setLaser(false);
      this.saveZeroPoint('all');
    },
    setLaser(value) {
      if (value) {
        window.UArm.send_and_callback({
          cmd: 'uarm_set_position',
          data: {
            // position: [200, 0, 88],
            position: [200, 0, 88 + Number(this.setting.zero1)],
            speed: 1000000,
            relative: false,
            wait: true,
          },
        }, () => {
          window.UArm.send_and_callback({
            cmd: 'uarm_send_command',
            data: {
              command: 'G1',
            },
          }, () => {
          });
        })
      }
      else {
        window.UArm.send_and_callback({
          cmd: 'uarm_send_command',
          data: {
            command: 'G0',
          },
        }, () => {
        });
      }
    },
    resetMode() {
      this.show.settingModal = false;
      // this.setting.mode = '0';
      // this.radioClass.radio1 = 'selected';
      // this.radioClass.radio2 = '';
    },
    playClick() {
      if (!this.uarmPrintingState) {
        window.UArm.set_position({
          x: 200,
          y: 0,
          z: 150,
          speed: 1000000,
        })
        this.showPrintSetting();
      }
      else { // if (this.show.pause)
        this.resumePrint();
      }
    },
    closeTipDialog() {
      window.UserConfig.setItem(this.moduleName, 'installTipModal', !this.show.installTipDontShowAgain);
      this.show.installTip = false;
    },
    showPrintSetting() {
      const tipShow = window.UserConfig.getItem(this.moduleName, 'installTipModal');
//      console.log(`tipShow: ${tipShow}`);
      if (tipShow !== undefined && tipShow !== false) {
        this.show.installTip = true;
//        window.UserConfig.setItem(this.moduleName, 'installTipModal', false);
      }
      this.show.settingModal = true;
      // window.UserConfig.setItem(this.moduleName, 'zeroPoint', this.setting.zero);
      // this.saveZeroPoint();
      // this.show.installTip = false;
      this.savedDataLoaded = true;
      // initializing zero
      // let setZero;
      // if (this.setting.mode === '0') {
      //   setZero = this.setting.zero0;
      // }
      // else if (this.setting.mode === '1') {
      //   setZero = this.setting.zero1;
      // }
      // const tempObj = {
      //   x: 200,
      //   y: 0,
      //   z: setZero,
      // };
      // window.UArm.set_position(tempObj);
    },
    saveZeroPoint(isAll) {
      if (isAll !== undefined) {
        window.UserConfig.setItem(this.moduleName, 'zeroPoint0', this.setting.zero0);
        window.UserConfig.setItem(this.moduleName, 'zeroPoint1', this.setting.zero1);
      }
      else {
        if (this.setting.mode === '0') {
          window.UserConfig.setItem(this.moduleName, 'zeroPoint0', this.setting.zero0);
        }
        else if (this.setting.mode === '1') {
          window.UserConfig.setItem(this.moduleName, 'zeroPoint1', this.setting.zero1);
        }
      }
    },
    startPrintEvent() {
      // window.UserConfig.setItem(this.moduleName, 'zeroPoint', this.setting.zero);
      this.saveZeroPoint();
      eventBus.$emit('startPrint', this.setting);
    },
    onPrintStart() {
      this.show.setLaser = false;
      this.show.penUp = false;
      this.show.penDown = false;
      this.show.settingModal = false;
      this.show.pause = true;
    },
    stopPrint() {
      eventBus.$emit('stopPrint');
    },
    pausePrint() {
      eventBus.$emit('pausePrint');
      this.show.pause = false;
    },
    resumePrint() {
      eventBus.$emit('resumePrint');
      this.show.pause = true;
    },
    genGcode() {
      eventBus.$emit('genGcode');
    },
    upLockClick() {
      if (this.lockState.up) {
        this.show.penUp = true;
        this.show.settingModal = false;
      }
      this.lockState.up = !this.lockState.up;
    },
    downLockClick() {
      if (this.lockState.down) {
        this.show.penDown = true;
        this.show.settingModal = false;
      }
      this.lockState.down = !this.lockState.down;
    },
    gotoLaser() {
      this.show.setLaser = true;
      this.show.settingModal = false;
    },
    gobackSetting() {
      this.show.setLaser = false;
      this.show.penUp = false;
      this.show.penDown = false;
      this.show.settingModal = true;
    },
    saveProject() {
      eventBus.$emit('save-project');
    },
    saveAsProject() {
      eventBus.$emit('save-project-as');
    },
    newProject() {
      eventBus.$emit('new-project');
    },
    backToHome() {
      eventBus.$emit('prompt-save-on-quit', () => {
        this.$router.push('home-page');
      });
    },
// eslint-disable-next-line func-names
    updateZ: _.debounce((zero) => {
      const tempObj = {
        x: 200,
        y: 0,
        z: Number(zero),
        speed: 1000000,
        mode: window.UArm.Mode.LASER,
      };
      window.UArm.set_position(tempObj);
//      window.UArm.set_mode(window.UArm.Mode.LASER);
//      eventBus.$emit('zeroChange');
    }, 100),
    modeChangeDo() {
      // console.log('mode changed', this.setting.mode);
      this.isLaser = false;
      this.setLaser(false);
      if (this.setting.mode === '1') {
        this.radioClass.radio1 = '';
        this.radioClass.radio2 = 'selected';
        this.tipTexts = this.$t('paintApp.tipLaserMode');
        window.UArm.set_mode(1); // w&d:3, laser: 1
        // this.setting.zero = this.setting.zero1;
      }
      else if (this.setting.mode === '0') {
        this.radioClass.radio1 = 'selected';
        this.radioClass.radio2 = '';
        this.tipTexts = this.$t('paintApp.tipDrawMode');
        window.UArm.set_mode(3); // w&d:3, laser: 1
        // this.setting.zero = this.setting.zero0;
      }
    },
  },
  computed: {
    isLaser: {
      get() {
        return this.model.localPaintMgr.isLaser;
      },
      set(value) {
        this.model.localPaintMgr.isLaser = value;
      },
    },
  },
  watch: {
    isLaser() {
      if (this.isLaser) {
        this.setLaser(true);
      }
      else {
        this.setLaser(false);
      }
    },
    'show.settingModal'() {
      eventBus.$emit('settingShow', this.show.settingModal);
    },
    'setting.mode'() {
      this.modeChangeDo();
    },
    'setting.zero0'() {
      if (this.show.settingModal && this.savedDataLoaded) {
        this.updateZ(this.setting.zero0);
      }
    },
    'setting.zero1'() {
      if (this.show.settingModal && this.savedDataLoaded) {
        this.updateZ(this.setting.zero1);
      }
    },
    uarmConnectState() {
      if (!this.uarmConnectState) {
        this.show.pause = false;
      }
    },
  },
};

</script>
<style lang="sass">
.modal-setting {
    width:38% !important;
    font-size:.9rem;
}
</style>

<style lang="sass" scoped>
.header-wrapper-left {
    position: relative;
    width:100%;
}
.mu-paper-1 {
    box-shadow: none;
}
.back-button-paint {
  height: 20px;
  padding:0 20px;
  cursor: pointer;
}
.brand-logo-paint {
  margin-top: 4px;
  margin-left:8px;
  height: 20px;
}
label {
  font-weight: 300 ;
}
.mu-slider{
    width:50% !important;
}
.mu-appbar {
    background-color: #3c3c3c;
    max-height: 64px;
    .mu-icon-button {
        border-radius: 0;
    }
}
.mu-select-field .mu-dropDown-menu {
  border:1px solid #d8d8d8;
}
.mu-dialog .mu-dialog-title{
  color:#d95e2e;
}
.paint-dialog-title {
    color:#555 !important;
    font-size:1rem;
    text-align: center;
}
.config-wrapper{
    width:94%;
    margin:0 auto;
    .form-horizontal .control-label{
        padding-top: 0;
        font-size: 14px;
        position:relative;
    }
    .form-radio{
        display:none;
    }
    .mode-setting{
        display: flex;
        text-align: center;
        justify-content: center;
        padding-top:2vh;
        .mode-item{
          display:flex;
          width:100%;
           margin-top:10px;
          .form-control {
            width:62px !important;
            font-size: .9rem;
            margin-left: 2vw;
            text-align: center;
            padding: 0;
          }
          .speed-percent {
            padding-left:2vw;
          }
        }
        label{
            text-align:right;
            padding: 0 1vw;
            width:26%;
        }
        .mode-item{
            & > div{
                display:flex;
                justify-content: flex-start;
                img{
                    padding:0 1vw;
                    cursor:pointer;
                }
            }
            .demo-slider {
                width:16vw !important;
                max-width: 320px;
            }
        }
    }
    .laser {
        padding-top:2vh;
        flex-direction: column;
    }
    .mode-select{
        display: flex;
        padding: 15px 0;
        width: 90%;
        margin: 0 auto;
        justify-content: center;
        .control-label{
            text-align:right;
            padding-right:1vw;
            max-width:180px;
        }
        .label-select{
            display:flex;
            label{
                border:none;
                background-color: #E4E4E4;
                color:white;
                cursor:pointer;
                height: 32px;
                line-height: 32px;
                width:120px;
                vertical-align: middle;
                text-align: center;
            }
            label.selected{
                background-color: #555;
                color:white;
            }
        }

    }

}
.tips-wrapper{
  display:flex;
  flex-direction:column;
  font-size:1.1rem;
  align-items:center;
  & > img{
    width:21vw;
    padding-bottom:2vw;
  }
  & > div{
    padding-bottom:0.4vw;
    & > img{
      width:1.8vw;
      padding:0 0.3vw;
    }
  }
  .install-step{
    display:flex;
    width:100%;
    justify-content:center;
    padding-top:1vw;
    .step-block{
      width:30%;
      .step-img{
        position:relative;
        img{
          width:15vw;
          height:10vw;
        }
        span{
          position:absolute;
          font-size:0.8vw;
        }
        #step1, #step2{
          bottom:-0.5vw;
          right:1vw;
          width:7vw;
        }
        #step3a{
          bottom:0.5vw;
          right:3.5vw;
          width:6vw;
        }
        #step3b{
          top:-0.7vw;
          right:-2vw;
          width:7vw;
        }
      }
        .step-text{
          color: #D95E2E;
          padding:1vw;
        }
    }
  }
}
  .tooltipdiv{
    position:relative;
      .demo-icon-tip{
      position:absolute;
      left: -90%;
      top:0;
      width:30px !important;
      cursor:pointer;
    }
    .mu-tooltip{
      top:6px !important;
      text-align: left;
      width:120px;
    }
  }

.btn-wrapper {
    margin:40px 0 30px;
    display: flex;
    justify-content: center;
    .common-btn {
        height:36px !important;
        line-height: 36px !important;
        width:100px;
        font-size:1rem !important;
        margin: 0 1vw;
    }
}

</style>
