<template lang="html">
<div class="sys-wrapper">
  <table class="sys-setting-tb">
    <tr v-show="isNewFirmwareVersion">
        <td>
          {{ $t('settingPage.closedStepperControl') }}
        </td>
        <td>
          <mu-switch
            @change="onStepOutCheck"
            v-model="model.localCommonStatusMgr.isStepOutCheckOpen">
          </mu-switch>
        </td>
    </tr>
  </table>
</div>
</template>

<script>
  import eventBus from './eventBus';
  import swal from 'sweetalert2';
  import versionCompare from 'general-version-compare';
  import { ipcRenderer } from 'electron';
  export default {
    i18n: {
      messages: {
        en: {
        },
        cn: {
        },
      },
    },
    data() {
      return {
        model: window.GlobalUtil.model,
      };
    },
    mounted() {
    },
    methods: {
      onStepOutCheck() {
        console.log(this.model.localCommonStatusMgr.isStepOutCheckOpen);
        const isOpen = this.model.localCommonStatusMgr.isStepOutCheckOpen;
        window.UArm.set_step_out_check(isOpen, (response) => {
          // console.log('a');
          // console.log(JSON.stringify(response));
          // console.log('b');
          if (response && response.status === true) {
            window.UserConfig.setItem('lastStatus', 'isStepOutCheck', isOpen);
            // const flag = window.UserConfig.getItem('lastStatus', 'isStepOutCheck');
            // console.log(`flag = ${flag}`);
          }
          // else {
          // }
        });
      },
    },
    computed: {
      isNewFirmwareVersion() {
        return window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
      },
    },
    watch: {
    },
  };
</script>
<style lang="sass" scoped>
.sys-wrapper {
  width:100%;
  height:100%;
  .sys-setting-tb {
    position: absolute;
    left: 10px;
    td {
      width: 300px;
      height: 50px;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      font-size: 15px;
      line-height: 50px;
      padding-left: 20px;
    }
  }
}
</style>
