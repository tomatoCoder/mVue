/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-23 17:27:13
 * @LastEditors: qingyang
 * @LastEditTime: 2020-11-02 14:52:54
 */
import  { observe } from '../observer/index'
import {noop, bind} from '../utils/index'
import Dep, { pushTarget, popTarget } from '../observer/dep'

export const initState = (vm) => {
    vm._wathcers = [];
    const opts = vm.$options;
    if (opts.props) initProps(vm, opts.props)
    if (opts.methods) initMethods(vm, opts.methods)
    if (opts.data) {
        initData(vm)
    } else {
        observe(vm._data = {}, true /* asRootData */)
    }
    if (opts.computed) initComputed(vm, opts.computed)
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch)
    }
}


const initProps = (vm, props) => {
    const propsData = vm.$options.propsData || {}

}

const initMethods = (vm, methods) => {
    const props = vm.$options.props
    for (const key in methods) {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof methods[key] !== 'function') {
          console.warn(
            `Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
            `Did you reference the function correctly?`
          )
        }
        if (props && hasOwn(props, key)) {
            console.warn(
            `Method "${key}" has already been defined as a prop.`
          )
        }
        if ((key in vm) && isReserved(key)) {
            console.warn(
            `Method "${key}" conflicts with an existing Vue instance method. ` +
            `Avoid defining component methods that start with _ or $.`
          )
        }
      }
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
    }
}
const initComputed = (vm, computed) => {

}

const initWatch = (vm, watch) => {

}

const initData = (vm) => {
    let data = vm.$options.data;
    data  = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
    observe(data, true)  
}

export function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}