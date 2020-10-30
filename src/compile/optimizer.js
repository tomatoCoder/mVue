/*
 * @Description: 优化阶段
 * @Author: qingyang
 * @Date: 2020-10-29 09:57:36
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-30 13:30:19
 */

import { makeMap, no, cached, isBuiltInTag } from '../shared/util'

let isStaticKey
let isPlatformReservedTag
const genStaticKeysCached = cached(genStaticKeys)


// 找出静态节点并标记
export const optimize = (root, options) => {
    if (!root) return
    isStaticKey = genStaticKeysCached(options.staticKeys || '');
    isPlatformReservedTag = options.isReservedTag || no;
    // 标记静态节点
    markStatic(root)
    // 标记静态根节点
    markStaticRoots(root, false)
}

function genStaticKeys (keys) {
    return makeMap(
      'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
      (keys ? ',' + keys : '')
    )
}


const markStatic = (node) => {
    node.static = isStatic(node);
    if (node.type === 1) {
        for (let i = 0, l = node.children.length ; i < l ; i++) {
            const child = node.children[i];
            markStatic(child);
            if (!child.static) {
                node.static = false
            }         
        }
        if (node.ifConditions) {
            for (let i = 1, l = node.ifConditions.length; i < l; i++) {
              const block = node.ifConditions[i].block
              markStatic(block)
              if (!block.static) {
                node.static = false
              }
            }
        }
    }
}

function markStaticRoots (node, isInFor) {
    if (node.type === 1) {
      if (node.static || node.once) {
        node.staticInFor = isInFor
      }
      // For a node to qualify as a static root, it should have children that
      // are not just static text. Otherwise the cost of hoisting out will
      // outweigh the benefits and it's better off to just always render it fresh.
      if (node.static && node.children.length && !(
        node.children.length === 1 &&
        node.children[0].type === 3
      )) {
        node.staticRoot = true
        return
      } else {
        node.staticRoot = false
      }
      if (node.children) {
        for (let i = 0, l = node.children.length; i < l; i++) {
          markStaticRoots(node.children[i], isInFor || !!node.for)
        }
      }
      if (node.ifConditions) {
        for (let i = 1, l = node.ifConditions.length; i < l; i++) {
          markStaticRoots(node.ifConditions[i].block, isInFor)
        }
      }
    }
  }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
const isStatic = (node) => {
    // node.type:   1 元素节点  2.包含变量的动态文本节点  3.不包含变量的纯文本节点
    if (node.type === 2) {
        // 包含变量的文本节点
        return false
    }
    if (node.type === 3) {
        // 不包含变量的纯文本节点
        return true
    }
    /**
     * 如果元素节点是静态节点，那就必须满足以下几点要求：
        如果节点使用了v-pre指令，那就断定它是静态节点；
        如果节点没有使用v-pre指令，那它要成为静态节点必须满足：
        不能使用动态绑定语法，即标签上不能有v-、@、:开头的属性；
        不能使用v-if、v-else、v-for指令；
        不能是内置组件，即标签名不能是slot和component；
        标签名必须是平台保留标签，即不能是组件；
        当前节点的父节点不能是带有 v-for 的 template 标签；
        节点的所有属性的 key 都必须是静态节点才有的 key，
        注：静态节点的key是有限的，它只能是type,tag,attrsList,attrsMap,plain,parent,children,attrs之一
     */
    return !!(node.pre || (
        !node.hasBindings && // no dynamic bindings
        !node.if && !node.for && // not v-if or v-for or v-else
        !isBuiltInTag(node.tag) && // not a built-in
        isPlatformReservedTag(node.tag) && // not a component
        !isDirectChildOfTemplateFor(node) &&
        Object.keys(node).every(isStaticKey)
      ))
}

function isDirectChildOfTemplateFor (node) {
    while (node.parent) {
      node = node.parent
      if (node.tag !== 'template') {
        return false
      }
      if (node.for) {
        return true
      }
    }
    return false
  }