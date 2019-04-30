/**
 * Created by Jeffrey on 2017/4/13.
 */
import Vue from 'vue';

// exports.default = bus;
module.exports = new Vue();

/*
Event list:
|Component name      | Event name                    | Parameter |
|--------------------|-------------------------------|-----------|
PaintComponent.vue   | addShapes                     | index
PaintComponent.vue   | genGcode                      | void
PaintComponent.vue   | startPrint                    | setting
PaintComponent.vue   | stopPrint                     | void
PaintComponent.vue   | pausePrint                    | void
PaintComponent.vue   | resumePrint                   | void

*/
