<template>
    <mu-dialog :open="dialogVisible" :title="$t('title')" dialogClass="model-tip">
        <div class="main1">
            <div class="img-wrapper">
                <img class="img" src="../assets/dialog/GroveInstallationDialog/base_no_lights_3x.png" />
            </div>
            <p class="tip-text" v-html="$t('text1')"></p>
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
          title: 'Grove Installation Notice',
          text1: 'Please <span>Power Off</span> uArm before plugging in Grove modules (Grove does not support hot swapping) ',
          ok: 'Ok',
          not_show: 'Don’t show again',
        },
        cn: {
          title: 'Grove模块安装须知',
          text1: '插入Grove模块前，请<span>关掉uArm电源</span>（Grove模块不支持热插拔）',
          close: '关闭',
          ok: 'Ok',
          not_show: '下次不再提醒',
        },
      },
    },
    data() {
      return {
        blockName: 'Grove',
        dialogVisible: false,
        dontShowAgain: false,
      };
    },
    beforeDestroy() {
      EventBus.$off();
    },
    mounted() {
      EventBus.$on(`dialog-category-tip-${this.blockName}`, () => {
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
<style lang="sass" scoped="">
</style>