/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-08-22 16:08:57
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-16 10:50:34
 */
import Observer from './core/observer'
import Watcher from './core/observer/watcher'
import Compile from './compile'

export default class MVue {
    constructor (options) {
        this.data = options.data;
        this.methods = options.methods;
        new Observer(this.data);  
        new Compile(options.el, this);
        // ele.innerHTML = this.data[options.exp];  // 初始化模板数据的值
        // new Watcher(this, options.exp, function (value) {
        //     ele.innerHTML = value;
        // });    
    }
}