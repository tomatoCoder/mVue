/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-27 14:57:56
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-27 16:59:37
 */
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