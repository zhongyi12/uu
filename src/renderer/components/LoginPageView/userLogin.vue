<template lang="html">
    <div class="user-login-wrapper">
      <div class="navi-wrapper">
        <img src="./assets/img/login_uflogo.png" alt="">
        <mu-avatar slot="left" :src="question_icon" :size="18" class="question-icon" @click="account_link()"/>
      </div>
      <div class="select-wrapper">
          <div class="signin-wrapper">
            <!--<div class="signin-button login-select left" v-show="selectLogin" @click="loginState = '2'" @mouseover="show.loginDark = false" @mouseout="show.loginDark = true">-->
              <!--<img v-if="show.loginDark" src="./assets/img/img_sign_in_unselected.svg" alt="">-->
              <!--<img v-else src="./assets/img/img_sign_in_selected.svg" alt="">-->
              <!--<div class="font-big">{{$t('loginPage.signin')}}</div>-->
            <!--</div>-->
            <div class="sigin-switch login-switch" v-show="startSignin" @click="loginState = '3'">
              <img src="./assets/img/icon_registeruser_small.svg" alt="">
              <span class="switch-subtxt" v-html="$t('loginPage.switchRegister')"></span>
            </div>
            <div class="signin-form login-form" v-show="startSignin">
              <!--<img src="./assets/img/img_signin_user.svg" alt="">-->
              <div class="font-big">{{$t('loginPage.signin')}}</div>
              <div class="input-wrapper">
                <mu-text-field inputClass="input-style" :label="$t('loginPage.email')" labelFloat v-model="login.loginEmail" :errorText="errorMsg.loginEmail" @blur="checkLoginEmail()"/>
                <mu-text-field ref="password" :label="$t('loginPage.password')" labelFloat type="password" v-model="login.loginPassword" :errorText="errorMsg.loginPassword" @blur="checkLoginPassword()"/>
              </div>
              <mu-checkbox :label="$t('loginPage.remember')" iconClass="login-checkbox" labelClass="login-checkbox" v-model="loginRemember"/>
              <div class="confirm-button" @click="checkLogin()">
                <img src="./assets/img/arrow_enter.svg" alt="">
              </div>
              <div class="forget-password" @click="goToReset()">
                {{$t('loginPage.forget')}}
              </div>
              <div class="login-loading">
                <mu-circular-progress :size="40" v-show="showLoginLoading"/>
              </div>
               <div @click="uploadAndEnter" style="color: #666;cursor: pointer;text-align: right;position: relative;">{{$t('loginPage.jump')}}<i class="material-icons" style="position: absolute;top: -1px;">chevron_right</i></div>
            </div>

          </div>
          <div class="register-wrapper">
            <!--<div class="register-button login-select right" @click="loginState = '3'" v-show="selectLogin" @mouseover="show.registerDark = false" @mouseout="show.registerDark = true">-->
              <!--<img v-if="show.registerDark" src="./assets/img/img_register_unselected.svg" alt="">-->
              <!--<img v-else src="./assets/img/img_register_selected.svg" alt="">-->
              <!--<div class="font-big">{{$t('loginPage.register')}}</div>-->
            <!--</div>-->
            <div class="register-switch login-switch" v-show="startRegister" @click="loginState = '2'">
              <img src="./assets/img/icon_signin_small.svg" alt="">
              <span class="switch-subtxt" v-html="$t('loginPage.switchLogin')"></span>
            </div>
            <div class="register-form login-form" v-show="startRegister">
              <!--<img src="./assets/img/img_Register_user.svg" alt="">-->
              <div class="font-big">{{$t('loginPage.register')}}</div>
              <div class="input-wrapper">
                <mu-text-field :label="$t('loginPage.email')" labelFloat v-model="register.Email" :errorText="errorMsg.registerEmail" @blur="checkRegisterEmail()"/>
                <mu-text-field class="datepick" id="brith-date" :label="$t('loginPage.birth')" type="date" min='1900-01-01' :max="setMaxBirthDate()" v-model="register.Birth" :errorText="errorMsg.registerBirth" @blur="checkRegisterBirth()"/>

                <div class="sub-wrapper">
                  <mu-select-field :class="{countrySelect: true}" v-model="register.Country" :errorText="errorMsg.registerCountry" :label="$t('loginPage.country')" @input="checkRegisterCountry()" :maxHeight="400">
                     <mu-menu-item value="0" :title="$t('loginPage.select')"/>
                     <mu-menu-item v-for="country in countryList" :value="country.Code" :title="country.Name"/>
                  </mu-select-field>
                  <span id="blank-block"></span>
                  <mu-select-field v-model="register.Gender" :errorText="errorMsg.registerGender" :label="$t('loginPage.gender')" @input="checkRegisterGender()">
                     <mu-menu-item value="0" :title="$t('loginPage.select')"/>
                     <mu-menu-item value="1" :title="$t('loginPage.genderList[1]')"/>
                     <mu-menu-item value="2" :title="$t('loginPage.genderList[2]')"/>
                     <mu-menu-item value="3" :title="$t('loginPage.genderList[3]')"/>
                  </mu-select-field>
                </div>
                <mu-text-field :label="$t('loginPage.password')" labelFloat type="password" v-model="register.Password" :errorText="errorMsg.registerPassword"  @blur="checkRegisterPassword()"/>
                <mu-text-field :label="$t('loginPage.repassword')" labelFloat type="password" v-model="register.RePassword" :errorText="errorMsg.registerRePassword"  @blur="checkRegisterRePassword()"/>
              </div>
              <div class="checkbox-wrapper">
                  <div class="register-policy">
                    <mu-checkbox :label="$t('loginPage.agreePolicy1')" iconClass="login-checkbox" labelClass="login-checkbox" v-model="register.Policy" @change="checkPolicy()"/>
                    <!-- <span class="not-error">{{$t('loginPage.agreePolicy1')}}</span>&nbsp; -->
                    <router-link class="under-line" :to="{name:'policy', params: { page: '2', registerData: register }}" v-html="$t('loginPage.agreePolicy2')"></router-link>
                    <span>{{ errorMsg.agreePolicy }}</span>
                  </div>
                  <mu-checkbox :label="$t('loginPage.promotion')" iconClass="login-checkbox" labelClass="login-checkbox" v-model="register.Promotion"/>
              </div>
              <div class="confirm-button" @click="sendRegister">
                <img src="./assets/img/arrow_enter.svg" alt="">
              </div>
              <div class="login-loading">
                <mu-circular-progress :size="40" v-show="showLoginLoading"/>
              </div>
            </div>
          </div>
        </div>
    </div>

</template>
<script>
import datepicker from 'vue-date';
import countries from './assets/json/countries.json';
import accountApi from '../assets/api/accountapi';
export default {
  data() {
    return {
      question_icon: require('./assets/img/icon_question.svg'),
      showLoginLoading: false,
      hosturl: '',
      loginState: '2',
      loginRemember: false,
      login: {
        loginEmail: '',
        loginPassword: '',
      },
      register: {
        Email: '',
        Password: '',
        RePassword: '',
        Country: '0',
        Gender: '0',
        Birth: '1988-01-23',
        Promotion: false,
        Policy: false,
      },
      errorMsg: {
        loginEmail: '',
        loginPassword: '',
        registerEmail: '',
        registerPassword: '',
        registerRePassword: '',
        registerCountry: '',
        registerGender: '',
        registerBirth: '',
        agreePolicy: '',
      },
      countryList: [],
//      show: {
//        loginDark: true,
//        registerDark: true,
//      },
    };
  },
  created() {
    this.countryList = countries;
    if (accountApi.profile.token !== null && this.$store.getters.userProfile.isLogin === false) {
      this.$router.push({ name: 'home-page' });
      this.$store.getters.userProfile.isLogin = true;
    }
    if (this.$route.params.state !== undefined) {
      this.loginState = this.$route.params.state;
    }
    if (this.$route.params.loginData !== undefined) {
      this.login = this.$route.params.loginData;
    }
    if (this.$route.params.registerData !== undefined) {
      this.register = this.$route.params.registerData;
    }
  },
  mounted() {
    const input = this.$refs.password.$el.querySelector('input');
    input.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.checkLogin();
      }
    });
    this.setMaxBirthDate();
  },
  methods: {
    setMaxBirthDate() {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; // January is 0!
      const yyyy = today.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }
      today = `${yyyy}-${mm}-${dd}`;
//      document.getElementById('brith-date').setAttribute('max', today);
      return today;
    },
    account_link() {
      this.$router.push({ name: 'policy', params: {
        page: '1',
        state: this.loginState,
        registerData: this.register,
        loginData: this.login,
      } });
    },
    goToReset() {
      this.$router.push({ name: 'resetpassword' });
    },
    sendRegister() {
      if (!this.showLoginLoading) {
        if (this.register.Email === '' || this.register.Password === ''
          || this.register.Country === '0' || this.register.Gender === '0' || this.register.Policy === false) {
          this.checkRegisterEmail();
          this.checkRegisterPassword();
          this.checkRegisterRePassword();
          this.checkRegisterCountry();
          this.checkRegisterGender();
          this.checkPolicy();
        }
        else if (this.form2Validate) {
          const nickname = this.register.Email.split('@')[0];
          const args = {
            email: this.register.Email,
            password: this.register.Password,
            nickname,
            gender: this.register.Gender,
            birthday: this.register.Birth,
            country: this.register.Country,
            promotion: this.register.Promotion,
          };
          this.showLoginLoading = true;
          accountApi.signUp(args).then(() => {
            this.$router.push({ name: 'registersuccess' });
            this.showLoginLoading = false;
          }).catch((errCode) => {
            switch (errCode) {
              case 1: {
                this.errorMsg.registerEmail = this.$t('loginPage.validation.registerFail');
                break;
              }
              case 2: {
                this.errorMsg.registerEmail = this.$t('loginPage.validation.networkingIssue');
                break;
              }
              default: this.errorMsg.registerEmail = this.$t('loginPage.validation.registerFail');
            }
            this.showLoginLoading = false;
          });
//          this.$http.post(url, newUser).then((response) => {
//            const returnData = response.data === undefined ? response : response.data;
//            if (returnData.code === 0) {
//              console.log(`returnData: ${JSON.stringify(returnData.data.sessionToken)}`);
//              this.updateProfile(null, null, null, null, returnData.data.sessionToken);
//              this.$router.push({ name: 'registersuccess' });
//            }
//            else {
//              this.errorMsg.registerEmail = 'Register fail.';
//            }
//          }, (response) => {
//            console.log('error', response);
//          }).finally(() => {
//            this.showLoginLoading = false;
//          });
        }
      }
    },
    checkLogin() {
      if (!this.showLoginLoading) {
        if (this.login.loginEmail === '' || this.login.loginPassword === '') {
          this.checkLoginEmail();
          this.checkLoginPassword();
        }
        else if (this.form1Validate) {
//        console.log('hostUrl', this.hosturl);
//          const url = `${this.hosturl}api/1.0/signin`;
//          const user = {
//            email: this.loginEmail,
//            password: this.loginPassword,
//          };
          this.showLoginLoading = true;
          this.keepLogin(this.$store.getters.userProfile.token);
          accountApi.signIn(this.login.loginEmail, this.login.loginPassword).then(() => {
            this.$store.getters.userProfile.isLogin = true;
            this.showLoginLoading = false;
            this.$router.push({ name: 'home-page' });
          }).catch((errorCode) => {
            switch (errorCode) {
              case 1: {
                this.errorMsg.loginEmail = this.$t('loginPage.validation.loginFail');
                break;
              }
              case 2: {
                this.errorMsg.loginEmail = this.$t('loginPage.validation.networkingIssue');
                break;
              }
              default: this.errorMsg.loginEmail = this.$t('loginPage.validation.loginFail');
            }
            this.showLoginLoading = false;
          });
//          this.$http.post(url, user).then((response) => {
//            const returnBack = response.data === undefined ? response : response.data;
//            if (returnBack.code === 0) { // login success
//              const returnData = returnBack.data;
//              sessionStorage.loginToken = returnData.sessionToken;
//              sessionStorage.nickname = returnData.nickname;
//              this.updateProfile(returnData.nickname, returnData.email,
//                returnData.emailVerified, returnData.avatar, returnData.sessionToken);
//              this.$router.push({ name: 'home-page' });
//            }
//            else { // login fail
//              this.errorMsg.loginEmail = this.$t('loginPage.validation.loginFail');
//            }
//          }, (response) => {
//            console.log('error', response);
//            this.errorMsg.loginEmail = this.$t('loginPage.validation.networkingIssue');
//          }).finally(() => {
//            this.showLoginLoading = false;
//          });
        }
      }
    },
    keepLogin(mytoken) {
      if (this.loginRemember) {
        localStorage.setItem('loginToken', mytoken);
        console.log('loginToken', mytoken);
      }
    },
    uploadAndEnter() {
      // window.Studio.userTracking.uploadTrackData().then(() => {
      //   console.log('Upload Tracking Data');
      // });
      accountApi.clearUserProfile();
      this.clearCache();
      this.$store.getters.userProfile.isLogin = false;
      this.$router.push({ name: 'home-page' });
    },
    clearCache() {
      localStorage.clear();
      sessionStorage.clear();
      const modules = window.UserConfig.modules;
      for (const k of Object.keys(modules)) {
        window.UserConfig.clean(modules[k]);
      }
    },
    isEmail(email) {
      const filter = /\S+@\S+\.\S+/;
      return filter.test(email);
    },
    checkLoginEmail() {
      if (this.isEmail(this.login.loginEmail)) {
        this.errorMsg.loginEmail = '';
      }
      else {
        this.errorMsg.loginEmail = this.$t('loginPage.validation.emailFormat');
      }
    },
    checkLoginPassword() {
      if (this.login.loginPassword.length > 5) {
        this.errorMsg.loginPassword = '';
      }
      else {
        this.errorMsg.loginPassword = this.$t('loginPage.validation.passwordFormat');
      }
      this.checkLoginEmail();
    },
    checkRegisterEmail() {
      if (this.isEmail(this.register.Email)) {
//        const url = `${this.hosturl}api/1.0/checkemailvalidate`;
//        const checkemail = {
//          email: this.registerEmail,
//        };
        this.showLoginLoading = true;
        accountApi.validateEmail(this.register.Email).then(() => {
          this.errorMsg.registerEmail = '';
          this.showLoginLoading = false;
        }).catch((errCode) => {
          switch (errCode) {
            case 1: {
              this.errorMsg.registerEmail = this.$t('loginPage.validation.emailRegisted');
              break;
            }
            case 2: {
              this.errorMsg.registerEmail = this.$t('loginPage.validation.networkingIssue');
              break;
            }
            default: this.errorMsg.registerEmail = this.$t('loginPage.validation.emailRegisted');
          }
          this.showLoginLoading = false;
        });
//        this.$http.post(url, checkemail).then((response) => {
//          if (response.data.code === 0) {
//            this.errorMsg.registerEmail = '';
//          }
//          else {
//            this.errorMsg.registerEmail = this.$t('loginPage.validation.emailRegisted');
//          }
//        }, (response) => {
//          console.log('error', response);
//          this.errorMsg.registerEmail = this.$t('loginPage.validation.serverUnavailable');
//        }).finally(() => {
//          this.showLoginLoading = false;
//        });
      }
      else {
        this.errorMsg.registerEmail = this.$t('loginPage.validation.emailFormat');
      }
    },
    checkRegisterBirth() {
      const maxDate = new Date(this.setMaxBirthDate().split('-'));
      const registerDate = new Date(this.register.Birth.split('-'));
      if (this.register.Birth === '' || registerDate > maxDate) {
        this.errorMsg.registerBirth = this.$t('loginPage.validation.birthEmpty');
      }
      else {
        this.errorMsg.registerBirth = '';
      }
    },
    checkRegisterPassword() {
      if (this.register.Password.length > 5) {
        this.errorMsg.registerPassword = '';
      }
      else {
        this.errorMsg.registerPassword = this.$t('loginPage.validation.passwordFormat');
      }
    },
    checkRegisterRePassword() {
      if (this.register.RePassword === this.register.Password) {
        this.errorMsg.registerRePassword = '';
      }
      else {
        this.errorMsg.registerRePassword = this.$t('loginPage.validation.passwordMatch');
      }
    },
    checkRegisterCountry() {
      if (this.register.Country === '0') {
        this.errorMsg.registerCountry = this.$t('loginPage.validation.countryEmpty');
      }
      else {
        this.errorMsg.registerCountry = '';
      }
    },
    checkRegisterGender() {
      if (this.register.Gender === '0') {
        this.errorMsg.registerGender = this.$t('loginPage.validation.genderEmpty');
      }
      else {
        this.errorMsg.registerGender = '';
      }
    },
    checkPolicy() {
      if (this.register.Policy === true) {
//        this.errorMsg.agreePolicy = this.$t('loginPage.validation.agreePolicy');
        this.errorMsg.agreePolicy = '';
      }
      else {
//        this.errorMsg.agreePolicy = '';
        this.errorMsg.agreePolicy = this.$t('loginPage.validation.agreePolicy');
      }
    },
  },
  components: {
    datepicker,
  },
  computed: {
//    selectLogin() {
//      return this.loginState === '1';
//    },
    startSignin() {
      return this.loginState === '2';
    },
    startRegister() {
      return this.loginState === '3';
    },
    form1Validate() {
      if (this.errorMsg.loginEmail === '' && this.errorMsg.loginPassword === '') {
        return true;
      }
      return false;
    },
    form2Validate() {
      if (this.errorMsg.registerEmail === '' && this.errorMsg.registerPassword === ''
          && this.errorMsg.registerRePassword === '' && this.errorMsg.registerCountry === ''
          && this.errorMsg.registerGender === '' && this.errorMsg.registerBirth === '') {
        return true;
      }
      return false;
    },
  },
};

</script>
<style lang="sass">
    .login-form{
        .mu-text-field.has-label {
            width:100%;
            margin-bottom: 0;
        }
        .mu-text-field.has-label .mu-text-field-content{
            padding-top: 27px !important;
            padding-bottom: 12px !important;
            border:none;
    }
        .mu-text-field.has-label .mu-text-field-label{
            top:8px;
            left:0;
            width:100%;
            text-align: center;
            color: #DC6E42;
            transform-origin:center;
    }
        .mu-text-field {
            .mu-text-field-line{
                display: block;
                background-color: #DC6E42;;
    }
        .mu-dropDown-menu{
            border:none;
            .mu-dropDown-menu-text{
                color: #555;
                text-align: center;
    }
    }
    }
        input.mu-text-field-input {
            height: 32px !important;
            background-color: transparent !important;
            color:#555;
            text-align: center;
    }
        .mu-checkbox-wrapper{
            justify-content:center;
    }
        .mu-checkbox-ripple-wrapper{
            display: none;
    }
        .login-checkbox{
            color:#D95E2E;
            font-size:1vw;
            font-weight:normal;
    }
        .mu-checkbox-icon{
            margin-right: 7px;
    }
        .hint-text{
            color:#ababab;
            text-align: center;
            width: 100%;
    }
    }

</style>

<style lang="sass"  scoped>
.user-login-wrapper {
  .font-big{
    font-family: ufbigfont;
    color: #FFD3C2;
    font-size: 2.5vw;
  }
  .user-login-wrapper {
    height:100%;
  }
    .navi-wrapper{
      height:10vh;
      display:flex;
      margin:1% auto;
      position:relative;
      .navi-title{
        margin:auto;
        font-size:1.5vw;
    }
      img{
        cursor:pointer;
        height:100%;
        margin:auto;
      }
      .mu-avatar {
        background:#fff;
        width: 28px !important;
        height: 28px !important;
        position: absolute;
        right: 36%;
        top: 28%;
        cursor:pointer;
      }
    }
    .select-wrapper{
      display: flex;
      height: 100%;
      width: 100%;
      justify-content: center;
      & > div{
        display: flex;
        & > div{

          height:60vh;
        }
        .login-select{
          position: relative;
          width: 30vw;
          height:60vh;
          display: flex;
          justify-content: center;
          background-color: #FFF0EA;
          z-index: 1;
          cursor: pointer;
          .font-big{
            top: 56%;
            position: absolute;
          }
          & > img {
            position: absolute;
            height:40%;
            top:20%;
          }
        }
        .login-select:hover{
          background-color: rgba(217,94,46,0.78);
          border-left: none;
          z-index: 3;
          .font-big{
            color: #F6D8CD;;
          }
        }

        .login-form{
          color: #D95E2E;
          background-color: #fff;
          border:1px solid rgba(85,85,85,0.15);
          width: 60vw;
          height:80vh;
          min-height:520px;
          display: flex;
          flex-direction: column;
          padding: 0 8vw;
          justify-content: space-around;
          position: relative;
          .font-big{
            padding-top:10px;
            width: 100%;
            text-align: center;
            color: #D95E2E;;
            left: 0;
          }
          .input-wrapper{
            padding: 0 6vw;
            text-align: center;
            .sub-wrapper{
              display: flex;
              #blank-block{
                width: 4vw;
                height: 1vw;
              }
            }
            .datepick{
              padding-left: 4vw;
            }
          }
          .checkbox-wrapper {
            position:relative;
            padding-left:6vw;
            .register-policy {
              span {
                color:#D95E2E;
                font-size:0.9vw;
                font-weight:normal;
                display:inline-block;
                height:24px;
                text-align: left;
                line-height: 24px;
                position: relative;
                top: -10px;
              }
              span.not-error{
                font-size:1vw;
              }
              .under-line {
                cursor: pointer;
                  color:#D95E2E;
                  font-size:1vw;
                  font-weight:normal;
                  display:inline-block;
                  height:24px;
                  text-align: left;
                  line-height: 24px;
                  position: relative;
                  top: -10px;
              }
            }
          }
          .confirm-button{
            text-align: center;
            margin: 0 auto;
            background: #D95E2E;
            border-radius: 50%;
            box-shadow: -1px 2px 10px 0;
            cursor:pointer;
            width:60px;
            height:60px;
            line-height:60px;
            padding-bottom:10px;
              img {
                height:20%;
                vertical-align: middle;
              }
            }
          .forget-password{
            color:#D95E2E;
            font-size:1vw;
            text-align: center;
            cursor:pointer;
          }
          .login-loading {
            text-align: center;
          }
        }
        .login-switch{
          background-color: #E17E58;
          padding: 3vw 0 2vw;
          width:8vw;
          height:80vh;
          min-height:520px;
          cursor:pointer;
          display:flex;
          justify-content:center;
          flex-direction:column;
          align-items:center;
          .switch-subtxt{
            color:#F6D8CD;
            font-size:0.9vw;
            text-align: center;
            font-size: 0.9vw;
          }
          img{
            width: 5vw;
            height: 5vw;
          }
        }
        .register-button{
          border-left:1px solid #ddd;
        }
      }
    }
}

</style>
