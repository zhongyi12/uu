<template lang="html">
    <div>
      <div class="text-09-01-id">
        <div>
          {{ this.$t('homePageView.getStart.getStart03Text01') }}
        </div>
      </div>
      <div class="text-09-box">
        <div class="text-09-02-id">
          {{ this.$t('homePageView.getStart.getStart09Text02') }}
        </div>
        <div class="text-09-03-id">
          {{ this.$t('homePageView.getStart.getStart09Text03') }}
        </div>
        <div class="text-09-04-id get-start-blockly-font-size">
          <div>
            {{ this.$t('homePageView.getStart.getStart09Text04') }}
          </div>
        </div>
        <!-- <div class="text-09-05-id get-start-blockly-font-size">
          <div>
            Drag and drop blocks to create your robotic project
          </div>
        </div> -->
        <div class="text-09-05-id get-start-blockly-font-size">{{ this.$t('homePageView.getStart.getStart09Text05') }}</div>
        <img src="./assets/img/icon_drawlaser.png" class="img-09-01"/>
      </div>

      <!-- <div class="text-09-06-id">
        Apply movements recorded in Teach & Play section
      </div> -->

      <img src="./assets/img/right_draw.png" class="img-blockly-10 get-start-img-blockly-top" />

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
      this.$parent.page = '8';
    },
    nextPage() {
      this.$parent.page = '10';
    },
  },
};
</script>
<style>
.text-09-01-id {
  color: #555555;
  font-family: Gotham-Book;
  font-size: 17px;
  position: absolute;
  top: 10%;
  width: 468px;
  text-align: center;
}
.text-09-01-id div {
  position: absolute;
  width: 187px;
  margin:0 auto;
  left: 0px;
  right: 0px;
}
.text-09-box {
  position: absolute;
  top: 30%;
}
.text-09-02-id {
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
.text-09-03-id {
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
.text-09-04-id {
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
.text-09-04-id div {
  position: absolute;
  width: 324px;
  text-align: center;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.text-09-05-id {
  font-family: .PingFangSC-Light;
  /*font-size: 20px;*/
  position: absolute;
  /*width: 278px;*/
  width: 468px;
  height: 40px;
  /*top: 475px;*/
  top: 270px;
  /*left: 32px;*/
  text-align:center;
  /*line-height: 20px;*/
  /*line-height: 40px;*/
  font-family: .PingFangSC-Light;
  font-size: 18px;
  color: #D95E2E;
}
.text-09-05-id div {
  position: absolute;
  width: 278px;
  text-align: center;
  margin: 0 auto;
  left: 0;
  right: 0;
}
.text-09-06-id {
  font-family: .PingFangSC-Light;
  font-size: 20px;
  color: #555555;
  position: absolute;
  left: 590px;
  top: 30px;
}
.img-09-01 {
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
