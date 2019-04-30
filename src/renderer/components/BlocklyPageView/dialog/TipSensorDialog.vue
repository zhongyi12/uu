<template>
    <mu-dialog :open="dialogVisible" :title='$t("BlocklyPageView.modal6.title")'  dialogClass="model-tip">
        <div class="main1">
            <div class="two-img-wrapper">
                <div class="img1">
                    <img src="../assets/dialog/TipSensorDialog/press_suction_cup.svg" alt="">
                </div>
                <div class="img1">
                    <img src="../assets/dialog/TipSensorDialog/us_press_suction_cup.png" alt="">
                    <div class="righttext">
                        {{ $t("example") }}
                    </div>
                </div>
            </div>
            <mu-flat-button slot="actions" primary @click="closeEvent()" :label="$t('gotIt')" backgroundColor="#52BF53" />
            <mu-checkbox :label="$t('not_show')" class="demo-checkbox" v-model="dontShowAgain"/>
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
          example: 'Example',
          gotIt: 'Got it',
          not_show: 'Don’t show again',
        },
        cn: {
          example: '举例',
          gotIt: 'OK',
          not_show: '下次不再提醒',
        },
      },
    },
    data() {
      return {
        blockName: 'event_tip_sensor',
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
<style lang="sass" scoped>
</style>