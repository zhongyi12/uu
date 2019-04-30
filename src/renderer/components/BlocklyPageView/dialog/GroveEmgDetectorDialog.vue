<template>
    <mu-dialog :open="dialogVisible" dialogClass="model-tip">
        <div class="main1" v-show="modalNextPage">
        <h2 class="title">{{$t('title1')}}</h2>
            <div class="two-img-wrapper">
                <!--<div class="img1">-->
                    <!--<img class="img" src="../assets/dialog/GroveEmgDialog/emg_detector_a13.png" />-->
                    <!--<span>A13</span>-->
                <!--</div>-->
                <div class="img1">
                    <img class="img" src="../assets/dialog/GroveEmgDialog/emg_detector_pin1-2.png" />
                    <!--<span>Pin1/2</span>-->
                </div>
            </div>
            <mu-flat-button class="btn-class"  :label="$t('next')" @click="modalNextPage = false" slot="actions" />
        </div>
        <div class="main2" v-show="!modalNextPage">
            <h2 class="title">{{ $t('title2')}}</h2>
            <div class="wrapper">
                <div class="img-wrapper" >
                    <img class="img" src="../assets/dialog/GroveEmgDialog/emg_instruction.png"/>
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
          title1: 'Step 1: Please connect EMG Detector Sensor with Pin1/2 Port',
          title2: 'Step 2: Please Tack the three electrodes to your muscle, and keep a distance between each electrodes',
          next: 'Next',
          close: 'Close',
          ok: 'Ok',
          cancel: 'Cancel',
          not_show: 'Don’t show again',
        },
        cn: {
          title1: '步骤一：请将肌电传感器接入Pin1/2端口',
          title2: '步骤二：请将三个电极固定在肌肉上，并且每个电极之间保持一定的距离',
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
        blockName: 'get_grove_emg',
        dialogVisible: false,
        dontShowAgain: false,
        modalNextPage: true,
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
        this.modalNextPage = true;
        EventBus.$emit('dialog-show-again', this.blockName, !this.dontShowAgain);
      },
    },
  };
</script>
<style lang="sass" scoped="">
    .guide_icon {
        padding:6px;
    }
    .left-guid {
        position:relative;
        left:0;
        top:0;
        width:34%;
        .guide1 {
            position:absolute;
            left:0;
            width:80%;
    }
        .left-line {
            position:absolute;
            right:0;
            bottom:10%;
            width:44%;
            img {
                width:100%;
        }
    }
        .guide-text {
            width: 60%;
            color: #D95E2E;
            font-size: 12px;
            font-weight: 700;
            position: absolute;
            bottom: -16px;
            right: -10px;
    }
    }

    .right-guid {
        position:relative;
        right:0;
        top:0;
        width:34%;
        .guide2 {
            width:80%;
            position:absolute;
            right:0;
            top:-22%;
    }
        .right-line {
            position:absolute;
            left:-10%;
            top:0;
            width:52%;
            img {
                width:100%;
        }
    }
        .guide-text {
            width: 60%;
            color: #D95E2E;
            font-size: 12px;
            font-weight: 700;
            position: absolute;
            bottom: 26%;
            left: -30px;
    }
}
    div[class^="bg"]{
        width:100%;
        height:6vw;
        max-height:80px;
        min-height:66px;
        vertical-align: bottom;
        margin-top:4px;
        div[class^="guide_icon"] {
            width:26%;
            margin:0 auto;
            img {
                width:100%;
        }
    }
    }
</style>