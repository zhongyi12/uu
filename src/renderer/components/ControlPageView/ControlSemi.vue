<template lang="html">
  <div class="">
    <!-- <div style="position:absolute;width:600px;height:300px;background:yellow;opacity:0.2;">
    </div> -->
    <canvas id="canvas" data-score='0' width="600" height="600">
    </canvas>
  </div>
</template>

<script>

const imagePath = './assets/img/';
import _ from 'lodash';

const setRadius = 240;
const deadRadius = 120;
const smallRadius = setRadius / 12;
const halfCircleLineWidth = 3;
const PI2 = Math.PI * 2;

let mouse;
let lastMouse = { x: -9999, y: -9999 };
let offset;
let tempX;
let tempY;
let rangeTemp;
let mouseX;
let mouseY;
// let eventW;
// let isDown = false;

export default {
  props: [],
  data() {
    return {
      model: window.GlobalUtil.model,
      cData: window.GlobalUtil.model.localCtrlMgr.cData,
      canvas: null,
      ctx: null,
      cWidth: 0,
      cHeight: 0,
    };
  },
  beforeDestroy() {
    const canvas = this.canvas;
    canvas.removeEventListener('mousedown', this.onMouseDown);
    canvas.removeEventListener('mousemove', this.onMouseMove);
    canvas.removeEventListener('mouseup', this.removeMouseMove);
    this.canvas = null;
    this.ctx = null;
  },
  mounted() {
    this.model.localCtrlMgr.limitXY = (x, y) => {
      return this.limitXY(x, y);
    };

    const self = this;
    this.canvas = document.getElementById('canvas');
    if (!this.canvas) {
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.cWidth = this.canvas.width;
    this.cHeight = this.canvas.height;

    const canvas = this.canvas;
    const ctx = this.ctx;
    const cWidth = this.cWidth;
    const cHeight = this.cHeight;

    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('mouseout', this.handleMouseOut);

    this.drawFrame();
    this.drawAngle();
  },
  methods: {
    drawAngle() { // draw uarm angle select
      const ctx = this.ctx;

      if (!ctx) {
        return;
      }

      ctx.stroke();
      ctx.restore();
      window.requestAnimationFrame(this.drawAngle); // real time change when let changes
    },
    drawFrame() { // draw uarm move
      const self = this;
      const ctx = this.ctx;
      const cWidth = this.cWidth;
      const cHeight = this.cHeight;

      if (!ctx) {
        return;
      }

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

      window.requestAnimationFrame(this.drawFrame); // real time change when let changes

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
      ctx.arc(0, 0, 4 * setRadius / 5 + 5, 0, Math.PI, false);
      ctx.stroke();
      ctx.restore();

      ctx.save(); // 中间刻度层3
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
      ctx.lineWidth = halfCircleLineWidth / 2;
      ctx.arc(0, 0, 3 * setRadius / 5 + 10, 0, Math.PI, false);
      ctx.stroke();
      ctx.restore();

      ctx.save(); // 中间刻度层4
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
      ctx.lineWidth = halfCircleLineWidth / 2;
      ctx.arc(0, 0, 2 * setRadius / 5 + 12, 0, Math.PI, false);
      ctx.stroke();
      ctx.restore();

      ctx.save(); // connect line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
      ctx.lineWidth = halfCircleLineWidth / 2;
      ctx.arc(0, 0, 1 * setRadius / 5 + 15, 0, Math.PI, false);
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
    }, // drawFrame function end
    onMouseDown(e) {
      const self = this;
      const canvas = this.canvas;
      mouse = {
        x: -(e.clientX - canvas.getBoundingClientRect().left),
        y: -(e.clientY - canvas.getBoundingClientRect().top),
      };
      lastMouse = mouse;
      const offset2 = {
        x: mouse.x - self.cData.armFinger.x,
        y: mouse.y - self.cData.armFinger.y,
      };
      // self.cData.mouse = mouse;
      // self.cData.offset = mouse;
      // self.cData.mouse = { x: -mouse.x, y: -mouse.y };
      const offsetCenter = -300;
      if (offset2.x < offsetCenter - smallRadius || offset2.x > offsetCenter + smallRadius) {
        return;
      }
      if (offset2.y < offsetCenter - smallRadius || offset2.y > offsetCenter + smallRadius) {
        return;
      }
      offset = offset2;

      canvas.addEventListener('mousemove', this.onMouseMove);
      canvas.addEventListener('mouseup', this.removeMouseMove);

      this.model.localCtrlMgr.addIntervalCtrl('positionXY');
      this.model.localCtrlMgr.initPositionInterval();
    },
    removeMouseMove() {
      const self = this;
      const canvas = this.canvas;
      canvas.removeEventListener('mousemove', this.onMouseMove, false);
      canvas.removeEventListener('mouseup', this.removeMouseMove);

      this.model.localCtrlMgr.removeIntervalCtrl('positionXY');
    },
    onMouseMove(e) {
      // self.isClickInPoint(e);
      const self = this;
      const canvas = this.canvas;
      mouse = {
        x: -(e.clientX - canvas.getBoundingClientRect().left),
        y: -(e.clientY - canvas.getBoundingClientRect().top),
      };
      // self.cData.mouse = { x: -mouse.x, y: -mouse.y };
      // self.cData.lastMouse = mouse;
      tempX = mouse.x - offset.x;
      tempY = mouse.y - offset.y;

      const limitXY = this.limitXY(tempX, tempY);
      tempX = limitXY.x;
      tempY = limitXY.y;

      // rangeTemp = Math.sqrt(tempX * tempX + tempY * tempY);
      // if (tempY > 0 && rangeTemp < (setRadius + 2) && rangeTemp > deadRadius) { // real time show on right side panel
      //   self.cData.y = self.cData.armFinger.y = tempY;
      // }
      // else if (tempY > 0 && rangeTemp > deadRadius) {
      //   if (Math.abs(tempX) < setRadius) {
      //     self.cData.y = self.cData.armFinger.y = Math.sqrt(setRadius * setRadius - tempX * tempX);
      //   }
      //   else {
      //     self.cData.y = self.cData.armFinger.y = 0;
      //   }
      // }
      // else if (rangeTemp > deadRadius) {
      //   self.cData.y = 0;
      // }
      // if (Math.abs(tempX) < (setRadius + 2) && rangeTemp > deadRadius) {
      //   self.cData.x = self.cData.armFinger.x = tempX;
      // }

      self.cData.x = self.cData.armFinger.x = tempX;
      self.cData.y = self.cData.armFinger.y = tempY;

      if (this.model.localCtrlMgr.onMovePosition) {
        this.model.localCtrlMgr.onMovePosition();
      }
    },
    handleMouseOut(e) {
      e.preventDefault();
      // Put your mouseOut stuff here
      // isDown = false;
      this.removeMouseMove();
    },
    limitXY(tempX, tempY) {
      if (tempY < 0) {
        tempY = 0;
      }
      const targetCenterPoint = { x: tempX, y: tempY };
      const xx = Math.abs(targetCenterPoint.x);
      const yy = Math.abs(targetCenterPoint.y);

      const targetR = Math.sqrt(xx * xx + yy * yy);
      // self.cData.targetR = targetR.toFixed(2);

      const limitMaxR = setRadius;
      const limitMinR = deadRadius;

      let d_rotate_angle = Math.atan2(yy, xx);
      if (targetCenterPoint.x >= 0) {
        if (targetCenterPoint.y <= 0) {
          // d_rotate_angle = d_rotate_angle;
        }
        else {
          d_rotate_angle = 2 * Math.PI - d_rotate_angle;
        }
      }
      else {
        if (targetCenterPoint.y <= 0) {
          d_rotate_angle = Math.PI - d_rotate_angle;
        }
        else {
          d_rotate_angle = Math.PI + d_rotate_angle;
        }
      }

      if (targetR > limitMaxR) {
        const x = limitMaxR * Math.cos(d_rotate_angle);
        const y = -limitMaxR * Math.sin(d_rotate_angle);
        targetCenterPoint.x = x;
        targetCenterPoint.y = y;
      }
      if (targetR < limitMinR) {
        const x = limitMinR * Math.cos(d_rotate_angle);
        const y = -limitMinR * Math.sin(d_rotate_angle);
        targetCenterPoint.x = x;
        targetCenterPoint.y = y;
      }
      tempX = targetCenterPoint.x;
      tempY = targetCenterPoint.y;

      tempX = Number(tempX).toFixed(0);
      tempY = Number(tempY).toFixed(0);

      return { x: tempX, y: tempY };
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
#canvas:active,
#canvas:hover {
    cursor: move;
}
</style>
