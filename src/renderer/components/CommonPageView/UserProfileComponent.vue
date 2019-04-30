<template lang="html">
    <div class="header-profile-wrapper" >

    <mu-flat-button class="avatar-dropdown" @click="profileMenuVisible = !profileMenuVisible">
        <mu-avatar class="profile-avatar">
            <img v-if="this.$store.getters.userProfile.avatar != '' && this.$store.getters.userProfile.isLogin" :src="this.$store.getters.userProfile.avatar" alt="">
            <img v-else src="./assets/img/default_head_small.svg" alt="">
        </mu-avatar>
        <div class="icon">
            <img v-if="$route.name === 'home-page'" slot="left" src="./assets/img/UserProfile/icon_expand_black.svg"/>
            <img v-else slot="left" src="./assets/img/UserProfile/icon_user_expand.svg"/>
        </div>
        <!--<img class="icon-dot" src="./assets/img/UserProfile/menu.svg"/>-->
    </mu-flat-button>
    <div v-if="this.$store.getters.userProfile.isLogin">
        <mu-icon-menu icon="" menuClass="profile-drop-down-content profile_position1" :open="profileMenuVisible" @close="profileMenuVisible =false" v-show="profileMenuVisible">
            <mu-menu-item :title="$t('EditProfile')" class="edit-profile" @click="openProfile()"></mu-menu-item>
            <mu-menu-item :title="$t('Notification')" class="icon_notification" @click="openNews()"></mu-menu-item>
            <mu-menu-item :title="$t('Feedback')" class="icon_feedback" onClick="window.Studio.openOnBrowser(window.Studio.AppConfig.getIssueUrl())"></mu-menu-item>
            <!--<mu-menu-item v-show="language === 'en'" :title="$t('Feedback')" class="icon_feedback" onClick="window.Studio.openOnBrowser('http://www.mikecrm.com/cesaXd')"></mu-menu-item>-->
            <mu-menu-item v-if="language === 'cn'" :title="$t('community')" class="icon_groups" @hover="handleHoverCn"></mu-menu-item>
            <mu-menu-item v-else :title="$t('community')" class="icon_groups" @hover="handleHoverEn"></mu-menu-item>
            <mu-menu-item :title="$t('signOut')" class="icon_signout" @click="logOut()"></mu-menu-item>
        </mu-icon-menu>
        <mu-icon-menu icon="" menuClass="profile-drop-down-content profile_position2 " :open="communityMenuVisible" @close="communityMenuVisible = false" v-show="communityMenuVisible">
            <mu-menu-item :title="$t('forum')" class="icon_forum" onClick="window.Studio.openOnBrowser(window.Studio.AppConfig.SOCIAL_URL.forum)"></mu-menu-item>
            <mu-menu-item :title="$t('github')" class="icon_gihub" onClick="window.Studio.openOnBrowser(window.Studio.AppConfig.SOCIAL_URL.github)"></mu-menu-item>
            <mu-menu-item :title="$t('facebook')" class="icon_facebook" onClick="window.Studio.openOnBrowser(window.Studio.AppConfig.SOCIAL_URL.facebook)"></mu-menu-item>
        </mu-icon-menu>
        <mu-icon-menu icon="" menuClass="profile_position3" :open="wechatVisible" @close="wechatVisible = false" v-show="wechatVisible">
            <mu-menu-item class="icon-wetchat"></mu-menu-item>
        </mu-icon-menu>
      </div>
      <div v-else>
         <mu-icon-menu icon="" menuClass="profile-drop-down-content profile_position1" :open="profileMenuVisible" @close="profileMenuVisible =false" v-show="profileMenuVisible">
            <mu-menu-item :title="$t('login')" @click="backLogin('2')"></mu-menu-item>
            <mu-menu-item :title="$t('regester')" @click="backLogin('3')"></mu-menu-item>
        </mu-icon-menu>
      </div>
  </div>
</template>
<script>
import AccountAPI from '../assets/api/accountapi';
import eventBus from './eventBus';
module.exports = {
  i18n: {
    messages: {
      en: {
        EditProfile: 'Edit Profile',
        Notification: 'Notification',
        Feedback: 'Feedback',
        community: 'Community',
        signOut: 'Sign Out',
        forum: 'Forum',
        github: 'GitHub',
        facebook: 'Facebook',
        login: 'Sign in',
        regester: 'Sign up',
      },
      cn: {
        EditProfile: '个人信息',
        Notification: '通知',
        Feedback: '反馈',
        community: '社区',
        signOut: '退出',
        forum: '论坛',
        github: 'GitHub',
        facebook: 'Facebook',
        login: '登录',
        regester: '注册',
      },
    },
  },
  data() {
    return {
      profileMenuVisible: false,
      communityMenuVisible: false,
      wechatVisible: false,
//      profileDetailToggle: false,
      icon_edit_profile: require('./assets/img/UserProfile/edit_profile.svg'),
      language: 'en',
    };
  },
  mounted() {
    this.language = window.Studio.AppConfig.LANG;
  },
  methods: {
    handleHoverEn() {
      this.communityMenuVisible = !this.communityMenuVisible;
    },
    handleHoverCn() {
      this.wechatVisible = !this.wechatVisible;
    },
    logOut() {
      AccountAPI.clearUserProfile();
      this.clearCache();
      this.$router.push({ name: 'login' });
      this.$store.getters.userProfile.isLogin = false;
    },
    backLogin(index) {
      this.$router.push({ name: 'login', params: { state: index } });
    },
    clearCache() {
      localStorage.clear();
      sessionStorage.clear();
      const modules = window.UserConfig.modules;
      for (const k of Object.keys(modules)) {
        window.UserConfig.clean(modules[k]);
      }
    },
    openProfile() {
      eventBus.$emit('show-profile-info', true);
      eventBus.$emit('show-news-info', false);
      eventBus.$emit('sideBarShow', false);
      eventBus.$emit('toggle-side-visible', false);
      eventBus.$emit('home-side-show', false);
    },
    openNews() {
      eventBus.$emit('show-news-info', true);
      eventBus.$emit('show-profile-info', false);
      eventBus.$emit('sideBarShow', false);
      eventBus.$emit('toggle-side-visible', false);
      eventBus.$emit('home-side-show', false);
    },
  },
  computed: {
  },
  watch: {
  },
};
</script>
<style lang="sass">
.header-profile-wrapper {
    width: 80px;
    background-color: #3c3c3c;
    .hover{
        background-color:transparent;
    }
    .avatar-dropdown {
        width:70px;
        height:64px !important;
    }
    .profile-avatar {
        background: transparent;
        width:34px;
        height:34px;
    }
    .icon {
        padding-left:10px;
        img{
            width:100%;
            height:100%;
        }
    }
    .icon-dot {
        width:16px;
        height:16px;
    }
}
.profile-drop-down-content{
    overflow: visible;
    .mu-menu-list {
        background: rgba(42,43,44,1);
        width:155px !important;
    }
    .mu-menu-item-wrapper {
        height:38px;
        line-height:38px;
        padding-left:46px;
        color:#fff;
        border-bottom:none;
    }
     .mu-menu-list .mu-menu-item-wrapper:hover {
        background-color:rgba(85,85,85,0.3);
    }
      .edit-profile {
         background:url('./assets/img/UserProfile/edit_profile.svg') no-repeat 18px center;
    }
       .icon_notification {
          background:url('./assets/img/UserProfile/icon_notification.svg') no-repeat 18px center;
    }
        .icon_feedback {
            background:url('./assets/img/UserProfile/icon_feedback.svg') no-repeat 18px center;
    }
        .icon_groups {
            background:url('./assets/img/UserProfile/icon_groups.svg') no-repeat 18px center;
    }
        .icon_signout {
            background:url('./assets/img/UserProfile/icon_sign_out.svg') no-repeat 18px center;
    }
        .icon_forum {
            background:url('./assets/img/UserProfile/icon_forum.svg') no-repeat 18px center;
    }
        .icon_gihub {
            background:url('./assets/img/UserProfile/icon_github.svg') no-repeat 18px center;
    }
        .icon_facebook {
            background:url('./assets/img/UserProfile/icon_facebook.svg') no-repeat 18px center;
    }
}
.profile_position1 {
    position:absolute;
    left:-74px;
    top:0;
}
.profile_position2 {
    position:absolute;
    top:50px;
    left:-222px;
}
.profile_position3 {
    position: absolute;
    top:50px;
    left:-280px;
    z-index: 999;
    .icon-wetchat {
        background:url('./assets/img/uf_wechat.png') no-repeat left center;
        z-index: 999;
        .mu-menu-item-wrapper {
            height:240px;
            width: 170px;
            border-bottom:none;
        }
    }
}
</style>
