<template lang="html">
    <div class="table-wrapper">
    <table>
        <tbody class="tbody-wrapper">
        <tr>
            <td class="th-title" colspan="2">{{$t('device_title')}}</td>
        </tr>
        <tr>
            <td class="red top-left-radius" v-text="$t('device')"></td>
            <td class="top-right-radius">{{uarmInfo.productName}}</td>
        </tr>
        <tr>
            <td v-text="$t('port_number')"></td>
            <td>{{uarmInfo.portName}}</td>
        </tr>
        <tr>
            <td v-text="$t('firmware')"></td>
            <td>{{uarmInfo.firmwareVersion}}</td>
        </tr>
        <tr>
            <td v-text="$t('serial_number')" class="bottom-left-radius"></td>
            <td class="bottom-right-radius">{{uarmInfo.portSerialNumber}}</td>
        </tr>
        <tr>
            <td class="th-title" colspan="2">{{$t('studio_title')}}</td>
        </tr>
        <tr>
            <td class="red top-left-radius" v-text="$t('studio_version')"></td>
            <td  class="top-right-radius">{{systemInfo.APP_VERSION}}</td>
        </tr>
        <tr>
            <td class="red" v-text="$t('studio_channel')"></td>
            <td>{{systemInfo.Channel}}</td>
        </tr>
        <tr>
            <td class="red" v-text="$t('os')"></td>
            <td>{{systemInfo.OS_INFO}}</td>
        </tr>
        <tr>
            <td v-text="$t('uarm_core')"></td>
            <td>{{systemInfo.UARM_CORE_VERSION}}</td>
        </tr>
        <tr>
            <td v-text="$t('studio_language')" class="bottom-left-radius"></td>
            <td class="bottom-right-radius">{{systemInfo.LANG}}</td>
        </tr>
        </tbody>
    </table>
        <!--<mu-flat-button class="report-btn" backgroundColor="#D95E2E" :label="$t('copy')" color="#fff" @click="downloadReport()"/>-->
    </div>
</template>

<script>
export default {
  i18n: {
    messages: {
      en: {
        device_title: 'Device Information',
        device: 'Device',
        port_number: 'Port Number',
        firmware: 'Firmware Version',
        serial_number: 'Serial Number',
        studio_title: 'Studio Information',
        os: 'OS',
        uarm_core: 'uArmCore Version',
        uarm_core_path: 'uArmCore Path',
        studio_version: 'Studio Version',
        studio_channel: 'Studio Channel',
        studio_home_path: 'Studio Home Path',
        studio_language: 'Studio Language',
        copy: ' Copy',
      },
      cn: {
        device_title: '设备信息',
        device: '设备',
        port_number: '端口',
        firmware: '固件版本',
        serial_number: '序列号',
        studio_title: 'Studio 信息',
        os: '系统',
        uarm_core: 'uArmCore 版本',
        uarm_core_path: 'uArmCore 路径',
        studio_version: 'Studio 版本',
        studio_channel: 'Studio 频道',
        studio_home_path: 'Studio 主目录路径',
        studio_language: 'Studio 语言',
        copy: '复制',
      },
    },
  },
  data() {
    return {
      systemInfo: null,
    };
  },
  methods: {
    downloadReport() {
      let csv;
      const report = {
        Studio: window.Studio.AppConfig,
        UArm: this.uarmInfo,
      };
      csv = 'data:application/json;charset=utf-8,';
      csv += JSON.stringify(report, null, 2);
      const data = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', 'report.json');
      link.click();
    },
  },
  created() {
    this.systemInfo = window.Studio.AppConfig;
  },
  computed: {
    uarmInfo() {
      return this.$store.getters.uarmInfo;
    },
  },
};
</script>

<style lang="sass" scoped>
    .th-title {
        font-weight: bold;
        background: #fff;
        color:#D95E2E;
        padding:4vh 0 2vh;
    }
    .table-wrapper {
        width:100%;
        padding-left:15%;
        font-size:1.1rem;
    }
    .tbody-wrapper {
        width:100%;
        background: #F1F3F5;
        border-radius: 8px;
        color:#555;
        & > tr {
            width:100%;
            & > td {
                width: 26vw;
                line-height: 6.8vh;
                padding-left: 5vw;
            }
            & > td:nth-child(2) {
                font-weight: bold;
                padding-left:3vw;
                font-size: 1.1rem;
            }
        }
        .top-left-radius {
            border-radius: 8px 0 0 0;
        }
        .top-right-radius {
            border-radius:0 8px 0 0;
        }
        .bottom-right-radius {
            border-radius:0 0 8px 0;
        }
        .bottom-left-radius {
            border-radius: 0 0 0 8px;
        }
    }
    .report-btn {
        margin-top:3vw;
        margin-left:30%;
        width:10vw;
        background:url('./assets/img/icon_save_as.svg') no-repeat 2.1vw;
        text-align: right;
        padding-left:2vw;
        .mu-flat-button-label {
            font-size:2vw !important;
        }
    }
</style>
