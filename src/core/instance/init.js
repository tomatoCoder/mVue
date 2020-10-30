/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-26 13:18:29
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-30 16:40:24
 */

import { initLifecycle, callHook } from './lifecycle'
import { initEvents } from './events'
import { initRender } from './render'
import {initProvide, initInjections } from './inject'
import { initState } from './state'
import Compile, {createCompiler} from '../../compile'

export const init = (vue) => {
    const vm = vue;
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    //TODO $mount方法
    if (vm.$options.el) {
        debugger
        vm.$mount(vm.$options.el)
        // new Compile(vm.$options.el, vm); // 解析模板
        // createCompiler(' <div id="NLRX"><p>Hello {{name}}</p></div>  ',vm.$options)

    }
}