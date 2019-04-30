<template>
<div class="side-wrapper home-side-wrapper">
  <!-- <userprofile></userprofile> -->
  <!-- <newsfeed></newsfeed> -->
  <UserProfileComponent v-if="homeSideVisible"></UserProfileComponent>
  <p class="nickname" v-if="homeSideVisible && this.$store.getters.userProfile.isLogin"> {{this.$store.getters.userProfile.nickname}}</p>
  <div class="device-wrapper" v-show="homeSideVisible">
    <ul class="sidebar-nav">
      <li id="uarm-product-image">
        <img v-if="uarmStatus.usbConnection && uarmCheckProduct==='swiftpro'" src="./assets/img/uarm_swift_pro.png" />
        <img v-else-if="uarmStatus.usbConnection && uarmCheckProduct==='swift'" src="./assets/img/uarm_swift.png" />
        <img v-else src="./assets/img/uarm_disconnect_pro.png" />
      </li>

      <li class="device-connect-wrapper">
        <DeviceConnectionComponent></DeviceConnectionComponent>
        </li>
    </ul>
    <table class=" device-detail">
      <tr>
        <td>{{ $t("homePageView.hardware.portName") }}</td>
        <td>{{uarmInfo.portName}}</td>
      </tr>
      <tr>
        <td>{{ $t("homePageView.hardware.firmwareVersion") }}</td>
        <td>{{uarmInfo.firmwareVersion}}</td>
      </tr>
    </table>
    <div class="text-center buttons">
      <mu-raised-button class="big-btn" :label="$t('homePageView.hardware.setting')" backgroundColor="#D95E2E" @click="gotoSetting()" />
    </div>
  </div>
</div>
</template>
<script>
import userprofile from '../CommonPageView/userProfile.vue';
import newsfeed from '../CommonPageView/newsFeed.vue';
// import statusbar from '../CommonPageView/statusBar.vue';
import eventBusComm from '../CommonPageView/eventBus';
import DeviceConnectionComponent from '../CommonPageView/DeviceConnectionComponent.vue';
import UserProfileComponent from '../CommonPageView/UserProfileComponent.vue';
import News from '../assets/api/newsfeed';
module.exports = {
  data() {
    return {
      uarmInfo: {
        portName: null,
        hardwareVersion: null,
        firmwareVersion: null,
      },
      show: {
        profile: false,
        home: true,
        news: false,
      },
      language: this.$t('language'),
      popopen: false,
      homeSideVisible: true,
//      iconQuestion: require('../CommonPageView/assets/img/icon_question.svg'),
    };
  },
  mounted() {
    News.init();
//    this.poptrigger = this.$refs.button.$el;
    eventBusComm.$on('home-side-show', (show) => {
      this.homeSideVisible = show;
    });
  },
  methods: {
    trackingUser() {
      const testData = 'testTracking';
      window.Studio.userTracking.insertItem(testData);
    },
    popToggle() {
      this.popopen = !this.popopen;
    },
    popupClose() {
      this.popopen = false;
    },
    toggleConnect() {
      const connect = this.uarmStatus.usbConnection;
      if (connect) {
        this.uarmInfo.portName = this.$store.getters.uarmInfo.portName;
        this.uarmInfo.firmwareVersion = this.$store.getters.uarmInfo.firmwareVersion;
        this.uarmInfo.hardwareVersion = this.$store.getters.uarmInfo.hardwareVersion;
      }
      else {
        this.uarmInfo.portName = 'N/A';
        this.uarmInfo.firmwareVersion = 'N/A';
        this.uarmInfo.hardwareVersion = 'N/A';
      }
    },
    gotoSetting() {
      this.$router.push({ name: 'setting' });
    },
    handleHover() {
      this.show.connectedTip = true;
    },
    handleHoverExit() {
      this.show.connectedTip = false;
    },
  },
  created() {
    eventBusComm.$on('show-news', () => {
      this.show.news = true;
      this.show.home = false;
      this.show.profile = false;
    });
    eventBusComm.$on('show-profile', () => {
      this.show.profile = true;
      this.show.home = false;
      this.show.news = false;
    });
    eventBusComm.$on('show-home', () => {
      this.show.profile = false;
      this.show.news = false;
      this.show.home = true;
    });
    this.toggleConnect();
  },
  components: {
    userprofile,
    // statusbar,
    newsfeed,
    DeviceConnectionComponent,
    UserProfileComponent,
  },
  computed: {
    uarmStatus() {
      return this.$store.getters.uarmStatus;
    },
    uarmCheckProduct() {
      return this.$store.getters.uarmInfo.productType;
    },
  },
  watch: {
    'uarmStatus.usbConnection'() {
      this.toggleConnect();
    },
  },
};

</script>
<style lang="sass" scoped>
  .home-side-wrapper {
    .user-wrapper {
      width:100% !important;
    }
    .news-wrapper {
      width:100% !important;
    }
    .header-profile-wrapper {
      background-color:#fff;
      margin:0 auto;
      margin-top:2vh;
      height:60px;
      max-height:60px;
    }
  }
    .nickname {
      color: balck;
      font-size: 1.1rem;
      text-align: center;
      margin:0;
    }
  .side-wrapper{
    box-shadow: -1px 0 1px 0 rgba(113,113,113,0.12);
    .device-wrapper{
      height: 100%;
      display:flex;
      flex-direction: column;
      overflow-y: auto;
      .sidebar-nav {
        padding-left:0;
        li {
          list-style: none;
        }
        #uarm-product-image {
          width:12vw;
          margin:2vw auto 1vw;
          padding:0;
          img {
            width:100%;
            height:100%;
          }
        }
        .device-connect-wrapper {
          position:relative;
          margin:0 auto;
          display:flex;
          justify-content: center;
          margin-top:2vw;
          .device-connect-status {
            color: #7E8690;
            background: #ECECEC;
          }
        }

      }
      .device-detail{
        color:#555;
        font-size: 1vw;
        margin:1.5vw auto 2vw;
         td:first-child {
          font-weight: 600;
           padding-right:2vw;
           display:inline-block;
         }
         td{
            padding-top:.5vw;
         }
      }
      .big-btn {
        width:10vw;
        max-width:140px;
        opacity: 0.9;
      }
    }
    .bottom-wrapper{
      position: absolute;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      width: 100%;
      & > div{
        padding: 1vw;
        position: relative;
        cursor: pointer;
        .pop-wrapper{
          position: absolute;
          bottom: 1vw;
          width: 10vw;
          left: -7vw;
          background: white;
          box-shadow: -3px 0 5px 0 rgba(66,66,66,0.5);
          & > img{
            width: 100%;
          }
          & > div{
            display: flex;
            flex-direction: column;
            a{
              width: 100%;
              font-size: 0.8vw;
              color: black;
              display: flex;
              padding: 1vw 0;
              img{
                width: 2vw;
              }
            }
          }
        }
      }
    }
  }
  .buttons{
    padding-top: 1vw;
  }
  .user-nav{
    display: flex;
    justify-content: space-between;
    padding: 0.5vw;
    position: relative;
    .btn-img{
      img{
        padding: 0 .2vw;
        width: 1.8vw;
      }
    }
    .user-name{
      cursor: pointer;
      color:#D95E2E;
      display: flex;
      img{
        padding: 0 0.5vw;
      }
    }
    .btn-back{
      cursor: pointer;
    }
  }
</style>
