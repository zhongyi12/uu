<template lang="html">
    <div>
      <div class="text-3d-02-01-id">
        {{ this.$t('homePageView.get3dStart.get3dStart02Text01') }}
      </div>

      <img src="./assets/img/right_3d_screenshot02.png" class="get-3d-start-right" />

      <div class="get-3d-start-bottom-text-01">
        {{ this.$t('homePageView.get3dStart.get3dStart01Text99') }}
      </div>
      <div @click="openGuide()" class="get-3d-start-bottom-text-02">
        <!-- {{ this.$t('homePageView.get3dStart.get3dStart01Text98') }} -->
      </div>

      <div class="get-start-page">
        <span>3 / 5</span>
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
      this.$parent.page = '3D_01';
    },
    nextPage() {
      this.$parent.page = '3D_03';
    },
    openGuide() {
      shell.openExternal('#');
    },
  },
};
</script>
<style>
.text-3d-02-01-id {
  font-family: Gotham-Bold;
  font-size: 24px;
  color: #D95E2E;
  position: absolute;
  top: 23%;
  width: 550px;
  left: 0px;
  text-align: center;
}
</style>
