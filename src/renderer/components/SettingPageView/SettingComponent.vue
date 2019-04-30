<template lang="html">
<div class="content-box">

  <div class="tab-content tab-update" v-if="activeTab === 'updateTab'">
    <div class="update-head">
      <div class="head-left">
        {{updateAvailable}}{{$t('settingPage.updateAvailable')}}
      </div>
      <div class="head-left">
        <button type="button" name="button" class="active-button" @click="checkForUpdates()">{{$t('settingPage.refresh')}}</button>
      </div>
    </div>
    <div class="update-list">
      <div class="update-item" v-for="(item,key) in updateList">
        <img :src="item.img" alt="">
        <div class="update-name">
          <div class="name-text" v-text="item.name"></div>
          <div class="us-orange" v-text="item.version"></div>
          <div class="us-orange">{{$t('settingPage.release')}} {{item.date}}</div>
        </div>
        <div class="update-info">
          <ul>
            <li v-for="ele in item.releaseNote" v-text="ele"></li>
          </ul>
          <div class="us-orange" @click="showChangeLog(key)" v-text="$t('settingPage.moreinfo')"></div>
        </div>
        <div class="update-action">
          <button type="button" name="button" class="active-button" @click="updateItem(key)" v-show="item.updateAvailable">
            {{$t('settingPage.update')}}</button>
          <button type="button" name="button" class="disable-button" disabled="disabled" v-show="item.latest">
            {{$t('settingPage.updated')}}</button>
        </div>

      </div>
    </div>
  </div>

  <div class="tab-content" v-if="activeTab === 'deviceTab'">
    <table>
      <tbody>
        <tr>
          <td v-text="$t('settingPage.deviceName')"></td>
          <td>{{uarmInfo.productName}}</td>
        </tr>
        <tr>
          <td v-text="$t('settingPage.devicePort')"></td>
          <td>{{uarmInfo.portName}}</td>
        </tr>
        <tr>
          <td v-text="$t('settingPage.deviceFirmware')"></td>
          <td>{{uarmInfo.firmwareVersion}}</td>
        </tr>
        <tr>
          <td v-text="$t('settingPage.deviceSerial')"></td>
          <td>{{uarmInfo.portSerialNumber}}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <mu-dialog :open="changeLogModal" :title="$t('settingPage.changeLog')" dialogClass="modal-custom" >
    <ul class="text-left">
      <li v-for="li in changeLogText" v-text="li"></li>
    </ul>
    <mu-raised-button slot="actions" @click="changeLogModal = false" primary :label="$t('settingPage.OK')" backgroundColor="#D95E2E" color="#fff"/>
  </mu-dialog>

</div>
</template>

<script>
import swal from 'sweetalert2';
import versionCompare from 'general-version-compare';
import { ipcRenderer } from 'electron';
import eventBus from './eventBus';
export default {
  props: ['activeTab'],
  data() {
    return {
      changeLogModal: false,
      changeLogText: [],
      updateList: {
        studio: {
          name: 'uArm Studio',
          img: require('./assets/img/logo.svg'),
          restart: true,
          version: null,
          date: null,
          releaseNote: [],
          progress: 0,
          updateAvailable: false,
          latest: false,
        },
        firmware: {
          name: 'uArm Firmware',
          img: require('./assets/img/firmware_small.png'),
          restart: true,
          version: null,
          date: null,
          releaseNote: [],
          progress: 0,
          updateAvailable: false,
          latest: false,
        },
      },
    };
  },
  mounted() {
    ipcRenderer.on('fetch-version-info-reply', (event, error, versionInfo) => {
      if (error) {
        swal({
          type: 'error',
          text: error,
        });
      }
      this.fetchUpdate(versionInfo);
    });
    this.checkForUpdates();
  },
  methods: {
    checkForUpdates() {
      ipcRenderer.send('fetch-version-info');
    },
    fetchUpdate(versionInfo) {
      const AppConfig = window.Studio.AppConfig;
      if (versionInfo !== undefined && versionInfo !== null) {
        // firmware version update
        if (this.uarmStatus.usbConnection) {
          if (Object.keys(versionInfo).indexOf('firmware') !== -1) {
            if (Object.keys(versionInfo.firmware).indexOf(this.uarmInfo.productType) !== -1) {
              const updateJson = versionInfo.firmware[this.uarmInfo.productType];
              this.updateList.firmware.version = updateJson.version;
              this.updateList.firmware.releaseNote = updateJson.releaseNote[AppConfig.LANG];
              this.updateList.firmware.date = updateJson.publishDate;
            }
          }
        }
        // studio version update
        if (Object.keys(versionInfo).indexOf('software') !== -1) {
          const key = `${AppConfig.APP_NAME}-${AppConfig.OS_TYPE}-${AppConfig.OS_ARCH}`;
          console.log(`Fetch Studio version, key is ${key}`);
          if (Object.keys(versionInfo.software).indexOf(key) !== -1) {
            const updateJson = versionInfo.software[key];
            this.updateList.studio.version = updateJson.version;
            this.updateList.studio.releaseNote = updateJson.releaseNote[AppConfig.LANG];
            this.updateList.studio.date = updateJson.publishDate;
          }
        }
      }
    },
    updateItem(index) {
      if (index === 'firmware') {
        eventBus.$emit('change-allow-quit', false);
        ipcRenderer.on('firmware-upgrade-completed', () => {
          eventBus.$emit('change-allow-quit', true);
          swal({
            type: 'success',
            title: this.$t('settingPage.firmwareCompleted'),
          });
        });
        ipcRenderer.send('firmware-upgrade', this.uarmInfo.productType, this.uarmInfo.portName);
      }
      else if (index === 'studio') {
        ipcRenderer.send('check-for-updates');
      }
    },
    showChangeLog(key) {
      this.changeLogText = this.updateList[key].releaseNote;
      this.changeLogModal = true;
    },
  },
  computed: {
    uarmStatus() {
      return this.$store.getters.uarmStatus;
    },
    uarmInfo() {
      return this.$store.getters.uarmInfo;
    },
    updateAvailable() {
      let count = 0;
      if (this.firmwareUpdateAvailable) {
        count += 1;
      }
      if (this.studioUpdateAvailable) {
        count += 1;
      }
      return count;
    },
    firmwareUpdateAvailable() {
      return versionCompare(this.updateList.firmware.version, this.uarmInfo.firmwareVersion) === 1;
    },
    studioUpdateAvailable() {
      return versionCompare(this.updateList.studio.version, window.Studio.AppConfig.APP_VERSION) === 1;
    },
  },
  watch: {
    'updateList.firmware.version'() {
      if (this.uarmStatus.usbConnection && this.updateList.firmware.version !== null) {
        this.updateList.firmware.updateAvailable = this.firmwareUpdateAvailable;
        this.updateList.firmware.latest = !this.firmwareUpdateAvailable;
      }
      else {
        this.updateList.firmware.updateAvailable = false;
        this.updateList.firmware.latest = false;
      }
    },
    'updateList.studio.version'() {
      if (this.updateList.studio.version !== null) {
        this.updateList.studio.updateAvailable = this.studioUpdateAvailable;
        this.updateList.studio.latest = !this.studioUpdateAvailable;
      }
      else {
        this.updateList.studio.updateAvailable = false;
        this.updateList.studio.latest = false;
      }
    },
    'uarmStatus.usbConnection'() {
      if (this.uarmStatus.usbConnection) {
        this.checkForUpdates();
      }
      else {
        this.updateList.firmware.version = null;
        this.updateList.firmware.date = 'N/A';
        this.updateList.firmware.releaseNote = [];
      }
    },
  },
};

</script>
<style lang="sass" scoped>
  $usOrange:#D95E2E;
  $usGrey:#99A2A5;
  .content-box{
    width:100%;
    height:80%;
    .us-orange{
      color:$usOrange;
    }
    .active-button{
      border: 1px solid $usOrange;
      border-radius: 2px;
      background:white;
      color:#D95E2E;
      padding:0 2vw;
      margin:2vw;
    }
  .disable-button{
    border: 1px solid $usGrey;
    border-radius: 2px;
    background:white;
    color:$usGrey;
    padding:0 2vw;
    margin:2vw;
  }
    .tab-content{
      width:100%;
      height:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      .firmware-update{
          width:100%;
          height:100%;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          .version-update{
            img{
              cursor:pointer;
            }
          }
          & > img{
            padding:3vw;
            width:16vw;
            height:16vw;
          }

      }
      .update-head{
        width:100%;
        display:flex;
        justify-content:space-between;
        align-items:center;
        color:$usOrange;
        border-bottom:1px solid $usOrange;
        .head-left{
          padding:0 2vw;
        }
      }
      .update-list{
        width:100%;
        .update-item{
          display:flex;
          justify-content: space-around;
          padding: 1vw 0;
          border-bottom:1px solid #e9e9e9;
          & > img{
            width:5vw;
            margin:1vw 3vw;
            height:5vw;
          }
          .update-name{
            width:30%;
            .name-text{
              font-size:1.5vw;
            }
          }
          .update-info{
            width:30%;
            ul{
              padding-left:0;
            }
            .us-orange{
              cursor:pointer;
              text-decoration:underline;
            }
          }
          .update-action{
            width:20%;
            text-align:center;
            margin:auto;
          }
        }
      }
      table{
        width:50%;
        height:50%;
        td:last-child{
          color:$usOrange;
        }
        td{
          vertical-align:middle;

        }
      }
    }
    .tab-content.tab-update{
      justify-content:flex-start;
    }
    .mu-dialog-body{
      ul{
        text-align:left;
      }
    }
  }

</style>
