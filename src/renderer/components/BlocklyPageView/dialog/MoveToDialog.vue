<template>
    <mu-dialog :open="dialogVisible" :title="$t('title')" dialogClass="modal-custom">
        <div class="s9 modal1">
            <div class="modal-left">
                <img src="../assets/dialog/MoveToDialog/moveto_img.svg" alt="">
                <div class="modal-lefttext" v-text="$t('leftText')"></div>
            </div>
            <div class="modal-right">
                <div class="modal-group">
                    <label for="moveX">X</label>
                    <input id="moveX" :disabled="disableInput" v-model.number="moveX" type="number" class="validate" placeholder="">
                </div>
                <div class="modal-group">
                    <label for="moveY">Y</label>
                    <input id="moveY" :disabled="disableInput" v-model.number="moveY" type="number" class="validate" placeholder="">
                </div>
                <div class="modal-group">
                    <label for="moveZ">Z</label>
                    <input id="moveZ" :disabled="disableInput" v-model.number="moveZ" type="number" class="validate" placeholder="">
                </div>
                <div class="enable-edit" @click="editEvent()">
                    <mu-icon value="mode_edit" :size="22"/>
                </div>
            </div>
        </div>
        <!-- <mu-flat-button slot="actions" @click="closeModals()" primary label="cancel"/> -->
        <div class="button-wrapper">
            <mu-raised-button slot="actions" primary @click="closeEvent()" :label="$t('buttonOK')" backgroundColor="#52BF53" />
        </div>

    </mu-dialog>
</template>
<script>
  import EventBus from '../eventBus';
  module.exports = {
    i18n: {
      messages: {
        en: {
          example: 'Example',
          gotIt: 'Got it',
          title: 'Move to',
          leftText: 'Drag uArm to a destination',
          buttonOK: 'Ok',
        },
        cn: {
          example: '举例',
          gotIt: 'OK',
          title: '移动到',
          leftText: '将uArm拖拽到任意位置',
          buttonOK: 'OK',
        },
      },
    },
    data() {
      return {
        blockName: 'move_to',
        dialogVisible: false,
        disableInput: true,
        moveX: 0,
        moveY: 150,
        moveZ: 150,
        currentBlock: null,
      };
    },
    beforeDestroy() {
      EventBus.$off();
    },
    mounted() {
      EventBus.$on(`dialog-tip-${this.blockName}`, (currBlock) => {
        this.dialogVisible = true;
        this.currentBlock = currBlock;
        this.openEvent();
      });
    },
    methods: {
      openEvent() {
        window.UArm.set_servo_detach({ detachAll: true });
        window.UArm.start_report_position();
      },
      editEvent() {
        this.disableInput = false;
        window.UArm.set_servo_attach({
          attachAll: true,
        });
      },
      closeEvent() {
        this.dialogVisible = false;
        window.UArm.set_servo_attach({
          attachAll: true,
        });
        window.UArm.stop_report_position();
        const pos = [this.moveX, this.moveY, this.moveZ];
        if (this.currentBlock !== null) {
          if (this.currentBlock.setValue !== null) this.currentBlock.setValue(pos);
        }
      },
    },
    computed: {
      socketConnectStatus() {
        return this.$store.getters.uarmStatus.socketConnection;
      },
      uarmConnectStatus() {
        return this.$store.getters.uarmStatus.usbConnection;
      },
      cameraConnectStatus() {
        return this.$store.getters.uarmStatus.cameraConnection;
      },
      uarmInfo() {
        return this.$store.getters.uarmInfo;
      },
    },
    watch: {
      'uarmInfo.currentX'() {
        this.moveX = this.uarmInfo.currentX;
      },
      'uarmInfo.currentY'() {
        this.moveY = this.uarmInfo.currentY;
      },
      'uarmInfo.currentZ'() {
        this.moveZ = this.uarmInfo.currentZ;
      },
    },
  };
</script>
<style lang="sass" scoped>
  .modal-custom input[type=number] {
        margin: 0;
        background: white;
        border: 1px solid #D2D2D2;
        border-radius: 1px;
        height: 30px;
        width:100px;
        padding: 0;
        text-align: center;
    }
    .modal-custom input[disabled] {
        background: #F5F5F5; }
    .modal-custom input[type=number]:focus {
        border-bottom: 1px solid #D2D2D2;
        box-shadow: none;
        background: white; }
    .modal-custom td {
        line-height: 2rem;
        padding: 2px; }
    .modal-custom .row {
        margin-top: 20px;
        margin-bottom: 0; }
    .modal1 {
        justify-content:space-between;
        margin: 1vw 5vw 3vw ;
        display: flex;
        align-items: center;
        label {
            margin: 0 2px;
            font-weight: 300;
            font-size: 1rem;
            padding: 0.3vw 2vw;
        }
        .modal-group {
            display: flex;
        }
        .enable-edit {
            position:absolute;
            right:0;
            top:-4vh;
            cursor: pointer;
            padding: 0 12px;
        }
        .input-field {
            text-align: left;
        }
        .modal-left {
            width:50%;
        }
        .modal-right{
            position:relative;
            width: 40%;
            display: flex;
            flex-direction: column;
            font-size: 1.8vw;
            align-items: center;
            justify-content: center;
            img{
                width: 27vw;
        }
    }
  }
  .button-wrapper {
      margin-bottom: 30px;
  }
</style>