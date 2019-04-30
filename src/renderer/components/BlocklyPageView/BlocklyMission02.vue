<template>
  <div class="mission-wrapper">
    <ul class="step">
      <li>
        {{ this.$t('BlocklyPageView.mission.mission02Text01') }}
        <ul class="step_1">
          <li>{{ this.$t('BlocklyPageView.mission.mission02Text02') }}</li>
        </ul>
      </li>
      <li>
        {{ this.$t('BlocklyPageView.mission.mission02Text03') }}
        <ul class="step_1">
          <li>
            {{ this.$t('BlocklyPageView.mission.mission02Text04') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission02Text05') }}
          </li>
          <div style="color:#D95E2E;">
            {{ this.$t('BlocklyPageView.mission.mission02Text06') }}
          </div>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission02Text07') }}
          </li>
          <div class="img_2">
            <img v-show="language === 'en'" src="./assets/image/mission2.1.gif" class="img_gif" />
            <img v-show="language === 'cn'" src="./assets/image/cn_mission2_01.gif" class="img_gif" />
          </div>
        </ul>
      </li>
      <li>
        {{ this.$t('BlocklyPageView.mission.mission02Text08') }}
        <ul class="step_1">
          <li>
            {{ this.$t('BlocklyPageView.mission.mission02Text09') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission02Text10') }}
          </li>
          <div class="img_2">
            <img v-show="language === 'en'" src="./assets/image/mission2.2.gif" class="img_gif" />
            <img v-show="language === 'cn'" src="./assets/image/cn_mission2_02.gif" class="img_gif" />
          </div>
        </ul>
      </li>
      <li>
        {{ this.$t('BlocklyPageView.mission.mission02Text11') }}
        <ul class="step_1">
          <li>
            {{ this.$t('BlocklyPageView.mission.mission02Text12') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission02Text13') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission02Text14') }}
          </li>
        </ul>
      </li>
      <li>
        {{ this.$t('BlocklyPageView.mission.mission02Text15') }}
        <ul class="step_1">
          <li>
            {{ this.$t('BlocklyPageView.mission.mission02Text16') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission02Text17') }}
            <img src="./assets/image/svg_icon_start.svg" width="17px" height="21px" class="play_icon" />
            {{ this.$t('BlocklyPageView.mission.mission02Text18') }}
          </li>
          <div class="img_2">
            <img v-show="language === 'en'" src="./assets/image/mission2.3.gif" class="img_gif" />
            <img v-show="language === 'cn'" src="./assets/image/cn_mission2_03.gif" class="img_gif" />
          </div>
        </ul>
      </li>
      <li>
        {{ this.$t('BlocklyPageView.mission.mission02Text19') }}
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
