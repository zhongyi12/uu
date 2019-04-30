<template lang="html">
    <div class="err-wrapper">
        <div class="err-page">
            <div class="err-title">
                <span class="problem">{{$t('problem')}}</span>
                <span class="suggestion">{{$t('suggestion')}}</span>
            </div>
            <mu-list class="err-list">
                <mu-list-item class="err-item" :title="errorItem.title">
                    <mu-icon v-if="errorItem.show" slot="left" :value="iconType.success" :color="iconColor.success"/>
                    <mu-icon v-else slot="left" :value="iconType.fail" :color="iconColor.fail"/>
                    <img v-show="!errorItem.show" :src="problem_avatar" slot="rightAvatar" label="scrollable dialog" @click="open" />
                       <mu-dialog :open="dialog" @close="close" :title="$t('suggestion')" titleClass="suggestion-title" dialogClass="suggestion-dialog" >
                        <ul class="err-text">
                          <li v-for="(item, index) in errorItem.suggestion" v-html="`${index+1}. ${item}`"></li>
                        </ul>
                        <mu-flat-button class="btn-close" primary label="close"  @click="close" slot="actions"/>
                      </mu-dialog>
                </mu-list-item>
            </mu-list>
            <div class="button-wrapper">
                <button class="button" @click="downloadReport">{{$t('downLoad')}}</button>
            </div>
        </div>
        <div class="err-page">
            <div class="err-title">
                <span class="problem">{{$t('notices')}}</span>
            </div>
            <mu-list class="err-list">
                <span v-text="$t('notices_text')" ></span>
                <span v-text="$t('notices_text1')" ></span>
            </mu-list>
            <div class="button-wrapper">
                <button class="button" @click="clearCache">{{$t('clearCache')}}</button>
            </div>
        </div>
    </div>

</template>

<script>
import TroubleShooting from './assets/troubleshooting';
export default {
  i18n: {
    messages: {
      en: {
        suggestion: 'Suggestion',
        clearCache: 'Clean Cache',
        problem: 'INSPECTION',
        downLoad: 'Download Report',
        notices: 'NOTICES',
        notices_text: 'Some troubles are caused by the clash between old and new versions. ',
        notices_text1: 'Cleaning cache may help (your projects won’t be deleted).',
        error: {
          no_error: {
            title: 'Everything is working fine!',
          },
          uarmcore_not_existed: {
            title: 'no uarmcore file detected',
            suggestion: ['Please check if the antivirus program on your PC mistakingly killed the uarmcore file',
              'Download uArm Studio and install again'],
          },
          uarmcore_not_running: {
            title: 'uarmcore is not running',
            suggestion: ['Please reboot Studio. If it doesn’t help.',
              'reboot your computer. If it doesn’t help',
              'fill in the feedback form (menu bar->Help->Feedback), upload your log files.'],
          },
          uarmcore_not_connected: {
            title: 'uamcore failed to connect with Studio',
            suggestion: ['Please check if uarmcore was blocked by firewall.',
              'Please check if IP(127.0.0.1) was hijacked by proxy/agency.'],
          },
          uarm_usb_not_connected: {
            title: 'uArm is not connected with serial port',
            suggestion: ['Please check the USB connection and power connection. ' +
            'There should be a “beep” sound when USB is connected.'],
          },
          uarm_port_busy: {
            title: 'uArm is not connected. Port is occupied.',
            suggestion: ['Please cut off other software/tools (e.g. Arduino IDE) occupying the serial port. '],
          },
          uarm_firmware_invalid: {
            title: 'uArm is not connected. It’s not an invalid firmware.',
            suggestion: ['Please re-flash our official firmware with FlashTool.'],
          },
          uarm_not_connected_others: {
            title: 'uArm is not connected for other reasons.',
            suggestion: ['Please fill in the feedback form (menu bar->Help->Feedback), and upload your log files.'],
          },
          driver_not_installed: {
            title: 'uArm is not connected. Driver is not installed.',
            suggestion: ['Please install driver. '],
          },
          other: {
            title: 'Unexpected Error: {err}',
            suggestion: ['Please send us the report'],
          },
        },
      },
      cn: {
        suggestion: '建议',
        clearCache: '清理缓存',
        problem: '故障',
        downLoad: '下载报告',
        notices: '注意',
        notices_text: '有些问题是新旧版本之间的冲突造成的。 ',
        notices_text1: '清理缓存可能会有帮助(您的项目不会被删除)。',
        error: {
          no_error: {
            title: '运行正常，没有发现异常!',
          },
          uarmcore_not_existed: {
            title: 'uarmcore 文件不存在',
            suggestion: ['请检查 uarmcore 有没有被杀毒软件误杀', '重装uarm studio'],
          },
          uarmcore_not_running: {
            title: 'uarmcore 没有运行',
            suggestion: ['请重启studio ，若问题还在', '重启电脑，若问题还在',
              '填写反馈表（菜单栏->帮助->反馈），将Studio的log发给我们'],
          },
          uarmcore_not_connected: {
            title: 'uarmcore 与 studio 没有连接上',
            suggestion: [' 检查防火墙有没有禁用 uarmcore', '检查有没有代理劫持了本机地址 127.0.0.1。'],
          },
          uarm_usb_not_connected: {
            title: 'uArm没有连接上，没有检测到端口',
            suggestion: ['检查 USB与电源有没有插上，插上 USB 时有没有“嘀”一声'],
          },
          uarm_port_busy: {
            title: 'uArm 没有连接上，端口被占用',
            suggestion: ['关闭其它串口工具，或者 arduino ide'],
          },
          uarm_firmware_invalid: {
            title: 'uArm 没有连接上，固件不合法',
            suggestion: ['使用FlashTool重新刷新最新的固件'],
          },
          uarm_not_connected_others: {
            title: 'uArm 没有连接上: 其它',
            suggestion: ['填写反馈表（菜单栏->帮助->反馈），将Studio的log发给我们'],
          },
          driver_not_installed: {
            title: 'uArm 没有连接上，没有安装驱动',
            suggestion: ['请安装驱动'],
          },
          other: {
            title: '其它错误: {err}',
            suggestion: ['请与我们联系并提供错误报告'],
          },
        },
      },
    },
  },
  data() {
    return {
      errorItem: {
        title: null,
        suggestion: null,
        show: false,
      },
      problem_avatar: require('./assets/img/icon_text.svg'),
      iconType: {
        success: 'done',
        fail: 'clear',
      },
      iconColor: {
        success: '#13CE66',
        fail: '#FF4949',
      },
      problems: {
        coreExisted: false,
        coreRunning: false,
        coreConnected: false,
        uarmConnected: false,
        driverInstalled: false,
        uarmPortConnected: false,
        other: '',
      },
      ports: [],
      errPage: false,
      show: false,
      dialog: false,
    };
  },
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    showOnLoad() {
      // if (this.$route.params.tab === 'troubleTab') {
      this.checkProblem();
      // }
    },
    downloadReport() {
      let csv;
      const report = {
        Studio: window.Studio.AppConfig,
        UArm: this.$store.getters.uarmInfo,
        Problems: this.problems,
        ports: this.ports,
      };
      csv = 'data:application/json;charset=utf-8,';
      csv += JSON.stringify(report, null, 2);
      const data = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', 'problem_report.json');
      link.click();
    },
    async checkProblem() {
      try {
        this.problems.coreExisted = TroubleShooting.checkUArmCoreExisted(window.Studio.CoreProcess);
        this.problems.coreRunning = TroubleShooting.checkUArmCoreRunning(window.Studio.CoreProcess);
        this.problems.coreConnected = TroubleShooting.checkSocketConnection(window.UArm);
        this.problems.uarmConnected = TroubleShooting.checkUSBConnection(window.UArm);
        this.problems.driverInstalled = await TroubleShooting.checkDriverInstallation(window.Studio.DriverManager);
        this.ports = await TroubleShooting.checkUArmSerialPortExited();
        this.problems.uarmPortConnected = this.ports.length > 0;
      }
      catch (e) {
        console.log(e);
        this.errorItem.title = this.$t('error.other.title', { err: e });
        this.errPage = true;
        this.errorItem.suggestion = this.$t('error.other.suggestion');
        this.problems.other = e;
      }
      finally {
        this.errorItem.show = this.problems.coreExisted && this.problems.coreRunning &&
          this.problems.coreConnected && this.problems.uarmConnected;
//        this.errorItem.show = this.problems.uarmConnected;
        console.log(`this.errorItem: ${this.errorItem.show}`);
        if (!this.problems.coreExisted) {
          this.errorItem.title = this.$t('error.uarmcore_not_existed.title');
          this.errorItem.suggestion = this.$t('error.uarmcore_not_existed.suggestion');
        }
        else if (!this.problems.coreRunning) {
          this.errorItem.title = this.$t('error.uarmcore_not_running.title');
          this.errorItem.suggestion = this.$t('error.uarmcore_not_running.suggestion');
        }
        else if (!this.problems.coreConnected) {
          this.errorItem.title = this.$t('error.uarmcore_not_connected.title');
          this.errorItem.suggestion = this.$t('error.uarmcore_not_connected.suggestion');
        }
        else if (!this.problems.uarmConnected) {
          if (!this.driverInstalled) {
            this.errorItem.title = this.$t('error.driver_not_installed.title');
            this.errorItem.suggestion = this.$t('error.driver_not_installed.suggestion');
          }
          else {
            this.errorItem.title = this.$t('error.uarm_usb_not_connected.title');
            this.errorItem.suggestion = this.$t('error.uarm_usb_not_connected.suggestion');
          }
        }
        else {
          this.errorItem.title = this.$t('error.no_error.title');
          this.errorItem.suggestion = this.$t('error.no_error.suggestion');
        }
      }
    },
    clearCache() {
      localStorage.clear();
      sessionStorage.clear();
      const modules = window.UserConfig.modules;
      for (const k of Object.keys(modules)) {
        if (k !== 'Studio') window.UserConfig.clean(modules[k]);
      }
      this.$store.dispatch('showSnackBar', { message: this.$t('settingPage.cacheCleaned') });
    },
  },
  created() {
    this.showOnLoad();
  },
};
</script>
<style lang="sass">
.suggestion-dialog {
        width:70%;
        margin-left:17%;
        background: rgba(58,58,58,0.98);
        border-radius: 20px;
        position:relative;
        .mu-dialog-title {
            font-size:1.6rem;
    }
        .mu-dialog-body {
            font-size:1rem;
            color: #fff;
            width: 70%;
            margin: 0 auto 8%;
    }
        .mu-flat-button-primary {
            display:block;
            color: #fff;
            position: absolute;
    }
        .mu-menu-item {
            font-size:1rem;
            color:#fff;
    }
        .mu-menu-list .mu-menu-item-wrapper {
            border:none;
    }
        .mu-item-left {
            left: 0;
    }
        .mu-icon {
            font-size: 20px;
    }
        .mu-flat-button-label {
            display:block;
    }
        .err-text {
            margin:0;
            padding:0;
            li{
                padding:0;
                list-style: none;
                margin-top:10px;
                font-weight:normal;
        }
    }
}
</style>

<style lang="sass" scoped>
    .err-wrapper{
        width:88%;
        position:absolute;
        top:0;
    }
    .guide-wrapper {
        width:100%;
        text-align:center;
        margin-top:16%;
        p{
            font-size:1.3rem;
            span{
                color:#EE6723;
            }
        }
    }
    .button-wrapper {
        width:100%;
        text-align: center;
    }
    .button {
        width: 15vw;
        height: 4vw !important;
        line-height: 0 !important;
        margin-top: 9vh;
        text-align: center;
        background: #EE6723;
        color: #fff;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        border-radius: 50px;
        font-size: 1.2vw !important;
        padding: 1px;
        background-clip: content-box;
        border: 3px solid #EE6723;
        outline: 0;
    }
    .err-page{
        margin: 0 auto;
        width: 76%;
        padding-top: 6%;
        .err-title {
            width:100%;
            border-bottom:1px solid #555;
            .problem {
                display:inline-block;
                font-size:1.4rem;
                width:69%;
                color:#555;
                line-height: 50px;
                font-family: ufbigfont;
                letter-spacing: -0.5px;
            }
            .suggestion {
                display:inline-block;
                font-size:1.2rem;
                width:29%;
                color:#555;
                text-align:right;
                line-height: 50px;
            }
        }
        .err-list {
            width:100%;
            .mu-item-title {
                font-size: 20px !important;
                padding: 10px;
            }
            span {
                display:block;
                padding-left:10px;
                margin:0;
                font-size:1.1rem;
            }
            span:first-child {
                padding-top:2vh;
            }
            a {
                color:#D95E2E;
                display:inline-block;
                span {
                    padding-left:10px;
                    font-size: 12px;
                }
            }
            .err-item {
                font-size:1.2rem;
                width:100%;
            }
        .success-color {
            color: #13CE66;
        }
        .fail-color {
            color: #FF4949;
        }
    }
        .download-report {
            text-decoration: underline;
            color:#D95E2E;
            cursor:pointer;
            padding-left:2vw;
        }
    }


</style>
