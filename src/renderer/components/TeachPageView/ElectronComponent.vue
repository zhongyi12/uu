<template></template>
<script>
  import eventBus from './eventBus';
  const { remote } = require('electron');
  let closeWindow = false;
  export default {
    mounted() {
      // Main window close event
      window.removeEventListener('beforeunload', this.beforeunload); // avoid multiple event listener
      window.addEventListener('beforeunload', this.beforeunload);
      window.UArm.record.addEventListener('status', this.updateRecordName);
    },
    beforeDestroy() {
      window.removeEventListener('beforeunload', this.beforeunload);
      window.UArm.record.removeEventListener('status', this.updateRecordName);
    },
    methods: {
      beforeunload(evt) {
        if (closeWindow) return;
        evt.returnValue = false;

        setTimeout(() => {
          eventBus.$emit('prompt-save-record', () => {
            closeWindow = true;
            remote.getCurrentWindow().close();
          });
        });
      },
      updateRecordName(status) {
        if (status) window.Studio.UserConfig.setItem('teach', 'LastRecordName', null);
      },
    },
  };

</script>

