<template lang="html">
    <div>

      <div class="text-3d-00-01-id">
        {{ this.$t('homePageView.get3dStart.get3dStart00Text01') }}
      </div>

      <div class="text-3d-00-box">
        <div class="text-3d-00-02-id text-3d-00-detail get-start-blockly-font-size">
          {{ this.$t('homePageView.get3dStart.get3dStart00Text02') }}
        </div>
        <div class="text-3d-00-03-id text-3d-00-detail get-start-blockly-font-size">
          <a id="jump-url" @click="openUrl()">
            {{ this.$t('homePageView.get3dStart.get3dStart00Text03') }}
          </a>
        </div>
        <div class="text-3d-00-04-id text-3d-00-detail get-start-blockly-font-size">
          {{ this.$t('homePageView.get3dStart.get3dStart00Text04') }}
        </div>
      </div>

      <div class="img-00-01">
        <img src="./assets/img/cura-icon.png" class="img-00-0" @click="openCura()" />
        <div class="text-00-title text-00-title-location">
          {{ this.$t('homePageView.get3dStart.get3dStart00Text05') }}
        </div>
      </div>

      <div>
        <div class="text-3d-00-05-id">
          {{ this.$t('homePageView.get3dStart.get3dStart01Text99') }}
        </div>
      </div>

      <div class="get-start-page">
        <span>
          1 / 5
        </span>
      </div>

      <!-- <img class="get-start-prev" @click="prevPage()" src="./assets/img/icon_prev.svg" /> -->
      <img class="get-start-next" @click="nextPage()" src="./assets/img/icon_next.svg" />
    </div>
</template>
<script>
import { shell, ipcRenderer } from 'electron';
module.exports = {
  methods: {
    // prevPage() {
    //   this.$parent.page = '3D_01';
    // },
    openCura() {
      ipcRenderer.send('start-cura');
    },
    nextPage() {
      this.$parent.page = '3D_01';
    },
    openGuide() {
      shell.openExternal('#');
    },
    openUrl() {
      // const url = document.getElementById('jump-url').innerHTML;
      const url = `https://www.ufactory.cc/#/${window.Studio.AppConfig.LANG}/support`;
      shell.openExternal(url);
    },
  },
};
</script>
<style>
.img-00-0 {
  left: 0;
  top: 0;
  cursor: pointer;
}
.img-00-01 {
  position: absolute;
  width: 100%;
  background: yellow;
  /*height: 109px;*/
  /*left: 996px;*/
  /*top: 368px;*/
  /*top: 65%;*/
  top: 50%;
  margin:0 auto;
  left: 0px;
  right: 0px;
  /*right: 0px;*/
}
.img-00-01 img {
  position: absolute;
  width: 83px;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.text-3d-00-01-id {
  font-family: Gotham-Bold;
  font-size: 24px;
  color: #D95E2E;
  position: absolute;
  top: 2%;
  width: 100%;
  /*width: 550px;*/
  /*left: 0px;*/
  text-align: center;
}
.text-3d-00-box {
  position: absolute;
  width: 100%;
  top: 20%;
}
.text-3d-00-detail {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  color: #555555;
}
.text-3d-00-02-id {
  position: absolute;
  top: 0px;
  width: 100%;
  text-align: center;
  font-size: 18px;
}
.text-3d-00-03-id a {
  position: absolute;
  top: 30px;
  width: 100%;
  text-align: center;
  font-size: 18px;
  color: #D95E2E;
  cursor: pointer;
}
.text-3d-00-04-id {
  position: absolute;
  top: 90px;
  width: 100%;
  text-align: center;
  font-size: 18px;
}
.text-3d-00-05-id {
  position: absolute;
  font-family: .PingFangSC-Light;
  font-size: 16px;
  color: #D95E2E;
  line-height: 20px;
  margin: 0 auto;
  left: 0;
  right: 0;
  text-align: center;
  bottom: 40px;
}
.text-00-title {
  font-family: Gotham-Book;
  font-size: 18px;
  color: #555555;
}
.text-00-title-location {
  position: absolute;
  width: 100%;
  /*left: -60px; */
  text-align: center;
  z-index: 5px;
  margin-top:85px;
}
</style>
