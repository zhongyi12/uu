<template lang="html">
    <div id="leapmotion-page" class="app-container" style="background-color:yellow;">
        <div @click="openUrl()" id="open-div-id" style="position:absolute;top:200px;width:100px;height:50px;background:yellow;z-index:20;display:none;">
          <!-- <div style="width:80px;height:30px;background-color: red;" onclick="window.history.back()"></div> -->
        </div>
        <div>
          <img src="./assets/img/btn_back.svg" class="back-button" />
        </div>
        <div id="leap-wrapper" style="position:absolute;width:100%;height:100%;background-color:black;">
            <iframe v-if="lang === 'cn'" src='./leapmotion/index_leap_cn.html' id="leap-frame" style="position:absolute;width:100%;height:100%;"></iframe>
            <iframe v-else src='./leapmotion/index_leap_en.html' id="leap-frame" style="position:absolute;width:100%;height:100%;"></iframe>
            <router-link :to="{name:'home-page'}">
              <div style="position:absolute;width:100px;height:80px;">
              </div>
            </router-link>
            </div>
        </div>
    </div>
</template>
<script>
// import './assets/lib/leapmotion/css/index.css';
// import './assets/lib/leapmotion/css/normalize.css';
// import LeapmotionComponent from './LeapmotionPageView/LeapmotionComponent.vue';
// import three from './assets/lib/leapmotion/js/three.r76.min.js'
// import index from './assets/lib/leapmotion/js/index.js'
// import shell from 'electron';
import { shell } from 'electron';
module.exports = {
  data() {
    return {
      lang: window.Studio.AppConfig.LANG,
    };
  },
  mounted() {
    window.UArm.set_mode(0);
    window.UArm.reset();
    window.Studio.userTracking.insertItem('leapMotionTimes');
    // document.getElementById('leap-frame').src = './leapmotion/index_leap.html';
  },
  // mounted: {
  // },
  // components: {
  //   LeapmotionComponent,
  // },
  created: {
  },
  methods: {
    openUrl() {
//      console.log('open url 2');
      const element = document.getElementById('open-div-id');
//      console.log(element.url);
      shell.openExternal(element.url);
    },
  },
};
</script>
