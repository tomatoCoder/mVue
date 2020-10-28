/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-27 14:49:26
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-28 18:01:19
 */

 import {parseHTML} from './html-parser'
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



export const parse = (template, options) => {
  const stack = []
  const preserveWhitespace = options.preserveWhitespace !== false
  const whitespaceOption = options.whitespace
  let root
  let currentParent
  let inVPre = false
  let inPre = false
  let warned = false
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
      let element = createASTElement(tag, attrs, currentParent)
      debugger
    },
    end() {
      //每当解析到标签结束的位置时，触发
      console.log('解析结束')
    },
    chars(text, start, end) {
      //每当解析到文本时触发
      console.log('解析到文本',text)
    },
    comment(text, start, end) {
      //每当解析到注释时触发
      console.log('解析到注释' + text)
    }
  })
}

const makeAttrsMap = (attrs) => {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    map[attrs[i].name] = attrs[i].value
  }
  return map
}