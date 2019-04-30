<template>
  <div class="mission-wrapper">
    <div class="content_top">
      {{ this.$t('BlocklyPageView.mission.mission01Text01') }}
    </div>
    <div class="img_1">
      <!-- <img src="./assets/image/svg_image_base.svg" width="178px" height="212px" /> -->
      <img src="./assets/image/img_base.png" width="178px" height="212px" />
    </div>
    <ul class="step">
      <li>
        {{ this.$t('BlocklyPageView.mission.mission01Text02') }}
        <ul class="step_1">
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text03') }}
          </li>
        </ul>
      </li>
      <li>
        {{ this.$t('BlocklyPageView.mission.mission01Text04') }}
        <ul class="step_1">
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text05') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text05A') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text06') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text07') }}
            <img src="./assets/image/svg_icon_start.svg" width="17px" height="21px" class="play_icon" />
            {{ this.$t('BlocklyPageView.mission.mission01Text08') }}
          </li>
          <div class="img_2">
            <img v-show="language === 'en'" src="./assets/image/mission1.1.gif" class="img_gif" />
            <img v-show="language === 'cn'" src="./assets/image/cn_mission1_01.gif" class="img_gif" />
          </div>
        </ul>
      </li>
    </ul>
    <ul class="step">
      <li>
        {{ this.$t('BlocklyPageView.mission.mission01Text09') }}
        <ul class="step_1">
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text10') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text11') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text12') }}
            <img src="./assets/image/svg_icon_start.svg" width="17px" height="21px" class="play_icon" />
            {{ this.$t('BlocklyPageView.mission.mission01Text13') }}
          </li>
          <div class="img_2">
            <img v-show="language === 'en'" src="./assets/image/mission1.2.gif" class="img_gif" />
            <img v-show="language === 'cn'" src="./assets/image/cn_mission1_02.gif" class="img_gif" />
          </div>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text14') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text15') }}
            <img src="./assets/image/svg_icon_start.svg" width="17px" height="21px" class="play_icon" />
            {{ this.$t('BlocklyPageView.mission.mission01Text16') }}
          </li>
          <div class="img_2">
            <img v-show="language === 'en'" src="./assets/image/mission1.3.gif" class="img_gif" />
            <img v-show="language === 'cn'" src="./assets/image/cn_mission1_03.gif" class="img_gif" />
          </div>
        </ul>
      </li>
    </ul>
    <ul class="step">
      <li>
        {{ this.$t('BlocklyPageView.mission.mission01Text17') }}
        <ul class="step_1">
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text18') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission01Text19') }}
            <img src="./assets/image/svg_icon_start.svg" width="17px" height="21px" class="play_icon" />
            {{ this.$t('BlocklyPageView.mission.mission01Text20') }}
          </li>
          <div class="img_2">
            <img v-show="language === 'en'" src="./assets/image/mission1.4.gif" class="img_gif" />
            <img v-show="language === 'cn'" src="./assets/image/cn_mission1_04.gif" class="img_gif" />
          </div>
        </ul>
      </li>
    </ul>
    <ul class="step">
      <li>
        {{ this.$t('BlocklyPageView.mission.mission01Text21') }}
        <div class="img_2">
          <img v-show="language === 'en'" src="./assets/image/mission1.5.gif" class="img_gif" />
          <img v-show="language === 'cn'" src="./assets/image/cn_mission1_05.gif" class="img_gif" />
        </div>
      </li>
    </ul>
    <br/>
    <br/>
    <br/>
    <br/>
  </div>
</template>
<script>
import './assets/css/mission.scss';
module.exports = {
  data() {
    return {
      language: 'en',
    };
  },
  mounted() {
    this.language = this.$t('language');
  },
};
</script>
