<template lang="html">
    <div>
      <div class="text-10-01-id">
        <div>
          {{ this.$t('homePageView.getStart.getStart03Text01') }}
        </div>
      </div>
      <div class="text-10-box">
        <div class="text-10-02-id">
          {{ this.$t('homePageView.getStart.getStart10Text02') }}
        </div>
        <div class="text-10-03-id">
          {{ this.$t('homePageView.getStart.getStart10Text03') }}
        </div>
        <div class="text-10-04-id get-start-blockly-font-size">
          <div>
            {{ this.$t('homePageView.getStart.getStart10Text04') }}
          </div>
        </div>
        <div class="text-10-05-id get-start-blockly-font-size">
          <div>
            {{ this.$t('homePageView.getStart.getStart10Text05') }}
          </div>
        </div>

        <div class="text-10-06-id get-start-blockly-font-size">{{ this.$t('homePageView.getStart.getStart10Text06') }}</div>

        <img src="./assets/img/icon_3DPringting.png" class="img-10-01"/>
      </div>

      <img src="./assets/img/right_3d.png" class="img-blockly-10 get-start-img-blockly-top" />

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
      this.$parent.page = '9';
    },
    nextPage() {
      this.$parent.page = '11';
    },
  },
};
</script>
<style>
.text-10-01-id {
  color: #555555;
  font-family: Gotham-Book;
  font-size: 17px;
  position: absolute;
  top: 10%;
  width: 468px;
  text-align: center;
}
.text-10-01-id div {
  position: absolute;
  width: 187px;
  margin:0 auto;
  left: 0px;
  right: 0px;
}
.text-10-box {
  position: absolute;
  top: 30%;
}
.text-10-02-id {
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
.text-10-03-id {
  font-family: Gotham-Bold;
  font-size: 20px;
  color: #555555;
  position: absolute;
  /*left: 31px;*/
  /*width: 372px;*/
  /*top: 379px;*/
  width: 468px;
  top: 183px;
  text-align: center;
}
.text-10-04-id {
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
.text-10-04-id div {
  position: absolute;
  width: 344px;
  text-align: center;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.text-10-05-id {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  color: #555555;
  position: absolute;
  /*width: 324px;*/
  width: 468px;
  height: 40px;
  /*top: 417px;*/
  top: 275px;
  /*left: 32px;*/
  text-align:left;
  line-height: 20px;
  /*line-height: 40px;*/
}
.text-10-05-id div {
  position: absolute;
  width: 344px;
  text-align: center;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.text-10-06-id {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  position: absolute;
  /*width: 278px;*/
  width: 468px;
  height: 40px;
  left: 0px;
  /*top: 475px;*/
  top: 325px;
  /*left: 32px;*/
  text-align:center;
  /*line-height: 20px;*/
  /*line-height: 40px;*/
  font-family: .PingFangSC-Light;
  font-size: 18px;
  color: #D95E2E;
}
.text-10-05-id div {
  position: absolute;
  width: 278px;
  text-align: center;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.img-10-01 {
  position: absolute;
  width: 99px;
  height: 96px;
  left: 185px;
  /*top: 254px;*/
  top: 62px;
}
.img-blockly-10 {
  position: absolute;
  /*width: 908px;*/
  width: 55%;
  /*top: 86px;*/
  /*right: 250px;*/
  left: 450px;
}
</style>
