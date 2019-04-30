<template lang="html">
    <div>
      <div class="text-06-01-id">
        <div>
          {{ this.$t('homePageView.getStart.getStart03Text01') }}
        </div>
      </div>
      <div class="text-06-box">
        <div class="text-06-02-id">
          {{ this.$t('homePageView.getStart.getStart05Text02') }}
        </div>
        <div class="text-06-03-id">
          {{ this.$t('homePageView.getStart.getStart05Text03') }}
        </div>
        <div class="text-06-04-id get-start-blockly-font-size">
          <div>
            {{ this.$t('homePageView.getStart.getStart06Text04') }}
          </div>
        </div>
        <div class="text-06-05-id get-start-blockly-font-size">
          <div>
            {{ this.$t('homePageView.getStart.getStart06Text05') }}
          </div>
        </div>
        <img src="./assets/img/icon_blockly.svg" class="img-06-01"/>
      </div>

      <div class="text-06-06-id">
        {{ this.$t('homePageView.getStart.getStart06Text06') }}
      </div>

      <img src="./assets/img/right_blockly_2.gif" class="img-blockly-06 get-start-img-blockly-top" />

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
      this.$parent.page = '5';
    },
    nextPage() {
      this.$parent.page = '7';
    },
  },
};
</script>
<style>
.text-06-01-id {
  color: #555555;
  font-family: Gotham-Book;
  font-size: 17px;
  position: absolute;
  top: 10%;
  width: 468px;
  text-align: center;
}
.text-06-01-id div {
  position: absolute;
  width: 187px;
  margin:0 auto;
  left: 0px;
  right: 0px;
}
.text-06-box {
  position: absolute;
  top: 30%;
}
.text-06-02-id {
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
.text-06-03-id {
  font-family: Gotham-Bold;
  font-size: 20px;
  color: #555555;
  position: absolute;
  /*left: 31px;*/
  /*width: 372px;*/
  /*top: 379px;*/
  top: 183px;
  width: 468px;
  text-align: center;
}

.text-06-04-id {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  color: #555555;
  position: absolute;
  /*width: 324px;*/
  width: 468px;
  height: 40px;
  /*top: 417px;*/
  top: 221px;
  /*left: 32px;*/
  text-align:left;
  line-height: 20px;
  /*line-height: 40px;*/
}
.text-06-04-id div {
  position: absolute;
  width: 324px;
  text-align: center;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.text-06-05-id {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  color: #555555;
  position: absolute;
  /*width: 278px;*/
  width: 468px;
  height: 40px;
  /*top: 475px;*/
  top: 279px;
  /*left: 32px;*/
  text-align:left;
  line-height: 20px;
  /*line-height: 40px;*/
}
.text-06-05-id div {
  position: absolute;
  width: 278px;
  text-align: center;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.text-06-06-id {
  font-family: .PingFangSC-Light;
  font-size: 20px;
  color: #555555;
  position: absolute;
  left: 690px;
  /*top: 37px;*/
  top: 3%;
}
.img-06-01 {
  position: absolute;
  width: 99px;
  height: 96px;
  left: 180px;
  /*top: 254px;*/
  top: 62px;
}
.img-blockly-06 {
  position: absolute;
  /*width: 908px;*/
  width: 55%;
  /*top: 86px;*/
  /*right: 250px;*/
  left: 450px;
}
</style>
