<template lang="html">
  <div class="record-wrapper" v-bind:class="{notfull: sideToggleState}">
      <!--<div class="toggle-button-fixed" @click="toggleSideClick()"  v-show="toggleSideVisible">-->
          <!--<img v-if="sideToggleState" src="../assets/img/toggle_off.svg" alt="hide side bar"/>-->
          <!--<img v-else src="../assets/img/toggle_on.svg" alt="hide side bar"/>-->
      <!--</div>-->
      <div class="canvas-wrapper">
          <img v-if="language === 'en'" src="./assets/img/img_base_en.png" alt="" />
          <img v-else src="./assets/img/img_base_cn.png" alt="" />
      </div>
      <div class="not-canvas">
          <div class="up-box">
            <div class="up-switch">
              {{ this.$t('recordApp.text.is_lock') }}  <mu-switch label="" v-model="isLock" :disabled="uarm.uarm_info.uarm_connected === false" labelBottom class="demo-switch" />
            </div>
            <!-- <div v-if="isLock" class="btn-lock" @click="setServoDetach()">UnLock</div>
            <div v-else class="btn-lock" @click="setServoAttach()">Lock</div> -->
            <div class="progress-panel">
                <div class="progress-status">
                    {{textData.progress_status}}
                </div>
                <div class="progress-time">{{textData.recordTime}}</div>
            </div>
            <div class="button-wrapper" v-show="teachStatus.readyRecord" >
              <mu-raised-button :label="$t('recordApp.button.start')" class="demo-raised-button" backgroundColor="#E95516" @click="startRecord()"/>
            </div>
            <div class="button-wrapper" v-show="teachStatus.recording" >
                <mu-raised-button :label="$t('recordApp.button.restart')" class="demo-raised-button" backgroundColor="#8E8E8E" @click="restartRecord()"/>
                <mu-raised-button  :label="$t('recordApp.button.finish')" class="demo-raised-button" backgroundColor="#52BF53"  @click="finishRecord()"/>
            </div>
            <div class="discard-save" v-show="teachStatus.recordCompleted">
                <mu-raised-button  :label="$t('recordApp.button.discard')" class="demo-raised-button" backgroundColor="#8E8E8E" @click="discardRecord()"/>
                <mu-raised-button  :label="$t('recordApp.button.save')" class="demo-raised-button" backgroundColor="#52BF53" default @click="saveRecord()"/>
            </div>
          </div>
          <div  class="down-box" v-show="teachStatus.readyPlay">
              <!-- v-show="showData.complete" -->
              <table class="play-config table">
                  <!--<tr>-->
                      <!--<td v-text="$t('recordApp.text.speed')"></td>-->
                      <!--<td>-->
                          <!--<mu-slider v-model="speedLevel" class="demo-slider" :max="3" :min="1" :step="1"/>-->
                          <!--<span class="speed-txt">{{cData.speed}}x</span>-->
                      <!--</td>-->
                  <!--</tr>-->
                  <tr>
                      <td v-text="$t('recordApp.text.times')"></td>
                      <td ><input class="time-number" v-model="textData.playTimes" type="number" :disabled="textData.playLoop"  @blur="checkTimes" /></td>
                  </tr>
                  <tr>
                      <td v-text="$t('recordApp.text.loop')"></td>
                      <td>
                          <mu-switch v-model="textData.playLoop" class="demo-switch" /><br/>
                      </td>
                  </tr>

              </table>

              <mu-raised-button v-show="!teachStatus.playing" :label="$t('recordApp.button.play')" class="demo-raised-button " backgroundColor="#5A93D7"  @click="startPlay()" />
          </div>
          <div v-show="teachStatus.playing" class="play-overlay">
              <div class="up-box">
                  <div class="progress-panel">
                      <div class="progress-status">
                          {{textData.playFileText}}
                      </div>
                      <div class="progress-time">{{textData.recordTime}}</div>
                  </div>
              </div>

              <div class="play-progress">
                  <div class="play-text">
                      {{textData.playText}}
                  </div>
                  <div class="progress-time">
                      {{teachStatus.playedTimes}} / {{textData.playLoop === false ? textData.playTimes : '∞'}}
                  </div>
                  <mu-linear-progress mode="determinate" :value="textData.playTimeShow"/>
                  <!--<div class="play-speed">-->
                      <!--{{$t('recordApp.text.speed')}} {{cData.speed}}x-->
                  <!--</div>-->
              </div>
              <mu-raised-button label="Stop" class="demo-raised-button " backgroundColor=" #EB4444" @click="stopPlay()" />
          </div>
      </div>
  </div>

</template>

<script>
function toMMSS(timestr) {
  const sec_num = parseInt(timestr, 10); // don't forget the second param
  let minutes = Math.floor(sec_num / 60);
  let seconds = sec_num - (minutes * 60);

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

function countToTime(totalPoint, speed) {
  return parseInt(0.05 * Number(totalPoint) / Number(speed)).toString();
}
import swal from 'sweetalert2';
import eventBus from './eventBus';
import { get } from 'http';
//  import eventBusComm from '../CommonPageView/eventBus';
export default {
  props: ['cData', 'recordItem', 'moduleName', 'sideToggleState'],
  data() {
    return {
      uarm: window.UArm,
//      sideToggleState: true,
//      toggleSideVisible: true,
      language: '',
      model: window.GlobalUtil.model,
      // isLock: true,
      trigger: {
        recordCount: null,
      },
      teachStatus: {
        playing: false,
        recording: false,
        recordCompleted: false,
        readyRecord: true,
        readyPlay: false,
        standby: false,
        discarded: false,
        totalPlayTimes: null,
        playedTimes: null,
//        playStatus: false,
      },
      textData: {
        recordTime: '00:00',
        playTime: 0,
        playTimes: 1,
        playTimeShow: 0,
        progress_status: this.$t('recordApp.text.progress_status'),
        toastText: '',
        playFileText: '',
        playText: '',
        playLoop: false,
      },
      constText: {
        ready: this.$t('recordApp.text.ready'),
        recording: this.$t('recordApp.text.recording'),
        stopped: this.$t('recordApp.text.stopped'),
        playing: this.$t('recordApp.text.playing'),
        save_successful: this.$t('recordApp.text.save_successful'),
        delete_successful: this.$t('recordApp.text.delete_successful'),
        rename_successful: this.$t('recordApp.text.rename_successful'),
        previewing: this.$t('recordApp.text.previewing'),
        preview: this.$t('recordApp.text.preview'),
      },
      speedLevel: 2,
    };
  },
  mounted() {
    window.UArm.set_mode(0);
    window.UArm.uarm_info.speed = 1;
    window.UArm.set_position({
      x: 120,
      y: 0,
      z: 50,
      relative: false,
      wait: true,
    });
    this.language = window.Studio.AppConfig.LANG;
    if (this.uarmStatus.usbConnection && this.uarmStatus.socketConnection) {
      window.UArm.teach_standby_mode.start_standby_mode();
    }
    this.teachStatus.readyRecord = true;
    // event
    // Load Record
    eventBus.$on('load-record', (recordName) => {
      this.loadRecord(recordName);
    });
    // Discard Record
    eventBus.$on('discard-record', () => {
      this.discardRecord();
    });

    // Prompt save record
    eventBus.$on('prompt-save-record', (Callback) => {
      this.promptSaveRecord(Callback);
    });

//    eventBusComm.$on('toggle-side-visible', (show) => {
//      this.toggleSideVisible = show;
//    });

    if (this.isLock) {
      this.setServoAttach();
    }
    else {
      this.setServoDetach();
    }
  },
  methods: {
    setServoDetach() {
      window.UArm.set_servo_detach({ detachAll: true });
      // this.isLock = false;
    },
    setServoAttach() {
      window.UArm.set_servo_attach({ attachAll: true });
      // this.isLock = true;
    },
//    toggleSideClick() {
//      this.sideToggleState = !this.sideToggleState;
//      eventBus.$emit('sideBarShow', this.sideToggleState);
//    },
    checkTimes() {
//      console.log(this.textData.playTimes);
      if (this.textData.playTimes <= 1) {
        this.textData.playTimes = 1;
      }
    },
    loadRecord(recordName) {
      if (!this.teachStatus.playing && !this.teachStatus.record) {
        const gcodeString = window.FileManager.loadProjectSync(this.moduleName, recordName);
        const length = gcodeString.split(/\r\n|\r|\n/).length;
//        this.showData.playRecordItem = recordName;
        eventBus.$emit('play-record-changed', recordName);
        this.textData.playFileText = recordName;
        this.textData.playText = this.constText.previewing;
        const totalTime = countToTime(length, this.cData.speed);
        this.textData.recordTime = toMMSS(totalTime);
        this.textData.progress_status = recordName;
        this.teachStatus.readyPlay = true;
        this.speedLevel = 2;
        this.textData.playLoop = false;
        this.textData.playTimes = 1;
      }
    },
    promptSaveRecord(okCallback, cancelCallback) {
      okCallback = okCallback || (() => {});
      cancelCallback = cancelCallback || (() => {});
      const self = this;
      if (!self.teachStatus.recordCompleted) {
        okCallback();
      }
      else {
        swal({
          html: this.$t('recordApp.dialog.save.html'),
//          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: window.usui.okBtnColor,
          cancelButtonColor: window.usui.cancelBtnColor,
          confirmButtonText: this.$t('recordApp.dialog.save.okButton'),
          cancelButtonText: this.$t('recordApp.dialog.save.cancelButton'),
          allowEnterKey: true,
          allowOutsideClick: false,
          showCloseButton: true,
          reverseButtons: true,
        }).then(() => {
          self.saveRecord(okCallback);
        }, (dismiss) => {
          if (dismiss === 'cancel') {
            okCallback();
          }
          else if (dismiss === 'close') {
            cancelCallback();
          }
        });
      }
    },
    startRecord() {
//      console.log('start record');
//      console.log(window.UArm.uarm_info.uarm_connected);
      if (window.UArm.uarm_info.uarm_connected === true) {
//        eventBus.$emit('teach-close-side');
        window.UArm.record.start_recording();
        this.isLock = false;
      }
      else {
        this.alertUnconnected();
      }
    },
    finishRecord() {
      window.UArm.record.stop_recording();
      this.isLock = true;
    },
    restartRecord() {
      this.teachStatus.discarded = true;
      window.UArm.record.stop_recording();
      this.textData.recordTime = '00:00';
      this.isLock = true;
    },
    saveRecord(okCallback) {
      okCallback = okCallback || (() => {});
      const self = this;
      swal({
        title: this.$t('recordApp.dialog.name.html'),
        input: 'text',
        showCancelButton: true,
        confirmButtonText: this.$t('recordApp.dialog.name.okButton'),
        cancelButtonText: this.$t('recordApp.dialog.name.cancelButton'),
        showLoaderOnConfirm: true,
        confirmButtonColor: window.usui.okBtnColor,
        cancelButtonColor: window.usui.cancelBtnColor,
        reverseButtons: true,
        preConfirm(text) {
          return new Promise((resolve, reject) => {
            // if (window.FileManager.checkExistedTeachModeRecord(text)) {
            //   reject('This filename has been taken.');
            // }
            const projects = window.FileManager.listProjectListSync(self.moduleName, { sortOrderDesc: true });
            const projectNameList = [];
            for (const p of projects) {
              projectNameList.push(p.name);
            }
            if (text.length === 0) {
              reject(`${self.$t('recordApp.dialog.name.emptyAlert')} ${text}.`);
            }
            else if (projectNameList.indexOf(text) >= 0) {
              reject(`${text} ${self.$t('recordApp.dialog.name.existedAlert')}`);
            }
            else {
              resolve();
            }
          });
        },
        allowOutsideClick: false,
      }).then((text) => {
        window.FileManager.saveProjectSync(self.moduleName, text, null);
        window.Studio.userTracking.insertItem('teachPlayFileSaveTimes');
        self.listRecordFiles();
        self.discardRecord();
        swal({
          type: 'success',
          title: self.$t('recordApp.dialog.success.title'),
          html: `${self.$t('recordApp.dialog.success.content')} ${text}`,
          onClose: okCallback,
        });
      });
    },
    listRecordFiles() {
      eventBus.$emit('refresh-record-list');
    },
    discardRecord() {
      this.teachStatus.recording = false;
      this.teachStatus.recordCompleted = false;
      this.teachStatus.readyRecord = true;
      this.teachStatus.readyPlay = false;
      this.textData.progress_status = this.constText.ready;
      this.textData.recordTime = '00:00';
    },
    alertUnconnected() {
      swal({
        title: 'uArm is not connected.',
        text: 'Please plug in USB and keep uArm powered on.',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: window.usui.okBtnColor,
        cancelButtonColor: window.usui.cancelBtnColor,
        confirmButtonText: 'OK',
        reverseButtons: true,
      }).then(() => {
      });
    },
    startPlay() {
      const self = this;

      if (window.UArm.uarm_info.uarm_connected === false) {
        this.alertUnconnected();
        return;
      }
      self.teachStatus.playing = true;
      let times;
//      console.log(`self.textData.playLoop: ${self.textData.playLoop}`);
      if (self.textData.playLoop) {
        times = 0;
      }
      else {
        times = self.textData.playTimes;
      }
      self.teachStatus.playedTimes = 1;
      const startCallback = (data) => {
        const totalTime = countToTime(data, self.cData.speed);
        self.textData.recordTime = toMMSS(totalTime);
      };
      const completedCallback = () => {
        self.teachStatus.playing = false;
      };
      const progressCallback = (times, progress) => {
        self.textData.playTimeShow = progress;
        self.teachStatus.playedTimes = times;
      };
      window.UArm.play.startPlay({
        speed: this.cData.speed,
        times,
        startCallback,
        progressCallback,
        completedCallback,
      });
    },
    stopPlay() {
      this.teachStatus.playing = false;
      window.UArm.play.stopPlay();
    },
  },
  computed: {
    uarmStatus() {
      return this.$store.getters.uarmStatus;
    },
    isLock: {
      get() {
        return this.model.localTeachMgr.isLock;
      },
      set(value) {
        this.model.localTeachMgr.isLock = value;
      },
    },
  },
// setServoDetach()">UnLock</div>
//             <div v-else class="btn-lock" @click="setServoAttach()
  watch: {
    isLock() {
      if (this.isLock) {
        this.setServoAttach()
      }
      else {
        this.setServoDetach()
      }
    },
    speedLevel() {
      const matchTable = {
        1: '0.5',
        2: '1',
        3: '2',
      };
      this.cData.speed = matchTable[this.speedLevel];
      window.UArm.play.set_play_speed(this.cData.speed);
    },
    'teachStatus.playing'() {
      const self = this;
//      let totalPoint;
//      let totalTime;
//      self.teachStatus.playing = self.uarmStatus.teach.playStatus;
      if (self.teachStatus.playing) {
        if (this.recordItem.playRecordName === null) {
          this.textData.playFileText = this.constText.preview;
          this.textData.playText = this.constText.previewing;
        }
      }
      else {
        self.teachStatus.readyPlay = true;
        eventBus.$emit('play-record-changed', null);
        self.textData.playTimeShow = 0;
      }
    },
//    'uarmStatus.teach.playStatus'() {
//      const self = this;
//      let totalPoint;
//      let totalTime;
//      self.teachStatus.playing = self.uarmStatus.teach.playStatus;
//      if (self.uarmStatus.teach.playStatus) {
//        if (this.recordItem.playRecordName === null) {
//          this.textData.playFileText = this.constText.preview;
//          this.textData.playText = this.constText.previewing;
//        }
//        totalPoint = self.uarmStatus.teach.playTotalCount;
//        totalTime = countToTime(totalPoint, self.cData.speed);
//        self.textData.recordTime = toMMSS(totalTime);
//      }
//      else {
//        self.teachStatus.readyPlay = true;
//        self.recordItem.playRecordItem = null;
//        eventBus.$emit('play-record-changed', null);
//        self.textData.playTimeShow = 0;
//      }
//    },
    'uarmStatus.teach.recordStatus'() {
      const self = this;
      const status = self.uarmStatus.teach.recordStatus;
      self.teachStatus.recording = status;
      if (status) {
        self.textData.recordTime = '00:00';
        let secondCounts = 0;
        self.textData.progress_status = this.constText.recording;
        this.trigger.recordCount = setInterval(() => {
          secondCounts++;
          self.textData.recordTime = toMMSS(secondCounts.toString());
        }, 1000);
        self.teachStatus.readyRecord = false;
        self.teachStatus.recordCompleted = false;
        self.teachStatus.readyPlay = false;
      }
      else {
        clearInterval(this.trigger.recordCount);
        if (self.teachStatus.discarded) {
          self.textData.progress_status = self.constText.ready;
          self.teachStatus.readyRecord = true;
          self.teachStatus.readyPlay = false;
          self.teachStatus.recordCompleted = false;
          self.teachStatus.discarded = false;
        }
        else {
          self.textData.progress_status = self.constText.stopped;
          self.teachStatus.readyPlay = true;
          self.teachStatus.readyRecord = false;
          self.teachStatus.recordCompleted = true;
          self.teachStatus.discarded = false;
        }
      }
    },
    'uarmStatus.teach.standbyStatus'() {
      const self = this;
      self.teachStatus.standby = self.uarmStatus.teach.standbyStatus;
    },
//    'uarmStatus.teach.playProgress'() {
//      const self = this;
//      if (self.uarmStatus.teach.playStatus) {
//        self.textData.playTimeShow = self.uarmStatus.teach.playProgress;
//      }
//    },
  },
};

</script>

<style lang="sass" scoped>
.btn-lock {
  right: 0;
}
$bottomTextColor: #555;
$bottomRadialEnd: #444;
.notfull {

}
.record-wrapper {
    position:relative;
    display: flex;
    flex-direction: row;
    width:100%;
    height:100%;
    justify-content: space-around;
    align-items: center;
    .canvas-wrapper {
        max-width:40vw;
        img{
          width:100%;
          max-width: 550px;
        }
    }
    .not-canvas {
        width:20vw;
        max-width: 386px;
        height: 32vw;
        max-height:624px;
        border:1px solid #6487B2;
        background: white;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        padding: 0;
        text-align: center;
        position:relative;
        .up-box {
            .up-switch {
              padding-top: 50px;
              font-size: 15px;
            }
            .progress-panel {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                margin: 12% 12% 0;
                padding: 14px 0;
                border: 1px solid #D8D8D8;
                border-radius:2px;
                color: #515151;
                .progress-time {
                    color:#616161;
                }
            }
            .button-wrapper {
                margin:38% 14% 0;
                display: flex;
                justify-content: space-around;
            }
            .discard-save {
                margin-top:12%;
                display: flex;
                justify-content: space-around;
            }
        }
        .down-box {
            table {
                margin: 9% 0;
                td{
                  vertical-align:middle;
                }
                td:first-child {
                    width: 40%;
                }
                td:last-child {
                    text-align: left;
                    display: flex;
                }
                .speed-txt {
                    padding: 0 5%;
                }
                .time-number {
                    border:1px solid #D7D7D7;
                    border-radius: 1px;
                    background: #FDFDFD;
                    font-size: 12px;
                    color: #555;
                    height:2vw;
                    line-height: 2vw !important;
                    width:3vw;text-align: center;
                    margin-bottom:2vh;
                }
            }
        }
        .switch-wrapper {
            text-align: center;
            .mu-switch-label {
                color: white;
            }
        }
        .play-overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.94);
            z-index: 9;
            /*height:60vh;*/
            .play-length {
                text-align: center;
                color: #85BCFF;
                margin: 14% 5%;
            }
            .play-progress {
                margin: 18% 10%;
                color: #85BCFF;
                .play-text {
                    font-size: 10px;
                    text-align: center;
                    color: white;
                    padding-bottom: 6%;
                    letter-spacing: 0.63px;
                }
                .play-speed {
                    font-size: 10px;
                    text-align: center;
                    color: white;
                    padding-top: 6%;
                    letter-spacing: 0.63px;
                }
            }
            .up-box {
                .progress-panel {
                    .progress-status {
                        color: #F6F6F6;
                    }
                }
            }
        }
    }
}

.themeblue {
    background: #4B5B68;
}
.ui-slider-range {
    background: #4B5B68;
}
.slider-btn {
    background: #313131;
    border: 1px white solid;
}

#slider-vertical {
    margin: 22% auto;
    background: white;
}
.mu-dialog {
    width: 35%;
}
@media screen and (min-height: 800px){
    .record-wrapper .canvas-wrapper img {
        max-width: 630px;
    }
}
@media screen and (min-height: 1000px){
    .record-wrapper .canvas-wrapper img {
        max-width: 730px;
    }
}
</style>
