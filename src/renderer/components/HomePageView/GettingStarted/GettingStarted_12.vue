<template lang="html">
    <div class='page-wrapper'>
      <div class="text-12-01-id">
        {{ this.$t('homePageView.getStart.getStart12Text01') }}
      </div>
      <div class="text-12-02-id">
        {{ this.$t('homePageView.getStart.getStart12Text02') }}
      </div>

      <div class="img-12-icon-wrapper">

        <div class="line1">
        </div>
        <div class="line2">
        </div>

        <div class="text-tips-12-01">
          {{ this.$t('homePageView.getStart.getStart12Text03') }}
        </div>
        <div class="text-tips-12-02">
          {{ this.$t('homePageView.getStart.getStart12Text04') }}
        </div>

        <router-link :to="{name: modules.blockly === true ? 'blockly' : ''}" :style="{opacity: modules.blockly === true ? 1 : 0.3}">
          <div class="img-12-01">
            <img src="./assets/img/last_page_blockly.svg" class="img-12-01 img-12-0" />
            <div class="text-12-title text-12-title-location">
              {{ this.$t('homePageView.getStart.getStart12Text05') }}
            </div>
          </div>
        </router-link>
        <router-link :to="{name: modules.control === true ? 'control' : ''}" :style="{opacity: modules.control === true ? 1 : 0.3}">
          <div class="img-12-03">
            <img src="./assets/img/last_page_control.svg" class="img-12-03 img-12-0" />
            <div class="text-12-title text-12-title-location">
              {{ this.$t('homePageView.getStart.getStart12Text06') }}
            </div>
          </div>
        </router-link>

        <router-link :to="{name: modules.teach === true ? 'teach' : ''}" :style="{opacity: modules.teach === true ? 1 : 0.3}">
          <div class="img-12-02">
            <img src="./assets/img/last_page_teach_play.svg" class="img-12-02 img-12-0" />
            <div class="text-12-title text-12-title-location">
              {{ this.$t('homePageView.getStart.getStart12Text07') }}
            </div>
          </div>
        </router-link>
        <router-link :to="{name: modules.paint === true ? 'paint' : ''}" :style="{opacity: modules.paint === true ? 1 : 0.3}">
          <div class="img-12-06">
            <img src="./assets/img/icon_drawlaser.png" class="img-12-06 img-12-0" />
            <div class="text-12-title text-12-title-location">
              {{ this.$t('homePageView.getStart.getStart12Text08') }}
            </div>
          </div>
        </router-link>
        <router-link :to="{name: modules.leapmotion === true ? 'leapmotion' : ''}" :style="{opacity: modules.leapmotion === true ? 1 : 0.3}">
          <div class="img-12-04">
            <img src="./assets/img/last_page_leap_motion.svg" class="img-12-04 img-12-0" />
            <div class="text-12-title text-12-title-location">
              {{ this.$t('homePageView.getStart.getStart12Text09') }}
            </div>
          </div>
        </router-link>

        <div class="img-12-05" @click="modules.print3d === true ? to3DPring(): ''" :style="{opacity: modules.print3d === true ? 1 : 0.3}">
          <img src="./assets/img/icon_3DPringting.png" class="img-12-05 img-12-0" />
          <div class="text-12-title text-12-title-location">
            {{ this.$t('homePageView.getStart.getStart12Text10') }}
          </div>
        </div>

      </div>

      <div class="get-start-page">
        <span>{{ page }} / {{ total }}</span>
      </div>

      <img class="get-start-prev" v-show="page !== 1" @click="$emit('prev-page')" src="./assets/img/icon_prev.svg" />
      <img class="get-start-next" v-show="page !== total" @click="$emit('next-page')" src="./assets/img/icon_next.svg" />
      <!-- <img class="get-start-prev" @click="prevPage()" src="./assets/img/icon_prev.svg" /> -->
      <!-- <img class="get-start-next" @click="nextPage()" src="./assets/img/icon_next.svg" /> -->

      <!-- <div id="text-12-03-id">Blockly</div> -->
      <!-- <div id="text-12-04-id" class="text-12-title">Teach & Play</div> -->
      <!-- <div id="text-12-05-id" class="text-12-title">Control</div> -->
      <!-- <div id="text-12-06-id" class="text-12-title">Leap motion</div> -->
    </div>
</template>
<script>
module.exports = {
  props: ['total', 'page'],
  data() {
    return {
      modules: window.GlobalUtil.modules,
    }
  },
  methods: {
    prevPage() {
      this.$parent.page = '11';
    },
    // nextPage() {
    //   this.$parent.page = '4';
    // },
    // showLeap() {
    //   console.log('show leap 1');
    //   this.$parent.leapShow = true;
    //   // if (document.getElementById('leap-frame').src === null || document.getElementById('leap-frame').src === '') {
    //   //   console.log('leap2 leap2 init');
    //   //   document.getElementById('leap-frame').src = 'leapmotion/index_leap.html';
    //   // }
    //   console.log(this.$parent.leapShow);
    //   this.$router.push({ name: 'home-page', params: { leapmotion: 'true' } });
    //   console.log('show leap 2');
    // },
    to3DPring() {
      console.log('productType');
      console.log(this.$store.getters.uarmInfo.productType);
      this.$router.push({ name: 'start-3d' });
    },
  },
  computed: {
    uarmProductType() {
      return this.$store.getters.uarmInfo.productType;
    },
  },
};
</script>
<style>
.next {
  margin-left: 0px;
  margin-top: 0px;
}
.text-12-01-id {
  font-family: Gotham-Book;
  font-size: 24px;
  color: #555555;
  letter-spacing: -0.8px;
  /*position: absolute;
  left: 586px;*/
  /*top: 57px;*/
  top: 4%;
  position: absolute;
  margin:0 auto;
  width: 500px;
  text-align: center;
  left: 0px;
  right: 0px;
}
.text-12-02-id {
  font-family: Gotham-Bold;
  font-size: 24px;
  color: #D95E2E;
  /*position: absolute;
  left: 510px;*/
  /*top: 110px;*/
  top: 13%;
  position: absolute;
  margin:0 auto;
  width: 500px;
  text-align: center;
  left: 0px;
  right: 0px;
}
.img-12-icon-wrapper {
  position: absolute;
  width: 875px;
  height: 400px;
  margin: 0 auto;
  top: 26%;
  left: 0;
  right: 0;
  /*background: yellow;*/
}
.img-12-01 {
  position: absolute;
  /*width: 122px;*/
  width: 110px;
  /*left: 148px;*/
  /*top: 242px;*/
  top: 50px;
  margin:0 auto;
  left: 0px;
  right: 0px;
}
.img-12-02 {
  position: absolute;
  width: 118px;
  /*height: 123px;*/
  /*top: 371px;*/
  /*top: 60%;*/
  top: 230px;
  margin:0 auto;
  left: 0px;
  right: 0px;
  /*left: 385px;*/
}
.img-12-03 {
  position: absolute;
  /*width: 128px;*/
  /*height: 132px;*/
  width: 110px;
  /*left: 666px;*/
  margin:0 auto;
  /*left: 200px;*/
  /*right: 0px;*/
  /*top: 232px;*/
  /*top: 43%;*/
  top: 50px;
  left: 0px;
}
.img-12-04 {
  position: absolute;
  width: 130px;
  /*height: 109px;*/
  /*left: 996px;*/
  /*top: 368px;*/
  /*top: 65%;*/
  top: 230px;
  margin:0 auto;
  left: 0px;
  /*right: 0px;*/
}
.img-12-05 {
  position: absolute;
  /*width: 141px;*/
  /*height: 109px;*/
  /*left: 996px;*/
  /*top: 368px;*/
  /*top: 65%;*/
  width: 110px;
  top: 230px;
  margin:0 auto;
  right: 0px;
  cursor: pointer;
  /*right: 0px;*/
}
.img-12-06 {
  position: absolute;
  width: 110px;
  /*width: 109px;*/
  /*height: 109px;*/
  /*left: 996px;*/
  /*top: 368px;*/
  /*top: 65%;*/
  top: 50px;
  margin:0 auto;
  right: 0px;
  /*right: 0px;*/
}
.img-12-0 {
  left: 0;
  top: 0;
}
.text-12-title {
  font-family: PingFangSC-Regular;
  font-size: 11.25px;
  color: #000000;
  letter-spacing: 0.72px;
  text-shadow: 0 1px 1px rgba(0,0,0,0.50);
}
.text-12-title-location {
  position: relative;
  width: 100px;
  margin:0 auto;
  text-align: center;
  z-index: 5px;
  margin-top:130px;
}
.text-12-03-id {
  position: absolute;
  left: 183px;
  top: 374px;
}
.text-12-04-id {
  position: absolute;
  left: 400px;
  top: 512px;
}
.text-12-05-id {
  position: absolute;
  left: 715px;
  top: 385px;
}
.text-12-06-id {
  position: absolute;
  left: 1036px;
  top: 504px;
}
.text-tips-12-01 {
  position: absolute;
  top: 0px;
  font-family: Gotham-Book;
  font-size: 18px;
  color: #D95E2E;
  letter-spacing: -0.6px;
  width: 130px;
  text-align: center;
  left: 180px;
  background: white;
  z-index: 5px;
}
.text-tips-12-02 {
  position: absolute;
  top: 0px;
  right: 0px;
  font-family: Gotham-Book;
  font-size: 18px;
  color: #D95E2E;
  letter-spacing: -0.6px;
  width: 160px;
  text-align: center;
  right: 180px;
  background: white;
  z-index: 5px;
}
.img-12-icon-wrapper .line1 {
  position: absolute;
  /*background: yellow;*/
  margin: 0 auto;
  left: 0px;
  right: 0px;
  width: 740px;
  height: 25px;
  /*right: 305px;*/
  top: 10px;
  border-left: 1px #D95E2E solid;
  border-right: 1px #D95E2E solid;
  border-top: 1px #D95E2E solid;
}
.img-12-icon-wrapper .line2 {
  position: absolute;
  /*background: yellow;*/
  margin: 0 auto;
  left: 0px;
  right: 0px;
  width: 1px;
  height: 25px;
  /*right: 305px;*/
  top: 10px;
  background: #D95E2E;
  /*border-left: 1px #D95E2E solid;
  border-right: 1px #D95E2E solid;
  border-top: 1px #D95E2E solid;*/
}
</style>
