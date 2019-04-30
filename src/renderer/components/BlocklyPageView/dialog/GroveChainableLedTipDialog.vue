<template>
    <mu-dialog  :open="dialogVisible" dialogClass="colorPickerDialog" :title="$t('title')">
      <ColorPickerComponent v-model="colors"/>
      <mu-flat-button label="OK"  @click="closeEvent()" slot="actions" backgroundColor="#52BF53" color="#fff"/>
    </mu-dialog>
</template>
<script>
  import EventBus from '../eventBus';
  // import BlocklyLib from '../assets/lib/blockly/uarm/blockly_lib';
  import { Chrome } from 'vue-color';
  const defaultProps = {
    hex: '#194d33',
    hsl: {
      h: 150,
      s: 0.5,
      l: 0.2,
      a: 1,
    },
    hsv: {
      h: 150,
      s: 0.66,
      v: 0.30,
      a: 1,
    },
    rgba: {
      r: 25,
      g: 77,
      b: 51,
      a: 1,
    },
    a: 1,
  };
  module.exports = {
    i18n: {
      messages: {
        en: {
          title: 'Pick A Color',
        },
        cn: {
          title: '选一个颜色',
        },
      },
    },
    components: {
      ColorPickerComponent: Chrome,
    },
    data() {
      return {
        blockNames: [
          'control_grove_chainable_led_rgb',
          'control_grove_chainable_led_hsl',
          'rgb_array',
          'hsl_array',
        ],
        currentBlock: null,
        colors: defaultProps,
        dialogVisible: false,
      };
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
    },
    watch: {
    },
    methods: {
      closeEvent() {
        this.dialogVisible = false;
        this.currentBlock.setValue(this.colors.rgba.r, this.colors.rgba.g, this.colors.rgba.b);
      },
      openEvent() {
        this.dialogVisible = true;
      },
      // closeColorDialog(save) {
      //   this.dialogVisible = false;
      //   if (save) {
      //     if (this.currentBlock !== null) {
      //       if (this.currentBlock.setValue !== undefined) this.currentBlock.setValue(this.colors.hex);
      //     }
      //   }
      // },
      // colors_panel_toggle() {
      //   this.colors_panel = !this.colors_panel;
      // },
    },
  };
</script>
<style lang="sass">
  .colorPickerDialog {
    max-width: 340px;
    max-height:450px;
    padding-bottom: 16px;
    .mu-dialog-title {
       padding:16px;
    }
    .mu-dialog-body {
        padding:0 20px;
     }
     .vc-chrome {
      width: auto;
     }
    .mu-flat-button {
      border-radius: 2px;
      max-height: 30px !important;
    }
  }
</style>