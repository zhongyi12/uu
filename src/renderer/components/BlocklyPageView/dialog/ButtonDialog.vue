<template>
    <mu-dialog :open="dialogVisible" title="" dialogClass="model-tip">
        <div class="s9">
            <div class="modal-left">
                <img src="../assets/dialog/ButtonDialog/img_base_modal.png" alt="">
                <div class="lefttexta">
                    {{ $t("menuButton") }}
                </div>
                <div class="lefttextb">
                    {{ $t("playButton") }}
                </div>
            </div>
            <div class="modal-right">
                <div class="modal-tip">
                    <div class="tip-title">{{ $t("tipTitle") }}</div>
                    <div class="tip-text" v-html="$t('tipContent')"></div>
                </div>
                <img src="../assets/dialog/ButtonDialog/button_press.png" alt="">
                <div class="modal-righttext">
                    {{ $t("example") }}
                </div>
            </div>
        </div>
        <div class="button-checked-wrapper">
            <mu-flat-button slot="actions" primary @click="closeEvent()" :label="$t('BlocklyPageView.modalText.gotIt')" backgroundColor="#52BF53" />
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
          menuButton: 'Menu Button',
          playButton: 'Play Button',
          tipTitle: 'Tips',
          tipContent: 'Use buttons on the base to<br>trigger commands',
          buttonOK: 'Got it',
          example: 'Example',
          gotIt: 'Got it',
          not_show: 'Don’t show again',
        },
        cn: {
          menuButton: '【菜单】按钮',
          playButton: '【播放】按钮',
          tipTitle: '小贴士',
          tipContent: '按底座按钮，触发Blockly命令',
          buttonOK: 'OK',
          example: '举例',
          gotIt: 'OK',
          not_show: '下次不再提醒',
        },
      },
    },
    data() {
      return {
        blockName: 'event_button_pressed',
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
<style lang="sass" scoped="">
.model-tip {
    .s9{
        display: flex;
        font-size: 1rem;
        width: 100%;
        justify-content: space-around;
    }
    .modal-left {
        width: 50%;
        position: relative;
        img {
            width: 100%;
        }
        .lefttexta {
            position: absolute;
            bottom: 12%;
            left: 3%;
        }
        .lefttextb {
            position: absolute;
            left :20%;
            bottom: 3%;
        }
    }
    .modal-right{
        width: 50%;
        img {
            width: 100%;
        }
        .modal-tip{
            font-size: 1.1rem;
            padding:15% 0 10%;
            .tip-title{
                color:#D95E2E;
        }
    }
}
    .button-checked-wrapper {
        display: flex;
        flex-direction: column;
        margin: 30px auto;
        justify-content: center;
        .mu-flat-button {
            background: #52BF53;
            display: block;
            margin: 0 auto;
            border-radius: 2px;
            color: #fff;
            max-height: 30px !important;
            line-height: 0 !important;
            color: #fff;
            font-size: 12px;
            padding: 0 10px;
        }
        .mu-checkbox {
            width: 16%;
            margin: 0 auto;
        }
     }
}
</style>