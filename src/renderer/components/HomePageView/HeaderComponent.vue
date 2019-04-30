<template>
<div class="left-wrapper">
  <div class="container-fluid">
    <div class="row logo-text">
      <img src="./assets/img/logo.svg">
    </div>
    <div class="row get-start">
      <img src="./assets/img/banner.png" />
      <h1 class="inner" v-html="$t('homePageView.intro.slogan')"></h1>
      <router-link :to="{name:'tutorial'}">
        <div class="btn">{{ $t("homePageView.intro.btnStart") }}</div>
      </router-link>
    </div>
  </div>
</div>
</template>
<script>
module.exports = {
  methods: {
  },
};
</script>
<style lang="sass" scoped="">
  @media screen and (max-height: 768px){
  .get-start img {
    max-width: 660px;
  }
  }
  @media screen and (min-height: 768px) and (max-height:900px){
  .get-start img {
    max-width: 820px;
  }
  }
  @media screen and (min-height: 900px) and (max-height: 1000px){
    .get-start img {
      max-width: 920px;
  }
  }
    @media screen and (min-height: 1000px){
    .get-start img {
      max-width: 1500px;
  }
  }
</style>