/**
 * Created by alex on 2017/4/7.
 */
import Vue from 'vue';
const eventBus = new Vue();

// exports.default = bus;
module.exports = eventBus;

/*
Event list:
|Component name      | Event name                    | Parameter |
|--------------------|-------------------------------|-----------|
TeachComponent.vue   | teach-open-side               | void
TeachComponent.vue   | teach-close-side              | void
*/
