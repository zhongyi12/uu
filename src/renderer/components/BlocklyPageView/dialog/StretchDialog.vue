<template>
    <mu-dialog :open="dialogVisible" :title="$t('title')"  dialogClass="modal-custom modal5">
        <div class="s9">
            <div class="modal-left">
                <img src="../assets/dialog/StretchDialog/stretch_swift.svg" alt="">
                <div class="left-texta">{{$t('backward')}}</div>
                <div class="left-textb">{{$t('forward')}}</div>
            </div>
            <div class="modal-right">
                <div class="rightimg">
                    <img src="../assets/dialog/RecordDialog/us_teachplay.png" alt="">
                    <div class="righttext">
                        {{ $t("example") }}
                    </div>
                </div>
            </div>

        </div>
        <mu-raised-button slot="actions" primary @click="closeEvent()" :label="$t('gotIt')" backgroundColor="#52BF53" />
        <mu-checkbox :label="$t('not_show')" class="demo-checkbox" v-model="dontShowAgain"/>
    </mu-dialog>
</template>
<script>
  import EventBus from '../eventBus';
  module.exports = {
    props: ['moduleName'],
    i18n: {
      messages: {
        en: {
          title: 'Let uArm move relatively in polar coordinates.',
          backward: 'Stretch Backward',
          forward: 'Stretch Forward',
          example: 'Example',
          gotIt: 'Got it',
          not_show: 'Don’t show again',
        },
        cn: {
          title: '让uArm在极坐标系中做相对运动',
          backward: '臂缩回',
          forward: '臂伸展',
          example: '举例',
          gotIt: 'OK',
          not_show: '下次不再提醒',
        },
      },
    },
    data() {
      return {
        blockName: 'stretch',
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
    .modal5 {
        height: 38vw;
        .s9{
            margin: 0 4vw 4vw;
            display: flex;
            align-items: center;
    }
        .modal-left{
            text-align:left;
            font-size: 1vw;
            img{
                width: 24vw;
        }
            & > div{
                position: absolute;
                transform: rotate(-26deg);
        }
            .left-texta{
                top: 12vw;
                left: 5vw;
        }
            .left-textb{
                top: 20vw;
                left: 10vw;
        }
    }
        .modal-right{
            font-size: 1vw;
            img{
                width: 22vw;
        }
    }
    }
</style>