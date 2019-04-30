<template>
    <mu-dialog :open="dialogVisible" :title="$t('title')" dialogClass="model-tip ">
        <div class="main1" >
            <div class="two-img-wrapper">
                <div class="img1">
                    <img class="img" src="../assets/dialog/GrovePotentiometerDialog/slide_potentiometer.png"/>
                    <!--<span>Pin1/2</span>-->
                </div>
                <!--<div class="img1">-->
                    <!--<img class="img" src="../assets/img/d8_d9_a13.png" />-->
                    <!--<span>A13</span>-->
                <!--</div>-->
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
          title: 'Please connect Slide Potentiometer with Pin1/2',
          next: 'Next',
          close: 'Close',
          ok: 'Ok',
          cancel: 'Cancel',
          not_show: 'Don’t show again',
        },
        cn: {
          title: '请将滑动式变阻器接入Pin1/2',
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
          'get_grove_slide',
          'grove_slided_to',
          'control_grove_slide_led',
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
        EventBus.$on(`dialog-tip-${blockName}`, (currBlock) => {
          this.currentBlock = currBlock;
          this.dialogVisible = true;
//          this.openEvent();
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