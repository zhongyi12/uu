<template lang="html">
  <div>
    <div class="text-01-id">
      {{ this.$t('homePageView.getStart.getStart01Text01') }}
      <img src="./assets/img/icon_small triangle_black.svg">
    </div>
    <div class="text-01-02-id">
      {{ this.$t('homePageView.getStart.getStart01Text02') }}
    </div>
    <div class="text-01-box">
      <div class="text-01-03-id">
        {{ this.$t('homePageView.getStart.getStart01Text02A') }}
      </div>
      <div class="text-01-04-id text-01-detail get-start-blockly-font-size">
        {{ this.$t('homePageView.getStart.getStart01Text03') }}
      </div>
      <div class="text-01-05-id text-01-detail get-start-blockly-font-size">
        {{ this.$t('homePageView.getStart.getStart01Text04') }}
      </div>
      <div class="text-01-06-id text-01-detail get-start-blockly-font-size">
        {{ this.$t('homePageView.getStart.getStart01Text05') }}
      </div>
    </div>

    <img src="./assets/img/image_base.png" class="img-01" />
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
    // prevPage() {
    //   this.$parent.page = '1';
    // },
    nextPage() {
      this.$parent.page = '2';
    },
  },
};
</script>
<style>
.text-01-id {
  position: absolute;
  /*left: 89px;*/
  /*top: 60px;*/
  top: 10%;
  width: 560px;
  left: 0px;
  text-align: center;
  font-family: Gotham-Book;
  font-size: 18px;
  color: #555555;
}
.text-01-id img {
  position: absolute;
  text-align: center;
  margin: 0 auto;
  left: 0px;
  right: 0px;
  top: 25px;
}
.text-01-box {
  position: absolute;
  top: 55%;
}
.text-01-02-id {
  font-family: Gotham-Bold;
  font-size: 24px;
  color: #D95E2E;
  position: absolute;
  /*width: 400px;
  left: 107.5px;*/
  /*top: 222px;*/
  /*top: 0px;*/
  top: 25%;
  width: 560px;
  left: 0px;
  text-align: center;
}
.text-01-03-id {
  font-family: Gotham-Bold;
  font-size: 20px;
  color: #555555;
  position: absolute;
  /*width: 400px;
  left: 108px;*/
  /*top: 348px;*/
  /*top: 126px;*/
  top: 0px;
  width: 560px;
  left: 0px;
  text-align: center;
}
.text-01-detail {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  color: #555555;
}
.text-01-04-id {
  position: absolute;
  left: 112px;
  /*width: 400px;*/
  /*top: 376px;*/
  /*top: 154px;*/
  top: 54px;
  width: 560px;
  left: 0px;
  text-align: center;
}
.text-01-05-id {
  position: absolute;
  left: 112px;
  /*width: 400px;*/
  /*top: 403px;*/
  /*top: 181px;*/
  top: 87px;
  width: 560px;
  left: 0px;
  text-align: center;
}
.text-01-06-id {
  position: absolute;
  left: 109px;
  /*width: 400px;*/
  /*top: 427px;*/
  top: 120px;
  width: 560px;
  left: 0px;
  text-align: center;
}
.img-01 {
  position: absolute;
  height: 90%;
  /*width: 658px;
  height: 670px;*/
  top: 0px;
  /*left: 510px;*/
  right: 112px;
}
</style>
