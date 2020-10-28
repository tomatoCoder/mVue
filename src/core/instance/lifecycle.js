/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-26 13:20:26
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-28 09:46:27
 */

export let activeInstance = null;
export let isUpdatingChildComponent = false;

export function setActiveInstance(vm) {
    const preActiveInstance = activeInstance;
    activeInstance = vm;
    return () => {
        activeInstance = preActiveInstance
    }
}

export const initLifecycle = (vm) => {
    const options = vm.$options;
    // let parent = options.parent;
    // 判断是否存在父组件
    // if (parent && !options.abstract) {
    //     while (parent.$options.abstract && parent.$parent) {
    //       parent = parent.$parent
    //     }
    //     parent.$children.push(vm)
    // }
    // vm.$parent = parent;
    //为实例挂载属性
    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestoryed = false;
    vm._isBeingDestroyed = false;
}

export const callHook = (vm, hook) => {
    console.log(hook);
    const handlers = vm.$options[hook];
    if ( handlers ) {
        for (let i = 0, j = handlers.length; i < j; i++) {
            try {
                handlers[i].call(vm)
            } catch (e) {
            }
        }
    }
    if (vm._hasHookEvent) {
        vm.$emit('hook' + hook);
    }
}
