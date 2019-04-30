<template>
  <div class="s12 side-wrapper" id="blockly-side-wrapper-id">
    <div v-show="show.home" class="blockly-sidebar">
      <div class="accordion-wrapper">
        <div class="accordion" v-bind:class="{active:show.project}">
          <span class="title" @click="show.project = !show.project">{{ $t("BlocklyPageView.sidebar.project_name") }}</span>
          <div class="edit-sync icon-right" :tooltip="$t('common.tooltip.sync')" slot="right" @click="cloudSync" v-show="!show.editMode">
            <img src="../assets/img/cloud_downloading.svg"  alt="Sync">
          </div>
        </div>
        <div v-show="show.project">
          <div class="panel project-list" v-bind:class="{bigProjectList:!show.mission}">
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
                    <div class="item-edit-btn" v-show="show.editMode" @click="renameProject(item.basename)"><img src="./assets/img/item_edit.svg"  alt="" ></div>
                    <div class="item-edit-btn" @click="exportProject(item.basename)" v-show="!show.editMode"><img src="./assets/img/item_export.svg" ></div>
                  </mu-td>
                </mu-tr>
              </mu-tbody>
            </mu-table>
          </div>
          <div class="edit-wrapper">
            <div v-if="show.editMode" class="edit-icon" alt="">
              <mu-icon-button  @click="changeEditMode" v-show="show.editMode && show.project" class="edit-done common-btn">
                {{$t('common.done')}}
              </mu-icon-button>
              <mu-icon-button class="common-btn import-btn" :tooltip="$t('common.tooltip.import')" @click="openFolder">
              </mu-icon-button>
              <div class="delete-wrapper">
                <div v-if="showDeleteIcon" @click="selectedCheckbox" class="edit-delete "></div>
                <div v-else class="edit-delete-disable"></div>
              </div>
            </div>
            <div v-else class="edit-icon" alt="">
              <mu-icon-button class="common-btn edit-btn" :tooltip="$t('common.tooltip.edit')" @click="changeEditMode()">
              </mu-icon-button>
              <mu-icon-button class="common-btn import-btn" :tooltip="$t('common.tooltip.import')" @click="openFolder">
              </mu-icon-button>
            </div>
          </div>
        </div>
      </div>
      <div class="accordion-wrapper">
        <div class="accordion" v-bind:class="{active:show.mission}" @click="show.mission = !show.mission">
          <span class="title" >{{ $t("BlocklyPageView.sidebar.mission_name") }}</span>
        </div>
        <mu-list v-show="show.mission">
          <mu-divider shallowInset/>
          <mu-list-item v-for="item in missionList" @click="showMission(item)" :title="item" :titleClass=" item === blocklyData.projectName ? 'highlight-project-item' : 'normal' " >
          </mu-list-item>
        </mu-list>
      </div>
    </div>
    <div id="mission-id" class="mission">
      <div class="mission-head">
        <div class="mission-title" id="mission-title-id"></div>
        <div class="mission-close" @click="closeMission">
          <img src='./assets/img/svg_icon_closed.svg' width="15px" height="15px" style="margin-top:20px;margin-left:20px;"/>
        </div>
      </div>
      <div class="mission-content" id="mission-content-id">
        <BlocklyMission01 v-if="missionPage === '1'"></BlocklyMission01>
        <BlocklyMission02 v-if="missionPage === '2'"></BlocklyMission02>
        <BlocklyMission03 v-if="missionPage === '3'"></BlocklyMission03>
      </div>
    </div>
    <mu-snackbar v-if="snackBarDisplayFlag" action="Close" :message="snackBarDisplayMessage" />
  </div>

</template>

<script>
import eventBus from './eventBus';
import eventBusComm from '../CommonPageView/eventBus';
import swal from 'sweetalert2';
// import { Blockly } from './assets/lib/blockly/blockly.js';
import BlocklyMission01 from './BlocklyMission01.vue';
import BlocklyMission02 from './BlocklyMission02.vue';
import BlocklyMission03 from './BlocklyMission03.vue';
module.exports = {
  props: ['blocklyData', 'moduleName'],
  i18n: {
    messages: {
      en: {
        sync_error: 'Sync fail {err}',
        delete_completed: 'deleted!',
        download_failed: '{length} Project(s) are failed to download: {list}',
        retry: 'Retry',
        ignore: 'Ignore',
        cancel: 'Cancel',
        loginTip: 'Please login in Studio before Cloud Storage',
        login: 'Login',
      },
      cn: {
        sync_error: '同步失败 {err}',
        delete_completed: '已删除',
        download_failed: '{length} 个项目下载失败: {list}',
        retry: '重试',
        abort: '忽略',
        cancel: '取消',
        loginTip: '云存储前，请先登录',
        login: '登录',
      },
    },
  },
  data() {
    return {
      snackBarDisplayFlag: false,
      snackBarDisplayMessage: null,
      projectList: [],
      missionList: [
        this.$t('BlocklyPageView.mission.startMoving'),
        this.$t('BlocklyPageView.mission.pickAndPlace'),
        this.$t('BlocklyPageView.mission.applyRecorings'),
      ],
      projectsChecked: [],
      show: {
        project: true,
        mission: true,
        editMode: false,
        profile: false,
        home: true,
        news: false,
      },
      missionPage: '',
      language: this.$t('language'),
//      sideToggle: true,
    };
  },
  components: {
    BlocklyMission01,
    BlocklyMission02,
    BlocklyMission03,
  },
  beforeDestroy() {
    self.projectList = null;
    eventBus.$off();
    eventBusComm.$off();
  },
  mounted() {
    const self = this;
    self.projectList = window.FileManager.listProjectListSync(this.moduleName, { sortOrderDesc: true });
    eventBus.$on('rename-project', (projectName) => {
      self.renameProject(projectName);
    });
    eventBus.$on('save-project', (callback) => {
      self.saveProject(callback);
    });
    eventBus.$on('save-project-as', (callback) => {
      self.saveAsProject(callback);
    });
    eventBus.$on('prompt-save-project', (callback) => {
      self.promptSaveProject(callback);
    });
    eventBus.$on('prompt-save-on-quit', (callback) => {
      self.promptSaveOnQuit(callback);
    });
    eventBus.$on('new-project', () => {
      self.newProject();
    });
    eventBus.$on('refresh-project-list', () => {
      self.projectList = window.FileManager.listProjectListSync(this.moduleName, { sortOrderDesc: true });
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
  computed: {
    uarmConnectStatus() {
      return this.$store.getters.uarmConnectStatus;
    },
    cameraConnectStatus() {
      return this.$store.getters.cameraConnectStatus;
    },
    connectedStatusClass() {
      return this.uarmConnectStatus ? 'label label-success' : 'label label-default';
    },
    uarmInfo() {
      return this.$store.getters.uarmInfo;
    },
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
    closeMission() {
      this.missionPage = '';
      this.show.home = true;
      document.getElementById('mission-id').style.display = 'none';
    },
    showMission(item) {
      this.show.home = false;
      const indexOf = this.missionList.indexOf(item);
      const mission = document.getElementById('mission-id');
      mission.style.display = 'block';
      const missionTitle = document.getElementById('mission-title-id');
      if (indexOf === 0) {
        missionTitle.innerHTML = this.$t('BlocklyPageView.mission.misstionTitle1');
        this.missionPage = '1';
      }
      else if (indexOf === 1) {
        missionTitle.innerHTML = this.$t('BlocklyPageView.mission.misstionTitle2');
        this.missionPage = '2';
      }
      else if (indexOf === 2) {
        missionTitle.innerHTML = this.$t('BlocklyPageView.mission.misstionTitle3');
        this.missionPage = '3';
      }
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
          this.downloadXML(filename, projectContent);
        }
      });
    },
    downloadXML(filename, text) {
      let csv;
      if (text === null) {
        text = '';
      }
      csv = 'data:text/xml;charset=utf-8,';
      csv += text;
      const data = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    },
    openFolder() {
//      console.log('open Folder');
      document.getElementById('f_input').click();
    },
    changeEditMode() {
      this.show.editMode = !this.show.editMode;
      this.unselect();
    },
    loadProject(project) {
      console.log(`try to load ${project}`);
      const loadProjectItem = () => {
        eventBus.$emit('blockly-load-project', project);
      };
      eventBus.$emit('prompt-save-project', loadProjectItem);
    },
    clearProject() {
      eventBus.$emit('blockly-clear-project');
    },
    deleteProjects(items) {
      const self = this;
      const size = items.length;
      if (size <= 0) {
        swal(this.$t('dialog.noSelectProject.title'), this.$t('dialog.noSelectProject.text'), 'error');
        return;
      }
      swal({
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
          if (items[i] === self.blocklyData.projectName) {
            eventBus.$emit('new-project');
          }
          window.FileManager.deleteProjectSync(this.moduleName, items[i]);
        }
        window.SyncManager.deleteProject(this.moduleName, items);
        this.$store.dispatch('showSnackBar', { message: self.$t('delete_completed') });
        this.show.editMode = false;
        self.projectList = window.FileManager.listProjectListSync(this.moduleName, { sortOrderDesc: true });
        self.projectsChecked = [];
      }, () => {});
    },
    newProject() {
      const self = this;
      const _newProject = () => {
        eventBus.$emit('blockly-clear-project');
        eventBus.$emit('project-file-content-changed', null);
        eventBus.$emit('project-name-changed', null);
      };
      self.promptSaveProject(_newProject);
    },
    renameProject(projectName) {
      const self = this;
      swal({
//        title: this.$t('dialog.renameProject.title'),
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
            const projects = window.FileManager.listProjectListSync(self.moduleName, { sortOrderDesc: true });
            if (!projects) reject(`${self.$t('dialog.saveProject.fileNotExisted').replace('{}', text)}.`);
            const projectsNameList = [];
            for (const p of projects) {
              projectsNameList.push(p.basename);
            }
            if (text.length === 0) {
              reject(`${self.$t('dialog.saveProject.faila')} ${text}.`);
            }
            else if (projectsNameList.indexOf(text) >= 0) {
              reject(`${text} ${self.$t('dialog.saveProject.failb')}`);
            }
            else {
              resolve();
            }
          });
        },
      }).then((text) => {
        this.$store.dispatch('showSnackBar', { message: `${self.$t('dialog.saveProject.newname')}: ${text}` });
        this.show.editMode = false;
        window.FileManager.renameProjectSync(this.moduleName, projectName, text);
        window.SyncManager.renameProject(this.moduleName, projectName, text);
        self.projectList = window.FileManager.listProjectListSync(this.moduleName, { sortOrderDesc: true });
        if (projectName === self.blocklyData.projectName) {
          eventBus.$emit('project-name-changed', text);
          self.saveProject();
        }
      });
    },
    promptSaveProject(okCallback, cancelCallback) {
      okCallback = okCallback || (() => {});
      cancelCallback = cancelCallback || (() => {});
      const self = this;
      if (self.blocklyData.projectSaveStatus) {
        okCallback();
      }
      else {
        swal({
          html: self.$t('dialog.save.html'),
          showCancelButton: true,
          width: window.usui.width,
          confirmButtonColor: window.usui.okBtnColor,
          cancelButtonColor: window.usui.cancelBtnColor,
          confirmButtonText: self.$t('dialog.save.okButton'),
          cancelButtonText: self.$t('dialog.save.cancelButton'),
          allowEnterKey: true,
          allowOutsideClick: false,
          showCloseButton: true,
          reverseButtons: true,
        }).then(() => {
          self.saveProject(okCallback);
        }, (dismiss) => {
          if (dismiss === 'cancel') {
            okCallback();
          }
          else if (dismiss === 'close') {
            cancelCallback();
          }
        });
      }
    },
    promptSaveOnQuit(okCallback, cancelCallback) {
      okCallback = okCallback || (() => {});
      cancelCallback = cancelCallback || (() => {});
      const self = this;
      if (self.blocklyData.projectSaveStatus) {
        okCallback();
      }
      else {
        swal({
          html: self.$t('dialog.quitSave.html'),
          showCancelButton: true,
          width: window.usui.width,
          confirmButtonColor: window.usui.okBtnColor,
          cancelButtonColor: window.usui.cancelBtnColor,
          confirmButtonText: self.$t('dialog.quitSave.okButton'),
          cancelButtonText: self.$t('dialog.quitSave.cancelButton'),
          allowEnterKey: true,
          allowOutsideClick: true,
          showCloseButton: true,
          reverseButtons: true,
        }).then(() => {
          self.saveProject(okCallback);
        }, (dismiss) => {
          if (dismiss === 'cancel') {
            okCallback();
          }
          else if (dismiss === 'close') {
            cancelCallback();
          }
        });
      }
    },
    async cloudSync() {
      console.log('syncing');
      const self = this;
      if (this.$store.getters.userProfile.isLogin) {
        try {
          await this.downloadProject(false);
          this.$store.dispatch('showProgressBar', 'Uploading Projects');
          const list = await window.SyncManager.uploadProject(this.moduleName, {
            force: false, progressCallback(transferredSize, totalSize) {
              self.$store.dispatch('updateProgressBar', Math.round((transferredSize / totalSize) * 100), 2);
            },
          });
          this.$store.dispatch('showSnackBar', {
            message: this.$t('BlocklyPageView.sync.uploadProject').replace('{}', list.length),
          });
          this.$store.dispatch('hideProgressBar');
          const compareList = await window.SyncManager.compareProject(this.moduleName);
          if (compareList.length > 0) {
            const nameList = [];
            for (const p of compareList) {
              nameList.push(p.name);
            }
            swal({
              title: this.$t('dialog.syncProject.title').replace('{}', nameList.join(', ')),
              text: this.$t('dialog.syncProject.text'),
              confirmButtonText: this.$t('dialog.syncProject.overwriteLocal'),
              cancelButtonText: this.$t('dialog.syncProject.overwriteRemote'),
              confirmButtonColor: window.usui.okBtnColor,
              cancelButtonColor: window.usui.cancelBtnColor,
              showCancelButton: true,
              showLoaderOnConfirm: true,
              allowOutsideClick: false,
              showCloseButton: false,
              reverseButtons: true,
            }).then(() => {
              window.SyncManager.downloadProject(this.moduleName, { force: true });
              this.$store.dispatch('showSnackBar',
                { message: this.$t('BlocklyPageView.sync.downloadProject').replace('{}', list.length) });
            }).catch((dismiss) => {
              if (dismiss === 'cancel') {
                window.SyncManager.uploadProject(this.moduleName, { force: true }).then((list) => {
                  this.$store.dispatch('showSnackBar',
                    { message: this.$t('BlocklyPageView.sync.uploadProject').replace('{}', list.length) });
                });
              }
            });
          }
        }
        catch (e) {
          this.$store.dispatch('showSnackBar', { message: this.$t('sync_error', { err: e.desc }) });
        }
      }
      else {
        console.log('login');
        swal({
          html: this.$t('loginTip'),
          confirmButtonText: this.$t('login'),
          cancelButtonText: this.$t('cancel'),
          confirmButtonColor: window.usui.okBtnColor,
          cancelButtonColor: window.usui.cancelBtnColor,
          showCancelButton: true,
          showLoaderOnConfirm: true,
          allowOutsideClick: true,
          showCloseButton: true,
          reverseButtons: true,
        }).then(() => {
          this.$router.push({ name: 'login' });
        });
      }
    },
    async downloadProject(force) {
      const self = this;
      return new Promise(async (resolve, reject) => {
        try {
          this.$store.dispatch('showProgressBar', 'Downloading Projects');
          const list = await window.SyncManager.downloadProject(this.moduleName, { force, progressCallback(downloaded, total) {
            // console.log(`download progress: ${downloaded} , ${total}`);
            self.$store.dispatch('updateProgressBar', Math.round((downloaded / total) * 100), 2);
          } });
          console.log(`download ${list.length} files`);
          self.$store.dispatch('showSnackBar',
            { message: this.$t('BlocklyPageView.sync.downloadProject').replace('{}', list.length) });
          resolve(list);
        }
        catch (e) {
          if (e.code === 'error') reject(e);
          else {
            swal({
              text: this.$t('download_failed', { length: e.data.failed.length, list: e.data.failed.join(', ') }),
              confirmButtonText: this.$t('retry'),
              cancelButtonText: this.$t('ignore'),
              confirmButtonColor: window.usui.okBtnColor,
              cancelButtonColor: window.usui.cancelBtnColor,
              showCancelButton: true,
              showLoaderOnConfirm: true,
              allowOutsideClick: false,
              showCloseButton: false,
              reverseButtons: true,
            }).then(async () => {
              await self.cloudSync();
            }).catch((dismiss) => {
              if (dismiss === 'cancel') {
                resolve(e.data.succeed);
                console.log('cancel sync');
              }
            });
          }
        }
        finally {
          eventBus.$emit('refresh-project-list');
          self.$store.dispatch('hideProgressBar');
        }
      });
    },
    saveProjectToDisk(projectName) {
      window.FileManager.saveProjectSync(this.moduleName, projectName, this.blocklyData.projectContent);
      window.SyncManager.uploadProject(this.moduleName, {
        force: true,
        projectList: [projectName],
      }).then((list) => {
        this.$store.dispatch('showSnackBar',
          { message: this.$t('BlocklyPageView.sync.uploadProject').replace('{}', list.length) });
      });
      this.projectList = window.FileManager.listProjectListSync(this.moduleName, { sortOrderDesc: true });
      eventBus.$emit('project-name-changed', projectName);
      eventBus.$emit('project-file-content-changed', this.blocklyData.projectContent);
      window.Studio.userTracking.insertItem('blocklyFileSaveTimes');
    },
    saveAsProject(callback) {
      const self = this;
      callback = callback || (() => {});
      swal({
        title: self.$t('dialog.saveProject.inputName'),
        input: 'text',
        width: window.usui.width,
        showCancelButton: true,
        confirmButtonText: self.$t('dialog.saveProject.okBtn'),
        cancelButtonText: self.$t('dialog.saveProject.cancelBtn'),
        confirmButtonColor: window.usui.okBtnColor,
        cancelButtonColor: window.usui.cancelBtnColor,
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        reverseButtons: true,
        preConfirm: text => new Promise((resolve, reject) => {
          const projects = window.FileManager.listProjectListSync(self.moduleName, { sortOrderDesc: true });
          const projectsNameList = [];
          for (const p of projects) {
            projectsNameList.push(p.basename);
          }
          if (text.length === 0) {
            reject(`${self.$t('dialog.saveProject.faila')} ${text}.`);
          }
          else if (projectsNameList.indexOf(text) >= 0) {
            reject(`${text} ${self.$t('dialog.saveProject.failb')}`);
          }
          else {
            resolve();
          }
        }),
      }).then((text) => {
        this.saveProjectToDisk(text);
        this.$store.dispatch('showSnackBar', { message: `${self.$t('dialog.saveProject.newname')}: ${text}` });
        this.show.editMode = false;
        callback();
      });
    },
    saveProject(callback) {
      const self = this;
      callback = callback || (() => {});
      if (self.blocklyData.projectName === null) {
        this.saveAsProject(callback);
      }
      else {
        const filename = self.blocklyData.projectName;
        this.saveProjectToDisk(filename);
        this.$store.dispatch('showSnackBar', { message: self.$t('dialog.saveProject.success') });
        this.show.editMode = false;
        callback();
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.side-wrapper {
  .mu-list{
    margin-bottom: 3vw;
    .mu-divider{
      display: none;
    }
    .mu-item-content {
      padding-left: 2vw;
    }
  }
}

.collapse-wrapper {
  background: white;
  height: 60%;
  color: #555;
}
.accordion .title_icon{
  padding: 0 2vw;
}

.highlight-project-item {
  color: #AE393B;
}

.mission {
  // width: 390px;
  // width: 37.6%;
  // height: 800px;
  position:relative;
  top:-1px;
  height: 90%;
  background: #FFFFFF;
  box-shadow: -2px 0 4px 0 rgba(0,0,0,0.10);
  display: none;
  z-index: 20;
  padding-bottom:2vh;
}
.mission-head {
  position: absolute;
  width: 100%;
  height: 55px;
  background: #D95E2E;
}
.mission-title {
  position: absolute;
  left: 21px;
  width: 300px;
  height: 55px;
  font-family: BigJohn;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 55px;
}
.mission-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 55px;
  height: 55px;
  cursor: pointer;
  // background: green;
}
.mission-content {
  position: absolute;
  top: 55px;
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  // background: yellow;
}
/* Style the accordion panel. Note: hidden by default */

</style>
