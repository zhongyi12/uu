<template lang="html">
  <div class="user-wrapper" v-show="profileVisible">
    <div class="title">
        {{$t('userTitle')}}
        <img  class="close-profile" src="./assets/img/UserProfile/icon_closed.svg" alt="close" @click="closeProfile()"/>
      </div>
    <div class="user-avatar">
      <mu-avatar v-if="this.avatar != ''" :src="this.avatar" alt="avatar" :size="60"></mu-avatar>
      <mu-avatar v-else :src="defaultHeaderImg" alt="avatar" :size="60"></mu-avatar>
      <img v-show="!editable" class="avatar-band" @click="changeAvatarClick" :src="smallCamera"/>
      <input type="file" class="hide" id="avatar-file" name="file" accept="image/*"/>
    </div>
    <div class="table-wrapper">
      <table class="user-profile">
        <tr>
          <td>{{$t('userPage.name')}}</td>
          <td><input class="user-name" type="text" v-model="username" :readonly="editable"/></td>
        </tr>
        <tr>
          <td>{{$t('userPage.email')}}</td>
          <td class="email">{{$store.getters.userProfile.email}}</td>
        </tr>
      </table>
    </div>
    <div class="btn-wrapper">
        <mu-raised-button v-show="editable" :label="$t('userPage.button.edit')" class="demo-raised-button big-btn" backgroundColor="#D95E2E" color="white" @click="startEdit()"/>
        <mu-raised-button v-show="!editable" :label="$t('userPage.button.save')" class="demo-raised-button big-btn" backgroundColor="#52BF53" color="white" @click="saveEdit()"/>
        <br>
        <!--<mu-raised-button v-show="editable" :label="$t('userPage.button.signout')" class="demo-raised-button big-btn" @click="logOut()" />-->
        <mu-raised-button v-show="!editable" :label="$t('paintApp.dailog.cancelBtn')" class="demo-raised-button big-btn" backgroundColor="#C3C4C6" @click="cancelEdit()"/>
    </div>

  </div>
</template>
<script>
import eventBus from './eventBus';
module.exports = {
  i18n: {
    messages: {
      en: {
        userTitle: 'PROFILE',
        username: 'User Name',
        email: 'Email',
        btn: {
          edit: 'Edit',
          save: 'Save',
          cancel: 'Cancel',
        },
      },
      cn: {
        userTitle: '个人信息',
        username: '用户名',
        email: '邮箱',
        btn: {
          edit: '编辑',
          save: '保存',
          cancel: '取消',
        },
      },
    },
  },
  data() {
    return {
      defaultHeaderImg: require('./assets/img/default_head.svg'),
      hosturl: '',
      username: this.$store.getters.userProfile.nickname,
      editable: true,
      avatar: '',
      avatarImage: null,
      userProfile: {
        nickname: null,
        email: null,
        token: null,
        emailVerified: null,
        avatar: null,
      },
      avatarChanged: false,
      smallCamera: require('./assets/img/UserProfile/icon_small_camera.svg'),
      profileVisible: false,
    };
  },
  mounted() {
    this.userProfile.nickname = this.username;
    eventBus.$on('show-profile-info', (show) => {
      this.profileVisible = show;
    });
    if (!this.$store.getters.userProfile.avatar) {
      this.avatar = '';
    }
    else {
      this.avatar = this.$store.getters.userProfile.avatar;
    }
    document.getElementById('avatar-file').onchange = () => {
      const fileObj = document.getElementById('avatar-file').files[0];
      if (fileObj !== '') {
        this.avatarImage = fileObj;
        this.avatarPreview();
      }
    };
    this.hosturl = window.Studio.AppConfig.API_HOST_URL;
//    this.getProfile();
  },
  methods: {
    closeProfile() {
//      eventBus.$emit('prifileNewsShow', false);
      this.profileVisible = false;
      eventBus.$emit('toggle-side-visible', true);
      eventBus.$emit('sideBarShow', true);
      eventBus.$emit('home-side-show', true);
    },
    changeAvatarClick() {
      if (!this.editable) {
        document.getElementById('avatar-file').click();
      }
    },
    avatarPreview() {
      this.avatarChanged = true;
      const file = this.avatarImage;
      const filetype = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/BMP';
      if (file.size < 1024 * 1024 * 2 && filetype) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.avatar = e.target.result;
        };
      }
    },
    hideSnackbar() {
      this.$store.dispatch('hideSnackBar');
    },
    startEdit() {
      this.editable = false;
    },
    cancelEdit() {
      this.avatarChanged = false;
      this.editable = true;
      if (this.$store.getters.userProfile.avatar !== '') {
        this.avatar = this.$store.getters.userProfile.avatar;
      }
      else {
        this.avatar = '';
      }
      this.username = this.$store.getters.userProfile.nickname;
    },
    saveEdit() {
      if (this.username !== '' && this.username !== this.userProfile.nickname) {
        const url = `${this.hosturl}api/1.0/updateuserinfo`;
        const user = {
          nickname: this.username,
        };
        const options = {
          headers: {
            'X-LC-Session': this.$store.getters.userProfile.token,
          },
        };
        this.$http.post(url, user, options).then((response) => {
          console.log(response);
          const muteData = {
            nickname: this.username,
          };
          this.$store.commit('SET_USER_PROFILE', muteData);
          this.editable = true;
        }, (response) => {
          console.log('error', response);
        });
      }
      if (this.avatarChanged) {
        this.uploadAvatar();
      }
    },
    uploadAvatar() {
      const formdata = new FormData();
      formdata.append('file', document.getElementById('avatar-file').files[0]);
      const url = `${this.hosturl}api/1.0/uploadavatar`;
      const options = {
        headers: {
          'X-LC-Session': this.$store.getters.userProfile.token,
          'Content-Type': 'multipart/form-data',
        },
      };
      this.$http.post(url, formdata, options).then(response => {
        console.log(response);
        const returnBack = response.data === undefined ? response : response.data;
        if (returnBack.code === 0) {
          this.avatar = returnBack.data.avatar;
          const muteData = {
            avatar: this.avatar,
          };
          this.$store.commit('SET_USER_PROFILE', muteData);
          this.editable = true;
        }
        else {
          console.log('error code and msg:', returnBack.code, returnBack.message);
        }
      }, response => {
        console.log('error', response);
      });
    },
  },
  computed: {
    snackBarDisplayFlag() {
      return this.$store.getters.snackBarData.snackBarDisplayFlag;
    },
    snackBarDisplayMessage() {
      return this.$store.getters.snackBarData.snackBarDisplayMessage;
    },
  },
  watch: {
    '$store.getters.userProfile.name'() {
      this.username = this.$store.getters.userProfile.name;
    },
  },
};

</script>
<style lang="sass" scoped>
$themeOrange: #D95E2E;
.user-wrapper{
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  width:30%;
  height:100%;
  background-color:#fff;
    .title {
        height:60px;
        line-height: 60px;
        text-align: center;
        font-size: 1.2vw;
        border-top:1px solid  #E9E7E6;
        border-bottom: 1px solid  #E9E7E6;
        position:relative;
        width:100%;
        font-family: ufbigfont;
        letter-spacing: .1rem;
        color:#555;
        width:90%;
        margin:0 auto;
        margin-top:2vw;
        .close-profile{
            width:25px;
            padding-right:10px;
            cursor: pointer;
            position:absolute;
            right:0;
            top:38%;
        }
    }
  .user-avatar{
    padding-top: 4vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: ufbigfont;
    font-size: 1vw;
    position: relative;
    .avatar-band{
      position: absolute;
      bottom:-2px;
      right: -2px;
      cursor: pointer;
    }
  }
  .table-wrapper{
    margin-top:3vw;
    font-size: 1rem;
    .user-profile {
        color:#555;
        tr{
            border-bottom:1px solid rgba(233,231,230,0.48);
            .user-name {
                border:none;
                width: 100%;
            }
        }
        td{
            padding:3vw 0 .6vw;
            display:inline-block;
            width:70%;
        }
        td:first-child {
            width:28%;
        }
        .email {
            color: #9A9998;
        }
    }
  }
  .btn-wrapper {
      margin-top:4.5vw;
      .big-btn {
          width:12vw;
          max-width: 160px;
          font-weight:400;
          margin-top:1.5vw;
      }
  }
}
</style>
