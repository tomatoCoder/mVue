/*
 * @Description: 依赖层
 * @Author: qingyang
 * @Date: 2020-08-22 14:18:57
 * @LastEditors: qingyang
 * @LastEditTime: 2020-09-02 16:10:45
 */
export default class Dep {
    constructor() {
        this.subs = []
    }
    addSub(sub) {    // sub 就是watcher
        this.subs.push(sub)
    }
    removeSub(sub) {
        remove(this.subs, sub)
    }
    depend() {
        if(Dep.target) {
            this.addSub(Dep.target)
        }
    }
    notify() {
        const subs = this.subs.slice()
        for(let i = 0; i < subs.length; i++) {
            subs[i].update();
        }
    }
}


function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
          return arr.splice(index, 1)
        }
    } 
}

Dep.target = null
const targetStack = []

export function pushTarget (target) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}