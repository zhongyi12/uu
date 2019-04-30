<template lang="html">
    <div class="content-wrapper">
      <!-- <div style="position:absolute;background:yellow;left:0px;top:50px;"> cData = {{ model.localCtrlMgr.cData }} </div> -->
      <!-- <div style="position:absolute;background:yellow;left:0px;top:50px;"> cData = {{ positionParams }} - {{ rParams }} </div> -->
      <!-- <div style="position:absolute;background:green;left:0px;top:100px;"> send: {{ positionParams }} -- {{ rParams }} </div> -->
      <!-- <div style="position:absolute;background:green;left:0px;top:150px;"> send: {{ model.localCtrlMgr.cData.sendStr }} -- {{ model.localCtrlMgr.curIntervals }} </div> -->
      <div class="canvas-wrapper">
        <!-- <canvas id="canvas" data-score='0' width="600" height="600"></canvas> -->
        <ControlSemi></ControlSemi>
        <div class="shortcut sc-wrist">
          <span v-bind:class="{ guide:show.guidea }">W</span>
        </div>
        <div class="shortcut sc-wrist-b">
          <span v-bind:class="{ guide:show.guidea }">A</span><span v-bind:class="{ guide:show.guidea }">S</span><span v-bind:class="{ guide:show.guidea }">D</span>
        </div>
      </div>
      <div class="not-canvas">
        <div class="canvas-b-wrap">
          <!-- <canvas id="angle-canvas" width="200" height="200"></canvas> -->
          <ControlAngle></ControlAngle>
          <div class="shortcut sc-wrist">
            <span v-bind:class="{ guide:show.guidea }"><i class="material-icons">keyboard_arrow_left</i></span>
            <span v-bind:class="{ guide:show.guidea }"><i class="material-icons">keyboard_arrow_right</i></span>
          </div>
        </div>

        <div class="switch-wrapper" >
          <img v-if="model.localCtrlMgr.suctionToggle" :src="images.switchon" alt="" @click="model.localCtrlMgr.suctionToggle = false" />
          <img v-else :src="images.switchoff" alt="" @click="model.localCtrlMgr.suctionToggle = true" />
          <div class="white-text" v-text="$t('controlApp.suctionSwitch')"></div>
          <mu-switch label="" v-model="model.localCtrlMgr.suctionToggle" labelBottom class="demo-switch" />
          <!-- <div class="shortcut sc-wrist">
            <span v-bind:class="{ guide:show.guidea }" v-text="$t('controlApp.keySpace')"></span>
          </div> -->
        </div>

        <div class="switch-wrapper">
          <img v-if="model.localCtrlMgr.gripperToggle" :src="images.gripperon" alt="" @click="model.localCtrlMgr.gripperToggle = false" />
          <img v-else :src="images.gripperoff" alt="" @click="model.localCtrlMgr.gripperToggle = true" />
          <div class="white-text" v-text="$t('controlApp.gripperSwitch')"></div>
          <mu-switch label="" v-model="model.localCtrlMgr.gripperToggle" labelBottom class="demo-switch" />
          <!-- <div class="shortcut sc-wrist">
            <span v-bind:class="{ guide:show.guidea }" v-text="$t('controlApp.keySpace')"></span>
          </div> -->
        </div>

      </div>
          <!-- @mousedown="setPositionZ('start')"
          @mousemove="setPositionZ('move')"
          @mouseup="setPositionZ('end')"
          @touchstart="setPositionZ('start')"
          @touchmove="setPositionZ('move')"
          @touchend="setPositionZ('end')"  -->
      <div class="not-canvas height-scroll">
        <vue-slider
          :speed="0"
          @drag-start="setPositionZ('start')"
          @callback="setPositionZ('move')"
          @drag-end="setPositionZ('end')"
          v-model="model.localCtrlMgr.cData.z"
          v-bind="sliders.height"></vue-slider>
        <div v-bind:class="{ guide:show.guideb }" class="shortmouse">
          <div class="shortcut sc-wrist">
            <span><i class="material-icons">keyboard_arrow_up</i></span><span><i class="material-icons">keyboard_arrow_down</i></span>
          </div>
          <img :src="images.mouse" alt="" />
        </div>
      </div>
      <nav class="bottomNav navbar  navbar-fixed-bottom">
        <div class="col-md-4 col-xs-4 reset-btn shortcut" id="resetButton" @click="resetAction()">{{$t('controlApp.reset')}} <img :src="images.reset" alt="" /><span>R</span></div>
        <div class="col-md-4 col-xs-4 hide">
          r:{{model.localCtrlMgr.cData.r}}, radian:{{ model.localCtrlMgr.radianAngle }}
        </div>
        <div class="col-md-8 col-xs-8 speed-wrapper">
          <label class="speed-text" v-text="$t('controlApp.slow')"></label>
          <vue-slider
            :speed="0"
            v-model="model.localCtrlMgr.cData.speed"
            v-bind="sliders.speed">
          </vue-slider>
          <label class="speed-text" v-text="$t('controlApp.fast')"></label>
        </div>
      </nav>
      <div class="user-guide" v-show="show.guidea" @click="guideNext()">
        <div class="texta-guide" v-text="langData.guideTexta"></div>
      </div>
      <div class="user-guide" v-show="show.guideb" @click="guideEnd()">
        <div class="textb-guide" v-text="langData.guideTextb"></div>
      </div>
    </div>
</template>
<script>
const imagePath = './assets/img/';
import _ from 'lodash';
import vueSlider from 'vue-slider-component';
import ControlSemi from './ControlSemi';
import ControlAngle from './ControlAngle';
export default {
  props: [],
  data() {
    return {
      model: window.GlobalUtil.model,
      cData: window.GlobalUtil.model.localCtrlMgr.cData,
      isReset: false,
      images: {
        switchon: require(`${imagePath}btn_switch_on.png`),
        switchoff: require(`${imagePath}btn_switch_off.png`),
        gripperoff: require(`${imagePath}btn_switch_gripper_off.png`),
        gripperon: require(`${imagePath}btn_switch_gripper_on.png`),
        reset: require(`${imagePath}btn_reset.png`),
        mouse: require(`${imagePath}icon_mouse.png`),
      },
      sliders: {
        height: {
          direction: 'vertical',
          min: -50,
          max: 150,
          interval: 1,
          width: 4,
          height: 350,
        },
        speed: {
          direction: 'horizontal',
          min: 1,
          max: 9,
          interval: 1,
          width: '50%',
          height: 4,
        },
      },
      show: {
        guidea: false,
        guideb: false,
      },
      langData: {
        guideTexta: this.$t('controlApp.guideTexta'),
        guideTextb: this.$t('controlApp.guideTextb'),
      },
    };
  },
  beforeDestroy() {
    this.model.localCtrlMgr.quit = true;
    // this.model.localCtrlMgr.positionIntervalTimer = null;
    this.model.localCtrlMgr.onMovePosition = null;
    this.images = null;
    this.model.localCtrlMgr.removeEvent();
  },
  mounted() {
    this.model.localCtrlMgr.resetAction = () => {
      this.resetAction();
    };
    this.model.localCtrlMgr.onMovePosition = () => {
      this.setPolar();
    };
    if (this.model.localCtrlMgr.resetAction) {
      this.model.localCtrlMgr.resetAction();
    }
    // this.model.localCtrlMgr.positionIntervalTimer = () => {
    //   this.model.localCtrlMgr.cData = Object.assign({}, this.cData);
    //   if (this.model.localCtrlMgr.resetPositionInterval === true) {
    //     return;
    //   }
    //   this.setPolar();
    // };

    this.model.localCtrlMgr.addKeyboardEvent();
    this.model.localCtrlMgr.addWheelEvent();

    const storage = window.localStorage;
    if (storage.getItem('controlTips') === null) {
      this.show.guidea = true;
      storage.setItem('controlTips', false);
    }
    window.UArm.set_acceleration({
      printingMoves: 300,
      travelMoves: 300,
      retractMoves: 300,
    });
  },
  methods: {
    setPositionZ(state) {
      switch (state) {
        case 'start': {
          this.model.localCtrlMgr.addIntervalCtrl('positionZ');
          this.model.localCtrlMgr.initPositionInterval();
          break;
        }
        case 'move': {
          if (this.model.localCtrlMgr.onMovePosition) {
            this.model.localCtrlMgr.onMovePosition();
          }
          break;
        }
        case 'end': {
          this.model.localCtrlMgr.removeIntervalCtrl('positionZ');
          break;
        }
        default:
          break;
      }
    },
    guideNext() {
      this.show.guidea = false;
      this.show.guideb = true;
    },
    guideEnd() {
      this.show.guidea = false;
      this.show.guideb = false;
    },
    radiansToDegrees(radians) {
      return parseInt(180 * radians / Math.PI);
    },
    // suctionToggle() {
    //   this.model.localCtrlMgr.cToggle = !this.model.localCtrlMgr.cToggle;
    // },
    resetAction() {
      const self = this;
      this.isReset = true;
      self.model.localCtrlMgr.radianAngle = -1 * Math.PI / 2; // default value
      this.cData.speed = 3;
      // reset code here
      this.cData.r = 90; // default r value
      this.model.localCtrlMgr.suctionToggle = false;
      this.model.localCtrlMgr.gripperToggle = false;
      this.cData.x = this.cData.armFinger.x = 0;
      this.cData.y = this.cData.armFinger.y = 160;
      //      self.cData.rotation = 0;
      //      self.cData.stretch = 0;
      this.cData.z = 100;
      // setTimeout(() => {
      //   this.setPolar2();
      // })
      window.UArm.set_mode(0);
      window.UArm.reset();
    },
// eslint-disable-next-line func-names
    setPolar: _.debounce(function() {
      this.setPolar2();
    }, 20),
    setPolar2() {
      this.cData.armFinger.x = this.cData.x;
      this.cData.armFinger.y = this.cData.y;
      const tempObj = {
        rotation: 180 - this.rotation,
        stretch: this.stretch,
        height: this.cData.z,
        wait: false,
        speed: this.realSpeed,
        page: 'control',
      };
      window.UArm.set_polar(tempObj);
      // if (!this.isReset) {
      //   window.UArm.set_polar(tempObj);
      // }
      // else {
      //   window.UArm.reset();
      //   this.isReset = false;
      // }
    },
// eslint-disable-next-line func-names
    wristTurn: _.debounce(function() {
      window.UArm.wrist_turn({
        angle: 180 - this.cData.r,
        wait: false,
        speed: this.realSpeed,
      });
    }, 10),
  },
  components: {
    vueSlider,
    ControlSemi,
    ControlAngle,
  },
  watch: {
    suctionToggle() {
      // alert(this.cToggle)
      const tempObj = {
        ON: this.suctionToggle,
      };
      window.UArm.set_pump(tempObj);
    },
    gripperToggle() {
      const tempObj = {
        ON: this.gripperToggle,
      };
      window.UArm.set_gripper(tempObj);
    },
    // positionParams() {
    //   this.setPolar();
    // },
    rotation() {
      // this.setPolar();
    },
    stretch() {
      // this.setPolar();
    },
    positionZParams() {
      // this.setPolar();
    },
    rParams() {
      this.wristTurn();
    },
  },
  computed: {
    suctionToggle() {
      return this.model.localCtrlMgr.suctionToggle;
    },
    gripperToggle() {
      return this.model.localCtrlMgr.gripperToggle;
    },
    positionParams() {
      const params = {
        x: this.cData.x,
        y: this.cData.y,
        z: this.cData.z,
        // r: this.cData.r,
      };
      return JSON.stringify(params);
    },
    positionZParams() {
      const params = {
        // x: this.cData.x,
        // y: this.cData.y,
        z: this.cData.z,
        // r: this.cData.r,
      };
      return JSON.stringify(params);
    },
    rParams() {
      const params = {
        r: this.cData.r,
      };
      return JSON.stringify(params);
    },
    rotation() {
      return parseInt(90 + parseInt(180 * -Math.atan2(this.cData.x, this.cData.y) / Math.PI));// x y switched
    },
    stretch() {
      return parseInt(300 * Math.sqrt(this.cData.x * this.cData.x + this.cData.y * this.cData.y) / 240);// 240 scale to 300
    },
    realSpeed() {
      if (this.$store.getters.uarmInfo.productName === 'swift') {
        return this.cData.speed * 10;
      }
      return this.cData.speed * 3000;
    },
  },
};

</script>

<style lang="sass" scoped>
$bottomTextColor: #CCC;
$bottomRadialStart: #444;
$bottomRadialEnd: #5c5c5c;
$themeOrange:#D95E2E;
.shortcut {
    color: #969696;
    span {
        border: 1px solid #585858;
        border-radius: 1px;
        padding: 0 5px;
        font-size: 10px;
        i {
            font-size: 1.5em;
        }
    }
    span.guide {
      border: 1px solid $themeOrange;
      z-index: 1999;
    }
}


.content-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    .canvas-wrapper {
        margin-top: 6vw;
        height: 340px;
        position: relative;
        .sc-wrist {
            top: 350px;
            position: absolute;
            left: 48%;
            display: flex;
            justify-content: space-around;
            width: 4%;
            span {
                padding: 0 3px;
            }
        }
        .sc-wrist-b {
            top: 373px;
            position: absolute;
            left: 44%;
            display: flex;
            justify-content: space-around;
            width: 12%;
        }
    }
    .canvas-b-wrap {
        position: relative;
        .sc-wrist {
            top: 140px;
            position: absolute;
            left: 6%;
            display: flex;
            justify-content: space-around;
            width: 88%;
        }
    }
    .not-canvas {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-top: 1vw;
        margin: 2%;
        .switch-wrapper {
            text-align: center;
            position: relative;
            img {
                cursor: pointer;
            }
            .mu-switch-label {
                color: white;
            }
            .sc-wrist {
                top: 117px;
                position: absolute;
                left: 6%;
                display: flex;
                justify-content: space-around;
                width: 88%;
            }
        }

    }
    .height-scroll {
        position: relative;
        .vue-slider-wrap{
          margin: auto;
        }
        .shortmouse{
          width: 8vw;
          height: 7vw;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          .sc-wrist {
              display: flex;
              justify-content: center;
              flex-direction: column;
              span {
                  margin-top: 0.4vw;
                  line-height: 1em;
                  i {
                      margin-bottom: 0.2vw;
                      margin-top: 0;
                  }
              }
              span:first-child {

                  margin-top: 0.4vw;
                  line-height: 1em;
                  i {
                      margin-top: 0.2vw;
                      margin-bottom: 0;
                  }
              }
          }
          img {
            width: 3.5vw;
            height: 4.5vw;
          }
        }
        .shortmouse.guide {
          border: 1px solid $themeOrange;
          z-index: 1999;
        }

    }
}

.themeblue {
    background: #4B5B68;
}
.ui-slider-range {
    background: #4B5B68;
}
.slider-btn {
    background: #313131;
    border: 1px white solid;
}
#speed-slider {
    border: none;
    margin-top: 25px;
    width: 50%;
    background: -webkit-linear-gradient(left top, #8FFF94, #FF6868);
    border-radius: 5px;
}
#slider-vertical {
    height: 250px;
    margin: 22% auto;
    background: white;
}
.navbar-fixed-bottom {
    position: absolute;
    background: #5c5c5c;
    height: 80px;
    padding-top: 10px;
    display: flex;
    text-align: center;
    background: #5c5c5c;
    //* For browsers that do not support gradients */
    background: -webkit-linear-gradient(left top, $bottomRadialStart, $bottomRadialEnd);
    //* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(bottom right, $bottomRadialStart, $bottomRadialEnd);
    //* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(bottom right, $bottomRadialStart, $bottomRadialEnd);
    //* For Firefox 3.6 to 15 */
    background: linear-gradient(to bottom right, $bottomRadialStart, $bottomRadialEnd);
    //* Standard syntax */
    .speed-wrapper {
        display: flex;
        align-items: center;
    }
    .speed-text {
        padding: 5px;
        color: $bottomTextColor;
    }
    .reset-btn {
        padding: 5px;
        color: $bottomTextColor;
        cursor: pointer;
        line-height: 50px;
        img {
            width: 30px;
        }
        i {
            color: white;
            padding: 0 3%;
        }
    }
}
.switch-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
        width: 30%;
    }
}
.white-text {
    color: #969696;
    font-size: 12px;
}
#resetButton span {
    border: 1px solid #686868;
}
.user-guide{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background: rgba(0,0,0,0.6);
  left: 0;
  color: white;
  z-index: 1998;
  .texta-guide{
    position: absolute;
    top: 9vw;
    width: 100%;
    text-align: center;
  }
  .textb-guide{
    position: absolute;
    bottom: 20vw;
    right: 10vw;
    width: 100%;
    text-align: right;
  }
}
</style>
