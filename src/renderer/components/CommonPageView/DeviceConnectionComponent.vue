<template>
    <div class="device-connect-status">
        <img class="img" v-show="uarmConnectStatus" src="./assets/DeviceConnection/icon_connected.svg" alt=""/>
        <span class="text" v-show="uarmConnectStatus">{{$t('DeviceConnected')}}</span>
        <img class="img" v-show="!uarmConnectStatus" src="./assets/DeviceConnection/icon_disconnected.svg" alt=""/>
        <span class="text" v-show="!uarmConnectStatus">{{$t('DeviceDisconnected')}}</span>
        <img class="device-connect-help" v-show="!uarmConnectStatus" @click="$router.push({ name: 'setting', params: { tab: 'troubleTab' }})" size="16" :src="iconQuestion" ></img>
    </div>
</template>
<script>
module.exports = {
  i18n: {
    messages: {
      en: {
        DeviceConnected: 'Connected',
        DeviceDisconnected: 'Disconnected',
      },
      cn: {
        DeviceConnected: '设备已连接',
        DeviceDisconnected: '设备未连接',
      },
    },
  },
  data() {
    return {
      iconQuestion: require('./assets/img/icon_question.svg'),
    };
  },
  methods: {
  },
  computed: {
    uarmConnectStatus() {
      return this.$store.getters.uarmStatus.usbConnection;
    },
  },
  watch: {
  },
};

</script>
<style lang="sass" scoped>
    .device-connect-status {
        padding:0 14px;
        height: 30px;
        line-height: 29px;
        display:flex;
        background: #3B3B3B;
        border-radius:25px;
        margin-right:1vw;
        font-weight:400;
        font-size:12px;
        position: relative;
        .img{
            padding-right:8px;
            display:inline-block;
        }
        .text{
            display:inline-block;
        }
        .device-connect-help {
            cursor: pointer;
            padding-left:8px;
        }
    }

</style>
