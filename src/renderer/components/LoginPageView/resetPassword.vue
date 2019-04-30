<template lang="html">
    <div class="select-wrapper login-form">
      <div class="reset-wrapper" v-if="resetSuccess">
        <div class="font-big">
          {{$t('loginPage.reset')}}
        </div>
        <div class="reset-success">
          <div class="">
            {{$t('loginPage.emailSent')}}
          </div>
          <div class="">
            {{$t('loginPage.emailSentText')}}
          </div>
        </div>
        <div class="">
          <div class="confirm-button" @click="cancelReset">
            <img src="./assets/img/arrow_enter.svg" alt="">
          </div>
        </div>
      </div>
      <div class="reset-wrapper" v-else>
        <div class="font-big">
          {{$t('loginPage.reset')}}
        </div>
        <div class="input-wrapper">
          <mu-text-field :hintText="$t('loginPage.emailHint')" type="email" v-model="userEmail" :errorText="errorMsg.loginEmail" hintTextClass="hint-text" @blur="checkLoginEmail()"/>
        </div>
        <datepicker v-model="registerBirth"></datepicker>
        <div class="action-wrapper">
          <div class="confirm-button" @click="startReset">
            <img src="./assets/img/arrow_enter.svg" alt="">
          </div>
          <div @click="cancelReset" class="cancel-btn">{{$t('loginPage.cancel')}}</div>
        </div>
      </div>

    </div>
</template>
<script>
import datepicker from 'vue-date';
export default {
  data() {
    return {
      loginState: '1',
      activeTab: 'deviceTab',
      registerBirth: '',
      userEmail: '',
      hosturl: '',
      resetSuccess: false,
      errorMsg: {
        loginEmail: '',
      },
    };
  },
  mounted() {
    this.hosturl = window.Studio.AppConfig.API_HOST_URL;
  },
  methods: {
    checkLoginEmail() {
      if (this.isEmail(this.userEmail)) {
        this.errorMsg.loginEmail = '';
      }
      else {
        this.errorMsg.loginEmail = this.$t('loginPage.validation.emailFormat');
      }
    },
    cancelReset() {
      this.$router.push({ name: 'login', params: { state: '2' } });
    },
    isEmail(email) {
      const filter = /\S+@\S+\.\S+/;
      return filter.test(email);
    },
    startReset() {
      if (this.userEmail === '') {
        return;
      }
      else if (this.form1Validate) {
        const url = `${this.hosturl}api/1.0/resetpassword`;
        const user = {
          email: this.userEmail,
        };
        this.$http.post(url, user).then((response) => {
          console.log(response);
          this.resetSuccess = true;
        }, (response) => {
          console.log('error', response);
        });
      }
    },
  },
  components: {
    datepicker,
  },
  computed: {
    form1Validate() {
      if (this.errorMsg.loginEmail === '') {
        return true;
      }
      return false;
    },
  },
};

</script>

<style lang="sass" scoped>
  .select-wrapper{
    height: 100%;
    width: 100%;
    justify-content: center;
    padding: 0 10vw;
    background-color: #fff;
    justify-content: center;
    align-items: center;
    padding-top:16%;
    .reset-wrapper{
      color: #D95E2E;;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 22vw;
      width: 100%;
      .reset-success{
        div{
          text-align: center;
        }
      }
      .input-wrapper{
        padding: 0 6vw;
        width: 100%;
      }
      .font-big{
        font-size:2vw;
        padding: 10% 0;
      }
        .confirm-button{
            text-align: center;
            margin: 2vw auto;
            background: #D95E2E;
            border-radius: 50%;
            box-shadow: -1px 2px 10px 0;
            cursor:pointer;
            width:60px;
            height:60px;
            line-height:60px;
                img {
                    height:20%;
                    vertical-align: middle;
            }
        }
      .cancel-btn{
        text-align: center;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }


</style>
