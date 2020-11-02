/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-27 14:49:26
 * @LastEditors: qingyang
 * @LastEditTime: 2020-11-02 15:12:50
 */

 import {parseHTML} from './html-parser'
 import {parseText} from './text-parser'
 import { no } from '../../shared/util'

export const onRE = /^@|^v-on:/
export const dirRE = process.env.VBIND_PROP_SHORTHAND
  ? /^v-|^@|^:|^\.|^#/
  : /^v-|^@|^:|^#/
export const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/
export const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
const stripParensRE = /^\(|\)$/g
const dynamicArgRE = /^\[.*\]$/

const argRE = /:(.*)$/
export const bindRE = /^:|^\.|^v-bind:/
const propBindRE = /^\./
const modifierRE = /\.[^.\]]+(?=[^\]]*$)/g

const slotRE = /^v-slot(:|$)|^#/

const lineBreakRE = /[\r\n]/
const whitespaceRE = /\s+/g

const invalidAttributeRE = /[\s"'<>\/=]/

// const decodeHTMLCached = cached(he.decode)

export const emptySlotScopeToken = `_empty_`

export let warn
let delimiters
let transforms
let preTransforms
let postTransforms
let platformIsPreTag
let platformMustUseProp
let platformGetTagNamespace
let maybeComponent



export const createASTElement = (tag, attrs, parent) => {
    return {
        type: 1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        rawAttrsMap: {},
        parent,
        children: []
    }
}

export const pluckModuleFunction = () => {
  (module,key) => {
    return modules
    ? modules.map(m => m[key]).filter(_ => _)
    : []
  }
}

export const parse = (template, options) => {
  platformIsPreTag = options.isPreTag || no;
  platformIsPreTag = options.isPreTag || no
  platformMustUseProp = options.mustUseProp || no
  platformGetTagNamespace = options.getTagNamespace || no
  const isReservedTag = options.isReservedTag || no
  maybeComponent = (el) => !!el.component || !isReservedTag(el.tag)

  transforms = pluckModuleFunction(options.modules, 'transformNode')
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

  delimiters = options.delimiters
  const stack = []
  const preserveWhitespace = options.preserveWhitespace !== false
  const whitespaceOption = options.whitespace
  let root
  let currentParent
  let inVPre = false
  let inPre = false
  let warned = false

  function warnOnce (msg, range) {
    if (!warned) {
      warned = true
      console.warn(msg, range)
    }
  }
  function closeElement (element) {
    trimEndingWhitespace(element)
    if (!inVPre && !element.processed) {
      element = processElement(element, options)
    }
    if (!stack.length && element !== root) {
      // TODO
    } else {
      
    }

    if (currentParent && !element.forbidden) {
      currentParent.children.push(element)
      element.parent = currentParent
    }
    // final children cleanup
    // filter out scoped slots
    element.children = element.children.filter(c => !(c).slotScope)
    // remove trailing whitespace node again
    trimEndingWhitespace(element)
    // check pre state
    if (element.pre) {
      inVPre = false
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false
    }
    // apply post-transforms
    // for (let i = 0; i < postTransforms.length; i++) {
    //   postTransforms[i](element, options)
    // }
  }

  function trimEndingWhitespace (el) {
    // remove trailing whitespace node
    if (!inPre) {
      let lastNode
      while (
        (lastNode = el.children[el.children.length - 1]) &&
        lastNode.type === 3 &&
        lastNode.text === ' '
      ) {
        el.children.pop()
      }
    }
  }
  // 解析html
  parseHTML(template, {
    warn: options.warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    outputSourceRange: options.outputSourceRange,
    start(tag, attrs, unary) {
      //每当解析到标签开始的位置时，触发
      console.log('解析开始'+tag);
      let element = createASTElement(tag, attrs, currentParent);
      if (!root) {
        root = element
      }
      if (!unary) {
        currentParent = element
        stack.push(element)
      } else {
        closeElement(element)
      }
    },
    end() {
      //每当解析到标签结束的位置时，触发
      console.log('解析结束')
      const element = stack[stack.length - 1]
      // pop stack
      stack.length -= 1
      currentParent = stack[stack.length - 1]
      closeElement(element)
    },
    chars(text, start, end) {
      //每当解析到文本时触发
      console.log('解析到文本',text)
      const children = currentParent.children
      if (text) {
        let res
        let child
        if(text !== ' ' && (res = parseText(text, delimiters))) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text
          }
        } else {
          child = {
            type: 3,
            text
          }
        }
        if (child) {
          children.push(child)
        }
      }

    },
    comment(text, start, end) {
      //每当解析到注释时触发
      if(currentParent) {
        console.log('解析到注释' + text)
        let element = {
          type: 3,
          text,
          isComment: true
        }
        currentParent.children.push(element)
      }
    }
  })
  return root;
}

const makeAttrsMap = (attrs) => {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    map[attrs[i].name] = attrs[i].value
  }
  return map
}

export function processElement (
  element,
  options
) {
  // processKey(element)

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = (
    !element.key &&
    !element.scopedSlots &&
    !element.attrsList.length
  )

  // processRef(element)
  // processSlotContent(element)
  // processSlotOutlet(element)
  // processComponent(element)
  // for (let i = 0; i < transforms.length; i++) {
  //   element = transforms[i](element, options) || element
  // }
  processAttrs(element);  //解析标签中的属性
  return element
}


function processAttrs (el) {
  const list = el.attrsList
  let i, l, name, value, modifiers
  for (i = 0, l = list.length; i < l; i++) {
    name  = list[i].name
    value = list[i].value
    if (dirRE.test(name)) {
      // 解析修饰符
      modifiers = parseModifiers(name)
      if (modifiers) {
        name = name.replace(modifierRE, '')
      }
      if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '')
        debugger
        addHandler(el, name, value, modifiers, false, warn)
      }
    }
  }
}

function parseModifiers (name) {
  const match = name.match(modifierRE)
  if (match) {
    const ret = {}
    match.forEach(m => { ret[m.slice(1)] = true })
    return ret
  }
}

function processKey (el) {
  const exp = getBindingAttr(el, 'key')
  if (exp) {
    if (process.env.NODE_ENV !== 'production') {
      if (el.tag === 'template') {
        warn(
          `<template> cannot be keyed. Place the key on real elements instead.`,
          getRawBindingAttr(el, 'key')
        )
      }
      if (el.for) {
        const iterator = el.iterator2 || el.iterator1
        const parent = el.parent
        if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
          warn(
            `Do not use v-for index as key on <transition-group> children, ` +
            `this is the same as not using keys.`,
            getRawBindingAttr(el, 'key'),
            true /* tip */
          )
        }
      }
    }
    el.key = exp
  }
}

function processRef (el) {
  const ref = getBindingAttr(el, 'ref')
  if (ref) {
    el.ref = ref
    el.refInFor = checkInFor(el)
  }
}

export function processFor (el) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const res = parseFor(exp)
    if (res) {
      extend(el, res)
    } else if (process.env.NODE_ENV !== 'production') {
      warn(
        `Invalid v-for expression: ${exp}`,
        el.rawAttrsMap['v-for']
      )
    }
  }
}