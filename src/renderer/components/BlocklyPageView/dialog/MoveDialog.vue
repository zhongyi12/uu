<template>
    <mu-dialog :open="dialogVisible" :title="$t('BlocklyPageView.modal4.title')"  dialogClass="modal-custom modal4">
        <div class="main-wrapper">
            <div class="s9">
                <div class="modal-left">
                    <img src="../assets/dialog/MoveDialog/us_xyz.png" alt="">
                </div>
                <div class="modal-right">
                    <div class="rightimg">
                        <img src="../assets/dialog/MoveDialog/us_moveup.png" alt="">
                        <div class="righttext">
                            {{ $t("example") }}
                        </div>
                    </div>
                </div>
            </div>
            <mu-raised-button slot="actions" @click="closeEvent()" :label="$t('gotIt')" backgroundColor="#52BF53" />
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
        blockName: 'move',
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
    .modal4 {
        height: 38vw;
        .s9{
            position:relative;
            display:flex;
            justify-content: space-around;
            align-items: center;
            margin:0 30px 30px;
    }
        .modal-left{
            text-align:left;
            font-size: 1rem;
            width: 60%;
            img{
                width: 100%;
        }
            .lefttext{
                width: 20vw;
                position: absolute;
                left: 6vw;
        }
    }
        .modal-right{
            font-size: 1rem;
            width: 34%;
            img{
                width: 100%;
        }
    }
    }
</style>