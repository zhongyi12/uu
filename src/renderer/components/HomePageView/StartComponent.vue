<template lang="html">
  <div class="content-wrapper">
      <HeaderComponent></HeaderComponent>
      <SidebarComponent></SidebarComponent>
  </div>
</template>
<script>
import './assets/css/style.scss';
import HeaderComponent from './HeaderComponent.vue';
import SidebarComponent from './SidebarComponent.vue';
module.exports = {
  data() {
    return {
      leapShow: false,
      getStartShow: false,
    };
  },
  components: {
    HeaderComponent,
    SidebarComponent,
  },
  methods: {
    hideGetstart() {
      this.getStartShow = false;
    },
    hideLeap() {
      this.leapShow = false;
    },
  },
  computed: {
    uarmStatus() {
      return this.$store.getters.uarmStatus;
    },
  },
  mounted() {
  },
};

</script>
<style>
</style>
