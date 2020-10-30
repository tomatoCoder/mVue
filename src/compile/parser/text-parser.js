/*
 * @Description: 文本解析
 * @Author: qingyang
 * @Date: 2020-10-29 13:36:51
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-30 09:58:52
 */

import { cached } from '../../shared/util'

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g

const buildRegex = cached(delimiters => {
    const open = delimiters[0].replace(regexEscapeRE, '\\$&')
    const close = delimiters[1].replace(regexEscapeRE, '\\$&')
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
})
export const parseText = (text, delimiters) => {
    const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
    // 匹配是否包含变量
    if (!tagRE.test(text)) {
        return
    }
    const tokens = [];
    const rawTokens = [];
    let lastIndex = tagRE.lastIndex = 0;
    let match, index, tokenValue;
    // 找到匹配的 就返回一个数组，否则返回null
    //举例：tagRE.exec("hello {{name}}，I am {{age}}")
    //返回：["{{name}}", "name", index: 6, input: "hello {{name}}，I am {{age}}", groups: undefined]
    while ((match = tagRE.exec(text))) {
        index = match.index;
        if (index > lastIndex) {
            rawTokens.push(tokenValue = text.slice(lastIndex, index));
            tokens.push(JSON.stringify(tokenValue));
        }
        // 取出'{{ }}'中间的变量exp
        const exp = match[1].trim();
        tokens.push(`_s(${exp})`);
        rawTokens.push({'@binding' : exp});
        // 设置lastIndex 以保证下一轮循环时，只从'}}'后面再开始匹配正则
        lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
        rawTokens.push(tokenValue = text.slice(lastIndex))
        tokens.push(JSON.stringify(tokenValue))
      }
      return {
        expression: tokens.join('+'),
        tokens: rawTokens
      }
}