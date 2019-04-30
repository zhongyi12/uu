<template lang="html">
    <nav class="navbar ">
      <div class="nav-wrapper">
        <!-- <router-link :to="{name:'home'}" class="fa fa-chevron-left fa-2x home" aria-hidden="true" ></router-link> -->
        <!--<router-link :to="{name:'home-page'}" @click="stopAll"><img src="./assets/img/btn_back.svg" alt="" class="home"/></router-link>-->
          <a @click="backToHome()"><img src="../assets/img/btn_back.svg" class="back-button"/>
          </a>
        <img src="./assets/img/title_teach&play.svg" alt="" class="brand-logo" />
      </div>
    </nav>
</template>

<script>
  import eventBus from './eventBus';
  export default {
    data() {
      return {
        titleImage: require(`${this.$t('recordApp.titleImagePath')}`),
      };
    },
    methods: {
      quit() {
        window.UArm.stop_all();
        this.$router.push('home-page');
      },
      backToHome() {
        eventBus.$emit('prompt-save-record', this.quit);
      },
      stopAll() {
        window.UArm.stop_all();
      },
    },
  };

</script>

<style lang="sass" scoped>
$bottomTextColor: #555;
.back-button {
    // padding: 0 1vw;
    height: 20px;
    padding:0 20px;
    cursor: pointer;
}
.navbar {
    line-height: 50px;
    background-color:#3c3c3c;
    margin-bottom:0;
    border-radius:0;
    width:100%;
    height:64px;
    .nav-wrapper {
        display: flex;
        align-items:center;
    }
    .home {
        line-height: 50px;
    }
    .brand-logo {
        font-size: 22px;
        margin: 13px 0;
        line-height: 20px;
        height: 40px;
        margin: 12px 0;
        padding:10px;
    }
}
</style>
