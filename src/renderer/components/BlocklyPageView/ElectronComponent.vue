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
      if (window.Studio.AppConfig.Channel !== 'dev') {
        window.removeEventListener('beforeunload', this.beforeunload); // avoid multiple event listener
        window.addEventListener('beforeunload', this.beforeunload);
      }
    },
    beforeDestroy() {
      if (window.Studio.AppConfig.Channel !== 'dev') {
        window.removeEventListener('beforeunload', this.beforeunload);
      }
    },
    methods: {
      beforeunload(evt) {
        if (closeWindow) return;
        evt.returnValue = false;

        setTimeout(() => {
          eventBus.$emit('prompt-save-project', () => {
            closeWindow = true;
            remote.getCurrentWindow().close();
          });
        });
//        window.Studio.UserConfig.setItem('blockly', 'LastProjectName', this.blocklyData.projectName);
      },
    },
  };

</script>

