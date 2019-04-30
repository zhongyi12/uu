<template>

    <mu-dialog :open="dialogVisible" dialogClass="model-tip ">
        <div class="main1" v-show="modalNextPage">
            <h2 class="title">{{$t('title1')}}</h2>
            <div class="img-wrapper-com img-wrapper">
                <img class="img" src="../assets/dialog/GroveGestureDialog/gesture_dialog.png" />
            </div>
            <mu-flat-button class="btn-class"  :label="$t('next')" @click="modalNextPage = false" slot="actions" />
        </div>
        <div class="main2" v-show="!modalNextPage">
            <h2 class="title">{{$t('title2')}}</h2>
            <div class="wrapper">
                <div class="left-gesture">
                    <div class="left-gesture-icon">
                        <img src="../assets/dialog/GroveGestureDialog/gesture_sensor01_3x.png" />
                    </div>
                    <div class="gesture up ">{{$t('up')}}<span class="caret"></span> </div>
                    <div class="gesture right">{{$t('right')}}<span class="caret"></span></div>
                    <div class="gesture down">
                        <span class="down-text">{{$t('down')}}</span>
                        <span class="caret"></span>
                    </div>
                    <div class="gesture left">{{$t('left')}}<span class="caret"></span></div>
                </div>
                <div class="divided-line"></div>
                <div class="right-gesture">
                    <div class="gesture">
                        <div class="gesture1">
                            <div class="gesture-icon">
                                <img src="../assets/dialog/GroveGestureDialog/finger_clockwise.svg"/>
                            </div>
                            <span class="gesture-text">
                        <span class="caret"></span>
                         {{$t('clockwise')}}
                    </span>
                        </div>
                        <div class="gesture2">
                            <div class="gesture-icon">
                                <img src="../assets/dialog/GroveGestureDialog/finger_counterclockwise.svg"/>
                            </div>
                            <span class="gesture-text">
                        <span class="caret"></span>
                         {{$t('counter')}}
                    </span>
                        </div>
                        <div class="gesture3">
                            <div class="gesture-icon">
                                <img src="../assets/dialog/GroveGestureDialog/forward.svg"/>
                            </div>
                            <span class="gesture-text">
                        <span class="caret"></span>
                        {{$t('forward')}}
                    </span>
                        </div>
                        <div class="gesture4">
                            <div class="gesture-icon">
                                <img src="../assets/dialog/GroveGestureDialog/backward.svg"/>
                            </div>
                            <span class="gesture-text">
                        <span class="caret"></span>
                         {{$t('backward')}}
                    </span>
                        </div>
                    </div>
                    <div class="gesture-img">
                        <img src="../assets/dialog/GroveGestureDialog/gesture_sensor02_3x.png" />
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
          title1: 'Please connect Gesture Sensor with the base of uArm.',
          title2: 'Gesture sensor is able to sense motions in 8 directions:',
          up: 'Up',
          right: 'Right',
          down: 'Down',
          left: 'Left',
          clockwise: ' Clockwise',
          counter: ' Counterclockwise',
          forward: ' Forward',
          backward: 'Backward',
          next: 'Next',
          close: 'Close',
          ok: 'Ok',
          cancel: 'Cancel',
          not_show: 'Don’t show again',
        },
        cn: {
          title1: '请将【手势传感器】连接到uArm底座',
          title2: '【手势传感器】可检测8个方向的运动：',
          up: '上',
          right: '右',
          down: '下',
          left: '左',
          clockwise: ' 顺时针',
          counter: ' 逆时针',
          forward: ' 前',
          backward: '后',
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
          'grove_gesture_type',
          'get_grove_gesture',
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
<style lang="sass" scoped>
    .left-gesture {
        position: relative;
        width:49%;
        height:30vw;
        max-height:370px;
        font-size:14px;
        .left-gesture-icon {
            width:50%;
            height:50%;
            margin:0 auto;
            position: absolute;
            top: 24%;
            left: 25%;
            img {
                width:100%;
        }
    }
        .up {
            position: absolute;
            top:0;
            left:48%;
            background:url(../assets/dialog/GroveGestureDialog/up.svg) no-repeat center bottom;
            width: 35px;
            height: 80px;
            .caret{
                transform: rotate(-180deg);
                position: absolute;
                top: 37%;
                left: 32%;
        }
    }
        .right {
            position: absolute;
            right:1vw;
            top:48%;
            background: url(../assets/dialog/GroveGestureDialog/right.svg) no-repeat right bottom;
            width: 40px;
            height: 85px;
            .caret{
                transform: rotate(-90deg);
                position: absolute;
                top: 12%;
                left: -30%;
        }
    }
        .down {
            position: absolute;
            bottom:0;
            left:48%;
            background: url(../assets/dialog/GroveGestureDialog/down.svg) no-repeat center top;
            width: 35px;
            height: 80px;
            .caret {
                position: absolute;
                bottom: 34%;
                left: 60%;
        }
            .down-text {
                position:absolute;
                bottom:0;
                left:32%;
        }
    }
        .left {
            position: absolute;
            left:1vw;
            top:48%;
        background: url(../assets/dialog/GroveGestureDialog/left.svg) no-repeat left bottom;
            width: 40px;
            height: 85px;
            .caret{
                transform: rotate(-270deg);
                position: absolute;
                top: 12%;
                right: -20%;
        }
    }
    }
        .divided-line {
            border-left:1px dotted #555;
            margin:0 auto;
            height: 26vw;
            max-height: 350px;
    }
        .right-gesture {
        width:48%;
        position: relative;
        .gesture {
            width:100%;
            padding:2vw 1vw;
            .gesture-icon {
                width:4vw;
                max-width:54px;
                display:inline-block;
                img {
                    width:100%;
            }
        }
            .gesture-text {
                text-align: left;
                display:inline-block;
                font-size: 14px;
                .caret {
                    margin-right:10px;
            }
        }
            .gesture1 {
                text-align: center;
                padding-right: 38%;
        }
            .gesture2 {
                text-align: right;
                padding-right: 10%;
        }
            .gesture3 {
                text-align: left;
                padding-left: 3%;
        }
            .gesture4 {
                text-align: center;
                padding-right:3%;
        }
    }
        .gesture-img {
            width:70%;
            margin:0 auto;
            img {
                width:100%;
        }
    }
    }
</style>