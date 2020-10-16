/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-08-22 14:26:20
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-16 14:20:18
 */
import Dep, { pushTarget, popTarget } from './dep'
export default class Watcher {
    constructor (vm,expOrFn,cb) {
      this.vm = vm;
      this.cb = cb;
      this.expOrFn = expOrFn;
      this.getter = parsePath(expOrFn);
      this.value = this.get()
    }
    get() {
      // window.target = this;
      pushTarget(this)
      const vm = this.vm
      let value = this.getter.call(vm.data, vm.data);
      window.target = null;
      return value
    }
    update() {
      const oldValue = this.value
      this.value = this.get()
      this.cb.call(this.vm, this.value, oldValue)
    }
  }
  
  /**
   * Parse simple path.
   * 把一个形如'data.a.b.c'的字符串路径所表示的值，从真实的data对象中取出来
   * 例如：
   * data = {a:{b:{c:2}}}
   * parsePath('a.b.c')(data)  // 2
   */
  const bailRE = /[^\w.$]/
  export function parsePath (path) {
    if (bailRE.test(path)) {
      return
    }
    const segments = path.split('.')
    return function (obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) return
        obj = obj[segments[i]]
      }
      return obj
    }
  }