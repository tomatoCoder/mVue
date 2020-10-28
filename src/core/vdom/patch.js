/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-27 14:57:56
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-28 11:20:49
 */

 import VNode, { cloneVNode } from './vnode'

import {
    isDef,
    isTrue,
    isUndef
} from '../utils/index'
const sameVnode = (a, b) => {
    return (
        a.key === b.key && (
            (
                a.tag === b.tag &&
                a.isComment === b.isComment && 
                isDef(a.data) === isDef(b.data) && 
                sameInputType(a, b)
            ) || (
                isTrue(a.isAsyncPlaceholder) &&
                a.asyncFactory === b.asyncFactory &&
                isUndef(b.asyncFactory.error)
            ) 
        )
    )
}


const sameInputType = (a, b) => {
    if (a.tag !== 'input') return true
    let i 
    const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type
    const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

const createElm = (vnode, parentElm, refElm) => {
    const data = vnode.data;
    const children = vnode.children;
    const tag = vnode.tag;
    if (isDef(tag)) {
        // 如果有元素标签，则创建元素节点
        vnode.elm = nodeOps.createElement(tag, vnode)   // 创建元素节点
        createChildren(vnode, children, insertedVnodeQueue) // 创建元素节点的子节点
        insert(parentElm, vnode.elm, refElm)       // 插入到DOM中
    } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text)  // 创建注释节点
        insert(parentElm, vnode.elm, refElm)           // 插入到DOM中
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text)  // 创建文本节点
        insert(parentElm, vnode.elm, refElm)           // 插入到DOM中
      }
}
const isTextInputType = (tag) => {

}


const addVnodes = (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) => {
    for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx)
    }
}


function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm)
      }
    }
    remove.listeners = listeners
    return remove
  }
  
const removeVnodes = (vnode, startIdx, endIdx) => {
    for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx]
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch)
            invokeDestroyHook(ch)
          } else { // Text node
            removeNode(ch.elm)
          }
        }
      }
} 

const removeAndInvokeRemoveHook = (vnode, rm) => {
    if (isDef(rm) || isDef(vnode.data)) {
      let i
      const listeners = cbs.remove.length + 1
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners)
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm)
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm)
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm)
      } else {
        rm()
      }
    } else {
      removeNode(vnode.elm)
    }
  }

const patchVnode = (oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) => {
    // 新旧vnode是否完全一样，一样则退出
    if (oldVnode === vnode) {
        return
    }
    const elm = vnode.elm = oldVnode.elm;
    // vnode与oldVnode是否都是静态节点 
    if (isTrue(vnode.isStatic) && 
        isTrue(oldVnode.isStatic) && 
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
        return
    }

    const oldCh = oldVnode.children
    const ch = vnode.children
    // vnode有text属性
    if (isUndef(vnode.text)) {
        // vnode的子节点与oldVnode的子节点是否都存在？
        if (isDef(oldCh) && isDef(ch)) {
            // 若都存在，判断子节点是否相同，不同则更新子节点
            if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
        }
         // 若只有vnode的子节点存在
        else if (isDef(ch)){
             /**
             * 判断oldVnode是否有文本？
             * 若没有，则把vnode的子节点添加到真实DOM中
             * 若有，则清空Dom中的文本，再把vnode的子节点添加到真实DOM中
             */
            if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
        }
        // 若只有oldnode的子节点存在
        else if (isDef(oldVnode)) {
            // 清空DOM中的子节点
            removeVnodes(elm, oldCh, 0, oldCh.length - 1)
        }
         // 若只有oldnode的子节点存在
        else if (isDef(oldCh)) {
        // 清空DOM中的子节点
            removeVnodes(elm, oldCh, 0, oldCh.length - 1)
        }
        // 若vnode和oldnode都没有子节点，但是oldnode中有文本
        else if (isDef(oldVnode.text)) {
            // 清空oldnode文本
            nodeOps.setTextContent(elm, '')
        }
    } 
     // 若有，vnode的text属性与oldVnode的text属性是否相同？
    else if (oldVnode.text !== vnode.text) {
        // 若不相同：则用vnode的text替换真实DOM的文本
        nodeOps.setTextContent(elm, vnode.text)
    }
}