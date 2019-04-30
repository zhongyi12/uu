<template lang="html">
  <div class="app-container noselected">
      <div class="s12 main-wrapper">
          <div class="head-wrapper">
              <topbar :cData="cData" :uarmPrintingState="uarmPrintingState" :moduleName="moduleName" :uarmConnectState="connection"></topbar>
              <UserProfileComponent></UserProfileComponent>
          </div>
          <div class="content-wrapper">
              <paint :cData="cData" :svgPathlist="svgPathlist" :uarmPrintingState="uarmPrintingState" :moduleName="moduleName" :uarmConnectState="connection"></paint>
              <siderbar :cData="cData" :svgPathlist="svgPathlist" v-show="sideToggleState" :moduleName="moduleName"></siderbar>
               <userProfile></userProfile>
               <newsFeed></newsFeed>
          </div>
          <ElectronComponent :moduleName="moduleName"></ElectronComponent>
      </div>
  </div>
</template>

<script>
const imagePath = './assets/img/';
const iconPatternPath = './PaintPageView/assets/img/shapes/';
const iconPatternPath2 = './PaintPageView/assets/img/shapes2/';
import topbar from './PaintPageView/HeaderComponent.vue';
import siderbar from './PaintPageView/SidebarComponent.vue';
import paint from './PaintPageView/PaintComponent.vue';
import ElectronComponent from './PaintPageView/ElectronComponent.vue';
import eventBus from './PaintPageView/eventBus';
import UserProfileComponent from './CommonPageView/UserProfileComponent.vue';
import userProfile from './CommonPageView/userProfile.vue';
import newsFeed from './CommonPageView/newsFeed.vue';
import eventBusComm from './CommonPageView/eventBus';
export default {
  data() {
    return {
      moduleName: 'Paint',
      cData: {
        x: 0,
        y: 150,
        z: 150,
        r: 90,
        speed: 1,
        armFinger: {
          x: 0,
          y: 150,
        },
        editingProjectName: '',
      },
      sideToggleState: true,
      images: {
        toggleoff: require(`${imagePath}toggle-off.png`),
        toggleon: require(`${imagePath}toggle-on.png`),
      },
      svgPathlist: {
        1: require(`${iconPatternPath2}angry.svg`),
        2: require(`${iconPatternPath2}crazy.svg`),
        3: require(`${iconPatternPath2}crying.svg`),
        4: require(`${iconPatternPath2}crying01.svg`),
        5: require(`${iconPatternPath2}dead.svg`),
        6: require(`${iconPatternPath2}embarrassed.svg`),
        7: require(`${iconPatternPath2}embarrassed01.svg`),
        8: require(`${iconPatternPath2}evil.svg`),
        9: require(`${iconPatternPath2}freeze.svg`),
        10: require(`${iconPatternPath2}friendly.svg`),
        11: require(`${iconPatternPath2}happiness.svg`),
        12: require(`${iconPatternPath2}happiness01.svg`),
        13: require(`${iconPatternPath2}happy.svg`),
        14: require(`${iconPatternPath2}happy01.svg`),
        15: require(`${iconPatternPath2}happy02.svg`),
        16: require(`${iconPatternPath2}hilarious.svg`),
        17: require(`${iconPatternPath2}indifferent.svg`),
        18: require(`${iconPatternPath2}indifferent01.svg`),
        19: require(`${iconPatternPath2}inlove.svg`),
        20: require(`${iconPatternPath2}inlove01.svg`),
        21: require(`${iconPatternPath2}kiss.svg`),
        22: require(`${iconPatternPath2}laughing.svg`),
        23: require(`${iconPatternPath2}naughty.svg`),
        24: require(`${iconPatternPath2}nerd.svg`),
        25: require(`${iconPatternPath2}nerd01.svg`),
        26: require(`${iconPatternPath2}sad.svg`),
        27: require(`${iconPatternPath2}sad02.svg`),
        28: require(`${iconPatternPath2}scared.svg`),
        29: require(`${iconPatternPath2}smile.svg`),
        30: require(`${iconPatternPath2}spechless.svg`),
        31: require(`${iconPatternPath2}stress.svg`),
        32: require(`${iconPatternPath2}surprised.svg`),
        33: require(`${iconPatternPath2}suspect.svg`),
        34: require(`${iconPatternPath2}upset.svg`),
        35: require(`${iconPatternPath2}wink.svg`),
        36: require(`${iconPatternPath2}wink01.svg`),
        37: require(`${iconPatternPath2}ambulance.svg`),
        38: require(`${iconPatternPath2}bigtruck.svg`),
        39: require(`${iconPatternPath2}boat.svg`),
        40: require(`${iconPatternPath2}bus.svg`),
        41: require(`${iconPatternPath2}caravan.svg`),
        42: require(`${iconPatternPath2}chasis.svg`),
        43: require(`${iconPatternPath2}construction_block.svg`),
        44: require(`${iconPatternPath2}construction_cone.svg`),
        45: require(`${iconPatternPath2}defroster.svg`),
        46: require(`${iconPatternPath2}dice.svg`),
        47: require(`${iconPatternPath2}doors_open.svg`),
        48: require(`${iconPatternPath2}engine.svg`),
        49: require(`${iconPatternPath2}e_car.svg`),
        50: require(`${iconPatternPath2}firetruck.svg`),
        51: require(`${iconPatternPath2}flattire.svg`),
        52: require(`${iconPatternPath2}forklifts.svg`),
        53: require(`${iconPatternPath2}fuel.svg`),
        54: require(`${iconPatternPath2}gear.svg`),
        55: require(`${iconPatternPath2}handicapcar.svg`),
        56: require(`${iconPatternPath2}headlight.svg`),
        57: require(`${iconPatternPath2}Instrumentcuster.svg`),
        58: require(`${iconPatternPath2}jeep.svg`),
        59: require(`${iconPatternPath2}jetski.svg`),
        60: require(`${iconPatternPath2}key.svg`),
        61: require(`${iconPatternPath2}laddertruck.svg`),
        62: require(`${iconPatternPath2}licence.svg`),
        63: require(`${iconPatternPath2}limousine.svg`),
        64: require(`${iconPatternPath2}lowridecar.svg`),
        65: require(`${iconPatternPath2}mini.svg`),
        66: require(`${iconPatternPath2}minicar.svg`),
        67: require(`${iconPatternPath2}monstertruck.svg`),
        68: require(`${iconPatternPath2}motor.svg`),
        69: require(`${iconPatternPath2}motorbike.svg`),
        70: require(`${iconPatternPath2}oil.svg`),
        71: require(`${iconPatternPath2}parking.svg`),
        72: require(`${iconPatternPath2}pedals.svg`),
        73: require(`${iconPatternPath2}policecar.svg`),
        74: require(`${iconPatternPath2}quad.svg`),
        75: require(`${iconPatternPath2}radio.svg`),
        76: require(`${iconPatternPath2}retrocar.svg`),
        77: require(`${iconPatternPath2}roadlanes.svg`),
        78: require(`${iconPatternPath2}roadroller.svg`),
        79: require(`${iconPatternPath2}schoolbus.svg`),
        80: require(`${iconPatternPath2}scooter.svg`),
        81: require(`${iconPatternPath2}seatbelt.svg`),
        82: require(`${iconPatternPath2}servicevan.svg`),
        83: require(`${iconPatternPath2}simulationcar.svg`),
        84: require(`${iconPatternPath2}skidloader.svg`),
        85: require(`${iconPatternPath2}snowbike.svg`),
        86: require(`${iconPatternPath2}spanner.svg`),
        87: require(`${iconPatternPath2}sportscar.svg`),
        88: require(`${iconPatternPath2}steeringwheel.svg`),
        89: require(`${iconPatternPath2}stop.svg`),
        90: require(`${iconPatternPath2}swat.svg`),
        91: require(`${iconPatternPath2}tank.svg`),
        92: require(`${iconPatternPath2}temperature.svg`),
        93: require(`${iconPatternPath2}towtruck.svg`),
        94: require(`${iconPatternPath2}tractor.svg`),
        95: require(`${iconPatternPath2}trafficlights.svg`),
        96: require(`${iconPatternPath2}trailer.svg`),
        97: require(`${iconPatternPath2}tram.svg`),
        98: require(`${iconPatternPath2}uturn.svg`),
        99: require(`${iconPatternPath2}van.svg`),
        100: require(`${iconPatternPath2}warninglight.svg`),
        101: require(`${iconPatternPath2}brochette.svg`),
        102: require(`${iconPatternPath2}candy.svg`),
        103: require(`${iconPatternPath2}chicken.svg`),
        104: require(`${iconPatternPath2}fried_egg.svg`),
        105: require(`${iconPatternPath2}fries.svg`),
        106: require(`${iconPatternPath2}hot_dog.svg`),
        107: require(`${iconPatternPath2}icecream.svg`),
        108: require(`${iconPatternPath2}lollipop.svg`),
        109: require(`${iconPatternPath2}meat.svg`),
        110: require(`${iconPatternPath2}ramen.svg`),
        111: require(`${iconPatternPath2}sausage.svg`),
        112: require(`${iconPatternPath2}axe.svg`),
        113: require(`${iconPatternPath2}bonnet.svg`),
        114: require(`${iconPatternPath2}compass.svg`),
        115: require(`${iconPatternPath2}earth.svg`),
        116: require(`${iconPatternPath2}halfmoon.svg`),
        117: require(`${iconPatternPath2}leaf.svg`),
        118: require(`${iconPatternPath2}leaf02.svg`),
        119: require(`${iconPatternPath2}littlestar.svg`),
        120: require(`${iconPatternPath2}mushroom.svg`),
        121: require(`${iconPatternPath2}shoes.svg`),
        123: require(`${iconPatternPath2}sun.svg`),
        124: require(`${iconPatternPath2}map.svg`),
        125: require(`${iconPatternPath2}water.svg`),
        126: require(`${iconPatternPath2}wind.svg`),
        127: require(`${iconPatternPath2}wood.svg`),
        128: require(`${iconPatternPath2}xmastree.svg`),
        129: require(`${iconPatternPath2}alien.svg`),
        130: require(`${iconPatternPath2}astronaut.svg`),
        131: require(`${iconPatternPath2}comet.svg`),
        132: require(`${iconPatternPath2}flag.svg`),
        133: require(`${iconPatternPath2}moon.svg`),
        134: require(`${iconPatternPath2}moonrover.svg`),
        135: require(`${iconPatternPath2}robot.svg`),
        136: require(`${iconPatternPath2}satelite.svg`),
        137: require(`${iconPatternPath2}saturn.svg`),
        138: require(`${iconPatternPath2}solar_system.svg`),
        139: require(`${iconPatternPath2}solar_system2.svg`),
        140: require(`${iconPatternPath2}spaceship01.svg`),
        141: require(`${iconPatternPath2}spaceship02.svg`),
        142: require(`${iconPatternPath2}spaceship03.svg`),
        143: require(`${iconPatternPath2}spaceship04.svg`),
        144: require(`${iconPatternPath2}spaceship05.svg`),
        145: require(`${iconPatternPath2}start.svg`),
        146: require(`${iconPatternPath2}telescope.svg`),
        147: require(`${iconPatternPath2}ufo.svg`),
        148: require(`${iconPatternPath2}guards.svg`),
        149: require(`${iconPatternPath2}guards02.svg`),
        150: require(`${iconPatternPath2}master.svg`),
        151: require(`${iconPatternPath2}robota.svg`),
        152: require(`${iconPatternPath2}robotb.svg`),
        153: require(`${iconPatternPath2}robotc.svg`),
        154: require(`${iconPatternPath}1.Rectangle.svg`),
        155: require(`${iconPatternPath}13.arcstar.svg`),
        156: require(`${iconPatternPath}17.dialog.svg`),
        157: require(`${iconPatternPath}4.Polygon5.svg`),
        158: require(`${iconPatternPath}8.Star4.svg`),
        159: require(`${iconPatternPath}10.rhombus.svg`),
        160: require(`${iconPatternPath}14.Star12.svg`),
        161: require(`${iconPatternPath}18.dialog2.svg`),
        162: require(`${iconPatternPath}5.Polygon6.svg`),
        163: require(`${iconPatternPath}9.Star6.svg`),
        164: require(`${iconPatternPath}11.trapezoid.svg`),
        165: require(`${iconPatternPath}15.dialog4.svg`),
        166: require(`${iconPatternPath}2.Oval.svg`),
        167: require(`${iconPatternPath}6.Polygon8.svg`),
        168: require(`${iconPatternPath}12.cylinder.svg`),
        169: require(`${iconPatternPath}16dialog3.svg`),
        170: require(`${iconPatternPath}3.Triangle.svg`),
        171: require(`${iconPatternPath}7.Star.svg`),
      },
    };
  },
  beforeDestroy() {
    eventBus.$off();
  },
  mounted() {
    eventBus.$on('sideBarShow', (show) => {
      this.sideToggleState = show;
    });
    eventBusComm.$on('sideBarShow', (show) => {
      this.sideToggleState = show;
    });
    window.Studio.userTracking.insertItem('drawLaserTimes');
    // window.UArm.set_mode(3); // w&d:3, laser: 1
    eventBus.$on('editing-project-name-changed', (name) => {
      this.cData.editingProjectName = name;
      window.UserConfig.setItem(this.moduleName, 'LastProjectName', name);
    });
  },
  components: {
    topbar,
    siderbar,
    paint,
    UserProfileComponent,
    userProfile,
    newsFeed,
    ElectronComponent,
  },
  computed: {
    uarmPrintingState() {
      return this.$store.getters.uarmPrintingState;
    },
    connection() {
      return this.$store.getters.uarmConnectState;
    },
  },
};

</script>

<style lang="sass" scoped>
  .app-container {
    background:#fafafa;
    .mu-appbar {
      background-color: #3c3c3c;
    }
    .main-wrapper {
      border-right: 1px solid #ddd;
      .head-wrapper {
        display:flex;
        width: 100%;
        background-color:#3c3c3c;
        .header-profile-wrapper {
          z-index:999;
          height:64px;
        }
        .header-wrapper-left {
           z-index:3;
        }
      }
      .content-wrapper {
        display:flex;
        width: 100%;
        height:100%;
        .side-wrapper, .news-wrapper, .user-wrapper{
           height:100%;
           width:400px;
        }
      }
    }
  }
</style>
