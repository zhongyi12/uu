<template>

</template>
<script>
  import eventBus from './eventBus';
  const { remote } = require('electron');
  let closeWindow = false;
  export default {
    props: ['blocklyData'],
    mounted() {
      // Main window close event
      window.removeEventListener('beforeunload', this.beforeunload); // avoid multiple event listener
      window.addEventListener('beforeunload', this.beforeunload);
    },
    beforeDestroy() {
      window.removeEventListener('beforeunload', this.beforeunload);
    },
    methods: {
      beforeunload(evt) {
        if (closeWindow) return;
        evt.returnValue = false;

        setTimeout(() => {
          eventBus.$emit('prompt-save-on-quit', () => {
            closeWindow = true;
            remote.getCurrentWindow().close();
          });
        });
//        window.Studio.UserConfig.setItem('blockly', 'LastProjectName', this.blocklyData.projectName);
      },
    },
  };

</script>

