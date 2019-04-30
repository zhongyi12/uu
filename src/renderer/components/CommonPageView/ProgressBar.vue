<template lang="html">
      <mu-dialog :open="showDialog" :title="dialogTitle">
        <mu-flexbox wrap="nowrap">
            <mu-flexbox-item grow="0">
            </mu-flexbox-item>
            <mu-flexbox-item grow="10">
                <mu-linear-progress mode="determinate" :value="progressValue" color="#D95E2E"/>
            </mu-flexbox-item>
            <mu-flexbox-item grow="1">
                {{progressValue}}%
            </mu-flexbox-item>
        </mu-flexbox>
        <mu-flexbox>
            <mu-flexbox-item>
            </mu-flexbox-item>
        </mu-flexbox>
        <mu-flat-button label="OK" slot="actions" primary @click="closeDialog" v-show="showCloseButton"/>
  </mu-dialog>
</template>
<script>
module.exports = {
  methods: {
    closeDialog() {
      this.$store.dispatch('hideProgressBar');
    },
  },
  computed: {
    showDialog() {
      return this.$store.getters.progressBarData.progressBarShowFlag;
    },
    dialogTitle() {
      return this.$store.getters.progressBarData.progressBarTitle;
    },
    showDialogCloseButton() {

    },
    progressValue() {
      return this.$store.getters.progressBarData.progress;
    },
    showCloseButton() {
      return this.$store.getters.progressBarData.showCloseButton;
    },
  },
  watch: {
  },
};

</script>

<style>
</style>
