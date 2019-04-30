<template lang="html">
    <div>
      <div class="text-04-01-id">
        <div>
          {{ this.$t('homePageView.getStart.getStart03Text01') }}
        </div>
      </div>
      <div class="text-04-box">
        <div class="text-04-02-id">
          {{ this.$t('homePageView.getStart.getStart04Text02') }}
        </div>
        <div class="text-04-03-id">
          {{ this.$t('homePageView.getStart.getStart04Text03') }}
        </div>
        <div class="text-04-04-id get-start-blockly-font-size">
          {{ this.$t('homePageView.getStart.getStart04Text04') }}
        </div>
        <!-- <div class="text-04-05-id get-start-blockly-font-size">
          {{ this.$t('homePageView.getStart.getStart04Text05') }}
        </div> -->

        <img src="./assets/img/icon_leapmotion.svg" class="img-04-01"/>
      </div>

      <img src="./assets/img/right_leapmotion.gif" class="img-blockly-04 get-start-img-blockly-top" />

      <div class="get-start-page">
        <span>{{ page }} / {{ total }}</span>
      </div>

      <img class="get-start-prev" v-show="page !== 1" @click="$emit('prev-page')" src="./assets/img/icon_prev.svg" />
      <img class="get-start-next" v-show="page !== total" @click="$emit('next-page')" src="./assets/img/icon_next.svg" />

    </div>
</template>
<script>
module.exports = {
  props: ['total', 'page'],
  methods: {
    prevPage() {
      this.$parent.page = '3';
    },
    nextPage() {
      this.$parent.page = '5';
    },
  },
};
</script>
<style>
.text-04-01-id {
  color: #555555;
  font-family: Gotham-Book;
  font-size: 17px;
  position: absolute;
  top: 10%;
  width: 468px;
  text-align: center;
}
.text-04-01-id div {
  position: absolute;
  width: 187px;
  margin:0 auto;
  left: 0px;
  right: 0px;
}
.text-04-box {
  position: absolute;
  top: 30%;
}
.text-04-02-id {
  font-family: Gotham-Bold;
  font-size: 24px;
  color: #D95E2E;
  position: absolute;
  /*left: 31px;*/
  /*width: 372px;*/
  /*top: 196px;*/
  /*top: 86px;*/
  width: 468px;
  top:0 px;
  text-align: center;
}
.text-04-03-id {
  font-family: Gotham-Bold;
  font-size: 20px;
  color: #555555;
  position: absolute;
  /*left: 31px;*/
  width: 468px;
  /*top: 425px;*/
  top: 229px;
  text-align: center;
}
.text-04-04-id {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  color: #555555;
  position: absolute;
  /*left: 120px;*/
  /*top: 452px;*/
  top: 256px;
  /*margin:0 auto;*/
  /*width: 372px;
  left: 0px;
  right: 0px;*/
  width: 468px;
  text-align: center;
}
.text-04-05-id {
  font-family: .PingFangSC-Light;
  font-size: 18px;
  color: #D95E2E;
  position: absolute;
  top: 290px;
  width: 468px;
  text-align: center;
}
.img-04-01 {
  position: absolute;
  width: 119px;
  height: 93px;
  left: 175px;
  /*top: 281px;*/
  top: 85px;
}
.img-blockly-04 {
  position: absolute;
  /*width: 908px;*/
  width: 55%;
  /*top: 86px;*/
  /*right: 250px;*/
  left: 450px;
}
</style>
