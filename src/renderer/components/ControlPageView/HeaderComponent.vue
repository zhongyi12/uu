<template lang="html">
    <nav class="navbar ">
      <div class="nav-wrapper">
        <router-link to="home-page" ><img src="../assets/img/btn_back.svg" alt="" class="back-button-control"/></router-link>
        <img :src="titleImage" alt="" class="brand-logo"/>
      </div>
    </nav>
</template>

<script>
export default {
  data() {
    return {
      model: window.GlobalUtil.model,
      titleImage: require(`${this.$t('controlApp.titleImagePath')}`),
    };
  },
};

</script>

<style lang="sass" scoped>
$bottomTextColor: #CCC;
.back-button-control {
    // padding: 0 1vw;
    height: 20px;
    margin-top: 13px;
    padding:0 20px;
    cursor: pointer;
}
.navbar {
    line-height: 50px;
    .nav-wrapper {
        display: flex;
    }
    .brand-logo {
        font-size: 22px;
        margin: 13px 0;
        line-height: 20px;
        height: 40px;
        margin: 12px 0;
        padding:10px;
        color: $bottomTextColor;
    }
}
</style>
