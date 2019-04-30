<template lang="html">
  <div class="user-nav" v-show="showHome">
    <div class="user-name" @click="displayProfile()">
      <img v-if="showProfile" src="./assets/img/avatar-in-profile.svg" alt="">
      <img v-else-if="this.$store.getters.userProfile.avatar != ''" :src="this.$store.getters.userProfile.avatar" alt="">
      <img v-else src="./assets/img/default_head_small.svg" alt="">
      <p class="nickname"> {{this.$store.getters.userProfile.nickname}}</p>
    </div>
    <UserProfileComponent v-show="showHome"></UserProfileComponent>
    {{log}}
  </div>
</template>
<script>
import eventBus from './eventBus';
// import News from '../assets/api/newsfeed';
import UserProfileComponent from './UserProfileComponent.vue';
// let feedInterval = null;
module.exports = {
  props: ['showHome', 'showProfile'],
  data() {
    return {
      hosturl: '',
      show: {
        connectedTip: false,
      },
      log: '',
      news: {
        server: '',
      },
      msgCount: 0,
      avatar: '',
    };
  },
  components: {
    UserProfileComponent,
  },
  mounted() {
    // News.init();
    // feedInterval = setInterval(() => {
    //   this.msgCount = News.feedCount;
    // }, 3000);
  },
  beforeDestroy() {
    // clearInterval(feedInterval);
  },
  methods: {
    handleHover() {
      this.show.connectedTip = true;
    },
    handleHoverExit() {
      this.show.connectedTip = false;
    },
    displayProfile() {
      eventBus.$emit('show-profile');
    },
    displayNews() {
      eventBus.$emit('show-news');
      this.msgCount = 0;
      window.News.resetCount();
    },
    displayHome() {
      eventBus.$emit('show-home');
    },
  },
  computed: {
    uarmStatus() {
      return this.$store.getters.uarmStatus;
    },
    getMessageCount() {
      return window.News.feedCount;
    },
  },
  watch: {
  },
};

</script>
<style lang="sass" scoped>
$themeOrange:#D95E2E;
.underlineColor{
  border-bottom: 2px solid $themeOrange;
}
.user-nav{
  display: flex;
  justify-content: space-between;
  position: relative;
  padding-top:3vw;
  .news-btn{
    cursor: pointer;
    background-color: #555;
    height:20px;
  }
  .btn-img{
    img{
      margin: 0 .2vw;
      width: 1.4vw;
      height: 1.4vw;
    }
  }
  .user-name{
    cursor: pointer;
    display: flex;
    flex-direction: column;
    margin:0 auto;
    font-size: 1vw;
    .nickname {
        padding-top:4px;
        color: #5C5C5C;
        text-align: center;
    }
    img{
      margin: 0 0.5vw;
      width: 3vw;
      height: 3vw;
      border-radius: 50%;
    }
  }
  .btn-back{
    cursor: pointer;
  }
  .redalert{
    width: 0.7vw;
    height: 0.7vw;
    background: red;
    top: 0;
    position: absolute;
    right: -0.3vw;
    border-radius: 50%;
  }
}
.header-profile-wrapper {
    background-color:#fff;
}

</style>
