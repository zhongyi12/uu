<template lang="html">
    <div class="app-container">
      <div class="navi-wrapper">
          <img src="./assets/img/setting_btn_back.svg" alt="" @click="$router.go(-1)">
        <div class="navi-title">
          {{$t('settingPage.title')}}
        </div>
      </div>
      <div class="setting-wrapper">
        <div class="side-wrapper">
          <ul>
            <li v-for="(name,index) in tabNameList" v-text="name" v-bind:class="{active:index===activeTab}" @click="activeTab = index"></li>
          </ul>
        </div>
        <div class="main-wrapper">
          <div class="content-box">

            <div class="tab-content tab-update" v-show="activeTab === 'updateTab'">
              <UpdateComponent></UpdateComponent>
            </div>

            <div class="tab-content" v-show="activeTab === 'sysTab'">
              <SystemComponent></SystemComponent>
            </div>

            <div v-show="activeTab === 'deviceTab'">
              <DeviceComponent></DeviceComponent>
            </div>
            <div class="tab-content" v-show="activeTab === 'troubleTab'">
              <TroubleComponent></TroubleComponent>
            </div>

          </div>
        </div>
      </div>
      <ElectronComponent :allowQuit="allowQuit"></ElectronComponent>
    </div>
</template>
<script>
import UpdateComponent from './SettingPageView/UpdateComponent.vue';
import DeviceComponent from './SettingPageView/DeviceComponent.vue';
import TroubleComponent from './SettingPageView/TroubleComponent.vue';
import ElectronComponent from './SettingPageView/ElectronComponent.vue';
import SystemComponent from './SettingPageView/SystemComponent.vue';
import eventBus from './SettingPageView/eventBus';
export default {
  data() {
    return {
      tabNameList: {
        deviceTab: this.$t('settingPage.deviceTab'),
        updateTab: this.$t('settingPage.updateTab'),
        sysTab: this.$t('settingPage.sysTab'),
        troubleTab: this.$t('settingPage.troubleTab'),
      },
      activeTab: 'deviceTab',
      allowQuit: true,
    };
  },
  mounted() {
    window.Studio.userTracking.insertItem('settingPageTimes');
    if (this.$route.params.tab === 'updateTab') {
      this.activeTab = 'updateTab';
    }
    else if (this.$route.params.tab === 'troubleTab') {
      this.activeTab = 'troubleTab';
    }
    eventBus.$on('change-allow-quit', (allowQuit) => { this.allowQuit = allowQuit; });
  },
  beforeDestroy() {
    eventBus.$off();
  },
  components: {
    UpdateComponent,
    ElectronComponent,
    DeviceComponent,
    TroubleComponent,
    SystemComponent,
  },
  computed: {
    isNewFirmwareVersion() {
      return window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
    },
  },
};

</script>

<style lang="sass" scoped>
  $usOrange:#D95E2E;
  $usGrey:#99A2A5;
.app-container {
    background: white;
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    justify-content:center;
    .navi-wrapper{
      width:100%;
      height:7vh;
      display:flex;
      line-height:7vh;
      background: #DADADA;
      font-family:ufbigfont;
      color:#555;
      .navi-title{
        margin:auto;
        font-size:1.3vw;
      }
      img{
        padding:0 2vw;
        cursor:pointer;
      }
    }
    .setting-wrapper{
      display:flex;
      height:93vh;
      width:100%;
      .side-wrapper{
        width:22%;
        background: #EDEEEF;
        font-size: 1.2rem;
        min-width:118px;
        ul{
          list-style:none;
          height:100%;
          display:flex;
          flex-direction:column;
          align-items:flex-start;
          padding-left:0vw;
          li{
            padding:2vw 0 2vw 3vw;
            text-align:left;
            width:100%;
            cursor:pointer;
          }
          li:hover{
            background:#ddd;
          }
          li.active{
            background:#5A93D7;
            color:white;
          }
        }
      }
      .main-wrapper {
          justify-content:flex-start;
          align-items:center;
          overflow: hidden;
          .tab-content{
            width:100%;
            height:80%;
          }
      }
    }
  .content-box {
    width: 100%;
    height: 100%;
    position:relative;
      .us-orange {
        color: $usOrange;
      }
      .active-button {
        border: 1px solid $usOrange;
        border-radius: 2px;
        background: white;
        color: #D95E2E;
        padding: 0 2vw;
        margin: 2vw;
      }
      .disable-button {
        border: 1px solid $usGrey;
        border-radius: 2px;
        background: white;
        color: $usGrey;
        padding: 0 2vw;
        margin: 2vw;
      }
      .tab-content {
        width: 100%;
        height: 100% !important;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top:3vw;
      .firmware-update {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .version-update {
          img {
            cursor: pointer;
          }
        }
          & >img {
            padding: 3vw;
            width: 16vw;
            height: 16vw;
          }
        }
          .update-head {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: $usOrange;
            border-bottom: 1px solid $usOrange;
          .head-left {
            padding: 0 2vw;
          }
        }
      }
    }
  }


</style>
