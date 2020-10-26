/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-26 13:19:17
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-26 17:02:03
 */
export const initEvents = (vm) => {
   // 创建事件对象
    vm._event = Object.create(null);
    vm._hasHookEvent = false;
    // const listeners = vm.$options._parentListeners;
    // if (listeners) {
    //     updateComponentListeners(vm, listeners);
    // }
}

const updateComponentListeners = (vm, listeners, oldListener) => {
    
}