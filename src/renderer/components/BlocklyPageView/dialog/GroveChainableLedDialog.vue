<template>
    <mu-dialog :open="dialogVisible" :title="$t('title')" dialogClass="model-tip ">
        <div class="main1" >
            <div class="img-wrapper-com img-wrapper">
                <img class="img" src="../assets/dialog/GroveChainableLedDialog/chainable_led.png" />
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
          title: 'Please connect Chainable RGB LED with Pin3/4/5',
          next: 'Next',
          close: 'Close',
          ok: 'Ok',
          cancel: 'Cancel',
          not_show: 'Don’t show again',
        },
        cn: {
          title: '请将可连接发光二极管接入Pin3/4/5端口',
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
          'control_grove_chainable_led_rgb',
          'control_grove_chainable_led_hsl',
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