<template lang="html">
  <div class="content-wrapper">
    <div class="start-3d-wrapper">
      <Get3DStarted_00 v-if="page === '3D_00'"></Get3DStarted_00>
      <Get3DStarted_01 v-if="page === '3D_01'"></Get3DStarted_01>
      <Get3DStarted_02 v-if="page === '3D_02'"></Get3DStarted_02>
      <Get3DStarted_03 v-if="page === '3D_03'"></Get3DStarted_03>
      <Get3DStarted_04 v-if="page === '3D_04'"></Get3DStarted_04>
    </div>
    <router-link :to="{name:'home-page'}">
      <img src="./GettingStarted/assets/img/Icon_home.png" class="start-3d-back-button start_3d_back"/>
    </router-link>
  </div>
</template>
<script>
import Get3DStarted_00 from './Get3DStarted/Get3DStarted_00.vue';
import Get3DStarted_01 from './Get3DStarted/Get3DStarted_01.vue';
import Get3DStarted_02 from './Get3DStarted/Get3DStarted_02.vue';
import Get3DStarted_03 from './Get3DStarted/Get3DStarted_03.vue';
import Get3DStarted_04 from './Get3DStarted/Get3DStarted_04.vue';

import { ipcRenderer } from 'electron';
module.exports = {
  data() {
    return {
      page: '3D_00',
    };
  },
  components: {
    Get3DStarted_00,
    Get3DStarted_01,
    Get3DStarted_02,
    Get3DStarted_03,
    Get3DStarted_04,
  },
  methods: {
    hideGetstart() {
    },
  },
  computed: {
  },
  mounted() {
    ipcRenderer.send('start-cura');
  },
  watch: {
    '$route.params.page'() {
    },
  },
};
</script>
<style lang="sass" scoped>
.start-3d-wrapper {
  position: absolute;
  width: 100%;
  // height: 77%;
  // height: 40%;
  top: 0px;
  overflow: hidden;
  bottom: 185px;
  // bottom: 400px;
  // background: yellow;
  // z-index: 5;
  // ma
}
.start-3d-back-button {
    // padding: 0 1vw;
    // border-right: 2px #505050 solid;
    cursor: pointer;
}
.start_3d_back {
  position: absolute;
  // background: yellow;
  width: 23px;
  top: 10px;
  left: 15px;
  // z-index: 15;
}

</style>
