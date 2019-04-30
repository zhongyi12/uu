<template lang="html">
  <div class="">
    <canvas id="angle-canvas" width="200" height="200"></canvas>
  </div>
</template>
<script>

const imagePath = './assets/img/';
import _ from 'lodash';

let mouseX;
let mouseY;
let isDown = false;
const PI2 = Math.PI * 2;
const cx = 100;
const cy = 100;
const sRadius = 50;
const strokewidth = 3;
const thumbAngle = PI2 / 120;

export default {
  props: [],
  data() {
    return {
      model: window.GlobalUtil.model,
      cData: window.GlobalUtil.model.localCtrlMgr.cData,
      // radianAngle: -Math.PI / 2,
      sCanvas: null,
      sCtx: null,
    };
  },
  beforeDestroy() {
    const sCanvas = this.sCanvas;
    sCanvas.removeEventListener('mousedown', this.handleMouseDown);
    sCanvas.removeEventListener('mousemove', this.handleMouseMove);
    sCanvas.removeEventListener('mouseup', this.handleMouseUp);
    sCanvas.removeEventListener('mouseout', this.handleMouseOut);
    this.sCanvas = null;
    this.sCtx = null;
  },
  mounted() {
    const self = this;

    // define values for angle canva;
    this.sCanvas = document.getElementById('angle-canvas');
    if (!this.sCanvas) {
      return;
    }
    this.sCtx = this.sCanvas.getContext('2d');

    const sCanvas = this.sCanvas;
    const sCtx = this.sCtx;

    // default value
    self.cData.r = self.radiansToDegrees(-self.model.localCtrlMgr.radianAngle); // default r value
    sCtx.lineCap = 'round';
    sCtx.font = '24px arial';
    sCtx.lineWidth = 3;

    this.drawAngle();

    sCanvas.addEventListener('mousedown', this.handleMouseDown);
    sCanvas.addEventListener('mousemove', this.handleMouseMove);
    sCanvas.addEventListener('mouseup', this.handleMouseUp);
    sCanvas.addEventListener('mouseout', this.handleMouseOut);
  },
  methods: {
    handleMouseDown(e) {
      e.preventDefault();
      // Put your mousedown stuff here
      isDown = true;

      // this.model.localCtrlMgr.addIntervalCtrl('angle');
      // this.model.localCtrlMgr.initPositionInterval();
    },
    handleMouseUp(e) {
      e.preventDefault();
      // Put your mouseup stuff here
      isDown = false;
      // this.model.localCtrlMgr.removeIntervalCtrl('angle');
    },
    handleMouseOut(e) {
      e.preventDefault();
      // Put your mouseOut stuff here
      isDown = false;
    },
    handleMouseMove(e) {
      const self = this;
      const sCanvas = this.sCanvas;
      const sCtx = this.sCtx;
      if (!sCanvas || !sCtx) {
        return;
      }
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
        self.model.localCtrlMgr.radianAngle = tempradianAngle;
      }
    },
    drawAngle() { // draw uarm angle select
      const self = this;
      const sCanvas = this.sCanvas;
      const sCtx = this.sCtx;
      // clear
      if (!sCanvas || !sCtx) {
        return;
      }
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
      const radianAngle = self.model.localCtrlMgr.radianAngle;
      sCtx.arc(cx, cy, sRadius, radianAngle - thumbAngle / 2, radianAngle + thumbAngle / 2);
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
      if (!self.model.localCtrlMgr.quit) {
        sCtx.fillText(self.$t('controlApp.wristTurn'), cx, cy + 30);
      }
      // ctx.stroke();
      // ctx.restore();
      window.requestAnimationFrame(this.drawAngle); // real time change when let changes
    },
    radiansToDegrees(radians) {
      return parseInt(180 * radians / Math.PI);
    },
  },
  components: {
  },
  watch: {
  },
  computed: {
  },
};

</script>

<style lang="sass" scoped>
#angle-canvas:active,
#angle-canvas:hover {
    cursor: move;
}
</style>
