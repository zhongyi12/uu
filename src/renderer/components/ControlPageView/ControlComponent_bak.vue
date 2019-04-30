<template lang="html">
    <div class="content-wrapper">
      <div class="canvas-wrapper">
        <canvas id="canvas" data-score='0' width="600" height="600"></canvas>
        <div class="shortcut sc-wrist">
          <span v-bind:class="{ guide:show.guidea }">W</span>
        </div>
        <div class="shortcut sc-wrist-b">
          <span v-bind:class="{ guide:show.guidea }">A</span><span v-bind:class="{ guide:show.guidea }">S</span><span v-bind:class="{ guide:show.guidea }">D</span>
        </div>
      </div>
      <div class="not-canvas">
        <div class="canvas-b-wrap">
          <canvas id="angle-canvas" width="200" height="200"></canvas>
          <div class="shortcut sc-wrist">
            <span v-bind:class="{ guide:show.guidea }"><i class="material-icons">keyboard_arrow_left</i></span>
            <span v-bind:class="{ guide:show.guidea }"><i class="material-icons">keyboard_arrow_right</i></span>
          </div>
        </div>

        <div class="switch-wrapper" >
          <img v-if="cToggle" :src="images.switchon" alt="" @click="cToggle=false" />
          <img v-else :src="images.switchoff" alt="" @click="cToggle=true" />
          <div class="white-text" v-text="$t('controlApp.suctionGripperSwitch')"></div>
          <mu-switch label="" v-model="cToggle" labelBottom class="demo-switch" />
          <div class="shortcut sc-wrist">
            <span v-bind:class="{ guide:show.guidea }" v-text="$t('controlApp.keySpace')"></span>
          </div>
        </div>

      </div>
      <div class="not-canvas height-scroll">
        <vue-slider v-model="model.localCtrlMgr.cData.z" v-bind="sliders.height"></vue-slider>
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
          r:{{model.localCtrlMgr.cData.r}}, radian:{{radianAngle}}
        </div>
        <div class="col-md-8 col-xs-8 speed-wrapper">
          <label class="speed-text" v-text="$t('controlApp.slow')"></label>
          <vue-slider v-model="model.localCtrlMgr.cData.speed" v-bind="sliders.speed"></vue-slider>
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
export default {
  props: [],
  data() {
    return {
      model: window.GlobalUtil.model,
      radianAngle: -Math.PI / 2,
      cToggle: false,
      quit: false,
      isReset: false,
      images: {
        switchon: require(`${imagePath}btn_switch_on.png`),
        switchoff: require(`${imagePath}btn_switch_off.png`),
        reset: require(`${imagePath}btn_reset.png`),
        mouse: require(`${imagePath}icon_mouse.png`),
      },
      sliders: {
        height: {
          direction: 'vertical',
          min: 0,
          max: 250,
          interval: 1,
          width: 4,
          height: '80%',
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
    this.quit = true;
  },
  mounted() {
    const self = this;
    self.cData = this.model.localCtrlMgr.cData;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const cWidth = canvas.width;
    const cHeight = canvas.height;
    const setRadius = 240;
    const deadRadius = 110;
    const smallRadius = setRadius / 12;
    const halfCircleLineWidth = 3;

    let mouse;
    let offset;
    let tempX;
    let tempY;
    let rangeTemp;
    let mouseX;
    let mouseY;
    let eventW;
    function onMouseDown(e) {
      mouse = {
        x: -(e.clientX - canvas.getBoundingClientRect().left),
        y: -(e.clientY - canvas.getBoundingClientRect().top),
      };
      offset = {
        x: mouse.x - self.cData.armFinger.x,
        y: mouse.y - self.cData.armFinger.y,
      };
      // mouseC = {
      //   x: cWidth / 2 - e.clientX,
      //   y: cHeight / 2 - e.clientY,
      // }
      //            console.log(mouseC)
      //            console.log(self.cData.armFinger)
      // console.log(  Math.sqrt(Math.pow(offset.x,2)+Math.pow(offset.y,2) ) )
      function onMouseMove(e) {
        mouse = {
          x: -(e.clientX - canvas.getBoundingClientRect().left),
          y: -(e.clientY - canvas.getBoundingClientRect().top),
        };
        tempX = mouse.x - offset.x;
        tempY = mouse.y - offset.y;
        rangeTemp = Math.sqrt(tempX * tempX + tempY * tempY);
        if (tempY > 0 && rangeTemp < (setRadius + 2) && rangeTemp > deadRadius) { // real time show on right side panel
          self.cData.y = self.cData.armFinger.y = tempY;
          // self.cData.rotation = parseInt(90 + radiansToDegrees( -Math.atan2(tempX,tempY) ));
          // self.cData.stretch = parseInt(Math.sqrt(tempX*tempX+tempY*tempY));
        }
        else if (tempY > 0 && rangeTemp > deadRadius) {
          if (Math.abs(tempX) < setRadius) {
            self.cData.y = self.cData.armFinger.y = Math.sqrt(setRadius * setRadius - tempX * tempX);
          }
          else {
            self.cData.y = self.cData.armFinger.y = 0;
          }
        }
        else if (rangeTemp > deadRadius) {
          self.cData.y = 0;
        }
        if (Math.abs(tempX) < (setRadius + 2) && rangeTemp > deadRadius) {
          self.cData.x = self.cData.armFinger.x = tempX;
        }
      }

      function removeMouseMove() {
        canvas.removeEventListener('mousemove', onMouseMove, false);
      }
      canvas.addEventListener('mousemove', onMouseMove, false);
      canvas.addEventListener('mouseup', removeMouseMove);
    }
    canvas.addEventListener('mousedown', onMouseDown);

    function drawFrame() { // draw uarm move
      ctx.save();
      ctx.clearRect(0, 0, cWidth, cHeight);
      ctx.translate(cWidth / 2, cHeight / 2);
      ctx.rotate(Math.PI);

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = halfCircleLineWidth;
      ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
      ctx.arc(0, 0, 1 * setRadius / 5, 0, Math.PI, false);
      ctx.stroke();
      ctx.restore();

      window.requestAnimationFrame(drawFrame); // real time change when let changes

      ctx.save(); // 中间刻度层1
      ctx.fillStyle = '#3C3C3C'; // background
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
      ctx.lineWidth = halfCircleLineWidth;
      ctx.arc(0, 0, setRadius, 0, Math.PI, false);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.save(); // 中间刻度层2
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
      ctx.lineWidth = halfCircleLineWidth / 2;
      ctx.arc(0, 0, 4 * setRadius / 5, 0, Math.PI, false);
      ctx.stroke();
      ctx.restore();
      ctx.save(); // 3
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
      ctx.lineWidth = halfCircleLineWidth / 2;
      ctx.arc(0, 0, 3 * setRadius / 5, 0, Math.PI, false);
      ctx.stroke();
      ctx.restore();
      ctx.save(); // 中间刻度层4
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
      ctx.lineWidth = halfCircleLineWidth / 2;
      ctx.arc(0, 0, 2 * setRadius / 5, 0, Math.PI, false);
      ctx.stroke();
      ctx.restore();
      ctx.save(); // connect line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
      ctx.lineWidth = halfCircleLineWidth / 2;
      ctx.arc(0, 0, 1 * setRadius / 5, 0, Math.PI, false);
      ctx.stroke();
      ctx.restore();
      ctx.save(); // connect line
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#68C2FF';
      ctx.moveTo(self.cData.armFinger.x - 0, self.cData.armFinger.y - 0);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.rotate(Math.PI / 4);
      ctx.restore();


      ctx.save(); // 刻度线
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, .3)';
        ctx.moveTo(setRadius, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 4);
      }
      ctx.beginPath();
      ctx.restore(); // line bug fix

      ctx.save(); // angle value
      ctx.rotate(Math.PI / 2);
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = 'rgba(255, 255, 255, .3)';
        ctx.font = '16px Microsoft yahei';
        ctx.textAlign = 'center';
        ctx.fillText(45 * i, 0, 0 - setRadius - 5);
        ctx.rotate(Math.PI / 4);
      }
      ctx.restore();

      ctx.save(); // aixs circle
      ctx.fillStyle = '#363636'; // half dark
      ctx.beginPath();
      ctx.strokeStyle = '#6c6c6c';
      ctx.lineWidth = 5;
      ctx.arc(0, 0, smallRadius, 0, 2 * Math.PI, false);
      // ctx.arc(0, 0, smallRadius/2, 0, 2*Math.PI, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.save(); // aixs circle 2
      ctx.fillStyle = '#363636'; // half dark
      ctx.beginPath();
      ctx.strokeStyle = '#6c6c6c';
      ctx.lineWidth = 10;
      ctx.arc(0, 0, smallRadius / 5, 0, 2 * Math.PI, false);
      // ctx.arc(0, 0, smallRadius/2, 0, 2*Math.PI, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.save(); // dragable
      ctx.fillStyle = '#3370d4'; // blue
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, .9)';
      ctx.lineWidth = 3;
      ctx.arc(self.cData.armFinger.x, self.cData.armFinger.y, 4 * smallRadius / 5, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath(); // bug fix
      ctx.restore();
    } // drawFrame function end

    drawFrame();

    // define values for angle canva;
    const sCanvas = document.getElementById('angle-canvas');
    const sCtx = sCanvas.getContext('2d');
    let isDown = false;
    const PI2 = Math.PI * 2;
    const cx = 100;
    const cy = 100;
    const sRadius = 50;
    const strokewidth = 3;
    const thumbAngle = PI2 / 120;
    // default value
    self.cData.r = self.radiansToDegrees(-self.radianAngle); // default r value
    sCtx.lineCap = 'round';
    sCtx.font = '24px arial';
    sCtx.lineWidth = 3;

    function drawAngle() { // draw uarm angle select
      // clear
      sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);

      sCtx.save();
      // circle
      sCtx.beginPath();
      sCtx.arc(cx, cy, sRadius, Math.PI, PI2);
      sCtx.strokeStyle = '#e0e0e0';
      sCtx.lineWidth = strokewidth;
      sCtx.stroke();

      // zero marker
      // sCtx.beginPath();
      // sCtx.moveTo(cx + sRadius - strokewidth / 2, cy);
      // sCtx.lineTo(cx + sRadius + strokewidth / 2, cy);
      // sCtx.strokeStyle = "white";
      // sCtx.lineWidth = 3;
      // sCtx.stroke();

      // indicator
      sCtx.beginPath();
      sCtx.arc(cx, cy, sRadius, self.radianAngle - thumbAngle / 2, self.radianAngle + thumbAngle / 2);
      sCtx.strokeStyle = '#03A9F4'; // gold
      sCtx.lineWidth = strokewidth * 6;
      sCtx.stroke();

      sCtx.font = '20px PingFangSC-Regular';
      sCtx.fillStyle = 'gray';
      sCtx.textAlign = 'center';
      sCtx.fillText(self.cData.r, cx, cy + 8);
      // name


      sCtx.font = '12px PingFangSC-Regular';
      sCtx.fillStyle = '#969696';
      sCtx.textAlign = 'center';
      if (!self.quit) {
        sCtx.fillText(self.$t('controlApp.wristTurn'), cx, cy + 30);
      }

      ctx.stroke();
      ctx.restore();
      window.requestAnimationFrame(drawAngle); // real time change when let changes
    }

    drawAngle();

    function handleMouseDown(e) {
      e.preventDefault();
      // Put your mousedown stuff here
      isDown = true;
    }

    function handleMouseUp(e) {
      e.preventDefault();
      // Put your mouseup stuff here
      isDown = false;
    }

    function handleMouseOut(e) {
      e.preventDefault();
      // Put your mouseOut stuff here
      isDown = false;
    }

    function handleMouseMove(e) {
      // uncomment if you want to move slider only on drag instead of any mousemove
      if (!isDown) {
        return;
      }
      e.preventDefault();

      mouseX = parseInt(e.clientX - sCanvas.getBoundingClientRect().left);
      mouseY = parseInt(e.clientY - sCanvas.getBoundingClientRect().top);
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const tempradianAngle = Math.atan2(dy, dx);
      const tempAngle = self.radiansToDegrees(-tempradianAngle);
      if (tempAngle >= 0 || Math.abs(tempAngle) === 180) {
        self.cData.r = Math.abs(tempAngle);
        self.radianAngle = tempradianAngle;
      }
    }
    function getCurrentRadius(x, y) {
      return Math.sqrt(x * x + y * y);
    }
    function controlShortcut(e) {
      const delta = 5;
      if (e.keyCode === 87 && self.cData.armFinger.y < (setRadius - delta)) { // w
        self.cData.y = self.cData.armFinger.y = self.cData.y + delta;
      }
      else if (e.keyCode === 65 && self.cData.x < setRadius) { // a
        if (getCurrentRadius(self.cData.x + delta, self.cData.y) > deadRadius) {
          self.cData.x += delta;
        }
//        console.log(delta, self.cData.x, self.cData.armFinger.x);
      }
      else if (e.keyCode === 83 && self.cData.armFinger.y > delta) { // s
        if (getCurrentRadius(self.cData.x, self.cData.y - delta) > deadRadius) {
          self.cData.y = self.cData.armFinger.y = self.cData.y - delta;
        }
      }
      else if (e.keyCode === 68 && (0 - self.cData.x) < setRadius) { // d
        if (getCurrentRadius(self.cData.x - delta, self.cData.y) > deadRadius) {
          self.cData.x -= delta;
        }
//        console.log(delta, self.cData.x, self.cData.armFinger.x);
      }
      if (self.cData.r >= 0 && self.cData.r <= 180) {
        if (e.keyCode === 37 && self.cData.r < 180) { // left
          self.radianAngle = -PI2 * ++self.cData.r / 360;
        }
        else if (e.keyCode === 39 && self.cData.r > 0) { // right
          self.radianAngle = -PI2 * --self.cData.r / 360;
        }
      }
      // currentZ =$("#slider-vertical").slider("value");
      if (e.keyCode === 38) { // up
        self.cData.z = self.cData.z < 250 ? self.cData.z + 1 : self.cData.z;
        // $("#slider-vertical").slider("value", currentZ + 1);
      }
      else if (e.keyCode === 40) { // down
        self.cData.z = self.cData.z > 0 ? self.cData.z - 1 : self.cData.z;
        // $("#slider-vertical").slider("value", currentZ - 1);
      }
    }
    function keyupShortcut(e) {
      if (e.keyCode === 32) { // space
        self.cToggle = !self.cToggle;
      }
      else if (e.keyCode === 82) {
        self.resetAction();
      }
    }
    sCanvas.addEventListener('mousedown', handleMouseDown);
    sCanvas.addEventListener('mousemove', handleMouseMove);
    sCanvas.addEventListener('mouseup', handleMouseUp);
    sCanvas.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('keydown', controlShortcut, true);
    window.addEventListener('keyup', keyupShortcut, true);

    function callbackW(event) {
      if (event.wheelDelta > 0) {
        self.cData.z = self.cData.z < 250 ? self.cData.z + 1 : self.cData.z;
      }
      else {
        self.cData.z = self.cData.z > 0 ? self.cData.z - 1 : self.cData.z;
      }
      // $("#slider-vertical").slider("value", nextZ);
    }
    // let eventW = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

    if ('onwheel' in document) {
      eventW = 'wheel';
    }
    else if ('onmousewheel' in document) {
      eventW = 'mousewheel';
    }
    else {
      eventW = 'DOMMouseScroll';
    }
    window.addEventListener(eventW, callbackW);
    const storage = window.localStorage;
    if (storage.getItem('controlTips') === null) {
      this.show.guidea = true;
      storage.setItem('controlTips', false);
    }
    this.resetAction();
    window.UArm.set_acceleration({
      printingMoves: 300,
      travelMoves: 300,
      retractMoves: 300,
    });
  },
  methods: {
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
    suctionToggle() {
      this.cToggle = !this.cToggle;
    },
    resetAction() {
      this.isReset = true;
      // reset code here
      this.cData.x = this.cData.armFinger.x = 0;
      this.cData.y = this.cData.armFinger.y = 150;
      //      self.cData.rotation = 0;
      //      self.cData.stretch = 0;
      this.cData.z = 150;
      this.radianAngle = -1 * Math.PI / 2; // default value
      this.cData.r = 90; // default r value
      this.cToggle = false;
      this.cData.speed = 3;
      // window.UArm.reset();
    },
// eslint-disable-next-line func-names
    setPolar: _.debounce(function() {
      this.cData.armFinger.x = this.cData.x;
      this.cData.armFinger.y = this.cData.y;
      const tempObj = {
        rotation: 180 - this.rotation,
        stretch: this.stretch,
        height: this.cData.z,
        wait: false,
        speed: this.realSpeed,
      };
      if (!this.isReset) {
        window.UArm.set_polar(tempObj);
      }
      else {
        window.UArm.reset();
        this.isReset = false;
      }
    }, 100),
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
  },
  watch: {
    cToggle() {
      // alert(this.cToggle)
      const tempObj = {
        ON: this.cToggle,
      };
      window.UArm.set_pump(tempObj);
      window.UArm.set_gripper(tempObj);
    },
    rotation() {
      // console.log(`rotation: ${this.rotation}`);
      this.setPolar();
    },
    stretch() {
      this.setPolar();
    },
    'cData.z'() {
      this.setPolar();
    },
    'cData.r'() {
      this.wristTurn();
    },
  },
  computed: {
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
#angle-canvas:active,
#angle-canvas:hover,
#canvas:active,
#canvas:hover {
    cursor: move;
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
