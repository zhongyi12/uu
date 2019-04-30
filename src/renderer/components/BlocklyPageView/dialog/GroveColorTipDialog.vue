<template>
    <mu-dialog :open="dialogVisible" dialogClass="model-tip">
        <div class="main1" v-show="modalNextPage">
            <h2 class="title">{{ $t('title1') }}</h2>
            <div class="img-wrapper-com img-wrapper">
                <img class="img" src="../assets/dialog/GroveColorTipDialog/color.png" />
            </div>
            <mu-flat-button class="btn-class"  :label="$t('next')" @click="modalNextPage = false" slot="actions" />
        </div>
        <div class="main2" v-show="!modalNextPage">
            <h2 class="title">{{ $t('title2') }}</h2>
            <div class="color-wrapper">
                <div class="color-text-tip">
                    <p>{{ $t('text1') }} </p>
                    <p>{{ $t('text2') }} </p>
                    <p>{{ $t('please') }}
                        <ul class="color-text-tip-list">
                            <li>{{ $t('please1') }}</li>
                            <li>{{ $t('please2') }}</li>
                        </ul>
                    </p>
                </div>
                <div class="color-img">
                    <div class="color-img-left">
                        <img src="../assets/dialog/GroveColorTipDialog/color_img_left.png" />
                        <p>Switch on/off</p>
                    </div>
                    <div class="color-img-right">
                        <img src="../assets/dialog/GroveColorTipDialog/color_img_right.png"/>
                        <p>LED: Left is on, Right is off</p>
                    </div>
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
          title1: 'Please connect Color Sensor with the base of uArm.',
          title2: 'Tips ',
          text1: '1. Please make sure the background of the sensed object is white, clear and bright.',
          text2: '2.If you want to eliminate the impact of the environment (background color, light, etc.)',
          please: 'Please:',
          please1: 'Turn on the LED on the Grove',
          please2: 'Let the object touch the sensor',
          next: 'Next',
          close: 'Close',
          ok: 'Ok',
          cancel: 'Cancel',
          not_show: 'Don’t show again',
        },
        cn: {
          title1: '请将【颜色传感器】连接到uArm底座。',
          title2: '提示： ',
          text1: '1. 请确保被检测的物体处于明亮的白色背景中。',
          text2: '2. 如果您想完全避免环境因素（背景颜色、光线，等等）。',
          please: '请：',
          please1: '打开Grove模块上的LED灯',
          please2: '将被检测物体紧贴传感器。',
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
          'grove_color_hue_range',
          'get_grove_color',
        ],
        dialogVisible: false,
        dontShowAgain: false,
        modalNextPage: true,
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
        this.modalNextPage = true;
        this.blockNames.forEach((blockName) => {
          EventBus.$emit('dialog-show-again', blockName, !this.dontShowAgain);
        });
      },
    },
  };
</script>
<style lang="sass" scoped="">
    .color-text-tip {
        width:70%;
        margin:0 auto;
        color: #555;
        font-size:14px;
        line-height:14px;
        &>p{
            text-align: left;
            .color-text-tip-list{
                text-align: left;
                &>li {
                    line-height:20px;
            }
        }
    }
    }
        .color-img {
            display: flex;
            width:70%;
            margin:10% auto 4%;
            position: relative;
            font-size:12px;
            .color-img-left {
                width:30%;
                margin-right:6%;
                img {
                    width:100%;
            }
        }
            .color-img-right{
                width:50%;
                position:absolute;
                bottom:10%;
                right:4%;
                img {
                    width:100%;
            }
        }
    }
</style>