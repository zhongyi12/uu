<template>
<div id="#app">
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
  <SnackBarComponent></SnackBarComponent>
  <ProgressBarComponent></ProgressBarComponent>
  <UpdateDialogComponent></UpdateDialogComponent>
  <!-- <mu-switch
    style="position:absolute;left:300px;top:10px;width:150px;height:20px;z-index:2000;"
    v-model="model.localCommonStatusMgr.isStepOutCheckOpen"
    :color="white" 
    :label="'Switch: ' + model.localCommonStatusMgr.isStepOutCheckOpen">
  </mu-switch> -->
</div>

</template>

<script>
import './components/assets/css/common.scss';
import 'sweetalert2/dist/sweetalert2.css';
import store from './vuex/store';
import SnackBarComponent from './components/CommonPageView/SnackBar.vue';
import ProgressBarComponent from './components/CommonPageView/ProgressBar.vue';
import UpdateDialogComponent from './components/CommonPageView/UpdateDialogComponent.vue';
import swal from 'sweetalert2';
const { ipcRenderer } = require('electron');
export default {
  store,
  created() {
    this.$store.dispatch('syncConnectStatus');
    ipcRenderer.on('show-progress-bar', (event, title) => {
      this.$store.dispatch('showProgressBar', title);
    });
    ipcRenderer.on('update-progress-bar', (event, progress) => {
      this.$store.dispatch('updateProgressBar', progress);
    });
    ipcRenderer.on('hide-progress-bar', () => {
      this.$store.dispatch('hideProgressBar');
    });
    ipcRenderer.on('router-push', (event, path, params) => {
      console.log(`name: ${path}, params: ${params}`);
      this.$router.push({ name: path, params });
    });
  },
  data() {
    return {
      model: window.GlobalUtil.model,
    };
  },
  mounted() {
    document.ondragover = document.ondrop = (ev) => {
      ev.preventDefault();
    };
    document.body.ondrop = (ev) => {
      ev.preventDefault();
      // console.log('drop event', ev);
    };
  },
  components: {
    SnackBarComponent,
    ProgressBarComponent,
    UpdateDialogComponent,
  },
  computed: {
    uarmStatus() {
      return this.$store.getters.uarmStatus;
    },
  },
  watch: {
    'uarmStatus.usbConnection'() {
      if (this.uarmStatus.usbConnection) {
        this.$store.dispatch('showSnackBar', { message: this.$t('common.dialog.snackConnect') });
      }
      else {
        this.$store.dispatch('showSnackBar', { message: this.$t('common.dialog.snackDisconnect') });
      }
    },
    'uarmStatus.powerConnection'() {
      const connect = this.uarmStatus.powerConnection;
      if (!connect) {
        swal({
          title: this.$t('dialog.disconnect.title'),
          type: 'warning',
          html: this.$t('dialog.disconnect.text'),
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        }).then(() => {
        });
      }
    },
  },
};

</script>

<style>


</style>
