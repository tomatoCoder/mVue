
/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-08-22 10:30:22
 * @LastEditors: qingyang
 * @LastEditTime: 2020-09-02 16:47:12
 */
import Dep from './dep'
import {def,hasProto,hasOwn,isObject} from '../utils/index'
import {arrayMethods} from './array'
export default class Observer {
    constructor (value) {
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0;
        def(value, '__ob__', this); //给对象添加__ob__的属性
        console.log('11111111111111111111111111111');
        if(Array.isArray(value)) {
          if (hasProto) {
            protoAugment(value, arrayMethods)
          } else {
            copyAugment(value, arrayMethods, arrayKeys)
          }
          this.observeArray(value);
        } else {
            this.walk(value);
        }
    }
    walk(obj) {
        const keys = Object.keys(obj);
        keys.forEach((item) => {
          defineRective(obj, item)
        })
    }
    observeArray (items) {
        for (let i = 0, l = items.length; i < l; i++) {
          observe(items[i])
        }
    }
}

export function observe (value, asRootData) {
    // if (!isObject(value) || value instanceof VNode) {
    //   return
    // }
    if (!isObject(value)) {
      return
    }
    let ob
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__
    } else  {
      ob = new Observer(value)
    }
    if (asRootData && ob) {
      ob.vmCount++
    }
    return ob
  }
function defineRective(obj, key, val) {
    if (arguments.length === 2) {
        val = obj[key]
    }
    if(typeof val === 'object') {
        new Observer(val)
    }
    const dep = new Dep()   //实现依赖
    let childOb = observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            if (childOb) {
              childOb.dep.depend() //收集依赖
            }
            return val;
        },
        set(newVal) {
            if(val === newVal) {
                return
            }
            console.log(`${key}属性被修改了`)
            val = newVal;
            dep.notify()   // 在setter中通知依赖更新
        }
    })
} 

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}