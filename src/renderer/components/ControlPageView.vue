<template lang="html">
  <div class="app-container noselected">
      <div class="s12 main-wrapper">
          <topbar></topbar>
          <control></control>
          <!-- <div class="toggle-button-fixed hide" @click="toggleSideClick()">
            <img v-if="sideToggleState" :src="images.toggleoff" alt="hide side bar" />
            <img v-else :src="images.toggleon" alt="hide side bar" />
          </div> -->
      </div>
      <!-- <siderbar :connection="connection" v-show="sideToggleState"></siderbar> -->
  </div>
</template>

<script>
const imagePath = './assets/img/';
import topbar from './ControlPageView/HeaderComponent.vue';
// import siderbar from './ControlPageView/SidebarComponent.vue';
import control from './ControlPageView/ControlComponent.vue';
export default {
  data() {
    return {
      model: window.GlobalUtil.model,
      sideToggleState: false,
      images: {
        toggleoff: require(`${imagePath}toggle-off.png`),
        toggleon: require(`${imagePath}toggle-on.png`),
      },
    };
  },
  mounted() {
    window.Studio.userTracking.insertItem('controlTimes');
  },
  methods: {
    toggleSideClick() {
      this.sideToggleState = !this.sideToggleState;
    },
  },
  components: {
    topbar,
    // siderbar,
    control,
  },
  computed: {
    connection() {
      return this.$store.state.uarmConnectStatus;
    },
    cameraConnectStatus() {
      return this.$store.state.cameraConnectStatus;
    },
  },
};

</script>

<style lang="sass" scoped>
  .app-container {
      background: white;
      .main-wrapper {
          background: radial-gradient(ellipse farthest-corner, #444, #3A3A3A, #313131, #2B2B2B);
          overflow: hidden;
      }
  }
</style>
