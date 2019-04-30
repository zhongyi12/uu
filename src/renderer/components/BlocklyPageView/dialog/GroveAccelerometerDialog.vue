<template>
    <mu-dialog :open="dialogVisible" :title="$t('title')" dialogClass="model-tip ">
        <div class="main1" >
            <div class="img-wrapper-com img-wrapper">
                <img class="img" src="../assets/dialog/GroveAccelerometerDialog/accelerometer_compass.png" />
            </div>
            <mu-flat-button  class="btn-class"  :label="$t('ok')"  @click="closeEvent()" slot="actions"/>
            <mu-checkbox :label="$t('not_show')" class="demo-checkbox" v-model="dontShowAgain"/> <br/>
        </div>
    </mu-dialog>
</template>
<script>
  import EventBus from '../eventBus';
  module.exports = {
    props: ['moduleName'],
    i18n: {
      messages: {
        en: {
          title: 'Please connect 6-Axis Accelerometer& Compass Sensor with base of uArm',
          next: 'Next',
          close: 'Close',
          ok: 'Ok',
          cancel: 'Cancel',
          not_show: 'Don’t show again',
        },
        cn: {
          title: '请将加速度&罗盘传感器接入机械臂底座',
          next: '下一步',
          close: '关闭',
          ok: 'Ok',
          cancel: '取消',
          not_show: '下次不再提醒',
        },
      },
    },
    data() {
      return {
        blockNames: [
          'get_grove_accelerometer',
          'get_grove_compass',
        ],
        dialogVisible: false,
        dontShowAgain: false,
      };
    },
    beforeDestroy() {
      EventBus.$off();
    },
    mounted() {
      this.blockNames.forEach((blockName) => {
        EventBus.$on(`dialog-tip-${blockName}`, () => {
          this.dialogVisible = true;
        });
      });
    },
    methods: {
      closeEvent() {
        this.dialogVisible = false;
        this.blockNames.forEach((blockName) => {
          EventBus.$emit('dialog-show-again', blockName, !this.dontShowAgain);
        });
      },
    },
  };
</script>