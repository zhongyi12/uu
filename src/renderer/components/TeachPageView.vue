<template lang="html">
    <div class="app-container noselected">
        <div class="s12 main-wrapper">
            <div class="head-wrapper">
                <HeaderComponent :cData="cData" :moduleName="moduleName"></HeaderComponent>
                <UserProfileComponent></UserProfileComponent>
            </div>
            <div class="content-wrapper">
                <TeachComponent :cData="cData" :recordItem="recordItem" :moduleName="moduleName"></TeachComponent>
                <SidebarComponent :recordItem="recordItem" :moduleName="moduleName" v-show="sideToggleState"></SidebarComponent>
                <userProfile></userProfile>
                <newsFeed></newsFeed>
                <!--<div class="page-user-profile">-->
                    <!--<userProfile></userProfile>-->
                    <!--<newsFeed></newsFeed>-->
                <!--</div>-->
            </div>
        </div>

        <!--<ElectronComponent></ElectronComponent>-->
    </div>
</template>
<script>
  import HeaderComponent from './TeachPageView/HeaderComponent.vue';
  import SidebarComponent from './TeachPageView/SidebarComponent.vue';
  import TeachComponent from './TeachPageView/TeachComponent.vue';
  import ElectronComponent from './TeachPageView/ElectronComponent.vue';
  import eventBus from './TeachPageView/eventBus';
  import UserProfileComponent from './CommonPageView/UserProfileComponent.vue';
  import userProfile from './CommonPageView/userProfile.vue';
  import newsFeed from './CommonPageView/newsFeed.vue';
  import eventBusComm from './CommonPageView/eventBus';
  export default {
    data() {
      return {
        moduleName: 'TeachMode',
        sideToggleState: true,
        cData: {
          x: 100,
          y: 150,
          z: 150,
          r: 90,
          speed: 1,
          armFinger: {
            x: 0,
            y: 150,
          },
        },
        recordItem: {
          playRecordName: null,
          deleteRecordName: null,
          renameRecordName: null,
          recordList: [],
        },
      };
    },
    mounted() {
      eventBus.$on('sideBarShow', (show) => {
        this.sideToggleState = show;
      });
      eventBusComm.$on('sideBarShow', (show) => {
        this.sideToggleState = show;
      });
      window.Studio.userTracking.insertItem('teachTimes');
      this.listRecord();
      // event
      eventBus.$on('play-record-changed', (playRecordName) => {
        this.recordItem.playRecordName = playRecordName;
      });
      eventBus.$on('delete-record-changed', (deleteRecordName) => {
        this.recordItem.deleteRecordName = deleteRecordName;
      });
      eventBus.$on('rename-record-changed', (renameRecordName) => {
        this.recordItem.renameRecordName = renameRecordName;
      });
      eventBus.$on('refresh-record-list', () => {
        this.listRecord();
      });
      eventBus.$on('speed-changed', (speed) => {
        this.cData.speed = speed;
      });
      eventBus.$on('teach-open-side', () => {
        this.sideToggleState = true;
      });
      eventBus.$on('teach-close-side', () => {
        this.sideToggleState = false;
      });
    },
    beforeDestroy() {
      eventBus.$off();
    },
    methods: {
      listRecord() {
        this.recordItem.recordList = window.FileManager.listProjectListSync(this.moduleName, { sortOrderDesc: true });
      },
    },
    components: {
      HeaderComponent,
      SidebarComponent,
      TeachComponent,
      ElectronComponent,
      UserProfileComponent,
      userProfile,
      newsFeed,
      profileDetailToggle: true,
      newsToggle: false,
    },
    computed: {
      rotation() {
        return parseInt(90 + parseInt(180 * -Math.atan2(this.cData.x, this.cData.y) / Math.PI));
      },
      stretch() {
        return parseInt(Math.sqrt(this.cData.x * this.cData.x + this.cData.y * this.cData.y));
      },
      uarmStatus() {
        return this.$store.getters.uarmStatus;
      },
//    teachStatus() {
//      let teachStatus = this.$refs.teachComponent.teachStatus;
//      console.log(`teachStatus: ${teachStatus.playing}`);
//    },
    },
  };

</script>

<style lang="sass" scoped>
    .app-container {
      background: white;
      .main-wrapper {
            /*background: radial-gradient(ellipse farthest-corner, #f8f8f8, #d2d2d2);*/

             background:radial-gradient(40% 50%, #FFFFFF 41%, #CBCBCB 100%);
        overflow: hidden;
        .head-wrapper {
            display:table;
            position:relative;
            width:100%;
            z-index: 1 !important;
            .header-profile-wrapper {
                position: absolute;
                right: 0;
                top: 0;
            }
        }
        .content-wrapper {
          display:flex;
          width:100%;
          height:100%;
          .side-wrapper, .news-wrapper, .user-wrapper{
            height:100%;
            width:400px;
          }
        }
      }
    }
</style>
