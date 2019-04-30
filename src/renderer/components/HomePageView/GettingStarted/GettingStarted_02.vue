<template lang="html">
    <div>
      <div class="text-02-01-id">
        {{ this.$t('homePageView.getStart.getStart01Text01') }}
      </div>
      <div class="text-02-02-id">
        {{ this.$t('homePageView.getStart.getStart02Text02') }}
      </div>
      <!-- <div id="text-02-03-id">Install the end-effector you want.</div> -->
      <div @click="openDownloadUrl()" class="text-02-04-id">
        {{ this.$t('homePageView.getStart.getStart02Text03') }}
      </div>
      <div class="img-02-wrapper">
        <img src="./assets/img/img_suction_cup.png" class="img-02 img-02-01" />
        <img src="./assets/img/img_gripper.png" class="img-02 img-02-02" />
        <img src="./assets/img/img_universal_holder.png" class="img-02 img-02-03" />
        <img src="./assets/img/img_3D.svg" class="img-02 img-02-04" />
        <img src="./assets/img/img_laser.svg" class="img-02 img-02-05" />
        <div class="tips">
          {{ this.$t('homePageView.getStart.getStart02Text04') }}
        </div>
        <div class="line1">
        </div>
        <div class="line2">
        </div>
      </div>

      <div class="get-start-page">
        <span>{{ page }} / {{ total }}</span>
      </div>

      <img class="get-start-prev" v-show="page !== 1" @click="$emit('prev-page')" src="./assets/img/icon_prev.svg" />
      <img class="get-start-next" v-show="page !== total" @click="$emit('next-page')" src="./assets/img/icon_next.svg" />

    </div>
</template>
<script>
import { shell } from 'electron';
module.exports = {
  props: ['total', 'page'],
  methods: {
    prevPage() {
      this.$parent.page = '1';
    },
    nextPage() {
      this.$parent.page = '3';
    },
    openDownloadUrl() {
      console.log('open Download Url');
      const url = `http://ufactory.cc/#/${this.$t('language')}/support`;
      shell.openExternal(url);
    },
  },
};
</script>
<style>
.text-02-01-id {
  font-family: .PingFangSC-Regular;
  font-size: 20px;
  color: #555555;
  /*top: 57px;*/
  top: 10%;
  position: absolute;
  margin:0 auto;
  width: 500px;
  text-align: center;
  left: 0px;
  right: 0px;
  /*left: 485px;
  */
}
.text-02-02-id {
  font-family: Gotham-Bold;
  font-size: 24px;
  color: #D95E2E;
  /*top: 106px;*/
  top: 20%;
  position: absolute;
  margin:0 auto;
  width: 500px;
  text-align: center;
  left: 0px;
  right: 0px;
}
.text-02-03-id {
  font-family: .PingFangSC-Regular;
  font-size: 20px;
  color: #555555;
  top: 483px;
  position: absolute;
  margin:0 auto;
  width: 500px;
  text-align: center;
  left: 0px;
  right: 0px;
}
.text-02-04-id {
  font-family: .PingFangSC-Regular;
  font-size: 20px;
  color: #D95E2E;
  /*top: 509px;*/
  /*top: 90%;*/
  bottom: 30px;
  position: absolute;
  margin:0 auto;
  width: 500px;
  text-align: center;
  left: 0px;
  right: 0px;
  cursor: pointer;
  text-decoration:underline
}
.img-02-wrapper {
  position: absolute;
  top: 32%;
  width: 1128px;
  left: 0px;
  right: 0px;
  margin:0 auto;
}
.img-02-wrapper .tips {
  position: absolute;
  font-family: .PingFangSC-Regular;
  font-size: 16px;
  color: #D95E2E;
  letter-spacing: 0;
  width: 185px;
  top: 275px;
  right: 120px;
  text-align: center;
  /*background: yellow;*/
}
.img-02-wrapper .line1 {
  position: absolute;
  /*background: yellow;*/
  width: 18px;
  height: 28px;
  right: 305px;
  top: 262px;
  border-left: 1px #D95E2E solid;
  border-bottom: 1px #D95E2E solid;
}
.img-02-wrapper .line2 {
  position: absolute;
  /*background: yellow;*/
  width: 18px;
  height: 28px;
  right: 100px;
  top: 262px;
  border-right: 1px #D95E2E solid;
  border-bottom: 1px #D95E2E solid;
}
.img-02 {
  position: absolute;
  width: 188px;
  height: 264px;
}
.img-02-01 {
  left: 152px;
  /*top: 156px;*/
  /*top: 32%;*/
  left: 0px;
  /*right: 0px;*/
  /*margin:0 auto;*/
}
.img-02-02 {
  /*left: 534px;*/
  /*top: 156px;*/
  /*top: 32%;*/
  left: 235px;
  /*right: 0px;*/
  /*margin:0 auto;*/
  /*margin-top: 156px;*/
}
.img-02-03 {
  left: 916px;
  /*top: 156px;*/
  /*top: 32%;*/
  left: 0px;
  right: 0px;
  margin:0 auto;
}
.img-02-04 {
  /*left: 916px;*/
  /*top: 156px;*/
  /*top: 32%;*/
  /*left: 700px;*/
  /*right: 0px;*/
  right: 235px;
  /*margin:0 auto;*/
}
.img-02-05 {
  /*left: 916px;*/
  /*top: 156px;*/
  /*top: 32%;*/
  /*left: 700px;*/
  right: 0px;
  /*margin:0 auto;*/
}
</style>
