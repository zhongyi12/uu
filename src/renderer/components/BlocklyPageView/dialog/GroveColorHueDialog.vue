<template>
    <mu-dialog  :open="dialogVisible" dialogClass="color-dialog" >
        <mu-menu desktop listClass="mu-menu-color">
            <div class="color-edit">
                <div class="question-tip" v-show="question_tip && language === 'en'">
                    <p>1. Put the object in front of Color Sensor, and you'll see the detected hue value on the screen.</p>
                    <p>2. Please define the color by inputting the range of hue value.</p>
                    <ul>Notes:
                        <li>Hue value perceived by the sensor will vary according to the impact of the environment (background color, brightness, etc).</li>
                        <li>You may increase/decrease the tolerance of the  sensor by modifying the range of hue value.</li>
                        <li>It's recommended to use Color Sensor with a white, clear and bright background.</li>
                    </ul>
                </div>
                <div class="question-tip" v-show="question_tip && language === 'cn'">
                    <p>1. 把物体放在颜色传感器前，你会看到屏幕上检测到的色相值.</p>
                    <p>2. 请输入色相值的范围来定义颜色.</p>
                    <ul>提示:
                        <li>传感器感知的色相值根据环境的影响(背景色、亮度等)变化</li>
                        <li>你可以通过修改色相值的范围来增加/降低传感器的容差.</li>
                        <li>建议让传感器在干净、明亮的背景下识别颜色</li>
                    </ul>
                </div>
                <div class="color-range-wrapper">
                    <div class="question-icon-wrapper">
                        <mu-avatar slot="left" :src="question_icon"  color="orange200" backgroundColor="pink400" :size="20" class="question-icon" @click="question_tip_toggle()"/>
                    </div>
                    <label>{{ $t('hueRange') }}</label>
                    <input class="color-range" v-bind:class="{ active: isActive}" type="number" :disabled="!editMode" v-model.number="minHue"/>
                    <span class="connect-line">-</span>
                    <input class="color-range" v-bind:class="{ active: isActive}" :disabled="!editMode"  v-model.number="maxHue" type="number"/>
                    <mu-icon value="mode_edit" @click="changeEditState()" :size="20" :iconSize="16" />
                </div>
                <!--<div class="color-range-wrapper">-->
                <!--<label>Hue Detected:</label><span class="hue-detected">{{currentColorHue}}</span>-->
                <!--</div>-->
                <div class="color-range-wrapper">
                    <div class="color-box" v-bind:style="{ 'background-color': `hsl(${currentColorHue}, 100%, 50%)` }"></div>
                    <span class="color-text">{{ $t('hueDetected') }}<span>{{currentColorHue}}</span>   </span>
                </div>
                <div class="btn-wrapper">
                    <mu-raised-button :label="$t('cancel')"  @click="closeColorDialog(false)" backgroundColor="#C3C4C6"/>
                    <mu-raised-button :label="$t('save')"  @click="closeColorDialog(true)" backgroundColor="#52BF53"/>
                </div>
                <mu-list-item class="color-spectrum" :title="$t('colorSpectrum')" @click="colors_panel_toggle()">
                    <mu-avatar slot="left" :src="icon_colors" :size="20" />
                </mu-list-item>
                <div class="colors-panel-wrapper" v-show="colors_panel">
                    <img :src="colors_panel_img"/>
                </div>
            </div>
        </mu-menu>
    </mu-dialog>
</template>
<script>
  import EventBus from '../eventBus';
  module.exports = {
    i18n: {
      messages: {
        en: {
          hueRange: 'Hue Range',
          hueDetected: 'Hue Detected',
          colorSpectrum: 'Check complete color spectrum',
          save: 'Save',
          cancel: 'Cancel',
        },
        cn: {
          hueRange: '色调范围',
          hueDetected: '颜色检测',
          colorSpectrum: '查看所有颜色光谱',
          save: '保存',
          cancel: '取消',
        },
      },
    },
    data() {
      return {
        blockName: 'grove_color_hue_range',
        dialogVisible: false,
        dontShowAgain: false,
        editMode: false,
        isActive: false,
        currentColorHue: 0,
        minHue: 0,
        maxHue: 0,
        question_tip: false,
        icon_colors: require('../assets/dialog/GroveColorHueDialog/icon_colors.svg'),
        colors_panel_img: require('../assets/dialog/GroveColorHueDialog/color_sensor.png'),
        question_icon: require('../assets/dialog/GroveColorHueDialog/icon_question.svg'),
        colors_panel: false,
        color_panel_open: false,
        currentBlock: null,
        language: 'en',
      };
    },
    beforeDestroy() {
      EventBus.$off();
    },
    mounted() {
      EventBus.$on(`dialog-${this.blockName}`, (currBlock) => {
        this.currentBlock = currBlock;
        this.openEvent();
      });
      this.language = this.$t('language');
    },
    watch: {
      currentColorHue() {
        if (!this.editMode) {
          let minHue = this.minHue;
          let maxHue = this.maxHue;
          const currHue = this.currentColorHue;
          minHue = currHue - 5;
          maxHue = currHue + 5;
          if (minHue <= 0) minHue = 360 - Math.abs(minHue);
          if (maxHue <= 0) maxHue = 360 - Math.abs(maxHue);
          this.minHue = minHue;
          this.maxHue = maxHue;
        }
      },
    },
    methods: {
      question_tip_toggle() {
        this.question_tip = !this.question_tip;
      },
      closeEvent() {
        this.dialogVisible = false;
      },
      changeEditState() {
        this.editMode = !this.editMode;
        this.isActive = !this.isActive;
      },
      openEvent() {
        this.dialogVisible = true;
        window.UArm.Grove.addEventListener(window.UArm.Grove.ColorSensor, this.updateColor);
      },
      closeColorDialog(save) {
        this.dialogVisible = false;
        window.UArm.Grove.removeEventListener(window.UArm.Grove.ColorSensor, this.updateColor);
        if (save) {
          if (this.currentBlock !== null) {
            if (this.currentBlock.setValue !== undefined) this.currentBlock.setValue(this.minHue, this.maxHue);
          }
        }
      },
      colors_panel_toggle() {
        this.colors_panel = !this.colors_panel;
      },
      updateColor(pin, values) {
        console.log(`dialog color pin = ${pin}, values = ${JSON.stringify(values)}`);
        return new Promise((resolve, reject) => {
          if (values !== undefined) {
            this.currentColorHue = window.Grove.getValue(pin, 'hue', values);
            resolve();
          }
          else {
            this.currentColorHue = 0;
            reject();
          }
        });
      },
    },
  };
</script>
<style lang="sass" scoped>
.color-dialog {
    position: absolute;
    top:30%;
    left:30%;
    min-width: 250px;
    max-width:384px;
    .mu-menu {
        margin:0 auto;
        max-width: 384px;
    }
    .mu-menu-color {
        min-width: 250px;
        max-width:300px;
        margin:0 auto;
        .color-edit {
            padding-top:25px;
            color: #4D5967;
            font-size:12px;
            label {
                text-align:left;
                padding-left:25px;
                padding-right:20px;
                font-weight: normal;
            }
            input{
                outline: 0;
                -webkit-border-radius:2px;
                -moz-border-radius:2px;
                border-radius:2px;
                border: 1px solid #CECECE;
                padding:2px 10px;
                color: #555;
                background:#fff;
                font-size:14px;
                height:30px;
                width:60px ! important;
            }
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button{
                -webkit-appearance: none !important;
                margin: 0;
            }
            .question-icon-wrapper {
                position: absolute;
                left: 50px;
                top: 15%;
                width:30px;
                height:30px;
                .question-icon {
                background-color: #fff !important;
                cursor: pointer;
                width:100%;
                }
            }
            .color-range-wrapper {
                 line-height:36px;
                padding-left: 50px;
                .connect-line {
                    padding:0 4px;
                }
                .color-range {
                    width:70px;
                }
                .active {
                    border:1px solid #4A90E2;
                    background: #fff;
                }
                .mu-icon {
                    cursor: pointer;
                    margin-left: 8px;
                    position: absolute;
                    top: 13%;
                }
                .color-box {
                    width: 18px;
                    height: 18px;
                    display: inline-block;
                    vertical-align: middle;
                }
                .color-text {
                    display:inline-block;
                    padding-left: 4px;
                    span{
                        padding-left:20px;
                    }
                }
            }
            .btn-wrapper {
                width:80%;
                margin:18px auto 10px;
                text-align: center;
                display: flex;
                justify-content: space-around;
                button {
                    height:30px ! important;
                    line-height: 30px ! important;
                    font-size: 12px !important;
                }
                .mu-flat-button {
                    color: #fff;
                    -webkit-border-radius:4px;
                    -moz-border-radius:2px;
                    border-radius:4px;
                    .mu-flat-button-label {
                         font-size:12px;
                    }
                }
            }
            .colors-panel-wrapper {
                width:70%;
                position: absolute;
                top:-9%;
                right:-71%;
                img {
                     width:80%;
                }
            }
            .question-tip {
                padding:2vw;
                max-width:390px;
                width:390px;
                position: absolute;
                top:0;
                left:-102%;
                background: #fff;
                border: 1px solid #E4E4E4;
                border-radius: 8px;
                ul {
                    margin:0;
                    padding:0;
                    li {
                        margin-left:20px;
                        line-height: 24px;
                        margin-top:10px;
                    }
                }
            }
            .color-spectrum {
               display: flex;
               justify-content: center;
            }
        }
    }
}
</style>