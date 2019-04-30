<template lang="html">
  <div class="content-wrapper">
    <div class="get-start-wrapper">
      <GettingStarted_01 v-if="page === getPage(GettingStarted_01)" :total="total" :page="getPage(GettingStarted_01)" v-on:prev-page="prevPage" v-on:next-page="nextPage"></GettingStarted_01>
      <GettingStarted_02 v-if="page === getPage(GettingStarted_02)" :total="total" :page="getPage(GettingStarted_02)" v-on:prev-page="prevPage" v-on:next-page="nextPage"></GettingStarted_02>
      <GettingStarted_03 v-if="page === getPage(GettingStarted_03)" :total="total" :page="getPage(GettingStarted_03)" v-on:prev-page="prevPage" v-on:next-page="nextPage"></GettingStarted_03>
      <GettingStarted_04 v-if="page === getPage(GettingStarted_04)" :total="total" :page="getPage(GettingStarted_04)" v-on:prev-page="prevPage" v-on:next-page="nextPage"></GettingStarted_04>
      <GettingStarted_05 v-if="page === getPage(GettingStarted_05)" :total="total" :page="getPage(GettingStarted_05)" v-on:prev-page="prevPage" v-on:next-page="nextPage"></GettingStarted_05>
      <GettingStarted_06 v-if="page === getPage(GettingStarted_06)" :total="total" :page="getPage(GettingStarted_06)" v-on:prev-page="prevPage" v-on:next-page="nextPage"></GettingStarted_06>
      <GettingStarted_07 v-if="page === getPage(GettingStarted_07)" :total="total" :page="getPage(GettingStarted_07)" v-on:prev-page="prevPage" v-on:next-page="nextPage"></GettingStarted_07>
      <GettingStarted_08 v-if="page === getPage(GettingStarted_08)" :total="total" :page="getPage(GettingStarted_08)" v-on:prev-page="prevPage" v-on:next-page="nextPage"></GettingStarted_08>
      <GettingStarted_09 v-if="page === getPage(GettingStarted_09)" :total="total" :page="getPage(GettingStarted_09)" v-on:prev-page="prevPage" v-on:next-page="nextPage"></GettingStarted_09>
      <GettingStarted_10 v-if="page === getPage(GettingStarted_10)" :total="total" :page="getPage(GettingStarted_10)" v-on:prev-page="prevPage" v-on:next-page="nextPage"></GettingStarted_10>
      <GettingStarted_11 v-if="page === getPage(GettingStarted_11)" :total="total" :page="getPage(GettingStarted_11)" v-on:prev-page="prevPage" v-on:next-page="nextPage"></GettingStarted_11>
      <GettingStarted_12 v-if="page === getPage(GettingStarted_12)" :total="total" :page="getPage(GettingStarted_12)" v-on:prev-page="prevPage" v-on:next-page="nextPage" :disableModules="disableModules"></GettingStarted_12>
    </div>
    <router-link :to="{name:'home-page'}">
      <img src="./GettingStarted/assets/img/Icon_home.png" class="get-start-back-button get_start_back"/>
    </router-link>
  </div>
</template>
<script>
import GettingStarted_01 from './GettingStarted/GettingStarted_01.vue';
import GettingStarted_02 from './GettingStarted/GettingStarted_02.vue';
import GettingStarted_03 from './GettingStarted/GettingStarted_03.vue';
import GettingStarted_04 from './GettingStarted/GettingStarted_04.vue';
import GettingStarted_05 from './GettingStarted/GettingStarted_05.vue';
import GettingStarted_06 from './GettingStarted/GettingStarted_06.vue';
import GettingStarted_07 from './GettingStarted/GettingStarted_07.vue';
import GettingStarted_08 from './GettingStarted/GettingStarted_08.vue';
import GettingStarted_09 from './GettingStarted/GettingStarted_09.vue';
import GettingStarted_10 from './GettingStarted/GettingStarted_10.vue';
import GettingStarted_11 from './GettingStarted/GettingStarted_11.vue';
import GettingStarted_12 from './GettingStarted/GettingStarted_12.vue';

// const componentObject = {
//   GettingStarted_01,
//   GettingStarted_02,
//   GettingStarted_03,
//   GettingStarted_04,
//   GettingStarted_05,
//   GettingStarted_06,
//   GettingStarted_07,
//   GettingStarted_08,
//   GettingStarted_09,
//   GettingStarted_10,
//   GettingStarted_11,
//   GettingStarted_12,
// };

const modules = window.GlobalUtil.modules;
const componentObject = {
  GettingStarted_01,
  GettingStarted_02,
};
if (modules.control === true) {
  Object.assign(componentObject, {
    GettingStarted_03,
  });
}
if (modules.leapmotion === true) {
  Object.assign(componentObject, {
    GettingStarted_04,
  });
}
if (modules.blockly === true) {
  Object.assign(componentObject, {
    GettingStarted_05,
    GettingStarted_06,
    GettingStarted_07,
  });
}
if (modules.teach === true) {
  Object.assign(componentObject, {
    GettingStarted_08,
  });
}
if (modules.paint === true) {
  Object.assign(componentObject, {
    GettingStarted_09,
  });
}
if (modules.print3d === true) {
  Object.assign(componentObject, {
    GettingStarted_10,
  });
}
Object.assign(componentObject, {
  GettingStarted_11,
});
if (modules.allList === true) {
  Object.assign(componentObject, {
    GettingStarted_12,
  });
}

module.exports = {
  data() {
    return Object.assign({}, componentObject, {
      page: 1,
      total: Object.values(componentObject).length,
      componentList: Object.values(componentObject),
    });
  },
  components: componentObject,
  methods: {
    getPage(m) {
      const ret = this.componentList.indexOf(m);
      if (ret === -1) {
        return -1;
      }
      return ret + 1;
    },
    hideGetstart() {
    },
    nextPage() {
      this.page += 1;
    },
    prevPage() {
      this.page -= 1;
    },
  },
  computed: {
  },
  mounted() {
    console.log('leapmotion1');
    console.log(this.$route.params.leapmotion);
  },
  watch: {
    '$route.params.page'() {
    },
  },
};

</script>
<style lang="sass" scoped>
.get-start-wrapper {
  position: absolute;
  width: 100%;
  // height: 77%;
  // height: 40%;
  top: 0px;
  overflow: hidden;
  bottom: 185px;
  // bottom: 400px;
  // background: yellow;
  // z-index: 5;
  // ma
}
.get-start-back-button {
    // padding: 0 1vw;
    // border-right: 2px #505050 solid;
    cursor: pointer;
}
.get_start_back {
  position: absolute;
  // background: yellow;
  width: 23px;
  top: 10px;
  left: 15px;
  // z-index: 15;
}
// .content-wrapper{
  // background-color: blue;
// }
</style>
