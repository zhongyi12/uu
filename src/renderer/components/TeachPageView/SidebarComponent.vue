<template lang="html">
    <div class="s12 side-wrapper">
        <!--<div class="collapse-wrapper" v-show="teachStatus.readyRecord">-->
        <!--<statusbar :show-home="show.home"></statusbar>-->
        <!--<userprofile v-show="show.profile"></userprofile>-->
        <!--<newsfeed v-show="show.news"></newsfeed>-->
        <div v-show="show.home" class="collapse-wrapper accordion-wrapper">
            <div class="accordion" v-bind:class="{active:show.record}" @click="show.record = !show.record">
                <span class="title" >{{ $t("BlocklyPageView.sidebar.project_name") }}</span>
                <!--<div class="edit-sync icon-right" :tooltip="$t('common.tooltip.sync')" slot="right" @click="cloudSync">-->
                    <!--<img src="../assets/img/cloud_downloading.svg"  alt="Sync">-->
                <!--</div>-->
            </div>
            <!--<div @click="changeEditMode" v-show="show.editMode && show.record" class="edit-done">{{$t('common.done')}}</div>-->
            <div v-show="show.record">
                <div class="panel" >
                    <mu-table enableSelectAll multiSelectable :showCheckbox="show.editMode" @rowSelection="getSelectRow" ref="projectTable">
                      <mu-thead slot="header">
                        <mu-tr>
                          <mu-th lang="id" tooltip="ID">ID</mu-th>
                          <mu-th lang="name" tooltip="名称">{{$t('common.fileName')}}</mu-th>
                          <mu-th tooltip=""></mu-th>
                        </mu-tr>
                      </mu-thead>
                      <mu-tbody>
                        <mu-tr lang="checkbox" v-for="item,index in recordItem.recordList" :selected="item.selected">
                          <mu-td lang="id">{{index + 1}}</mu-td>
                          <mu-td lang="name" v-on:dblclick.native="loadRecord(item.basename)">{{item.basename.length < 20 ? item.basename : item.basename.substring(0, 20) + '...'}}</mu-td>
                          <mu-td>
                            <div class="item-edit-btn" v-show="show.editMode" @click="renameRecord(item.basename)"><img src="./assets/img/item_edit.svg"  alt="" ></div>
                            <div class="item-edit-btn" @click="exportRecord(item.basename)" v-show="!show.editMode"><img src="./assets/img/item_export.svg" ></div>
                          </mu-td>
                        </mu-tr>
                      </mu-tbody>
                    </mu-table>

                  <!--<mu-list >-->
                      <!--<mu-divider shallowInset/>-->
                      <!--<mu-list-item v-for="item in recordItem.recordList" :title="item.basename.length < 20 ? item.basename : item.basename.substring(0, 20) + '...'"-->
                                    <!--:titleClass=" item === recordItem.playRecordName ? 'highlight-project-item' : 'normal' "-->
                                    <!--v-on:dblclick.native="loadRecord(item.basename)">-->
                          <!--<mu-checkbox name="cb_project" v-model="recordChecked" :nativeValue="item" slot="left" v-show="show.editMode" />-->
                          <!--&lt;!&ndash; <mu-icon value="edit" slot="right" @click="renameRecord(item)" v-show="show.editMode" />-->
                          <!--<mu-icon value="edit" slot="right" @click="exportRecord(item)" v-show="show.editMode" /> &ndash;&gt;-->
                          <!--<img slot="right" src="./assets/img/item_edit.svg" @click="renameProject(item.basename)" alt="" v-show="show.editMode" >-->
                          <!--<img slot="right" src="./assets/img/item_export.svg" @click="exportProject(item.basename)" alt="" v-show="show.editMode" >-->
                      <!--</mu-list-item>-->
                  <!--</mu-list>-->

                  <!--<div v-if="show.editMode" class="edit-icon" alt="">-->
                    <!--<div v-if="recordChecked.length >0" @click="selectedCheckbox"  class="edit-delete"></div>-->
                    <!--<div v-else class="edit-delete-disable"></div>-->
                  <!--</div>-->
                  <!--<div v-else class="edit-icon" alt="">-->
                    <!--<div @click="changeEditMode()"  class="edit-edit"></div>-->
                    <!--<div @click="openFolder"  class="edit-import"></div>-->
                  <!--</div>-->

                </div>
                <div class="edit-wrapper">
                    <div v-if="show.editMode" class="edit-icon" alt="">
                      <mu-icon-button  @click="changeEditMode" v-show="show.editMode && show.record" class="edit-done common-btn">
                        {{$t('common.done')}}
                      </mu-icon-button>
                      <mu-icon-button class="common-btn import-btn" :tooltip="$t('common.tooltip.import')" @click="openFolder">
                      </mu-icon-button>
                      <div class="delete-wrapper">
                        <div v-if="recordChecked.length >0" @click="selectedCheckbox" class="edit-delete "></div>
                        <div v-else class="edit-delete-disable" ></div>
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
            <form id='f_form' class="hide">
              <input id='f_input' type='file' @change="didImport()"/>
            </form>
            <!-- <img src="./assets/img/btn_edit.svg" alt="" class="edit_icon" @click="changeEditMode" v-show="!show.editMode">
            <div class="edit_icon" @click="changeEditMode" v-show="show.editMode">Done</div>
            <div class="edit_icon" style="top:550px;" @click="selectedCheckbox" v-show="show.editMode">Del</div>
            <div class="edit_icon" style="right:1px;" @click="openFolder">Folder</div> -->
            <!--<mu-list v-show="show.record">-->
                <!--<mu-list-item v-for="item in recordItem.recordList" v-on:dblclick.native="loadRecord(item)">-->
                    <!--{{item}}-->
                    <!--<mu-icon-menu slot="right" icon="fa fa-ellipsis-v">-->
                        <!--<mu-menu-item title="Load" @click="loadRecord(item)"/>-->
                        <!--<mu-menu-item title="Rename" @click="renameRecord(item)"/>-->
                        <!--<mu-menu-item title="Delete" @click="deleteRecord(item)"/>-->
                    <!--</mu-icon-menu>-->
                <!--</mu-list-item>-->
            <!--</mu-list>-->
        </div>
    </div>
</template>

<script>
import swal from 'sweetalert2';
import eventBus from './eventBus';
import userprofile from '../CommonPageView/userProfile.vue';
import statusbar from '../CommonPageView/statusBar.vue';
import newsfeed from '../CommonPageView/newsFeed.vue';
import eventBusComm from '../CommonPageView/eventBus';
import fs from 'fs';
export default {
  props: ['recordItem', 'moduleName'],
  data() {
    return {
      recordChecked: [],
      show: {
        record: true,
        mission: true,
        editMode: false,
        profile: false,
        home: true,
        news: false,
      },
      renameRecordName: null,
      titleImage: require(`${this.$t('recordApp.imageProject')}`),
    };
  },
  mounted() {
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
  methods: {
    unselect() {
      this.$refs.projectTable.unSelectAll();
    },
    getSelectRow(selectedRows) {
      this.recordChecked.length = 0;
      for (let i = 0; i < selectedRows.length; i++) {
        this.recordChecked.push(this.recordItem.recordList[selectedRows[i]].basename);
      }
    },
    exportRecord(filename) {
//        console.log('export project');
      const projectContent = window.FileManager.loadProjectSync(this.moduleName, filename);
//        console.log(projectContent);
      if (projectContent === null) {
        swal({
          title: 'No selected project',
          text: 'No selected project',
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: window.usui.okBtnColor,
          // cancelButtonColor: '#d33',
          confirmButtonText: 'OK',
        }).then(() => {
        });
        return;
      }
//        console.log(projectContent);
      filename = filename.replace('.rec', '');
      filename += '.rec';
      this.downloadRec(filename, projectContent);
    },
    downloadRec(filename, text) {
      let csv;
      if (text === null) {
        text = '';
      }
      csv = 'data:text/rec;charset=utf-8,';
      csv += text;
      const data = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    },
    openFolder() {
//        console.log('open Folder');
      // window.FileManager.openTeachFolder();
      this.importProject();
    },
    importProject() {
//      console.log('import project');
      document.getElementById('f_input').click();
    },
    didImport() {
//        console.log('did import');
      const file = document.getElementById('f_input').files[0];
      let file_name = file.name;
      file_name = file_name.replace('.rec', '');
      let counter = 1;
      const projects = window.FileManager.listProjectListSync(this.moduleName, { sortOrderDesc: true });
      const projectNameList = [];
      for (const p of projects) {
        projectNameList.push(p.name);
      }
      while (projectNameList.indexOf(file_name) >= 0) {
        file_name = file.name.replace('.rec', '');
        file_name += '(';
        file_name += counter;
        file_name += ')';
        counter++;
      }
      const content = fs.readFileSync(file.path, 'utf8');
      if (content !== null && content.split(/\r\n|\r|\n/).length >= 0) {
        // console.log('file correct');
        window.FileManager.saveProjectSync(this.moduleName, file_name, content);
        eventBus.$emit('refresh-project-list');
      }
      else {
        // console.log('file wrong');
        swal({
          title: 'Sorry',
          text: 'This file can not be imported in Teach & Play.',
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: window.usui.okBtnColor,
          cancelButtonColor: window.usui.cancelBtnColor,
          confirmButtonText: 'OK',
          reverseButtons: true,
        }).then(() => {
        });
      }
      document.getElementById('f_input').value = null;
      document.getElementById('f_input').files = null;
      eventBus.$emit('refresh-record-list');
    },
    selectedCheckbox() {
//        console.log(this.recordChecked);
      this.deleteRecord(this.recordChecked);
    },
    changeEditMode() {
      this.show.editMode = !this.show.editMode;
      this.unselect();
    },
    deleteRecord(items) {
      const self = this;
      const size = items.length;
//        console.log(items);
      if (size <= 0) {
        swal(this.$t('dialog.noSelectProject.title'), this.$t('dialog.noSelectProject.text'), 'error');
        return;
      }
      swal({
//        title: this.$t('dialog.deleteWarning.title'),
        text: this.$t('dialog.deleteWarning.text'),
        width: window.usui.width,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('dialog.deleteWarning.confirmButtonText'),
        cancelButtonText: this.$t('dialog.deleteWarning.cancelButtonText'),
        confirmButtonColor: window.usui.deleteBtnColor,
        cancelButtonColor: window.usui.cancelBtnColor,
        reverseButtons: true,
      }).then(() => {
//          self.recordItem.deleteRecordName = recordName;
        for (let i = 0; i < items.length; i++) {
          const recordName = items[i];
          eventBus.$emit('delete-record-changed', recordName);
          if (self.recordItem.playRecordName !== null) {
            if (recordName === self.recordItem.playRecordName) {
              eventBus.$emit('discard-record', recordName);
//              self.discardRecord();
            }
          }
          window.FileManager.deleteProjectSync(self.moduleName, recordName);
        }
        eventBus.$emit('refresh-record-list');
        self.recordChecked = [];
        this.show.editMode = false;
        swal(
          this.$t('dialog.deleteRecord.title'),
          this.$t('dialog.deleteRecord.html'),
          'success',
        );
      }, () => {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      });
    },
    loadRecord(recordName) {
      eventBus.$emit('load-record', recordName);
    },
    renameRecord(recordName) {
      const self = this;
      // console.log('recordName');
      // console.log(this.recordItem);
      this.renameRecordName = recordName;
      swal({
        text: this.$t('dialog.nameRecord.title'),
        input: 'text',
        width: window.usui.width,
        showCancelButton: true,
        confirmButtonText: this.$t('dialog.nameRecord.okbtn'),
        cancelButtonText: this.$t('dialog.nameRecord.cancelbtn'),
        showLoaderOnConfirm: true,
        confirmButtonColor: window.usui.okBtnColor,
        cancelButtonColor: window.usui.cancelBtnColor,
        reverseButtons: true,
        preConfirm(text) {
          return new Promise((resolve, reject) => {
            const projects = window.FileManager.listProjectListSync(self.moduleName, { sortOrderDesc: true });
            const projectNameList = [];
            for (const p of projects) {
              projectNameList.push(p.basename);
            }
            if (text.length === 0) {
              reject(`${this.$t('dialog.nameRecord.faila')} ${text}.`);
            }
            else if (projectNameList.indexOf(text) >= 0) {
              reject(`${text} ${this.$t('dialog.nameRecord.failb')}`);
            }
            else {
              resolve();
            }
          });
        },
        allowOutsideClick: false,
      }).then((text) => {
        swal({
          type: 'success',
          title: this.$t('dialog.nameRecord.saved'),
          html: `${this.$t('dialog.nameRecord.filename')}: ${text}`,
        });
//          self.recordItem.renameRecordName = file_item;
        eventBus.$emit('rename-record-name', recordName);
        if (self.recordItem.playRecordName !== null) {
          if (self.recordItem.renameRecordName === self.recordItem.playRecordName) {
            eventBus.$emit('discard-record', recordName);
//              self.discardRecord();
          }
        }
        const new_filename = text;
        const old_filename = this.renameRecordName;
        window.FileManager.renameProjectSync(self.moduleName, old_filename, new_filename);
        eventBus.$emit('refresh-record-list');
      });
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
        .mu-list-right{
          img{
            padding: 0 1vw;
          }
        }
    }
  }
.highlight-project-item {
    color: #AE393B;
}
.collapse-wrapper{
  height: 100%;
  width: 100%;
  .accordion{
    .title_icon{
      padding: 0 1vw;
    }
  }

}
  div.panel {
      overflow: auto;
      max-height:80vh;
  }
  .edit-wrapper {
    background-color:#fff;
    min-height:80px;
    position:absolute;
    bottom:0;
    right:0;
    width:100%;
  }
</style>
