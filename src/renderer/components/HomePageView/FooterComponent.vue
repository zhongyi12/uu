<template>
    <div id="footer">
        <nav class="navbar">
            <ul class="nav navbar-nav">
                <!-- <li v-if="!isNewFirmwareVersion"> -->
                <li v-if="modules.blockly === true">
                    <router-link :to="{name:'blockly'}">
                        <img width="85" height="85" src="./assets/img/icon_blockly.svg">
                        <div class="tabName">Blockly</div>
                    </router-link>
                </li>
                <!--<li v-if="uarmCheckProduct!=='swiftpro'">-->
                <li v-if="modules.control === true">
                    <router-link :to="{name:'control'}">
                        <img width="85" height="85" src="./assets/img/icon_control.svg">
                        <div class="tabName">{{ $t("homePageView.tabText.tab2") }}</div>
                    </router-link>
                </li>
                <li v-if="modules.teach === true">
                    <router-link :to="{name:'teach'}">
                        <img width="85" height="85" src="./assets/img/icon_teachandplay.svg">
                        <div class="tabName">{{ $t("homePageView.tabText.tab3") }}</div>
                    </router-link>
                </li>
                <!-- TODO: 使用配置来处理不同的机械臂类型 -->
                <!-- <li v-if="uarmCheckProduct!=='swiftpro' || isNewFirmwareVersion"> -->
                <li v-if="isNewFirmwareVersion && modules.leapmotion === true">
                    <!-- <a href="leapmotion/index_leap.html"> -->
                    <!-- <a @click="showLeap();"> -->
                    <router-link :to="{name:'leapmotion'}">
                        <img width="85" height="85" src="./assets/img/icon_leapmotion.svg">
                        <div class="tabName">Leap Motion</div>
                    </router-link>
                    <!-- </a> -->
                </li>
                <li v-if="uarmCheckProduct!=='swift' && modules.paint === true">
                    <router-link :to="{name:'paint'}">
                        <img width="85" height="85" src="./assets/img/icon_drawlaser.svg">
                        <div class="tabName">{{ $t("homePageView.tabText.tab5") }}</div>
                    </router-link>
                </li>
                <li v-if="uarmCheckProduct!=='swift' && !isNewFirmwareVersion && modules.print3d === true">
                    <router-link :to="{name:'start-3d'}">
                        <img width="85" height="85" src="./assets/img/icon_3Dprinting.svg">
                        <div class="tabName">{{ $t("homePageView.tabText.3D-Printing") }}</div>
                    </router-link>
                </li>
            </ul>
        </nav>

    </div>
</template>
<script>
module.exports = {
  data() {
    return {
      modules: window.GlobalUtil.modules,
    }
  },
  computed: {
    uarmCheckProduct() {
      return this.$store.getters.uarmInfo.productType;
    },
    isNewFirmwareVersion() {
      return window.store.state.syncConnectStatus.func.isNewFirmwareVersion();
    },
  },
};

</script>
