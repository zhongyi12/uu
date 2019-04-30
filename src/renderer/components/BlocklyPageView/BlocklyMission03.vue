<template>
  <div class="mission-wrapper">
    <ul class="step">
      <li>
        {{ this.$t('BlocklyPageView.mission.mission03Text01') }}
        <ul class="step_1">
          <li>
            {{ this.$t('BlocklyPageView.mission.mission03Text02') }}
            <span style="color:#D95E2E;">
              {{ this.$t('BlocklyPageView.mission.mission03Text02A') }}
            </span>
            {{ this.$t('BlocklyPageView.mission.mission03Text03') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission03Text04') }}
          </li>
          <div class="img_2">
            <img v-show="language === 'cn'" src="./assets/image/cn_mission3_01.gif" class="img_gif" />
            <img v-show="language === 'en'" src="./assets/image/mission3.1.gif" class="img_gif" />
          </div>
        </ul>
      </li>
      <li>
        {{ this.$t('BlocklyPageView.mission.mission03Text05') }}
        <ul class="step_1">
          <li>
            {{ this.$t('BlocklyPageView.mission.mission03Text06') }}
          </li>
          <div class="img_2">
            <img v-show="language === 'en'" src="./assets/image/mission3.2.gif" class="img_gif" />
            <img v-show="language === 'cn'" src="./assets/image/cn_mission3_02.gif" class="img_gif" />
          </div>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission03Text07') }}
            <img src="./assets/image/svg_icon_start.svg" width="17px" height="21px" class="play_icon" />
            {{ this.$t('BlocklyPageView.mission.mission03Text08') }}
          </li>
        </ul>
      </li>
      <li>
        {{ this.$t('BlocklyPageView.mission.mission03Text09') }}
        <ul class="step_1">
          <li>
            {{ this.$t('BlocklyPageView.mission.mission03Text10') }}
          </li>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission03Text11') }}
          </li>
          <div style="color:#D95E2E;">
            {{ this.$t('BlocklyPageView.mission.mission03Text12') }}
          </div>
          <li>
            {{ this.$t('BlocklyPageView.mission.mission03Text13') }}
            <img src="./assets/image/svg_icon_start.svg" width="17px" height="21px" class="play_icon" />
            {{ this.$t('BlocklyPageView.mission.mission03Text14') }}
          </li>
          <div class="img_2">
            <img src="./assets/image/mission3.3.gif" class="img_gif" />
          </div>
        </ul>
      </li>
      <li>
        {{ this.$t('BlocklyPageView.mission.mission03Text15') }}
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
