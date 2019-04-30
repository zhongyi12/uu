<template lang="html">
    <div>
      <div class="text-08-01-id">
        <div>
          {{ this.$t('homePageView.getStart.getStart03Text01') }}
        </div>
      </div>
      <div class="text-08-box">
        <div class="text-08-02-id">
          {{ this.$t('homePageView.getStart.getStart05Text02') }}
        </div>
        <div class="text-08-03-id">
          {{ this.$t('homePageView.getStart.getStart08Text03') }}
        </div>
        <div class="text-08-04-id get-start-blockly-font-size">
          <div>
            {{ this.$t('homePageView.getStart.getStart08Text04') }}
          </div>
        </div>
        <div class="text-08-05-id get-start-blockly-font-size">
          <div>
            {{ this.$t('homePageView.getStart.getStart08Text05') }}
          </div>
        </div>
        <img src="./assets/img/icon_teach_play.svg" class="img-08-01"/>
      </div>

      <img src="./assets/img/right_teach_play.gif" class="img-blockly-08 get-start-img-blockly-top" />

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
      this.$parent.page = '7';
    },
    nextPage() {
      this.$parent.page = '9';
    },
  },
};
</script>
<style>
.text-08-01-id {
  color: #555555;
  font-family: Gotham-Book;
  font-size: 17px;
  position: absolute;
  top: 10%;
  width: 468px;
  text-align: center;
}
.text-08-01-id div {
  position: absolute;
  width: 187px;
  margin:0 auto;
  left: 0px;
  right: 0px;
}
.text-08-box {
  position: absolute;
  top: 30%;
}
.text-08-02-id {
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
.text-08-03-id {
  font-family: Gotham-Bold;
  font-size: 20px;
  color: #555555;
  position: absolute;
  /*left: 31px;*/
  /*width: 372px;*/
  width: 468px;
  /*top: 399px;*/
  top: 203px;
  text-align: center;
}

.text-08-04-id {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  color: #555555;
  position: absolute;
  /*width: 324px;
  height: 40px;*/
  /*top: 432px;*/
  /*width: 372px;*/
  width: 468px;
  top: 236px;
  /*left: 49px;*/
  text-align:left;
  line-height: 20px;
  /*line-height: 40px;*/
}
.text-08-04-id div {
  position: absolute;
  width: 324px;
  text-align: center;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.text-08-05-id {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  color: #555555;
  position: absolute;
  /*width: 326px;*/
  width: 468px;
  height: 40px;
  /*top: 464px;*/
  top: 268px;
  /*left: 49px;*/
  text-align:left;
  line-height: 20px;
  /*line-height: 40px;*/
}
.text-08-05-id div {
  position: absolute;
  width: 180px;
  text-align: center;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.img-08-01 {
  position: absolute;
  width: 119px;
  height: 112px;
  left: 170px;
  /*top: 248px;*/
  top: 52px;
}
.img-blockly-08 {
  position: absolute;
  /*width: 908px;*/
  width: 55%;
  /*top: 86px;*/
  /*right: 250px;*/
  left: 450px;
}
</style>
