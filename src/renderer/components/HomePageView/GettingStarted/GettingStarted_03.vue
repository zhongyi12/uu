<template lang="html">
    <div>
      <div class="text-03-01-id">
        <div>
          {{ this.$t('homePageView.getStart.getStart03Text01') }}
        </div>
      </div>
      <div class="text-03-box">
        <div class="text-03-02-id">
          {{ this.$t('homePageView.getStart.getStart03Text02') }}
        </div>
        <div class="text-03-03-id">
          {{ this.$t('homePageView.getStart.getStart03Text03') }}
        </div>
        <div class="text-03-04-id get-start-blockly-font-size">
          {{ this.$t('homePageView.getStart.getStart03Text04') }}
        </div>
        <!-- <div class="text-03-05-id get-start-blockly-font-size">
          {{ this.$t('homePageView.getStart.getStart03Text05') }}
        </div> -->
        <!-- <div class="text-03-06-id get-start-blockly-font-size">
          {{ this.$t('homePageView.getStart.getStart03Text06') }}
        </div> -->

        <img src="./assets/img/icon_control.svg" class="img-03-01"/>
      </div>
      <img src="./assets/img/right_control.gif" class="img-blockly-03 get-start-img-blockly-top" />
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
      this.$parent.page = '2';
    },
    nextPage() {
      this.$parent.page = '4';
    },
  },
};
</script>
<style>
.text-03-box {
  position: absolute;
  top: 30%;
}
.text-03-01-id {
  color: #555555;
  font-family: Gotham-Book;
  font-size: 17px;
  position: absolute;
  top: 10%;
  width: 468px;
  text-align: center;
  /*top: 0px;*/
  /*width: 372px;*/
  /*height: 86px;*/
  /*line-height: 86px;*/
}
.text-03-01-id div {
  position: absolute;
  width: 187px;
  margin:0 auto;
  left: 0px;
  right: 0px;
}
/*-196*/
.text-03-02-id {
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
.text-03-03-id {
  font-family: Gotham-Bold;
  font-size: 20px;
  color: #555555;
  position: absolute;
  /*left: 31px;*/
  /*width: 372px;*/
  /*width: 500px;*/
  width: 468px;
  top: 425px;
  /*top: 312px;*/
  top: 226px;
  text-align: center;
}
.text-03-04-id {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  color: #555555;
  position: absolute;
  /*left: 107px;*/
  margin:0 auto;
  /*left: 0px;
  right: 0px;*/
  width: 468px;
  /*width: 500px;*/
  /*top: 452px;*/
  /*top: 342px;*/
  top: 256px;
  text-align: center;
}
.text-03-05-id {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  color: #555555;
  position: absolute;
  /*left: 107px;*/
  width: 468px;
  margin:0 auto;
  /*left: 0px;
  right: 0px;*/
  /*width: 372px;*/
  /*top: 481px;*/
  /*top: 371px;*/
  top: 285px;
  text-align: center;
}
.text-03-06-id {
  font-family: .PingFangSC-Light;
  font-size: 18px;
  color: #D95E2E;
  position: absolute;
  top: 315px;
  width: 468px;
  text-align: center;
}
.img-03-01 {
  position: absolute;
  width: 93px;
  height: 97px;
  left: 180px;
  /*top: 276px;*/
  /*top: 166px;*/
  top: 80px;
}
.img-blockly-03 {
  position: absolute;
  /*width: 908px;*/
  width: 55%;
  /*top: 86px;*/
  /*right: 250px;*/
  left: 450px;
  /*margin-top: 86px;
  margin-right: 50px;
  margin-left: 372px;*/
}
</style>
