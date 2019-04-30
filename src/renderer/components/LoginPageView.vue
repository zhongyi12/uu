<template lang="html">
    <div class="app-container noselected">
      <div class="main-wrapper">
        <router-view ></router-view>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  mounted() {
    window.Studio.userTracking.insertTime('openTime');
  },
  methods: {
  },
  components: {
  },
  computed: {
  },
};

</script>

<style lang="sass" scoped>
.app-container {
    background: white;
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    justify-content:center;
    .main-wrapper{
      display:flex;
      width:100%;
    }

}


</style>
