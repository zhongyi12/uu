<template lang="html">
    <div class='page-wrapper'>
      <div class="text-11-01-id">
        {{ this.$t('homePageView.getStart.getStart11Text01') }}
      </div>
      <div class="text-11-02-id">
        {{ this.$t('homePageView.getStart.getStart11Text02') }}
      </div>
      <div class="text-11-03-id">
        {{ this.$t('homePageView.getStart.getStart11Text03') }}
      </div>

      <div class="text-11-04-id orange-text-09">
        {{ this.$t('homePageView.getStart.getStart11Text04') }}
      </div>
      <div class="text-11-05-id orange-text-09">
        {{ this.$t('homePageView.getStart.getStart11Text05') }}
      </div>
      <div class="text-11-06-id orange-text-09">
        {{ this.$t('homePageView.getStart.getStart11Text06') }}
      </div>

      <img src="./assets/img/icon_save.svg" class="img-09 img-11-01" />
      <img src="./assets/img/Icon_export.svg" class="img-09 img-11-02" />
      <img src="./assets/img/Icon_import.svg" class="img-09 img-11-03" />

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
      this.$parent.page = '10';
    },
    nextPage() {
      this.$parent.page = '12';
    },
  },
};
</script>
<style>
.text-11-01-id {
  font-family: Gotham-Book;
  font-size: 20px;
  color: #555555;
  /*position: absolute;
  left: 555px;*/
  /*top: 57px;*/
  top: 10%;
  position: absolute;
  margin:0 auto;
  width: 500px;
  text-align: center;
  left: 0px;
  right: 0px;
}
.text-11-02-id {
  font-family: .PingFangSC-Regular;
  font-size: 18px;
  color: #555555;
  /*position: absolute;
  left: 512px;*/
  /*top: 443px;*/
  top: 78%;
  position: absolute;
  margin:0 auto;
  width: 500px;
  text-align: center;
  left: 0px;
  right: 0px;
}
.text-11-03-id {
  font-family: .PingFangSC-Regular;
  font-size: 18px;
  color: #555555;
  /*position: absolute;
  left: 479px;*/
  /*top: 480px;*/
  top: 85%;
  position: absolute;
  margin:0 auto;
  width: 500px;
  text-align: center;
  left: 0px;
  right: 0px;
}
.orange-text-09 {
  font-family: Gotham-Bold;
  font-size: 24px;
  color: #D95E2E;
}
.text-11-04-id {
  /*position: absolute;
  left: 173px;*/
  /*top: 160px;*/
  top: 30%;
  position: absolute;
  margin:0 auto;
  width: 500px;
  text-align: center;
  left: -700px;
  right: 0px;
}
.text-11-05-id {
  /*position: absolute;
  left: 511px;*/
  /*top: 160px;*/
  top: 30%;
  position: absolute;
  margin:0 auto;
  width: 250px;
  text-align: center;
  left: 0px;
  right: 0px;
}
.text-11-06-id {
  /*position: absolute;
  left: 867px;*/
  /*top: 160px;*/
  top: 30%;
  position: absolute;
  margin:0 auto;
  width: 500px;
  text-align: center;
  left: 0px;
  right: -720px;
}
.img-09 {

}
.img-11-01 {
  /*position: absolute;*/
  width: 102px;
  height: 102px;
  /*left: 229px;*/
  /*left: 200px;*/
  /*top: 242px;*/
  top: 45%;
  position: absolute;
  margin:0 auto;
  text-align: center;
  left: -700px;
  right: 0px;
}
.img-11-02 {
  /*position: absolute;*/
  width: 100px;
  height: 107px;
  /*left: 580px;*/
  /*left: 560px;*/
  /*top: 242px;*/
  top: 45%;
  position: absolute;
  margin:0 auto;
  text-align: center;
  left: 0px;
  right: 0px;
}
.img-11-03 {
  /*position: absolute;*/
  width: 113px;
  height: 106px;
  /*left: 945px;*/
  /*left: 925px;*/
  /*top: 242px;*/
  top: 45%;
  position: absolute;
  margin:0 auto;
  text-align: center;
  left: 0px;
  right: -700px;
}
</style>
