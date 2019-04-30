<template lang="html">
    <div>

      <div class="text-3d-01-01-id">
        {{ this.$t('homePageView.get3dStart.get3dStart01Text01') }}
      </div>

      <div class="text-3d-01-box">
        <div class="text-3d-01-02-id text-3d-01-detail get-start-blockly-font-size">
          {{ this.$t('homePageView.get3dStart.get3dStart01Text02') }}
        </div>
        <div class="text-3d-01-03-id text-3d-01-detail get-start-blockly-font-size">
          {{ this.$t('homePageView.get3dStart.get3dStart01Text03') }}
        </div>
      </div>

      <img src="./assets/img/right_3d_screenshot01.png" class="get-3d-start-right" />

      <div class="get-3d-start-bottom-text-01">
        {{ this.$t('homePageView.get3dStart.get3dStart01Text99') }}
      </div>
      <div @click="openGuide()" class="get-3d-start-bottom-text-02">
        <!-- {{ this.$t('homePageView.get3dStart.get3dStart01Text98') }} -->
      </div>

      <div class="get-start-page">
        <span>
          2 / 5
        </span>
      </div>

      <img class="get-start-prev" @click="prevPage()" src="./assets/img/icon_prev.svg" />
      <img class="get-start-next" @click="nextPage()" src="./assets/img/icon_next.svg" />
    </div>
</template>
<script>
import { shell } from 'electron';
module.exports = {
  methods: {
    prevPage() {
      this.$parent.page = '3D_00';
    },
    nextPage() {
      this.$parent.page = '3D_02';
    },
    openGuide() {
      shell.openExternal('#');
    },
  },
};
</script>
<style>
.text-3d-01-01-id {
  font-family: Gotham-Bold;
  font-size: 24px;
  color: #D95E2E;
  position: absolute;
  top: 23%;
  width: 550px;
  left: 0px;
  text-align: center;
}
.text-3d-01-box {
  position: absolute;
  width: 550px;
  top: 35%;
}
.text-3d-01-detail {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  color: #555555;
}
.text-3d-01-02-id {
  position: absolute;
  top: 0px;
  width: 311px;
  margin: 0 auto;
  left: 0px;
  right: 0px;
  text-align: center;
  font-size: 18px;
}
.text-3d-01-03-id {
  position: absolute;
  top: 70px;
  width: 311px;
  margin: 0 auto;
  left: 0px;
  right: 0px;
  text-align: center;
  font-size: 18px;
}
</style>
