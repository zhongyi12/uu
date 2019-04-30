<template lang="html">
    <div class="select-wrapper">
      <div class="confirm-title">
        {{$t('loginPage.registerSuccess')}}
      </div>
      <div class="confirm-text">
        {{$t('loginPage.emailConfrim')}}
      </div>
      <div class="register-success" @click="loginSuccess()">
        <div class="confirm-button">
          <img src="./assets/img/arrow_enter.svg" alt="">
        </div>
          {{$t('loginPage.enterStudio')}}
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      loginState: '1',
      activeTab: 'deviceTab',
    };
  },
  mounted() {
  },
  methods: {
    loginSuccess() {
      this.$router.push({ name: 'home-page' });
      this.$store.getters.userProfile.isLogin = true;
    },
  },
  components: {
  },
  computed: {
  },
};

</script>

<style lang="sass" scoped>
  .select-wrapper{
    height:100%;
    width:100%;
    padding:7vw 19vw ;
    background-color:#fff;
    text-align: center;
    color: #D95E2E;
    .register-success{
      display: flex;
      flex-direction: column;
      cursor:pointer;
    }
    .confirm-button{
      margin: 1vw auto;
      padding: 1vw 1.3vw;
      background: #D95E2E;
      border-radius: 50%;
      box-shadow: -1px 2px 10px 0 #D95E2E;
    }
    .confirm-title{
      font-family: ufbigfont;
      color: #D95E2E;
      font-size: 2.5vw;
    }
    .confirm-text{
      padding: 1vw 0 5vw;
    }
  }


</style>
