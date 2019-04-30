<template lang="html">
    <div id="blockly-page" class="app-container noselected">
        <div id="page-header" class="s12 main-wrapper">
            <div class="header-wrapper">
                <HeaderComponent :blocklyData="blocklyData" :moduleName="moduleName"></HeaderComponent>
                <UserProfileComponent></UserProfileComponent>
            </div>
            <StatusBarComponent></StatusBarComponent>
            <div class="content-wrapper">
              <BlocklyComponent :blocklyData="blocklyData" :moduleName="moduleName"></BlocklyComponent>
              <SidebarComponent :blocklyData="blocklyData" :moduleName="moduleName" v-show="sideToggle"></SidebarComponent>
              <userProfile></userProfile>
              <newsFeed></newsFeed>
            </div>

            <ElectronComponent :moduleName="moduleName"></ElectronComponent>
        </div>
    </div>
</template>
<script>
import HeaderComponent from './BlocklyPageView/HeaderComponent.vue';
import SidebarComponent from './BlocklyPageView/SidebarComponent.vue';
import BlocklyComponent from './BlocklyPageView/BlocklyComponent.vue';
import ElectronComponent from './BlocklyPageView/ElectronComponent.vue';
import StatusBarComponent from './BlocklyPageView/StatusBarComponent.vue';
import UserProfileComponent from './CommonPageView/UserProfileComponent.vue';
import userProfile from './CommonPageView/userProfile.vue';
import newsFeed from './CommonPageView/newsFeed.vue';
import eventBus from './BlocklyPageView/eventBus';
import eventBusComm from './CommonPageView/eventBus';
module.exports = {
  data() {
    return {
      blocklyData: {
        running: false,
        projectName: null,
        projectFileContent: null,
        projectContent: null,
        jsCode: '',
        xmlCode: '',
        projectSaveStatus: true,
        blocksLength: 0,
        containVisionBlock: false,
      },
      moduleName: 'Blockly',
      sideToggle: true,
      profileNews: false,
    };
  },
  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from, next) {
    // console.log(`to: ${to}, from :${from}, next : ${next}`);
    eventBus.$emit('prompt-save-on-quit', () => { this.quit(next); });
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
  },
  methods: {
    quit(leave) {
      const self = this;
      if (self.socketConnectStatus && self.uarmConnectStatus) {
        eventBus.$emit('blockly-exit');
        eventBus.$emit('blockly-stop-project');
        window.UArm.stop_all();
      }
      if (this.blocklyData.projectName === null) {
        window.UserConfig.setItem(this.moduleName, 'LastProjectName', null);
      }
      leave();
    },
  },
  mounted() {
    window.Studio.userTracking.insertItem('blocklyTimes');
    // 初始化 UArm 的 模式
    if (window.UArm.uarm_info.uarm_connected) window.UArm.set_mode(window.UArm.Mode.Normal);
    eventBus.$on('sideBarShow', (show) => {
      this.sideToggle = show;
    });
    eventBusComm.$on('sideBarShow', (show) => {
      this.sideToggle = show;
    });
    eventBus.$on('xml-code-changed', (code) => {
      this.blocklyData.xmlCode = code;
    });
    eventBus.$on('js-code-changed', (code) => {
      this.blocklyData.jsCode = code;
    });
    eventBus.$on('project-save-changed', (status) => {
      this.blocklyData.projectSaveStatus = status;
    });
    eventBus.$on('project-content-changed', (content) => {
      this.blocklyData.projectContent = content;
    });
    eventBus.$on('project-size-changed', (size) => {
      this.blocklyData.blocksLength = size;
    });
    eventBus.$on('project-file-content-changed', (content) => {
      this.blocklyData.projectFileContent = content;
      eventBus.$emit('project-changed');
    });
    eventBus.$on('project-name-changed', (name) => {
      this.blocklyData.projectName = name;
    });
    eventBus.$on('running-status-changed', (status) => {
      this.blocklyData.running = status;
    });
    // eventBus.$on('contain-vision-block-changed', (status) => {
    //   this.blocklyData.containVisionBlock = status;
    // });
  },
  beforeDestroy() {
    eventBus.$off();
  },
  components: {
    BlocklyComponent,
    HeaderComponent,
    SidebarComponent,
    ElectronComponent,
    StatusBarComponent,
    UserProfileComponent,
    userProfile,
    newsFeed,
  },
  computed: {
    socketConnectStatus() {
      return this.$store.getters.uarmStatus.socketConnection;
    },
    uarmConnectStatus() {
      return this.$store.getters.uarmStatus.usbConnection;
    },
  },
};

</script>
<style lang="sass" scoped>
/* add for uarm studio */
.modal .modal-footer {
    text-align: center;
  }

.main-wrapper {
    .header-wrapper {
        display: table;
        position:relative;
        width: 100%;
        background-color:#3c3c3c;
        .header-profile-wrapper {
            height:64px;
             position: absolute;
             right: 0;
             top: 0;
        }
    }
    .content-wrapper{
      display: flex;
      height: 100%;
      width: 100%;
      .side-wrapper ,.news-wrapper,.user-wrapper {
        width:30% !important;
      }
    }
  }


</style>
