<template>
    <mu-dialog :open="dialogVisible" :title="$t('title')" dialogClass="modal-custom modal3">
        <div class="s9">
            <div class="modal-left">
                <img src="../assets/dialog/RecordDialog/us_NAVI.svg" alt="">
                <div class="lefttext" v-html="$t('textLeft')"></div>
            </div>
            <div class="modal-right">
                <div class="rightimg">
                    <img v-show="language === 'en'" src="../assets/dialog/RecordDialog/play_recording_en.png" alt="">
                    <img v-show="language === 'cn'" src="../assets/dialog/RecordDialog/play_recording_cn.png" alt="">
                    <div class="righttext" v-html="$t('textRight')"></div>
                </div>
            </div>
        </div>
        <div>
            <div>
                <mu-flat-button slot="actions" @click="closeEvent()" class="default" :label="$t('buttonCancel')" backgroundColor="#bdbdbd"/>
                <mu-flat-button slot="actions" primary @click="goTeachPlay()" :label="$t('buttonOK')" backgroundColor="#52BF53"/>
            </div>
            <mu-checkbox :label="$t('not_show')" class="demo-checkbox" v-model="dontShowAgain"/>
        </div>
    </mu-dialog>
</template>
<script>
  import EventBus from '../eventBus';
  module.exports = {
    i18n: {
      messages: {
        en: {
          title: 'Let uArm run the movements recorded in "Teach & Play" section.',
          textLeft: 'Record a movement in<br>"Teach & Play" section.',
          textRight: 'Apply the recording in<br>your Blockly project.',
          buttonOK: 'Record Now',
          buttonCancel: 'Record Later',
          not_show: 'Don’t show again',
        },
        cn: {
          title: '播放通过“手持示教”录制的运动轨迹',
          textLeft: '在“手持示教”模块录制一段轨迹',
          textRight: '在您的Blockly项目中调用该轨迹',
          buttonOK: '马上录制',
          buttonCancel: '以后再说',
          not_show: '下次不再提醒',
        },
      },
    },
    data() {
      return {
        blockName: 'studio_play_recording',
        dialogVisible: false,
        dontShowAgain: false,
        language: 'en',
      };
    },
    beforeDestroy() {
      EventBus.$off();
    },
    mounted() {
      this.language = this.$t('language');
      EventBus.$on(`dialog-tip-${this.blockName}`, () => {
        this.dialogVisible = true;
      });
    },
    methods: {
      closeEvent() {
        this.dialogVisible = false;
        EventBus.$emit('dialog-show-again', this.blockName, !this.dontShowAgain);
      },
      goTeachPlay() {
        this.$router.push({ name: 'teach' });
        this.closeEvent();
      },
    },
  };
</script>
<style lang="sass" scoped>
    .modal3 {
        .s9{
            padding-bottom: 30px;
            display:flex;
            position:relative;
    }
        .modal-left{
            width: 50%;
            text-align:left;
            font-size: .9rem;
            text-align: center;
            img{
                width: 100%;
        }
    }
        .modal-right{
            width: 50%;
            font-size: .9rem;
            text-align:right;
            padding-top:5%;
            text-align: center;
            img{
                width: 100%;
        }

    }
    }
    .mu-flat-button {
        color: #fff;
    }
</style>