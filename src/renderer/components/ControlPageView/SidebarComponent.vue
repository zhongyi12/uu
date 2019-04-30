<template lang="html">
  <div class="s12 side-wrapper">
    <div class="hardware-wrapper">
        <div class="hardware-status">
          <div class="uarm-name">
            <img src="./assets/img/uarmswift.svg" alt="uarm name" />
          </div>
          <span :class="connection ? 'label label-success' : 'label label-default'">{{connection ? 'Connected' : 'Disconnected'}}</span>
        </div>
        <table class="table">
          <tr>
            <td>X</td><td>{{model.localCtrlMgr.cData.x}}</td>
          </tr>
          <tr>
            <td>Y</td><td>{{model.localCtrlMgr.cData.y}}</td>
          </tr>
          <tr>
            <td>Z</td><td>{{model.localCtrlMgr.cData.z}}</td>
          </tr>
          <tr>
            <td>R</td><td>{{model.localCtrlMgr.cData.r}}</td>
          </tr>
          <tr>
            <td>rotation</td><td>{{rotation}}</td>
          </tr><tr>
            <td>stretch</td><td>{{stretch}}</td>
          </tr>
        </table>
      </div>
    </div>
</template>

<script>
export default {
  props: ['rotation', 'stretch', 'connection'],
  data() {
    return {
      model: window.GlobalUtil.model,
    };
  },
};

</script>

<style lang="css">
</style>
