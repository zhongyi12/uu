<template lang="html">
<div class="update-wrapper">
    <div class="update-head">
        <div class="head-left">
            {{updateAvailable}}{{$t('settingPage.updateAvailable')}}
            <button type="button" name="button" class="active-button" @click="checkForUpdates()">{{$t('settingPage.refresh')}}</button>
        </div>
    </div>
    <div class="update-list">
        <div v-if="item.isShow" class="update-item" v-for="(item,key) in updateList">
          <img :src="item.img" alt="">
          <div class="update-name">
            <div class="name-text" v-text="item.name"></div>
            <div class="us-orange" v-text="item.version"></div>
            <div class="us-orange">{{$t('settingPage.release')}} {{item.date}}</div>
          </div>
          <div class="update-info">
            <ul class="info-list">
              <li v-for="(ele,index) in item.releaseNote" v-html="`${ele}`"></li>
            </ul>
            <div class="us-orange" @click="showChangeLog(key)" v-text="$t('settingPage.moreinfo')"></div>
          </div>
          <div class="update-action">
            <button v-show="((!isNewFirmwareVersion && key === 'firmwarePro3') || (isNewFirmwareVersion && key === 'firmwarePro4') || key === 'firmwareSwift' || key === 'studio') && item.updateAvailable" type="button" name="button" class="active-button" @click="updateItem(key)">
              {{$t('settingPage.update')}}
            </button>
            <button v-show="((!isNewFirmwareVersion && key === 'firmwarePro3') || (isNewFirmwareVersion && key === 'firmwarePro4') || key === 'firmwareSwift' || key === 'studio') && item.latest" type="button" name="button" class="disable-button" disabled>
              {{$t('settingPage.updated')}}
            </button>
            <button v-show="isNewFirmwareVersion && key === 'firmwarePro3'" type="button" name="button" class="active-button" style="" @click="update2Pro(key)">
              {{$t('settingPage.updateTo3')}}
            </button>
            <button v-show="!isNewFirmwareVersion && key === 'firmwarePro4'" type="button" name="button" class="active-button" style="" @click="update2Pro(key)">
              {{ realTitle($t('settingPage.updateTo4')) }}
            </button>
          </div>
        </div>
    </div>
    <mu-dialog :open="changeLogModal" :title="$t('settingPage.changeLog')" dialogClass="modal-custom" titleClass="update-title">
        <ul class="text-left">
            <li v-for="(li,index) in changeLogText" v-html="`${li}`"></li>
        </ul>
        <mu-raised-button slot="actions" @click="changeLogModal = false" primary :label="$t('settingPage.OK')" backgroundColor="#D95E2E" color="#fff"/>
    </mu-dialog>
    <mu-dialog :open="changeFirmwareTo3Modal" @close="changeFirmwareTo3Modal=false" dialogClass="modal-custom font-change-dialog">
        <h3 class="update-dialog-title">{{ $t('change_firm_to_3_title') }}</h3>
        <mu-raised-button class="com-fixed-size-btn" slot="actions" @click="changeFirmwareTo3Modal=false" :label="$t('settingPage.cancel')" backgroundColor="#ccc"/>
        <mu-raised-button class="com-fixed-size-btn" slot="actions" primary @click="update2Pro3()" :label="$t('settingPage.OK')" backgroundColor="#52BF53"/>
    </mu-dialog>
    <mu-dialog :open="changeFirmwareTo4Modal" @close="changeFirmwareTo4Modal=false" dialogClass="modal-custom font-change-dialog">
        <h3 class="update-dialog-title">{{ realTitle($t('change_firm_to_4_title')) }}</h3>
        <mu-raised-button class="com-fixed-size-btn" slot="actions" @click="changeFirmwareTo4Modal=false" :label="$t('settingPage.cancel')" backgroundColor="#ccc"/>
        <mu-raised-button class="com-fixed-size-btn" slot="actions" primary @click="update2Pro4()" :label="$t('settingPage.OK')" backgroundColor="#52BF53"/>
    </mu-dialog>
          <!-- {{ versionInfoStr }} -->
          <!-- {{ uarmInfo.productType }} -->
    <!-- <textarea style="position:absolute;left:10px;bottom:20px;width:300px;height:250px;backgournd:yellow;">
      {{ versionInfoStr }}
    </textarea> -->
</div>
</template>

<script>
  import eventBus from './eventBus';
  import swal from 'sweetalert2';
  import versionCompare from 'general-version-compare';
  import { ipcRenderer } from 'electron';
  export default {
    i18n: {
      messages: {
        en: {
          fetch_update_failed: 'Can not reach update information: {err}.',
          firmware_failed_title: 'Firmware Upgrade Failed',
// eslint-disable-next-line max-len
          firmware_failed_text: '<a href="https://forum.ufactory.cc/t/official-manual-firmware-upgrade-uarm-swift-pro/1255">Still failed to upgrade?</a>',
          try_again: 'try again',
          change_firm_to_3_title: 'Note: You are going to flash firmware 3.2.0 to uArm Swift Pro, Leap Motion control is not available on firmware 3.2.0',
          change_firm_to_4_title: 'Note: You are going to flash firmware {cur_new_firmware_ver} to uArm Swift Pro, Grove Sensors and 3D Printing function are not available for firmware {cur_new_firmware_ver}',
        },
        cn: {
          fetch_update_failed: '无法获取更新信息: {err}.',
          firmwareFailed: '固件更新失败',
// eslint-disable-next-line max-len
          firmware_failed_text: '<a href="https://forum.ufactory.cc/t/uarm-swift-pro/1263">Still failed to upgrade?</a>',
          try_again: '重试',
          change_firm_to_3_title: '注意：即将刷入的固件V3.2.0不支持Leap Motion控制。',
          change_firm_to_4_title: '注意：即将刷入的固件V{cur_new_firmware_ver}不支持Grove传感器及3D打印功能。',
        },
      },
    },
    data() {
      return {
        versionInfoStr: 'null',
        changeLogModal: false,
        changeFirmwareTo3Modal: false,
        changeFirmwareTo4Modal: false,
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
            isShow: true,
          },
          // firmware: {
          //   name: 'uArm Firmware',
          //   img: require('./assets/img/firmware_small.png'),
          //   restart: true,
          //   version: null,
          //   date: null,
          //   releaseNote: [],
          //   progress: 0,
          //   updateAvailable: false,
          //   latest: false,
          // },
          firmwareNan: {
            name: 'uArm unconnected',
            img: require('./assets/img/firmware_small.png'),
            restart: true,
            version: null,
            date: null,
            releaseNote: [],
            progress: 0,
            updateAvailable: false,
            latest: false,
            isShow: false,
          },
          firmwareSwift: {
            name: 'uArm Swift Firmware',
            img: require('./assets/img/firmware_small.png'),
            restart: true,
            version: null,
            date: null,
            releaseNote: [],
            progress: 0,
            updateAvailable: false,
            latest: false,
            isShow: true,
          },
          firmwarePro3: {
            name: 'uArm Swift Pro Firmware',
            img: require('./assets/img/firmware_small.png'),
            restart: true,
            version: null,
            date: null,
            releaseNote: [],
            progress: 0,
            updateAvailable: false,
            latest: false,
            isShow: true,
          },
          firmwarePro4: {
            name: 'uArm Swift Pro New Firmware',
            img: require('./assets/img/firmware_small.png'),
            restart: true,
            version: null,
            date: null,
            releaseNote: [],
            progress: 0,
            updateAvailable: false,
            latest: false,
            isShow: true,
          },
        },
      };
    },
    mounted() {
      this.setUpSuccessCallback();
      ipcRenderer.on('fetch-version-info-reply', (event, error, versionInfo) => {
        if (error) {
          this.$store.dispatch('showSnackBar', { message: this.$t('fetch_update_failed', { err: error }) });
        }
        this.fetchUpdate(versionInfo);
      });
      this.checkForUpdates();
      this.checkDisplayList();
    },
    methods: {
      realTitle(originTitle) {
        const AppConfig = window.Studio.AppConfig;
        return originTitle.replace('{cur_new_firmware_ver}', AppConfig.cur_new_firmware_ver);
      },
      checkDisplayList() {
        const usbConnection = this.uarmStatus.usbConnection;
        this.updateList.firmwareNan.isShow = !usbConnection;
        this.updateList.firmwareSwift.isShow = usbConnection;
        this.updateList.firmwarePro3.isShow = usbConnection;
        this.updateList.firmwarePro4.isShow = usbConnection;
        if (usbConnection) {
          const isSwift = this.uarmInfo.productType === 'swift';
          this.updateList.firmwareSwift.isShow = isSwift;
          this.updateList.firmwarePro3.isShow = !isSwift;
          this.updateList.firmwarePro4.isShow = !isSwift;
        }
      },
      checkForUpdates() {
        ipcRenderer.send('fetch-version-info');
      },
      setNullFirmwareData() {
        this.updateList.firmwareSwift.version = null;
        this.updateList.firmwareSwift.date = 'N/A';
        this.updateList.firmwareSwift.releaseNote = [];

        this.updateList.firmwarePro3.version = null;
        this.updateList.firmwarePro3.date = 'N/A';
        this.updateList.firmwarePro3.releaseNote = [];

        this.updateList.firmwarePro4.version = null;
        this.updateList.firmwarePro4.date = 'N/A';
        this.updateList.firmwarePro4.releaseNote = [];
      },
      fetchUpdate(versionInfo) {
        this.versionInfoStr = JSON.stringify(versionInfo);
        const AppConfig = window.Studio.AppConfig;
        if (versionInfo !== undefined && versionInfo !== null) {
          // firmware version update
          if (this.uarmStatus.usbConnection) {
            if (Object.keys(versionInfo).indexOf(this.uarmInfo.productType) !== -1) {
              // const updateJson = versionInfo[this.uarmInfo.productType];
              // this.updateList.firmware.version = updateJson.version;
              // this.updateList.firmware.releaseNote = updateJson.releaseNote[AppConfig.LANG];
              // this.updateList.firmware.date = updateJson.publishDate;

              const updateJsonSwift = versionInfo['swift'];
              this.updateList.firmwareSwift.version = updateJsonSwift.version;
              this.updateList.firmwareSwift.releaseNote = updateJsonSwift.releaseNote[AppConfig.LANG];
              this.updateList.firmwareSwift.date = updateJsonSwift.publishDate;

              const updateJsonPro3 = versionInfo['swiftpro'];
              this.updateList.firmwarePro3.version = updateJsonPro3.version;
              this.updateList.firmwarePro3.releaseNote = updateJsonPro3.releaseNote[AppConfig.LANG];
              this.updateList.firmwarePro3.date = updateJsonPro3.publishDate;

              const updateJsonPro4 = versionInfo['swiftpro4'];
              this.updateList.firmwarePro4.version = updateJsonPro4.version;
              this.updateList.firmwarePro4.releaseNote = updateJsonPro4.releaseNote[AppConfig.LANG];
              this.updateList.firmwarePro4.date = updateJsonPro4.publishDate;
            }
          }
          // studio version update
          const key = AppConfig.APP_NAME;
          console.log(`Fetch Studio version, key is ${key}`);
          if (Object.keys(versionInfo).indexOf(key) !== -1) {
            const updateJson = versionInfo[key];
            this.updateList.studio.version = updateJson.version;
            this.updateList.studio.releaseNote = updateJson.releaseNote[AppConfig.LANG];
            this.updateList.studio.date = updateJson.publishDate;
          }
        }
      },
      update2Pro(key) {
        if (key === 'firmwarePro4') {
          // this.changeFirmwareTo3Modal = true;
          this.changeFirmwareTo4Modal = true;
        }
        else if (key === 'firmwarePro3') {
          // this.changeFirmwareTo4Modal = true;
          this.changeFirmwareTo3Modal = true;
        }
      },
      setUpSuccessCallback() {
        const productType = this.isNewFirmwareVersion ? 'swiftpro4' : this.uarmInfo.productType;

        ipcRenderer.on('firmware-upgrade-completed', async () => {
          eventBus.$emit('change-allow-quit', true);
          swal({
            type: 'success',
            title: this.$t('settingPage.firmwareCompleted'),
          });
          this.setNullFirmwareData();
        });

        ipcRenderer.on('firmware-upgrade-failed', async (event, error) => {
          eventBus.$emit('change-allow-quit', true);
          swal({
            title: this.$t('firmware_failed_title'),
            html: this.$t('firmware_failed_text'),
            type: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33333',
            confirmButtonText: this.$t('try_again'),
          }).then(() => {
            ipcRenderer.send('firmware-upgrade', productType, this.uarmInfo.portName);
          }).catch(() => {
            // this.updateList.firmware.version = null;
            // this.updateList.firmware.date = 'N/A';
            // this.updateList.firmware.releaseNote = [];
            this.setNullFirmwareData();
          });
          console.log(error);
//            window.UArm.connect();
        });
      },
      async update2Pro3() {
        this.changeFirmwareTo3Modal = false;
        ipcRenderer.send('firmware-upgrade-to-3', this.uarmInfo.portName);
      },
      async update2Pro4() {
        this.changeFirmwareTo4Modal = false;
        ipcRenderer.send('firmware-upgrade-to-4', this.uarmInfo.portName);
      },
      async updateItem(index) {
        const productType = this.isNewFirmwareVersion ? 'swiftpro4' : this.uarmInfo.productType;
        // if (index === 'firmware') {
        if (index.includes('firmware')) {
          eventBus.$emit('change-allow-quit', false);
//          await window.UArm.disconnect();
          ipcRenderer.send('firmware-upgrade', productType, this.uarmInfo.portName);
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
        // if (this.firmwareUpdateAvailable) {
        //   count += 1;
        // }
        if (this.firmwareSwiftUpdateAvailable === true) {
          count += 1;
        }
        if (this.firmwarePro3UpdateAvailable === true) {
          count += 1;
        }
        if (this.firmwarePro4UpdateAvailable === true) {
          count += 1;
        }
        if (this.studioUpdateAvailable === true) {
          count += 1;
        }
        return count;
      },
      // firmwareUpdateAvailable() {
      //   return versionCompare(this.uarmInfo.firmwareVersion, this.updateList.firmware.version) === 1;
      // },
      firmwareSwiftUpdateAvailable() {
        if (this.updateList.firmwareSwift.version === null) {
          return false;
        }
        if (this.uarmInfo.productType !== 'swift') {
          return false;
        }
        return versionCompare(this.uarmInfo.firmwareVersion, this.updateList.firmwareSwift.version) === 1;
      },
      firmwarePro3UpdateAvailable() {
        if (this.updateList.firmwarePro3.version === null) {
          return false;
        }
        if (this.uarmInfo.productType !== 'swiftpro') {
          return false;
        }
        if (this.isNewFirmwareVersion) {
          return false;
        }
        return versionCompare(this.uarmInfo.firmwareVersion, this.updateList.firmwarePro3.version) === 1;
      },
      firmwarePro4UpdateAvailable() {
        if (this.updateList.firmwarePro4.version === null) {
          return false;
        }
        if (this.uarmInfo.productType !== 'swiftpro') {
          return false;
        }
        if (!this.isNewFirmwareVersion) {
          return false;
        }
        return versionCompare(this.uarmInfo.firmwareVersion, this.updateList.firmwarePro4.version) === 1;
      },
      studioUpdateAvailable() {
        console.log(`update studio version: ${this.updateList.studio.version}`);
        console.log(`current studio version: ${window.Studio.AppConfig.APP_VERSION}`);
        console.log(versionCompare(window.Studio.AppConfig.APP_VERSION, this.updateList.studio.version));
        if (this.updateList.studio.version === null) {
          return false;
        }
        return versionCompare(window.Studio.AppConfig.APP_VERSION, this.updateList.studio.version) === 1;
      },
      isNewFirmwareVersion() {
        return window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
      },
    },
    watch: {
      // 'updateList.firmware.version'() {
      //   if (this.uarmStatus.usbConnection && this.updateList.firmware.version !== null) {
      //     this.updateList.firmware.updateAvailable = this.firmwareUpdateAvailable;
      //     this.updateList.firmware.latest = !this.firmwareUpdateAvailable;
      //   }
      //   else {
      //     this.updateList.firmware.updateAvailable = false;
      //     this.updateList.firmware.latest = false;
      //   }
      // },
      'updateList.firmwareSwift.version'() {
        if (this.uarmStatus.usbConnection && this.updateList.firmwareSwift.version !== null) {
          this.updateList.firmwareSwift.updateAvailable = this.firmwareSwiftUpdateAvailable;
          this.updateList.firmwareSwift.latest = !this.firmwareSwiftUpdateAvailable;
        }
        else {
          this.updateList.firmwareSwift.updateAvailable = false;
          this.updateList.firmwareSwift.latest = false;
        }
      },
      'updateList.firmwarePro3.version'() {
        if (this.uarmStatus.usbConnection && this.updateList.firmwarePro3.version !== null) {
          this.updateList.firmwarePro3.updateAvailable = this.firmwarePro3UpdateAvailable;
          this.updateList.firmwarePro3.latest = !this.firmwarePro3UpdateAvailable;
        }
        else {
          this.updateList.firmwarePro3.updateAvailable = false;
          this.updateList.firmwarePro3.latest = false;
        }
      },
      'updateList.firmwarePro4.version'() {
        if (this.uarmStatus.usbConnection && this.updateList.firmwarePro4.version !== null) {
          this.updateList.firmwarePro4.updateAvailable = this.firmwarePro4UpdateAvailable;
          this.updateList.firmwarePro4.latest = !this.firmwarePro4UpdateAvailable;
        }
        else {
          this.updateList.firmwarePro4.updateAvailable = false;
          this.updateList.firmwarePro4.latest = false;
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
          // this.updateList.firmware.version = null;
          // this.updateList.firmware.date = 'N/A';
          // this.updateList.firmware.releaseNote = [];
          this.setNullFirmwareData();
        }
        this.checkDisplayList();
      },
    },
  };
</script>
<style lang="sass" scoped>
    .update-dialog-title {
        color:#555 !important;
        font-size:1rem;
        text-align: center;
    }
    .update-wrapper {
        width:100%;
        padding:0 6%;
        font-size:1rem;
        .head-left {
            padding:20px;
            color:#D95E2E;
            border-bottom:2px solid #D95E2E;
            position:relative;
            .active-button {
                border:1px solid #D95E2E;
                color:#D95E2E;
                background:#fff;
                padding: 4px 20px;
                font-size: 1rem;
                position:absolute;
                right:10%;
                bottom:12px;
            }
        }
    }
    .update-list{
        width:100%;
        height:94vh;
        overflow-y: auto;
        .active-button {
            border:1px solid #D95E2E;
            color:#D95E2E;
            background:#fff;
            padding: 4px 20px;
            font-size: 1rem;
            right:10%;
            bottom:12px;
        }
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
                padding:10px;
            .name-text{
                font-size:1.2rem;
            }
            .us-orange {
                color:#D95E2E;
                font-size:1rem;
            }
        }
        .update-info{
            width:30%;
            .info-list {
            padding-left:0;
            max-height:4.2rem;
            overflow: hidden;
        li {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow-wrap: break-word;
        }
    }
            .us-orange{
                padding-top:10px;
                cursor:pointer;
                text-decoration:underline;
                color:#D95E2E;
                font-size:1rem;
            }
         }
        .update-action{
            width:20%;
            text-align:center;
            margin:auto;
        }
    }
    }
    .update-title {
        font-size: 1.2rem;
    }
    .text-left {
        height:100%;
        overflow: auto;
        margin:0 10% 2%;
        padding:0;
    }
</style>
