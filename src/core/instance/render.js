/*
 * @Description: 初始化渲染
 * @Author: qingyang
 * @Date: 2020-10-26 13:19:03
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-26 15:32:50
 */

import VNode, { createEmptyVNode } from '../vdom/vnode'
import { emptyObject } from '../utils/index'
export const initRender = (vm) => {
    vm._vnode = null;
    const options = vm.$options;
    const parentVnode = vm.$vnode = options._parentVnode;
    const renderContext = parentVnode && parentVnode.context

    //处理slot
    // vm.$slots = resolveSlots(options._renderChildren, renderContext)
    vm.$scopeSlots = emptyObject;

    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
    vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);

}