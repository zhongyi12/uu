<template lang="html">
  <div class="news-wrapper" v-show="newsVisible">
    <!--<div class="news-list">-->
      <!--<mu-card v-for="item in newsList">-->
        <!--<mu-card-title title="" :subTitle="item.time"/>-->
        <!--<mu-card-text v-html="item.content">-->
        <!--</mu-card-text>-->
      <!--</mu-card>-->
    <!--</div>-->

    <!--以下是最新的ui设计-->
     <div class="notification-wrapper">
            <div class="title">
                {{ $t('notificationTitle') }}
                <img class="close-profile" src="./assets/img/UserProfile/icon_closed.svg" alt="close" @click="closeNews()"/>
            </div>
            <div class="msg-wrapper">
                <div class="msg-detail" v-for="item in newsList">
                    <!-- <time class="msg-time" v-text="item.time"></time> -->
                    <p class="msg-title" v-text="item.title"></p>
                    <p class="msg-content" v-html="item.content"></p>
                    <!-- <a class="store-link">Go to store</a> -->
                </div>
                <!-- <div class="msg-detail">
                    <time class="msg-time">24/03/2017</time>
                    <p class="msg-title">New Python Library release.New Python Library release</p>
                    <p class="msg-content">Update your pyuarm to v3.0 that fixes the move_to problem.Update your pyuarm to v3.0 that fixes </p>
                    <a class="store-link">Go to Gihub</a>
                </div> -->
            </div>
        </div>
  </div>

</template>
<script>
let feedInterval = null;
import eventBus from './eventBus';
module.exports = {
  i18n: {
    messages: {
      en: {
        notificationTitle: 'NOTIFICATION',
      },
      cn: {
        notificationTitle: '通知',
      },
    },
  },
  data() {
    return {
      hosturl: '',
      username: this.$store.getters.userProfile.name,
      editable: true,
      newsVisible: false,
      news: {
        server: '',
      },
      newsList: [],
    };
  },
  mounted() {
    eventBus.$on('show-news-info', (show) => {
      this.newsVisible = show;
    });
    this.hosturl = window.Studio.AppConfig.API_HOST_URL;
    feedInterval = setInterval(() => {
      try {
        const existingEntries = JSON.parse(localStorage.getItem('newsFeed'));
        if (existingEntries !== null) {
          const tempList = [];
          existingEntries.forEach((item) => {
            item.content.forEach((value) => {
              const pushData = {
                time: item.time,
                title: value.title,
                content: value.alert,
              };
              tempList.push(pushData);
            });
          });
          this.newsList = tempList;
        }
      }
      catch (e) {
        console.error(e);
      }
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(feedInterval);
  },
  methods: {
    closeNews() {
      this.newsVisible = false;
      eventBus.$emit('toggle-side-visible', true);
      eventBus.$emit('sideBarShow', true);
      eventBus.$emit('home-side-show', true);
    },
  },
  computed: {
  },
  watch: {
  },
};

</script>
<style lang="sass" scoped>
$themeOrange:#D95E2E;
.news-wrapper{
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  height: 100%;
  background-color: white;
  width:30%;
  .news-list{
    overflow: scroll;
  }
  .mu-card{
    width: 100%;
  }
}
/**以下是最新的ui设计样式**/
.notification-wrapper {
    width: 100%;
    .title {
        height:60px;
        line-height: 60px;
        text-align: center;
        font-size: 1.2vw;
        border-top:1px solid  #E9E7E6;
        border-bottom: 1px solid  #E9E7E6;
        position:relative;
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
    .msg-wrapper {
        padding:0 2vw;
        height: 77vh;
        overflow-y: auto;
        .msg-detail {
            position:relative;
            border-bottom:1px dotted rgba(153,153,153,0.35);
            padding:3vh 0 5vh;
            .msg-time {
                color:#555;
                padding:1vw 0;
                display:block;
        }
            .msg-title {
                color:#D95E2E;
        }
            p {
                margin:0 0 0 5px;
        }
            .store-link {
                color: #D95E2E;
                text-decoration: underline;
                position:absolute;
                right:0;
                cursor: pointer;
        }
            .store-link:hover {
                font-weight:700;
        }
    }
}
}
</style>
