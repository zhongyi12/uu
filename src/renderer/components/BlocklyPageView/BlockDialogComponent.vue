<template>
    <div>
        <MoveToDialog></MoveToDialog>
        <ButtonDialog></ButtonDialog>
        <RecordDialog></RecordDialog>
        <MoveDialog></MoveDialog>
        <TipSensorDialog></TipSensorDialog>
        <GroveGestureDialog></GroveGestureDialog>
        <GroveColorTipDialog></GroveColorTipDialog>
        <GroveUltrasonicDialog></GroveUltrasonicDialog>
        <GroveColorHueDialog></GroveColorHueDialog>
        <GroveInstallationDialog></GroveInstallationDialog>
        <GroveMiniFanDialog></GroveMiniFanDialog>
        <GroveTemperatureDialog></GroveTemperatureDialog>
        <GroveElectromagnetDialog></GroveElectromagnetDialog>
        <GrovePirDialog></GrovePirDialog>
        <GroveButtonDialog></GroveButtonDialog>
        <GrovePotentiometerDialog></GrovePotentiometerDialog>
        <GroveAccelerometerDialog></GroveAccelerometerDialog>
        <GroveAirQualityDialog></GroveAirQualityDialog>
        <GroveSpeakerDialog></GroveSpeakerDialog>
        <GroveEmgDetectorDialog></GroveEmgDetectorDialog>
        <GroveLightDialog></GroveLightDialog>
        <GroveRotaryAngleDialog></GroveRotaryAngleDialog>
        <GroveSoundDialog></GroveSoundDialog>
        <GroveMotorDialog></GroveMotorDialog>
	      <GroveChainableLedDialog></GroveChainableLedDialog>
        <GroveChainableLedTipDialog></GroveChainableLedTipDialog>
        <GroveOledTipDialog></GroveOledTipDialog>
        <GroveOledDialog></GroveOledDialog>
        <GroveLcdDialog></GroveLcdDialog>
        <GroveLineFinderDialog></GroveLineFinderDialog>
    </div>
</template>
<script>
  import './assets/css/dialog.scss';
  import EventBus from './eventBus';
  import MoveToDialog from './dialog/MoveToDialog.vue';
  import ButtonDialog from './dialog/ButtonDialog.vue';
  import RecordDialog from './dialog/RecordDialog.vue';
  import MoveDialog from './dialog/MoveDialog.vue';
  import TipSensorDialog from './dialog/TipSensorDialog.vue';
  import GroveGestureDialog from './dialog/GroveGestureDialog.vue';
  import GroveColorTipDialog from './dialog/GroveColorTipDialog.vue';
  import GroveUltrasonicDialog from './dialog/GroveUltrasonicDialog.vue';
  import GroveColorHueDialog from './dialog/GroveColorHueDialog.vue';
  import GroveInstallationDialog from './dialog/GroveInstallationDialog.vue';
  import GroveMiniFanDialog from './dialog/GroveMiniFanDialog.vue';
  import GroveTemperatureDialog from './dialog/GroveTemperatureDialog.vue';
  import GroveElectromagnetDialog from './dialog/GroveElectromagnetDialog.vue';
  import GrovePirDialog from './dialog/GrovePirDialog.vue';
  import GroveChainableLedDialog from './dialog/GroveChainableLedDialog.vue';
  import GroveChainableLedTipDialog from './dialog/GroveChainableLedTipDialog.vue';
  import GroveButtonDialog from './dialog/GroveButtonDialog.vue';
  import GrovePotentiometerDialog from './dialog/GrovePotentiometerDialog.vue';
  import GroveAccelerometerDialog from './dialog/GroveAccelerometerDialog.vue';
  import GroveAirQualityDialog from './dialog/GroveAirQualityDialog.vue';
  import GroveSpeakerDialog from './dialog/GroveSpeakerDialog.vue';
  import GroveEmgDetectorDialog from './dialog/GroveEmgDetectorDialog.vue';
  import GroveLightDialog from './dialog/GroveLightDialog.vue';
  import GroveRotaryAngleDialog from './dialog/GroveRotaryAngleDialog.vue';
  import GroveSoundDialog from './dialog/GroveSoundDialog.vue';
  import GroveMotorDialog from './dialog/GroveMotorDialog.vue';
  import GroveOledDialog from './dialog/GroveOledDialog.vue';
  import GroveOledTipDialog from './dialog/GroveOledTipDialog.vue';
  import GroveLcdDialog from './dialog/GroveLcdDialog.vue';
  import GroveLineFinderDialog from './dialog/GroveLineFinderDialog.vue';
  module.exports = {
    props: ['moduleName'],
    components: {
      MoveToDialog,
      ButtonDialog,
      RecordDialog,
      MoveDialog,
      TipSensorDialog,
      GroveGestureDialog,
      GroveColorTipDialog,
      GroveUltrasonicDialog,
      GroveColorHueDialog,
      GroveInstallationDialog,
      GroveMiniFanDialog,
      GroveTemperatureDialog,
      GroveElectromagnetDialog,
      GrovePirDialog,
      GroveButtonDialog,
      GrovePotentiometerDialog,
      GroveAccelerometerDialog,
      GroveAirQualityDialog,
      GroveSpeakerDialog,
      GroveEmgDetectorDialog,
      GroveLightDialog,
      GroveRotaryAngleDialog,
      GroveMotorDialog,
      GroveSoundDialog,
      GroveChainableLedDialog,
      GroveChainableLedTipDialog,
      GroveOledDialog,
      GroveOledTipDialog,
      GroveLcdDialog,
      GroveLineFinderDialog,
    },
    beforeDestroy() {
      EventBus.$off();
    },
    mounted() {
      EventBus.$on('dialog-show-again', (blockName, value) => {
        window.UserConfig.setItem(this.moduleName, `dialog-tip-${blockName}`, value);
        window.UserConfig.setItem(this.moduleName, `dialog-category-tip-${blockName}`, value);
      });
    },
  };
</script>
