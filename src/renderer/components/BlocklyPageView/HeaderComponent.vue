<template>
    <div class="header-wrapper-left">
        <mu-appbar>
            <a @click="backToHome()"><img src="../assets/img/btn_back.svg" class="back-button"/></a>
            <img src="./assets/img/blockly.svg" alt="" class="brand-logo-blockly"/>
            <!--<mu-icon-button :tooltip="$t('BlocklyPageView.tooltip.reset')" slot="right" @click="discardProject()" class="reset-btn"><img class="reset-img" src="./assets/img/btn_reset.svg" alt=""></mu-icon-button>-->
            <mu-icon-button :tooltip="$t('BlocklyPageView.tooltip.reset')" slot="right" @click="resetPosition()" class="reset-btn"><img class="reset-img" src="./assets/img/btn_reset.svg" alt=""></mu-icon-button>
            <mu-icon-button class="vertical-line" slot="right"></mu-icon-button>
            <mu-icon-button :tooltip="$t('BlocklyPageView.tooltip.run')" id="fixCenter"  slot="right" @click="runProject()" class="run-btn">
                <img v-if="blocklyRunning" src="./assets/img/icon_stop.svg" alt="">
                <img v-else src="./assets/img/icon_start.svg" alt="">
            </mu-icon-button>
            <mu-icon-button :tooltip="$t('BlocklyPageView.tooltip.new')" slot="right" @click="newProject()"><img src="../assets/img/icon_new_project.svg" alt="New Project"></mu-icon-button>
            <mu-icon-button :tooltip="$t('BlocklyPageView.tooltip.saveas')" slot="right" @click="saveAsProject()" ><img src="./assets/img/icon_Save as.svg" alt="icon_Save as"></mu-icon-button>
            <mu-icon-button :tooltip="$t('BlocklyPageView.tooltip.save')" slot="right" @click="saveProject()" ><img src="../CommonPageView/assets/img/UserProfile/icon_save.svg" alt=""></mu-icon-button>
            <mu-icon-button :tooltip="$t('BlocklyPageView.tooltip.discard')" slot="right" @click="discardProject()" ><img src="./assets/img/icon_delete.svg" alt=""></mu-icon-button>
            <!-- <mu-icon-button :tooltip="$t('BlocklyPageView.tooltip.camera')" slot="right" @click="toggleCamera(!cameraConnectStatus)" :class="cameraButtonClassName"> -->
              <!-- <img src="./assets/img/icon_camera.svg" alt=""> -->
              <!-- </mu-icon-button> -->
        </mu-appbar>
        <form id='f_form' v-show='false'>
          <input id='f_input' type='file' @change="didImport()"/>
        </form>
        <form id='f_form_out' v-show='false'>
          <input id='f_output' type='path' @change="didOutput()"/>
        </form>

    </div>

</template>
<script>
import eventBus from './eventBus';
import swal from 'sweetalert2';
import fs from 'fs';
// import Camera from '../assets/api/camera';
import { Blockly } from './assets/lib/blockly/blockly';
module.exports = {
  props: ['blocklyData', 'moduleName'],
  components: {
  },
  data() {
    return {
      uarmInfo: {
        portName: null,
        hardwareVersion: null,
        firmwareVersion: null,
      },
      uiData: {
        sideToggleState: false,
      },
    };
  },
  beforeDestroy() {
    eventBus.$off();
  },
  methods: {
    backToHome() {
      console.log('back');
      // this.$router.push('home-page');
      // this.$router.push({ name: 'home-page' });
      this.$router.go(-1);
    },
    newProject() {
      eventBus.$emit('new-project');
    },
    saveProject() {
      eventBus.$emit('save-project');
    },
    saveAsProject() {
      eventBus.$emit('save-project-as');
    },
    noConnectionAlert() {
      swal({
        title: this.$t('dialog.notConnected.title'),
        html: this.$t('dialog.notConnected.html'),
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: window.usui.okBtnColor,
        confirmButtonText: this.$t('dialog.notConnected.okbtn'),
      }).then(() => {
      });
    },
    runProject() {
      const connect = this.uarmConnectStatus;
      if (!connect) {
        this.noConnectionAlert();
        return;
      }
      if (Blockly.Running || this.blocklyData.running) {
        eventBus.$emit('blockly-stop-project');
      }
      else {
        eventBus.$emit('blockly-start-project');
      }
    },
    discardProject() {
      const self = this;
      if (self.blocklyData.blocksLength <= 0) {
        swal(this.$t('dialog.deleteBlocks.faila'), this.$t('dialog.deleteBlocks.failb'), 'warning');
        return;
      }
      swal({
        title: this.$t('dialog.deleteBlocks.title'),
        text: this.$t('dialog.deleteBlocks.text'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: window.usui.cancelBtnColor,
        cancelButtonColor: window.usui.okBtnColor,
        confirmButtonText: this.$t('dialog.deleteBlocks.okbtn'),
        cancelButtonText: this.$t('dialog.deleteBlocks.cancelbtn'),
        reverseButtons: true,
      }).then(() => {
        eventBus.$emit('blockly-clear-project');
      });
    },
    // toggleCamera(open) {
    //   const self = this;
    //   if (self.cameraConnectStatus && !open) {
    //     Camera.closeWindow();
    //   }
    //   else if (!self.cameraConnectStatus && open) {
    //     Camera.openWindow();
    //   }
    // },
    importProject() {
      document.getElementById('f_input').click();
    },
    didImport() {
      const file = document.getElementById('f_input').files[0];
      let file_name = file.name;
      file_name = file_name.replace('.xml', '');
      let counter = 1;
      while (window.FileManager.listProjectListSync(this.moduleName).indexOf(file_name) >= 0) {
        file_name = file.name.replace('.xml', '');
        file_name += '(';
        file_name += counter;
        file_name += ')';
        counter++;
      }
      const content = fs.readFileSync(file.path, 'utf8');
      if (content !== null && content.indexOf('<xml') >= 0 && content.indexOf('</xml>') >= 0) {
        window.FileManager.saveProjectSync(this.moduleName, file_name, content);
        eventBus.$emit('refresh-project-list');
      }
      else {
        swal({
          title: this.$t('dialog.failImport.title'),
          text: this.$t('dialog.failImport.html'),
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: window.usui.okBtnColor,
          cancelButtonColor: window.usui.cancelBtnColor,
          confirmButtonText: this.$t('dialog.failImport.okbtn'),
          reverseButtons: true,
        }).then(() => {
        });
      }
      document.getElementById('f_input').value = null;
      document.getElementById('f_input').files = null;
    },
    exportProject() {
      if (this.blocklyData.projectContent === null) {
        swal({
          title: this.$t('dialog.failExport.title'),
          text: this.$t('dialog.failExport.html'),
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: window.usui.okBtnColor,
          confirmButtonText: this.$t('dialog.failExport.okbtn'),
        }).then(() => {
        });
        return;
      }
      this.downloadXML('export', this.blocklyData.projectContent);
    },
    downloadXML(filename, text) {
      let csv;
      if (text === null) {
        text = '';
      }
      csv = 'data:text/xml;charset=utf-8,';
      csv += text;
      const data = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    },
    didOutput() {
    },
    resetPosition() {
      window.UArm.reset();
    },
  },
  mounted() {
    const self = this;
    // toggle-camera
    // eventBus.$on('toggle-camera', (open) => {
    //   if (open === null || open === 'undefined') {
    //     self.toggleCamera(!self.cameraConnectStatus);
    //   }
    //   else {
    //     self.toggleCamera(open);
    //   }
    // });
    // quit blockly
    eventBus.$on('quit', () => {
      self.quit();
    });
  },
  computed: {
    socketConnectStatus() {
      return this.$store.getters.uarmStatus.socketConnection;
    },
    uarmConnectStatus() {
      return this.$store.getters.uarmStatus.usbConnection;
    },
    // cameraConnectStatus() {
    //   return this.$store.getters.uarmStatus.cameraConnection;
    // },
    playButtonIconName() {
      return this.blocklyRunning ? 'stop' : 'play_arrow';
    },
    // cameraButtonClassName() {
    //   return this.cameraConnectStatus ? 'runButton-running' : 'runButton-stop';
    // },
    blocklyButtonClassName() {
      return this.blocklyRunning ? 'runButton-running' : 'runButton-stop';
    },
    blocklyRunning() {
      return this.blocklyData.running;
    },
  },
  watch: {
    uarmConnectStatus() {
      if (this.blocklyRunning && !this.uarmConnectStatus) {
        eventBus.$emit('blockly-stop-project', true);
        this.noConnectionAlert();
      }
    },
  },
};

</script>
<style lang="sass" scoped>
.header-wrapper-left {
    position: relative;
    padding-right: 68px;
    .divide-line {
        width:1px;
        border-right:1px solid #fff;
        height:20px;
    }
}
.mu-appbar {
  background-color: transparent;
}
.mu-paper-1 {
    box-shadow: none;
}
.back-button {
    padding-left: 10px;
    padding-right: 25px;
    cursor: pointer;
    height:20px;
}

.brand-logo-blockly {
    /*padding-left: 10px;*/
    height: 22px;
    /*margin: 10px 20px;*/
}

.reset-btn {
    .reset-img{
        width:16px;
    }
}

.vertical-line {
    border-right:1px solid #fff;
    margin-right:28px;
    height:20px;
    border-radius: 0;
    padding:0;
    width: 16px;
}

.run-btn {
    /*background-color: #555;*/
    /*border-radius: 50%;*/
    /*width: 40px;*/
    /*height: 40px;*/
    /*line-height: 0.2;*/
    margin-right: 12px;
    img{
        /*width:12px;*/
      transform: scale(1.5);
    }
}

.runButton-running {
    border-radius: 0;
    background-color: #0a5;
}

.runButton-running:hover {
    background-color: #dd4b39;
}

.runButton-stop {
    border-radius: 0;
    background-color: transparent;
}

.runButton-stop:hover {
    background-color: #0a5;
}

#fixCenter > div{
  display: flex;
  justify-content: center;
}


</style>
