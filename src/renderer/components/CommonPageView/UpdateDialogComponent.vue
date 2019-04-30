<template>
    <div>
        <mu-dialog :open="showUpdate" :title="$t('update_available')" titleClass="update-dialog-title" dialogClass="update-dialog">
            <mu-table :showCheckbox="false" class="update-table">
                <mu-thead slot="header">
                    <mu-tr>
                        <mu-th></mu-th>
                        <mu-th >{{ $t('type') }}</mu-th>
                        <mu-th >{{ $t('version') }}</mu-th>
                        <mu-th >{{ $t('info') }}</mu-th>
                    </mu-tr>
                </mu-thead>
                <mu-tbody>
                    <mu-tr v-for="(v, k) in updateList" class="update-list" v-show="v.show">
                        <mu-td>
                            <img class="device-img" :src="v.icon"/>
                        </mu-td>
                        <mu-td>{{ v.name }}</mu-td>
                        <mu-td>{{ v.version }}</mu-td>
                        <mu-td @click="goToSetting">{{ $t('notes')}}</mu-td>
                    </mu-tr>
                </mu-tbody>
            </mu-table>
            <p class="tip" v-show="updateList.studio.show">{{ $t('tip', {studio: updateList.studio.version, firmware: updateList.studio.minimumFirmware}) }}</p>
            <div class="ok-button">
                <mu-raised-button class="com-btn" :label="$t('cancel')" @click="showUpdate = false"/>
                <mu-raised-button class="com-btn" :label="$t('update')" @click="goToSetting()"/>
            </div>
        </mu-dialog>
        <mu-dialog :open="showFirmware" :title="$t('update_available')" titleClass="update-dialog-title" dialogClass="update-dialog">
            <div class="firmware-wrapper">
            <img src="./assets/img/icon_firmware_big.svg"/>
                <p class="text1"> {{ $t('firmware_update_title')}}</p>
                <p>{{ $t('tip', {studio: currentStudioVersion, firmware: minimumFirmwareVersion}) }}</p>

            </div>
            <div class="ok-button">
                <mu-raised-button class="com-btn" backgroundColor="#D95E2E" color="#fff" :label="$t('update')" @click="goToSetting()"/>
            </div>
        </mu-dialog>
    </div>
</template>
<script>
import { ipcRenderer } from 'electron';
import versionCompare from 'general-version-compare';
module.exports = {
  i18n: {
    messages: {
      en: {
        update_available: 'Update Available',
        update: 'Update Now',
        cancel: 'Remind me latter',
        more: 'More',
        tip: '*uArm Studio(v{studio}) is only compatible with Firmware v{firmware} or after.',
        type: 'Type',
        version: 'Version',
        info: 'Info',
        notes: 'Notes',
        firmware_update_title: 'Please update firmware to continue.',
      },
      cn: {
        update_available: '更新可用',
        update: '现在更新',
        cancel: '下次提醒我',
        more: '更多',
        tip: '*uArm Studio(v{studio})只兼容固件v{firmware}或以上.',
        type: '类型',
        version: '版本',
        info: '信息',
        notes: '日志',
        firmware_update_title: '请更新固件以继续.',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      showUpdate: false,
      showFirmware: false,
      versionInfo: null,
      updateList: {
        studio: {
          show: false,
          name: 'uArm Studio',
          icon: require('../SettingPageView/assets/img/logo.svg'),
          restart: true,
          currentVersion: null,
          version: null,
          minimumFirmware: null,
          date: null,
          releaseNote: [],
          progress: 0,
          updateAvailable: false,
          latest: false,
        },
        firmware: {
          show: false,
          name: 'uArm Firmware',
          icon: require('../SettingPageView/assets/img/icon_firmware.png'),
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
  methods: {
    goToSetting() {
      this.$router.push({ name: 'setting', params: { tab: 'updateTab' } });
      this.showUpdate = false;
      this.showFirmware = false;
    },
    checkForUpdates() {
      ipcRenderer.send('fetch-version-info');
    },
    showDialog() {
      if (this.uarmConnectStatus) {
        if (this.minimumFirmwareRequired) {
          this.showFirmware = true;
        }
        else if (this.studioUpdateAvailable) {
          this.showUpdate = true;
        }
        else if (this.firmwareUpdateAvailable) {
          this.showUpdate = true;
        }
      }
      else {
        this.showUpdate = false;
        this.showFirmware = false;
      }
    },
    fetchUpdate(versionInfo) {
      const AppConfig = window.Studio.AppConfig;
      if (versionInfo !== undefined && versionInfo !== null) {
        // firmware version update
        if (Object.keys(versionInfo).indexOf(this.uarmInfo.productType) !== -1) {
          const updateJson = versionInfo[this.uarmInfo.productType];
          this.updateList.firmware.version = updateJson.version;
          this.updateList.firmware.releaseNote = updateJson.releaseNote[AppConfig.LANG];
          this.updateList.firmware.date = updateJson.publishDate;
        }
        // studio version update
        const key = AppConfig.APP_NAME;
        console.log(`Fetch Studio version, key is ${key}`);
        if (Object.keys(versionInfo).indexOf(key) !== -1) {
          const updateJson = versionInfo[key];
          this.updateList.studio.version = updateJson.version;
          this.updateList.studio.releaseNote = updateJson.releaseNote[AppConfig.LANG];
          this.updateList.studio.date = updateJson.publishDate;
          this.updateList.studio.minimumFirmware = updateJson.minimumFirmware;
        }
      }
    },
  },
  mounted() {
    this.updateList.studio.currentVersion = window.Studio.AppConfig.APP_VERSION;
    ipcRenderer.on('fetch-version-info-reply', (event, error, versionInfo) => {
      if (error) {
        this.$store.dispatch('showSnackBar', { message: this.$t('fetch_update_failed', { err: error }) });
      }
      else {
        this.versionInfo = versionInfo;
      }
    });
    setTimeout(() => {
      this.checkForUpdates();
      setTimeout(() => {
        this.fetchUpdate(this.versionInfo);
        this.updateList.studio.show = this.studioUpdateAvailable;
        this.updateList.firmware.show = this.firmwareUpdateAvailable;
        this.showDialog();
      }, 3000);
    }, 2000);
  },
  computed: {
    isNewFirmwareVersion() {
      return window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
    },
    uarmConnectStatus() {
      return this.$store.getters.uarmStatus.usbConnection;
    },
    uarmInfo() {
      return this.$store.getters.uarmInfo;
    },
    firmwareUpdateAvailable() {
      const flag = versionCompare(this.uarmInfo.firmwareVersion, this.updateList.firmware.version) === 1;
      console.log(`this.updateList.firmware.version: ${this.updateList.firmware.version}`);
      console.log(`firmware upgrade available: ${flag}`);
      if (!this.uarmConnectStatus || this.updateList.firmware.version === null) {
        return false;
      }
      return flag;
    },
    studioUpdateAvailable() {
//      console.log(`update studio version: ${this.updateList.studio.version}`);
//      console.log(`current studio version: ${window.Studio.AppConfig.APP_VERSION}`);
//      console.log(versionCompare(window.Studio.AppConfig.APP_VERSION, this.updateList.studio.version));
      if (this.updateList.studio.version === null) return false;
      return versionCompare(window.Studio.AppConfig.APP_VERSION, this.updateList.studio.version) === 1;
    },
    minimumFirmwareRequired() {
      const flag = versionCompare(this.uarmInfo.firmwareVersion, window.Studio.AppConfig.MINIMUM_FIRMWARE_VERSION) === 1;
      console.log(`window.Studio.AppConfig.MINIMUM_FIRMWARE_VERSION ${window.Studio.AppConfig.MINIMUM_FIRMWARE_VERSION} `);
      console.log(`this.uarmInfo.firmwareVersion ${this.uarmInfo.firmwareVersion} `);
      console.log(`minimumFirmwareRequired ${flag} `);
      if (!this.uarmConnectStatus) {
        return false;
      }
      return flag;
    },
    minimumFirmwareVersion() {
      return window.Studio.AppConfig.MINIMUM_FIRMWARE_VERSION;
    },
    currentStudioVersion() {
      return window.Studio.AppConfig.APP_VERSION;
    },
  },
  watch: {
    uarmConnectStatus() {
      this.updateList.studio.show = this.studioUpdateAvailable;
      this.updateList.firmware.show = this.firmwareUpdateAvailable;
      this.showDialog();
      if (this.uarmConnectStatus && this.isNewFirmwareVersion) {
        const isOpen = window.UserConfig.getItem('lastStatus', 'isStepOutCheck');
        this.model.localCommonStatusMgr.isStepOutCheckOpen = isOpen;
        window.UArm.set_step_out_check(isOpen, (response) => {
          // console.log(`aa = ${isOpen}`);
          console.log(JSON.stringify(response));
          // console.log(`bb = ${isOpen}`);
        });
      }
    },
  },
};

</script>
<style lang="sass">
.update-dialog {
    padding:0 47px 35px;
    width:50%;
    .update-dialog-title {
        width:156px;
        text-align: left;
        font-size:1.3rem;
        line-height: 20px;
        letter-spacing: -0.57px;
        font-weight:700;
        padding: 24px 0 0;
    }
}
</style>

<style lang="sass" scoped>
.update-table {
    .mu-th {
        font-size:1.1rem;
        font-weight:700;
        color: #525252;
}
    .mu-td , .mu-th {
        width: 180px;
        padding:0;
        text-align:center;
    }
    .mu-th:first-child,.mu-td:first-child {
        width:14%
    }
    .mu-thead, .mu-tr {
        border-bottom: none;
        display:block;
    }
    .update-list {
        text-align: center;
        height: 74px;
        line-height: 74px;
        margin-bottom:24px;
        background: #F1F3F5;
        border-radius: 8px;
        .mu-td {
            font-size:1rem;
            color: #525252;
        }
        .mu-td:last-child {
           text-decoration: underline;
            cursor: pointer;
        }
    }
    .mu-tr.selected,.mu-tr.hover {
        background-color: #F1F3F5;
    }
     .device-img {
        width:48px;
        padding-left:8px;
     }
}
.tip {
    padding-bottom:16px;
    font-size: 12px;
    color: #555555;
    font-weight: 700;
    text-align: center;
}
.ok-button {
    text-align: center;
    display:flex;
    justify-content: space-around;
    .com-btn {
        background: rgba(217,94,46,0.05);
        border: 1px solid #D95E2E;
        border-radius: 2px;
        transition: .3s;
        color: #D95E2E;
        font-size: 16px !important;
        height: 36px !important;
        line-height: 0 !important;
        width:43%;
        font-weight: normal !important;
    }
    .com-btn:hover {
        background: #D95E2E;
        color:#fff;
    }
}
.firmware-wrapper {
    margin:66px 0 100px;
    text-align: center;
    font-size: 14px;
    color: #555;
    &>img {
        width:64px;
    }
    .text1 {
        font-weight: 700;
        margin-top:20px;
    }
}
</style>
