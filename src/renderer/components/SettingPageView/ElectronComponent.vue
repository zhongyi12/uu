<template>

</template>
<script>
//  import eventBus from './eventBus';
  const { remote } = require('electron');
  let closeWindow = false;
  export default {
    props: ['allowQuit'],
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
          if (this.allowQuit) {
            closeWindow = true;
            remote.getCurrentWindow().close();
          }
//          eventBus.$emit('prompt-save-project', () => {
//            closeWindow = true;
//            remote.getCurrentWindow().close();
//          });
        });
      },
    },
  };

</script>

