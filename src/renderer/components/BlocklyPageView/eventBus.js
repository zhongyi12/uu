/**
 * Created by alex on 2017/4/5.
 */
import Vue from 'vue';

// exports.default = bus;
module.exports = new Vue();

/*
Event list:
|Component name      | Event name                    | Parameter |
|--------------------|-------------------------------|-----------|
SidebarComponent.vue | rename-project                | projectName
SidebarComponent.vue | save-project                  | void
SidebarComponent.vue | prompt-save-project           | callback
SidebarComponent.vue | new-project                   | void
SidebarComponent.vue | refresh-project-list          | void
BlocklyPageView.vue  | xml-code-changed              | xmlCode
BlocklyPageView.vue  | js-code-changed               | jsCode
BlocklyPageView.vue  | project-save-changed          | status
BlocklyPageView.vue  | project-content-changed       | content
BlocklyPageView.vue  | project-file-content-changed  | fileContent
BlocklyPageView.vue  | project-name-changed          | projectName
BlocklyPageView.vue  | contain-vision-block-changed  | status
BlocklyComponent.vue | blockly-load-project          | projectFilename
BlocklyComponent.vue | blockly-clear-project         | void
BlocklyComponent.vue | blockly-start-project         | void
BlocklyComponent.vue | blockly-stop-project          | void
BlocklyComponent.vue | blockly-sidebar-re-size       | void
 */
