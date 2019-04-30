<template>
    <mu-dialog  :open="dialogVisible" dialogClass="oledPickerDialog" :title="$t('title')">
    <div class="pixel-div" @mouseup="onMouseDown = false">
        <table class="pixel-table" @mouseup="onMouseDown = true" id="pixelTable">
        <tr v-for="(r, ri) in pixelData">
            <td v-for="(c, ci) in r">
              <div class="pixel-box">
               <div :class="['select-box', c === 1 ? 'fill' : 'blank']"
               @click="click(ri, ci)"
               @mouseover="mouseOver(ri, ci)"
               @mousedown="mousedown(ri, ci)"
               > </div>
               </div>
            </td>
        </tr>
        </table>
      </div>
      <mu-raised-button label="Clear"  @click="clearData" slot="actions"/>
      <mu-raised-button label="OK"  @click="closeEvent()" slot="actions" />
    </mu-dialog>
</template>
<script>
  import EventBus from '../eventBus';
  import html2canvas from 'html2canvas';
  import _ from 'lodash';
  import BlocklyLib from '../assets/lib/blockly/uarm/blockly_lib';
  function initData(row, cols) {
    const data = [];
    for (let r = 0; r < row; r++) {
      data[r] = [];
      for (let c = 0; c < cols; c++) {
        data[r][c] = 0;
      }
    }
    return data;
  }
  module.exports = {
    i18n: {
      messages: {
        en: {
          title: 'Make Pixels',
        },
        cn: {
          title: 'Make Pixels',
        },
      },
    },
    data() {
      return {
        blockNames: [
          'control_grove_oled',
          'pixels',
        ],
        currentBlock: null,
        dialogVisible: false,
        row: 8,
        cols: 16,
        pixelData: [],
        pixelCanvas: null,
        dataURL: null,
        onMouseDown: false,
      };
    },
    created() {
      this.clearData();
    // console.log(JSON.stringify(this.pixelData));
    },
    beforeDestroy() {
      EventBus.$off();
    },
    mounted() {
      this.blockNames.forEach((blockName) => {
        EventBus.$on(`dialog-${blockName}`, (currBlock) => {
          this.currentBlock = currBlock;
          this.openEvent();
        });
      });
//      EventBus.$on(`dialog-tip-${this.blockName}`, (currBlock) => {
//        this.currentBlock = currBlock;
//        this.openEvent();
//      });
//      EventBus.$on(`dialog-tip-${this.blockName}`1, (currBlock) => {
//        this.currentBlock = currBlock;
//        this.openEvent();
//      });
      // this.showGrid(initData(this.row, this.cols));
    },
    methods: {
      closeEvent() {
        this.dialogVisible = false;
        this.saveImage((base64) => {
          this.currentBlock.setValue(BlocklyLib.bin2hex(this.pixelData), base64);
        });
      },
      openEvent() {
        this.dialogVisible = true;
      },
      saveImage(callback) {
        const pixelTable = document.getElementById('pixelTable');
        html2canvas(pixelTable, {
          onrendered(canvas) {
            // this.dataURL = canvas.toDataURL();
            callback(canvas.toDataURL());
            // console.log(this.dataURL);
          },
        });
      },
      click(row, cols) {
        const deep = _.cloneDeep(this.pixelData[row]);
        deep[cols] = 1;
        this.$set(this.pixelData, row, deep);
      },
      mousedown(row, cols) {
        this.onMouseDown = true;
        this.click(row, cols);
      },
      mouseOver(row, cols) {
        if (this.onMouseDown) {
          this.click(row, cols);
        }
      },
      clearData() {
        this.pixelData = initData(this.row, this.cols);
      },
    },
  };
</script>
<style lang="sass">
  .oledPickerDialog {
    width: 420px;
    padding-bottom: 16px;
    background-color: #E37D7D !important;
    .mu-dialog-title {
       color: #fff;
       margin: 0;
       padding: 14px 0;
    }
    .mu-dialog-body {
        padding:0 20px;
     }
    .mu-dialog-actions {
        justify-content: space-around;
        margin-top: 20px;
        .mu-raised-button {
          opacity: 0.8;
          background: rgba(255,255,255,0.35);
          border-radius: 2px;
          max-height: 30px !important;
          color: #6f3938;
          font-size: 14px;
        }
        .hover {
            color: #fff;
            background-color:#6f3938;
        }

    }
  }
</style>
 <style lang="sass" scoped>
 .pixel-table {
     margin-left: auto;
     margin-right: auto;
     border: 0px;
     padding:4px;
 }
     .pixel-div {
         text-align: center;
 }
     .pixel-box {
         display: table-cell;
         vertical-align: middle;
         width: 16px;
         height:16px;
         padding:4px;
 }

     .select-box {
         width: 16px;
         height: 16px;
         margin: 0 auto;
 }

     .fill {
         background-color: rgb(111, 57, 56);
 }
     .blank {
         background-color: white;
 }
 </style>