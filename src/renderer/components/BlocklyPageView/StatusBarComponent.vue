<template>
    <div class="sensor-wrapper">
        <ul class="grove-ul" v-show="position.show">
            <li>
                <div class="input-grove">
                    <span class="grove-text">X: {{position.x}} mm</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">Y: {{position.y}} mm</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">Z: {{position.z}} mm</span>
                </div>
            </li>
            <li>{{ $t('Position')}}</li>
        </ul>
        <ul class="grove-ul" v-show="color.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{color.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <div class="grove-box" v-bind:style="{ 'background-color': `#${color.rgb}` }"></div>
                    <span class="color-text">RGB: {{color.rgb}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                <div class="grove-box" v-bind:style="{ 'background-color': `hsl(${color.hue}, 100%, 50%)` }"></div>
                <span class="color-text">Hue: {{color.hue}} </span>
                </div>
            </li>
            <li>{{ $t('ColorSensor') }}</li>
        </ul>
        <ul class="grove-ul" v-show="ultrasonic.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{ultrasonic.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{$t('Distance')}}: {{ultrasonic.distance}} cm</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text"> </span>
                </div>
            </li>
            <li>{{ $t('UltrasonicSensor')}}</li>
        </ul>
        <ul class="grove-ul" v-show="temperature.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{temperature.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{ $t('Temperature')}}: {{temperature.temperature}} c</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{ $t('Humidity')}}: {{temperature.humidity}} %</span>
                </div>
            </li>
            <li>{{ $t('TemperatureSensor')}}</li>
        </ul>
        <ul class="grove-ul" v-show="pir.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{pir.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{pir.detected ? $t('Detected'): $t('Undetected')}}</span>
                </div>
            </li>
            <li>
                <span class="grove-text"> </span>
            </li>
            <li>{{ $t('PIRMotionSensor')}}</li>
        </ul>
        <ul class="grove-ul" v-show="gesture.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{gesture.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{ $t('Gesture')}}: {{direction[lang][gesture.type]}}</span>
                </div>
            </li>
            <li>
                <span class="grove-text"> </span>
            </li>
            <li>{{ $t('GestureSensor')}}</li>
        </ul>
        <ul class="grove-ul" v-show="slide.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{slide.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{ $t('Potentiometer')}}: {{slide.value}}</span>
                </div>
            </li>
            <li>
                <span class="grove-text"> </span>
            </li>
            <li>{{ $t('SlideSensor')}}</li>
        </ul>
        <ul class="grove-ul" v-show="rotary.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{rotary.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{ $t('Rotary')}}: {{rotary.value}}</span>
                </div>
            </li>
            <li>
                <span class="grove-text"> </span>
            </li>
            <li>{{ $t('RotaryAngleSensor')}}</li>
        </ul>
        <ul class="grove-ul" v-show="light.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{light.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{ $t('Light')}}: {{light.value}}</span>
                </div>
            </li>
            <li>
                <span class="grove-text"> </span>
            </li>
            <li>{{ $t('LightSensor')}}</li>
        </ul>
        <ul class="grove-ul" v-show="air.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{air.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{ $t('Air')}}: {{air.value}}</span>
                </div>
            </li>
            <li>
                <span class="grove-text"> </span>
            </li>
            <li>{{ $t('AirQuailitySensor')}}</li>
        </ul>
        <ul class="grove-ul" v-show="sound.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{sound.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{ $t('Sound')}}: {{sound.value}}</span>
                </div>
            </li>
            <li>
                <span class="grove-text"> </span>
            </li>
            <li>{{ $t('SoundSensor')}}</li>
        </ul>
        <ul class="grove-ul" v-show="emg.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{emg.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{ $t('EMG')}}: {{emg.value}}</span>
                </div>
            </li>
            <li>
                <span class="grove-text"> </span>
            </li>
            <li>{{ $t('EMGDetector')}}</li>
        </ul>
        <ul class="grove-ul" v-show="line.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{line.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">{{ $t('Line')}}: {{line.detected ? $t('Detected'): $t('Undetected')}}</span>
                </div>
            </li>
            <li>
                <span class="grove-text"> </span>
            </li>
            <li>{{ $t('LineFinder')}}</li>
        </ul>
        <ul class="grove-ul" v-show="accel.show">
            <li>
                 <div class="input-grove">
                    <span class="grove-text">{{ $t('PIN')}}: {{accel.pin}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">X: {{accel.x}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">Y: {{accel.y}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">Z: {{accel.z}}</span>
                </div>
            </li>
            <li>
                <div class="input-grove">
                    <span class="grove-text">T: {{accel.t}}</span>
                </div>
            </li>
            <!--<li>-->
                <!--<div class="input-grove">-->
                    <!--<span class="grove-text">H: {{accel.h}}</span>-->
                <!--</div>-->
            <!--</li>-->
            <li>{{ $t('AccelerometerCompassSensor')}}</li>
        </ul>
    </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
export default {
  i18n: {
    messages: {
      en: {
        PIN: 'PIN',
        ColorSensor: 'Color Sensor',
        UltrasonicSensor: 'Ultrasonic Sensor',
        TemperatureSensor: 'Temp&Humi Sensor',
        PIRMotionSensor: 'PIR Motion Sensor',
        GestureSensor: 'Gesture Sensor',
        SlideSensor: 'Slide Potentiometer',
        RotaryAngleSensor: 'Rotary Angle Sensor',
        LightSensor: 'Light Sensor',
        AirQualitySensor: 'Air Quality Sensor',
        SoundSensor: 'Sound Sensor',
        LineFinder: 'Line Finder',
        EMGDetector: 'EMG Detector',
        AccelerometerCompassSensor: 'Accelerometer&Compass',
        Distance: 'Distance',
        Temperature: 'Temperature',
        Humidity: 'Humidity',
        Detected: 'Detected',
        Undetected: 'Undetected',
        Gesture: 'Gesture',
        Position: 'Position',
        Potentiometer: 'Potentiometer',
        Rotary: 'Angle',
        Light: 'Intensity',
        Line: 'Line',
        Air: 'Quality',
        Sound: 'Intensity',
        EMG: 'Signal',
      },
      cn: {
        PIN: '端口',
        ColorSensor: '颜色传感器',
        UltrasonicSensor: '超声波传感器',
        TemperatureSensor: '温度湿度传感器',
        PIRMotionSensor: '运动检测传感器',
        GestureSensor: '手势传感器',
        SlideSensor: '滑动变阻器',
        RotaryAngleSensor: '旋转角度传感器',
        LightSensor: '光线传感器',
        AirQualitySensor: '空气质量传感器',
        SoundSensor: '声音传感器',
        LineFinder: '循线传感器',
        EMGDetector: '肌电传感器',
        AccelerometerCompassSensor: '加速度&指南针',
        Distance: '障碍物距离',
        Temperature: '温度',
        Humidity: 'Humidity',
        Detected: '已检测',
        Undetected: '未检测',
        Gesture: '手势',
        Position: '位置',
        Potentiometer: '变阻器',
        Rotary: '角度',
        Light: '强度',
        Line: '线',
        Air: '质量',
        Sound: '强度',
        EMG: '信号',
      },
    },
  },
  data() {
    return {
      lang: 'en',
      direction: {
        en: {
          0: 'Not Detected',
          1: 'right',
          2: 'left',
          4: 'up',
          8: 'down',
          16: 'forward',
          32: 'backward',
          64: 'clockwise',
          128: 'counterClockWise',
        },
        cn: {
          0: '未检测',
          1: '右',
          2: '左',
          4: '上',
          8: '下',
          16: '前',
          32: '后',
          64: '顺时针',
          128: '逆时针',
        },
      },
      position: {
        show: false,
        x: 0,
        y: 0,
        z: 0,
      },
      color: {
        show: false,
        rgb: '#000000',
        hue: 0,
        pin: null,
      },
      ultrasonic: {
        show: false,
        distance: 0,
        pin: null,
      },
      temperature: {
        show: false,
        temperature: 0,
        humidity: 0,
        pin: null,
      },
      pir: {
        show: false,
        detected: false,
        pin: null,
      },
      gesture: {
        show: false,
        type: 0,
        pin: null,
      },
      slide: {
        show: false,
        value: null,
        pin: null,
      },
      rotary: {
        show: false,
        value: null,
        pin: null,
      },
      light: {
        show: false,
        value: false,
        pin: null,
      },
      air: {
        show: false,
        value: null,
        pin: null,
      },
      sound: {
        show: false,
        value: null,
        pin: null,
      },
      emg: {
        show: false,
        value: null,
        pin: null,
      },
      line: {
        show: false,
        detected: false,
        pin: null,
      },
      accel: {
        x: null,
        y: null,
        z: null,
        t: null,
        h: null,
        pin: null,
        show: false,
      },
    };
  },
  mounted() {
    this.lang = window.Studio.AppConfig.LANG;
    // Grove Value Change
    window.Grove.addEventListener(window.Grove.ColorSensor, this.updateColor);
    window.Grove.addEventListener(window.Grove.UltrasonicSensor, this.updateDistance);
    window.Grove.addEventListener(window.Grove.TemperatureSensor, this.updateTemperature);
    window.Grove.addEventListener(window.Grove.PIRMotionSensor, this.updatePIRMotion);
    window.Grove.addEventListener(window.Grove.GestureSensor, this.updateGesture);
    window.Grove.addEventListener(window.Grove.SlidePotentiometer, this.updateSlide);
    window.Grove.addEventListener(6, this.updateRotary);
    window.Grove.addEventListener(5, this.updateLight);
    window.Grove.addEventListener(7, this.updateAir);
    window.Grove.addEventListener(8, this.updateSound);
    window.Grove.addEventListener(9, this.updateAccel);
    window.Grove.addEventListener(18, this.updateLine);
    window.Grove.addEventListener(20, this.updateEMG);
    window.UArm.Position.addEventListener('data', this.updatePosition);
    // Grove Init
    window.Grove.addEventListener(window.Grove.ColorSensor, () => { this.color.show = true; }, 'init');
    window.Grove.addEventListener(window.Grove.UltrasonicSensor, () => { this.ultrasonic.show = true; }, 'init');
    window.Grove.addEventListener(window.Grove.TemperatureSensor, () => { this.temperature.show = true; }, 'init');
    window.Grove.addEventListener(window.Grove.PIRMotionSensor, () => { this.pir.show = true; }, 'init');
    window.Grove.addEventListener(window.Grove.GestureSensor, () => { this.gesture.show = true; }, 'init');
    window.Grove.addEventListener(window.Grove.SlidePotentiometer, () => { this.slide.show = true; }, 'init');
    window.Grove.addEventListener(6, () => { this.rotary.show = true; }, 'init');
    window.Grove.addEventListener(5, () => { this.light.show = true; }, 'init');
    window.Grove.addEventListener(7, () => { this.air.show = true; }, 'init');
    window.Grove.addEventListener(8, () => { this.sound.show = true; }, 'init');
    window.Grove.addEventListener(9, () => { this.accel.show = true; }, 'init');
    window.Grove.addEventListener(18, () => { this.line.show = true; }, 'init');
    window.Grove.addEventListener(20, () => { this.emg.show = true; }, 'init');
    window.UArm.Position.addEventListener('init', () => { this.position.show = true; });
    // Grove Stop
    window.Grove.addEventListener(window.Grove.ColorSensor, () => { this.color.show = false; }, 'stop');
    window.Grove.addEventListener(window.Grove.UltrasonicSensor, () => { this.ultrasonic.show = false; }, 'stop');
    window.Grove.addEventListener(window.Grove.TemperatureSensor, () => { this.temperature.show = false; }, 'stop');
    window.Grove.addEventListener(window.Grove.PIRMotionSensor, () => { this.pir.show = false; }, 'stop');
    window.Grove.addEventListener(window.Grove.GestureSensor, () => { this.gesture.show = false; }, 'stop');
    window.Grove.addEventListener(window.Grove.SlidePotentiometer, () => { this.slide.show = false; }, 'stop');
    window.Grove.addEventListener(6, () => { this.rotary.show = false; }, 'stop');
    window.Grove.addEventListener(5, () => { this.light.show = false; }, 'stop');
    window.Grove.addEventListener(7, () => { this.air.show = false; }, 'stop');
    window.Grove.addEventListener(8, () => { this.sound.show = false; }, 'stop');
    window.Grove.addEventListener(9, () => { this.accel.show = false; }, 'stop');
    window.Grove.addEventListener(18, () => { this.line.show = false; }, 'stop');
    window.Grove.addEventListener(20, () => { this.emg.show = false; }, 'stop');
    window.UArm.Position.addEventListener('stop', () => { this.position.show = false; });
  },
  beforeDestroy() {
    window.Grove.removeEventListener(window.Grove.ColorSensor, this.updateColor);
    window.Grove.removeEventListener(window.Grove.UltrasonicSensor, this.updateDistance);
    window.Grove.removeEventListener(window.Grove.TemperatureSensor, this.updateTemperature);
    window.Grove.removeEventListener(window.Grove.PIRMotionSensor, this.updatePIRMotion);
    window.Grove.removeEventListener(window.Grove.GestureSensor, this.updateGesture);
    window.Grove.removeEventListener(window.Grove.SlidePotentiometer, this.updateSlide);
    window.Grove.removeEventListener(6, this.updateRotary);
    window.Grove.removeEventListener(5, this.updateLight);
    window.Grove.removeEventListener(7, this.updateAir);
    window.Grove.removeEventListener(8, this.updateSound);
    window.Grove.removeEventListener(9, this.updateAccel);
    window.Grove.removeEventListener(18, this.updateLine);
    window.Grove.removeEventListener(20, this.updateEMG);
    window.UArm.Position.removeEventListener('data', this.updatePosition);
    // Grove Init
    window.Grove.removeEventListener(window.Grove.ColorSensor, () => { this.color.show = true; }, 'init');
    window.Grove.removeEventListener(window.Grove.UltrasonicSensor, () => { this.ultrasonic.show = true; }, 'init');
    window.Grove.removeEventListener(window.Grove.TemperatureSensor, () => { this.temperature.show = true; }, 'init');
    window.Grove.removeEventListener(window.Grove.PIRMotionSensor, () => { this.pir.show = true; }, 'init');
    window.Grove.removeEventListener(window.Grove.GestureSensor, () => { this.gesture.show = true; }, 'init');
    window.Grove.removeEventListener(window.Grove.SlidePotentiometer, () => { this.slide.show = true; }, 'init');
    window.Grove.removeEventListener(6, () => { this.rotary.show = true; }, 'init');
    window.Grove.removeEventListener(5, () => { this.light.show = true; }, 'init');
    window.Grove.removeEventListener(7, () => { this.air.show = true; }, 'init');
    window.Grove.removeEventListener(8, () => { this.sound.show = true; }, 'init');
    window.Grove.removeEventListener(9, () => { this.accel.show = true; }, 'init');
    window.Grove.removeEventListener(18, () => { this.line.show = true; }, 'init');
    window.Grove.removeEventListener(20, () => { this.emg.show = true; }, 'init');
    window.UArm.Position.removeEventListener('init', () => { this.position.show = true; });
    // Grove Stop
    window.Grove.removeEventListener(window.Grove.ColorSensor, () => { this.color.show = false; }, 'stop');
    window.Grove.removeEventListener(window.Grove.UltrasonicSensor, () => { this.ultrasonic.show = false; }, 'stop');
    window.Grove.removeEventListener(window.Grove.TemperatureSensor, () => { this.temperature.show = false; }, 'stop');
    window.Grove.removeEventListener(window.Grove.PIRMotionSensor, () => { this.pir.show = false; }, 'stop');
    window.Grove.removeEventListener(window.Grove.GestureSensor, () => { this.gesture.show = false; }, 'stop');
    window.Grove.removeEventListener(window.Grove.SlidePotentiometer, () => { this.slide.show = false; }, 'stop');
    window.Grove.removeEventListener(6, () => { this.rotary.show = false; }, 'stop');
    window.Grove.removeEventListener(5, () => { this.light.show = false; }, 'stop');
    window.Grove.removeEventListener(7, () => { this.air.show = false; }, 'stop');
    window.Grove.removeEventListener(8, () => { this.sound.show = false; }, 'stop');
    window.Grove.removeEventListener(9, () => { this.accel.show = false; }, 'stop');
    window.Grove.removeEventListener(18, () => { this.line.show = false; }, 'stop');
    window.Grove.removeEventListener(20, () => { this.emg.show = false; }, 'stop');
    window.UArm.Position.removeEventListener('stop', () => { this.position.show = false; });
  },
  methods: {
    updatePosition(values) {
      this.position.x = values[0];
      this.position.y = values[1];
      this.position.z = values[2];
    },
    updateColor(pin, values) {
      // console.log(`color status bar pin = ${pin}, values = ${JSON.stringify(values)}`);
      return new Promise((resolve, reject) => {
        this.color.pin = pin;
        if (values !== undefined) {
          this.color.rgb = window.Grove.getValue(pin, 'hex', values);
          this.color.hue = window.Grove.getValue(pin, 'hue', values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updateDistance(pin, values) {
      // console.log(`update Distance ultrasonic values = ${values}`)
      this.ultrasonic.pin = pin;
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          this.ultrasonic.distance = window.Grove.getValue(pin, null, values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updateTemperature(pin, values) {
      this.temperature.pin = pin;
      // console.log(`tem status bar pin = ${pin}, values = ${JSON.stringify(values)}`);
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          this.temperature.temperature = window.Grove.getValue(pin, 'temperature', values);
          this.temperature.humidity = window.Grove.getValue(pin, 'humidity', values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updatePIRMotion(pin, values) {
      this.pir.pin = pin;
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          this.pir.detected = window.Grove.getValue(pin, null, values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updateGesture(pin, values) {
      this.gesture.pin = pin;
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          this.gesture.type = window.Grove.getValue(pin, null, values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updateSlide(pin, values) {
      this.slide.pin = pin;
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          this.slide.value = window.Grove.getValue(pin, null, values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updateRotary(pin, values) {
      this.rotary.pin = pin;
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          this.rotary.value = window.Grove.getValue(pin, null, values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updateLight(pin, values) {
      this.light.pin = pin;
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          this.light.value = window.Grove.getValue(pin, null, values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updateAir(pin, values) {
      this.air.pin = pin;
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          this.air.value = window.Grove.getValue(pin, null, values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updateSound(pin, values) {
      this.sound.pin = pin;
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          this.sound.value = window.Grove.getValue(pin, null, values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updateLine(pin, values) {
      this.line.pin = pin;
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          this.line.detected = window.Grove.getValue(pin, null, values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updateEMG(pin, values) {
      this.emg.pin = pin;
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          this.emg.value = window.Grove.getValue(pin, null, values);
          resolve();
        }
        else {
          reject();
        }
      });
    },
    updateAccel(pin, values) {
      this.accel.pin = pin;
      return new Promise((resolve, reject) => {
        if (values !== undefined) {
          const v = window.Grove.getValue(pin, null, values);
          this.accel.x = Number(v[0]);
          this.accel.y = Number(v[1]);
          this.accel.z = Number(v[2]);
          this.accel.t = Number(v[3]);
          this.accel.h = Number(v[4]);
          resolve();
        }
        else {
          reject();
        }
      });
    },
  },
};
</script>

<style lang="sass" scoped>
  .sensor-wrapper {
      position: absolute;
      bottom: 12px;
      left: 10vw;
      font-size: 12px;
      display: flex;
      z-index: 9;
  }
      .grove-ul {
        border:1px solid rgba(85,85,85,0.3);
        margin:0;
        padding-top:5px;
        padding-left:0;
        background: #fff;
    }
    .grove-ul li{
        list-style: none;
        margin: 0;
        padding:3px;
    }
  .grove-ul li:last-child{
      height:26px;
      line-height: 26px;
      background:#A54F4E;
      color: #fff;
      padding: 0 34px;
      text-align: center;
    }
    .input-grove {
        position: relative;
    }
    .input-grove .grove-box {
        width: 20px;
        height: 20px;
        display: inline-block;
        position: absolute;
        left: 5px;
        top: 0px;
    }

    .grove-text {
        padding-left: 10px;
    }
  .color-text {
      padding-left: 30px;
  }
</style>
