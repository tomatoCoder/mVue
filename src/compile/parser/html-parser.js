/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-28 13:41:50
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-28 18:04:56
 */

import { makeMap, no} from '../../shared/util'

import { unicodeRegExp } from '../../core/utils/lang'

export const isPlainTextElement = makeMap('script,style,textarea', true)

const isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
)
const comment = /^<!\--/
const conditionalComment = /^<!\[/
const doctype = /^<!DOCTYPE [^>]+>/i
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

const isIgnoreNewlineTag = makeMap('pre,textarea', true)
const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n'

function decodeAttr (value, shouldDecodeNewlines) {
  const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
  return value.replace(re, match => decodingMap[match])
}

export const parseHTML = (html, options) => {
  const stack = []     // 维护AST节点层级的栈
  const expectHTML = options.expectHTML
  const isUnaryTag = options.isUnaryTag || no;
  const canBeLeftOpenTag = options.canBeLeftOpenTag || no
  let index = 0
  let last, lastTag;


  // 开启一个while 循环
  while (html) {
      last = html;
      // 确保不是在纯文本标签
      if (!lastTag || !isPlainTextElement(lastTag)) {
         let textEnd = html.indexOf('<');
         /**
           * 如果html字符串是以'<'开头,则有以下几种可能
           * 开始标签:<div>
           * 结束标签:</div>
           * 注释:<!-- 我是注释 -->
           * 条件注释:<!-- [if !IE] --> <!-- [endif] -->
           * DOCTYPE:<!DOCTYPE html>
           * 需要一一去匹配尝试
           */
         if (textEnd === 0) {
           // 解析是否是注释
           if (comment.test(html)) {
              const commentEnd = html.indexOf('-->')
              if (commentEnd >= 0) {
                  options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3)
                  advance(commentEnd + 3)
                  continue
              }
            }
            // 解析是否是条件注释
            if (conditionalComment.test(html)) {
              const conditionalEnd = html.indexOf(']>')
    
              if (conditionalEnd >= 0) {
                advance(conditionalEnd + 2)
                continue
              }
            }
            // 解析是否是DOCTYPE
            const doctypeMatch = html.match(doctype)
            if (doctypeMatch) {
              advance(doctypeMatch[0].length)
              continue
            }
            // 解析是否是结束标签
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
              const curIndex = index
              advance(endTagMatch[0].length)
              parseEndTag(endTagMatch[1], curIndex, index)
              continue
            }
            // 匹配是否是开始标签
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
              handleStartTag(startTagMatch)
              if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
                advance(1)
              }
              continue
            }
         }
         let text, rest, next
         if (textEnd >= 0) {
            rest = html.slice(textEnd)
            while (
              !endTag.test(rest) &&
              !startTagOpen.test(rest) &&
              !comment.test(rest) &&
              !conditionalComment.test(rest)
            ) {
              // < in plain text, be forgiving and treat it as text
              next = rest.indexOf('<', 1)
              if (next < 0) break
              textEnd += next
              rest = html.slice(textEnd)
            }
            text = html.substring(0, textEnd)
         }
         if (text) {
           advance(text.length)
         }
         if (options.chars && text) {
           options.chars(text, index - text.length, index)
         }
      } else {
        // 解析的内容在纯文本标签里 (script,style,textarea)
      }
      if (html === last) {
        options.chars && options.chars(html)
        break
      }
  }
  function advance (n) {
    index += n
    html = html.substring(n)
  }
  function parseStartTag () {
    // 判断html是否存在开始标签
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index
      }
      advance(start[0].length)
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index
        advance(attr[0].length)
        attr.end = index
        match.attrs.push(attr)
      }
      if (end) {
        match.unarySlash = end[1]
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }

  function handleStartTag (match) {
    const tagName = match.tagName
    const unarySlash = match.unarySlash
    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag)
      }
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
        parseEndTag(tagName)
      }
    }

    const unary = isUnaryTag(tagName) || !!unarySlash

    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      const value = args[3] || args[4] || args[5] || ''
      const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      }
      if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        attrs[i].start = args.start + args[0].match(/^\s*/).length
        attrs[i].end = args.end
      }
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end })
      lastTag = tagName
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }

  function parseEndTag (tagName, start, end) {
    let pos, lowerCasedTagName
    if (start == null) start = index
    if (end == null) end = index

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase()
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            `tag <${stack[i].tag}> has no matching end tag.`,
            { start: stack[i].start, end: stack[i].end }
          )
        }
        if (options.end) {
          options.end(stack[i].tag, start, end)
        }
      }

      // Remove the open elements from the stack
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end)
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end)
      }
      if (options.end) {
        options.end(tagName, start, end)
      }
    }
  }
}