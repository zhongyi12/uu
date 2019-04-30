<template>
    <mu-dialog :open="dialogVisible" :title="$t('title')" dialogClass="model-tip ">
        <div class="main1">
            <div class="two-img-wrapper">
                <div class="img1">
                    <img class="img" src="../assets/dialog/GroveUltrasonicDialog/ultrasonic_ranger.png" />
                    <span>D8/9</span>
                </div>
                <div class="img1">
                    <img class="img" src="../assets/img/a_port.png" />
                    <span>Pin4</span>
                </div>
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
          title: 'Please connect Ultrasonic Ranger with D8/9 or Pin4 port',
          next: 'Next',
          close: 'Close',
          ok: 'Ok',
          cancel: 'Cancel',
          not_show: 'Don’t show again',
        },
        cn: {
          title: '请将超声波传感器接入D8/9或者Pin4端口',
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
        blockName: 'get_grove_ultrasonic',
        dialogVisible: false,
        dontShowAgain: false,
      };
    },
    beforeDestroy() {
      EventBus.$off();
    },
    mounted() {
      EventBus.$on(`dialog-tip-${this.blockName}`, () => {
        this.dialogVisible = true;
      });
    },
    methods: {
      closeEvent() {
        this.dialogVisible = false;
        EventBus.$emit('dialog-show-again', this.blockName, !this.dontShowAgain);
      },
    },
  };
</script>