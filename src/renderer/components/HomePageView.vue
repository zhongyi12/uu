<template lang="html">
    <div v-if="uarmStatus.usbConnection || offlineMode" class='page-wrapper noselected'>
        <router-view></router-view>
        <FooterComponent></FooterComponent>
    </div>
    <div v-else class='page-wrapper noselected'>
        <div class="page-connect">
          <div class="start-img">
            <img src="./HomePageView/assets/img/startpage.png" />
          </div>
          <div class="start-text">
            {{ $t("homePageView.notConnected") }}
            <div class="start-offline">
              <a @click="offlineModeClick()">{{ $t("homePageView.goOffline") }}</a><br>
              <router-link :to="{name:'setting', params:{tab:'updateTab'}}" >{{ $t("homePageView.checkUpdate") }}</router-link>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import './HomePageView/assets/css/style.scss';
import HeaderComponent from './HomePageView/HeaderComponent.vue';
import SidebarComponent from './HomePageView/SidebarComponent.vue';
import FooterComponent from './HomePageView/FooterComponent.vue';
module.exports = {
  data() {
    return {
      offlineMode: false,
      paintShortcut: {
        80: false, // p
        85: false, // u
        70: false, // f
      },
    };
  },
  components: {
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  },
  methods: {
    offlineModeClick() {
//      storage.setItem('offlineMode', true);
      this.offlineMode = true;
    },
    keydownEvent(event) {
      if (event.keyCode in this.paintShortcut) {
        this.paintShortcut[event.keyCode] = true;
        if (this.paintShortcut[80] && this.paintShortcut[85] && this.paintShortcut[70]) {
          this.$router.push('paint');
        }
      }
    },
    keyupEvent(event) {
      if (event.keyCode in this.paintShortcut) {
        this.paintShortcut[event.keyCode] = false;
      }
    },
  },
  computed: {
    uarmStatus() {
      return this.$store.getters.uarmStatus;
    },
    uarmInfo() {
      return this.$store.getters.uarmInfo;
    },
  },
  mounted() {
    window.addEventListener('keydown', this.keydownEvent, true);
    window.addEventListener('keyup', this.keyupEvent, true);

    window.Studio.userTracking.insertTime('loginTime');
    window.Studio.userTracking.insertItem('homePageTimes');
    window.Studio.SyncManager.updateUserToken();
    window.Studio.userTracking.uploadTrackData().then(() => {
      console.log('Tracking Data Uploaded..');
    });
  },
};

</script>
  <style lang="sass" scoped>
  $themeOrange:#D95E2E;
  .eggegg{
    width:2vw;
    height:2vw;
    position:absolute;
    right:0;
    top:0;
  }
  .page-connect{
    .start-img img{
      width:100%;
      max-width: 1200px;
    }
    font-family: Gotham-Bold;
    display:flex;
    height:100%;
    width: 90%;
    margin: 0 auto;
    justify-content:flex-start;
    align-items:center;
    flex-direction:column;
    .start-img {
      width:100%;
      text-align: center;
    }
    .start-text{
      margin:auto;
      font-size:1.3rem;
      font-family: 'Gotham-Book';
      .start-offline{
        margin-top:1vw;
        text-align:center;
        font-size:1.2rem;
        cursor: pointer;
        a{

          color:$themeOrange !important;
        }
      }
    }
  }
  @media screen and (min-height: 800px){
    .page-connect .start-img img {
      max-width: 1300px;
    }
  }
  @media screen and (min-height: 900px){
  .page-connect .start-img img {
    max-width: 1600px;
  }
  }
  </style>
