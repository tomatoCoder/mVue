/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-23 17:16:59
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-26 17:10:25
 */
import {init} from './init'

export default class Vue {
    constructor(options) {
        const vm = this;
        vm._self = vm;
        this.$options = options;
        this.data = options.data;
        init(this);          
    }
}