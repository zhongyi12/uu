<template lang="html">
  <div class="s12 side-wrapper">
    <!--<statusbar :show-home="show.home"></statusbar>-->
    <!--<userprofile v-show="show.profile"></userprofile>-->
    <!--<newsfeed v-show="show.news"></newsfeed>-->
    <div v-show="show.home" class="paint-sidebar">
      <div class="accordion-wrapper">
        <div class="accordion" v-bind:class="{active:show.favorite}" @click="show.favorite = !show.favorite">
          <!--<img :src="titleImage" alt="">-->
          <span class="title" >{{ $t("paintApp.sidebar.project_name") }}</span>
          <!--<div class="edit-sync icon-right" :tooltip="$t('common.tooltip.sync')" slot="right" @click="cloudSync">-->
            <!--<img src="../assets/img/cloud_downloading.svg"  alt="Sync">-->
          <!--</div>-->
        </div>
        <div class="panel project-list" v-show="show.favorite" v-bind:class="{bigProjectList:!show.shapes}">
          <!--<mu-list class="paint-project">-->
            <!--<mu-list-item v-for="item in projectList" :title="item.basename.length < 20 ? item.basename : item.basename.substring(0, 20) + '...'" v-on:dblclick.native="loadProject(item.basename)">-->
              <!--<mu-checkbox name="cb_project" v-model="projectsChecked" :nativeValue="item.basename" slot="left" v-show="show.editMode" />-->
              <!--<img src="./assets/img/btn_edit.svg" alt="" @click="renameProject(item.basename)" v-show="show.editMode" >-->
            <!--</mu-list-item>-->
          <!--</mu-list>-->
          <mu-table enableSelectAll multiSelectable :showCheckbox="show.editMode" @rowSelection="getSelectRow" ref="projectTable">
            <mu-thead slot="header">
              <mu-tr>
                <mu-th lang="id" tooltip="ID">ID</mu-th>
                <mu-th lang="name" tooltip="名称">{{$t('common.fileName')}}</mu-th>
                <mu-th tooltip=""></mu-th>
              </mu-tr>
            </mu-thead>
            <mu-tbody>
              <mu-tr lang="checkbox" v-for="item,index in projectList" :selected="item.selected">
                <mu-td lang="id">{{index + 1}}</mu-td>
                <mu-td lang="name" v-on:dblclick.native="loadProject(item.basename)">{{item.basename.length < 20 ? item.basename : item.basename.substring(0, 20) + '...'}}</mu-td>
                <mu-td>
                  <div class="item-edit-btn" v-show="show.editMode" @click="renameProject(item.basename)"><img src="../assets/img/item_edit.svg"  alt="" ></div>
                  <!-- <div class="item-edit-btn" @click="exportProject(item.basename)" v-show="!show.editMode"><img src="../assets/img/item_export.svg" ></div> -->
                </mu-td>
              </mu-tr>
            </mu-tbody>
          </mu-table>
        </div>
        <div class="edit-wrapper" v-show="show.favorite">
            <div v-if="show.editMode" class="edit-icon" alt="">
              <mu-icon-button @click="changeEditMode()" v-show="show.editMode && show.favorite" class="edit-done common-btn">{{$t('common.done')}}</mu-icon-button>
              <mu-icon-button class="common-btn import-btn" :tooltip="$t('common.tooltip.import')" @click="importProject()"></mu-icon-button>
              <div class="delete-wrapper">
                <!--<div v-if="projectsChecked.length >0"  class="edit-delete" @click="selectedCheckbox()"></div>-->
                <div v-if="showDeleteIcon" @click="selectedCheckbox" class="edit-delete "></div>
                <div v-else class="edit-delete-disable"></div>
              </div>
            </div>
            <div v-else class="edit-icon" alt="">
              <mu-icon-button class="common-btn edit-btn" :tooltip="$t('common.tooltip.edit')" @click="changeEditMode()" ></mu-icon-button>
              <mu-icon-button class="common-btn import-btn" :tooltip="$t('common.tooltip.import')" @click="importProject()"></mu-icon-button>
            </div>
          </div>
      </div>
      <div class="accordion-wrapper">
        <div class="accordion" v-bind:class="{active:show.shapes}" @click="show.shapes = !show.shapes">
          <!--<img :src="patternImage" alt="">-->
          <span class="title" >{{ $t("paintApp.sidebar.picture_name") }}</span>
        </div>
        <div class="paint-panel" v-show="show.shapes" v-bind:class="{bigPanel:!show.favorite}">
            <img v-for="(element, index) in svgPathlist" :src="element" alt="" @click="addSVG(index)" v-on:dragstart="onDragStart(index)" draggable="true" />
            <!--
            <button type="button" name="button" @click="addRect">Rect</button>
            <button type="button" name="button" @click="addCircle">Circle</button>-->
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import eventBus from './eventBus';
import swal from 'sweetalert2';
import userprofile from '../CommonPageView/userProfile.vue';
import statusbar from '../CommonPageView/statusBar.vue';
import newsfeed from '../CommonPageView/newsFeed.vue';
import eventBusComm from '../CommonPageView/eventBus';
export default {
  props: ['cData', 'svgPathlist', 'moduleName'],
  data() {
    return {
      projectList: [],
      projectsChecked: [],
      show: {
        shapes: true,
        favorite: true,
        editMode: false,
        profile: false,
        home: true,
        news: false,
      },
      titleImage: require(`${this.$t('paintApp.leftSide.imageProject')}`),
      patternImage: require(`${this.$t('paintApp.leftSide.imagePatterns')}`),
    };
  },
  mounted() {
    const self = this;
    this.projectList = window.FileManager.listProjectListSync(this.moduleName);
    eventBus.$on('refresh-project-list', () => {
      self.projectList = window.FileManager.listProjectListSync(self.moduleName);
    });
    eventBusComm.$on('show-news', () => {
      this.show.news = true;
      this.show.home = false;
      this.show.profile = false;
    });
    eventBusComm.$on('show-profile', () => {
      this.show.profile = true;
      this.show.home = false;
      this.show.news = false;
    });
    eventBusComm.$on('show-home', () => {
      this.show.profile = false;
      this.show.news = false;
      this.show.home = true;
    });
  },
  components: {
    userprofile,
    statusbar,
    newsfeed,
  },
  computed: {
    showDeleteIcon() {
      return this.projectsChecked.length > 0;
    },
  },
  methods: {
    unselect() {
      this.$refs.projectTable.unSelectAll();
    },
    getSelectRow(selectedRows) {
      this.projectsChecked.length = 0;
      for (let i = 0; i < selectedRows.length; i++) {
        this.projectsChecked.push(this.projectList[selectedRows[i]].basename);
      }
    },
    addSVG(index) {
      eventBus.$emit('addShapes', index);
    },
    onDragStart(index) {
      // console.log('dragging', index);
      eventBus.$emit('dragging', index);
    },
    openFolder() {
      document.getElementById('f_input').click();
    },
    changeEditMode() {
      this.show.editMode = !this.show.editMode;
      this.unselect();
    },
    loadProject(name) {
      eventBus.$emit('load-project', name);
    },
    importProject() {
      eventBus.$emit('import-project');
    },
//    deleteProjects() {
//      const size = this.projectsChecked.length;
//      if (size <= 0) {
//        swal(this.$t('dialog.noSelectProject.title'), this.$t('dialog.noSelectProject.text'), 'error');
//        return;
//      }
//      swal({
//        title: this.$t('dialog.deleteWarning.title'),
//        text: this.$t('dialog.deleteWarning.text'),
//        type: 'warning',
//        showCancelButton: true,
//        confirmButtonText: this.$t('dialog.deleteWarning.confirmButtonText'),
//        cancelButtonText: this.$t('dialog.deleteWarning.cancelButtonText'),
//        confirmButtonColor: window.usui.okBtnColor,
//        cancelButtonColor: window.usui.cancelBtnColor,
//        reverseButtons: true,
//      }).then(() => {
//        for (let i = 0; i < this.projectsChecked.length; i++) {
//          window.FileManager.deleteProject(this.moduleName, this.projectsChecked[i]);
//        }
//        swal(
//          this.$t('dialog.deleteCompleted.title'),
//          this.$t('dialog.deleteCompleted.text'),
//          'success',
//        );
//        this.projectList = window.FileManager.listProjectListSync(this.moduleName);
//        this.projectsChecked = [];
//      }, () => {});
//    },

    deleteProjects(items) {
      const self = this;
      const size = items.length;
      if (size <= 0) {
        swal(this.$t('dialog.noSelectProject.title'), this.$t('dialog.noSelectProject.text'), 'error');
        return;
      }
      swal({
//        title: this.$t('dialog.deleteWarning.title'),
        text: this.$t('dialog.deleteWarning.text'),
        type: 'warning',
        width: window.usui.width,
        showCancelButton: true,
        confirmButtonText: this.$t('dialog.deleteWarning.confirmButtonText'),
        cancelButtonText: this.$t('dialog.deleteWarning.cancelButtonText'),
        confirmButtonColor: window.usui.deleteBtnColor,
        cancelButtonColor: window.usui.cancelBtnColor,
        reverseButtons: true,
      }).then(() => {
        for (let i = 0; i < items.length; i++) {
          if (items[i] === self.cData.projectName) {
            eventBus.$emit('new-project');
          }
          window.FileManager.deleteProjectSync(this.moduleName, items[i]);
        }
        window.SyncManager.deleteProject(this.moduleName, items);
        this.$store.dispatch('showSnackBar', { message: self.$t('dialog.deleteCompleted.text') });
        this.show.editMode = false;
        self.projectList = window.FileManager.listProjectListSync(this.moduleName, { sortOrderDesc: true });
        self.projectsChecked = [];
      }, () => {});
    },
    selectedCheckbox() {
      this.deleteProjects(this.projectsChecked);
    },
    exportProject(filename) {
      window.FileManager.loadProject(this.moduleName, filename).then((projectContent) => {
        if (projectContent === null) {
          swal({
            title: this.$t('dialog.failExport.title'),
            text: this.$t('dialog.failExport.html'),
            type: 'warning',
            showCancelButton: false,
            confirmButtonColor: window.usui.okBtnColor,
            confirmButtonText: this.$t('dialog.failExport.okbtn'),
          }).then(() => {
          });
        }
        else {
          filename = filename.replace('.json', '');
          filename += '.json';
          this.downloadJSON(filename, projectContent);
        }
      });
    },
    downloadJSON(filename, text) {
      let csv;
      if (text === null) {
        text = '';
      }
      csv = 'data:text/json;charset=utf-8,';
      csv += text;
      const data = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    },
    renameProject(projectName) {
      const self = this;
      swal({
        text: `${this.$t('dialog.renameProject.text')} ${projectName}`,
        input: 'text',
        width: window.usui.width,
        showCancelButton: true,
        confirmButtonText: this.$t('dialog.renameProject.confirmButtonText'),
        cancelButtonText: this.$t('dialog.renameProject.cancelButtonText'),
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        confirmButtonColor: window.usui.okBtnColor,
        cancelButtonColor: window.usui.cancelBtnColor,
        reverseButtons: true,
        preConfirm(text) {
          return new Promise((resolve, reject) => {
            const projects = window.FileManager.listProjectListSync(self.moduleName);
            const projectNameList = [];
            for (const p of projects) {
              projectNameList.push(p.basename);
            }
            if (text.length === 0) {
              reject(`${self.$t('dialog.saveProject.faila')} ${text}.`);
            }
            else if (projectNameList.indexOf(text) >= 0) {
              reject(`${text} ${self.$t('dialog.saveProject.failb')}`);
            }
            else {
              resolve();
            }
          });
        },
      }).then((text) => {
        swal({
          type: 'success',
          title: self.$t('dialog.saveProject.title'),
          html: `${self.$t('dialog.saveProject.newname')}: ${text}`,
        });
        window.FileManager.renameProjectSync(this.moduleName, projectName, text);
        self.projectList = window.FileManager.listProjectListSync(self.moduleName);
        if (projectName === this.cData.editingProjectName) {
          eventBus.$emit('editing-project-name-changed', text);
        }
      });
    },
    // methods end
  },
};

</script>
<style lang="sass" scoped>
.side-wrapper{
  background-color: white;
  border-left:1px solid rgba(85,85,85,0.2);
  border-bottom:1px solid rgba(85,85,85,0.2);
  height:100%;
  .paint-sidebar{
    width: 100%;
  }
}
/* Style the accordion panel. Note: hidden by default */
.bigPanel {
    max-height:82vh !important;
    overflow: auto;
}
div.paint-panel {
    background-color: white;
    overflow: auto;
    max-height: 30vh;
    display: inline-block;
    width:100%;
    text-align: center;
    position:relative;
    padding-bottom:1vh;
     img{
        width: 18%;
        padding: 3%;
        cursor: pointer;
     }
     img:hover{
        background: #eee;
     }
    .mu-list{
        overflow-y: scroll;
        padding-bottom:2vw !important;
    }
}
.accordion img{
  padding-left:1vw;
}
</style>
