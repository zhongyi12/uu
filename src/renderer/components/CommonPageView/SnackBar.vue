<template lang="html">
    <mu-snackbar v-if="snackBarDisplayFlag" action="Close" :message="snackBarDisplayMessage" @actionClick="hideSnackbar" @close="hideSnackbar" />
    <!--<mu-snackbar v-if="snackBarDisplayFlag" action="Close" :message="snackBarDisplayMessage" />-->
</template>
<script>
module.exports = {
  methods: {
    hideSnackbar() {
      this.$store.dispatch('hideSnackBar');
    },
  },
  computed: {
    snackBarDisplayFlag() {
      return this.$store.getters.snackBarData.snackBarDisplayFlag;
    },
    snackBarDisplayMessage() {
      return this.$store.getters.snackBarData.snackBarDisplayMessage;
    },
  },
  watch: {
  },
};

</script>

<style>
</style>
