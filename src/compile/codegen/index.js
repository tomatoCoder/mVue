/*
 * @Description: 代码生成
 * @Author: qingyang
 * @Date: 2020-10-30 13:38:00
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-30 16:21:36
 */


/*
  类型        创建方法          别名
元素节点    createElement        _c
文本节点    createTextVNode      _v
注释节点    createEmptyVNode     _e
*/

import { baseWarn, pluckModuleFunction } from '../helpers'
import { no, extend } from '../../shared/util'

export class CodegenState {
    constructor (options) {
      this.options = options
      this.warn = options.warn || baseWarn
      this.transforms = pluckModuleFunction(options.modules, 'transformCode')
      this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    //   this.directives = extend(extend({}, baseDirectives), options.directives)
      const isReservedTag = options.isReservedTag || no
      this.maybeComponent = (el) => !!el.component || !isReservedTag(el.tag)
      this.onceId = 0
      this.staticRenderFns = []
      this.pre = false
    }
  }
export const generate = (ast, options) => {
    const state = new CodegenState(options);
    const code = ast ? genElement(ast, state) : '_c("div")';
    return {
        render: `with(this){return ${code}}`,
        staticRenderFns: state.staticRenderFns
    }
}

const genElement = (el, state) => {
    if (el.parent) {
        el.pre = el.pre || el.parent.pre;
    }
    // component or element 
    let code 
    if (el.component) {
        code = genComponent(el.component, el, state)
    } else {
         // 生成元素型节点
        const data = el.plain ? undefined : genData(el, state);
        const children = el.inlineTemplate ? null : genChildren(el, state, true);
        code = `_c('${el.tag}'${
            data ? `,${data}` : '' // data
        }${
            children ? `,${children}` : '' // children
        })`
    }
     // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
        code = state.transforms[i](el, code)
    }
    return code
}

const genData = (el, state) => {

    let data = '{'

    // const dirs = genDirectives(el, state)
    // if (dirs) data += dirs + ','

    //key
    if(el.key) {
        data += `key:${el.key}`
    }
    if(el.ref) {
       data += `ref:${el.ref}`
    }
    if (el.refInFor) {
        data += `refInFor:true,`
    }
    // pre
    if (el.pre) {
        data += `pre:true,`
    }
    // record original tag name for components using "is" attribute
    if (el.component) {
        ata += `tag:"${el.tag}",`
    }
    // module data generation functions
    for (let i = 0; i < state.dataGenFns.length; i++) {
        data += state.dataGenFns[i](el)
    }
    // attributes
    if (el.attrs) {
        data += `attrs:${genProps(el.attrs)},`
    }
    // DOM props
    if (el.props) {
        data += `domProps:${genProps(el.props)},`
    }
    // component v-model
    if (el.model) {
        data += `model:{value:${
            el.model.value
        },callback:${
            el.model.callback
        },expression:${
            el.model.expression
        }},`
    }
    data = data.replace(/,$/, '') + '}'
    // v-bind dynamic argument wrap
    // v-bind with dynamic arguments must be applied using the same v-bind object
    // merge helper so that class/style/mustUseProp attrs are handled correctly.
    if (el.dynamicAttrs) {
      data = `_b(${data},"${el.tag}",${genProps(el.dynamicAttrs)})`
    }
    // v-bind data wrap
    if (el.wrapData) {
      data = el.wrapData(data)
    }
    // v-on data wrap
    if (el.wrapListeners) {
      data = el.wrapListeners(data)
    }
    return data
}

const genChildren = (el, state, checkSkip) => {
    const children = el.children;
    if (children.length) {
        const normalizationType  = 0
        // const normalizationType = checkSkip
        // ? getNormalizationType(children, state.maybeComponent)
        // : 0
        return `[${children.map(c => genNode(c, state)).join(',')}]${
        normalizationType ? `,${normalizationType}` : ''
        }`
    }
}

const genNode = (node, state) => {
    if (node.type === 1) {
        // 创建元素节点
        return genElement(node, state);
    } else if (node.type === 3 && node.isComment) {
        // 创建注释节点
        return genComment(node);
    } else {
        // 创建文本节点
        return genText(node)
    }
}
const genText = (node) => {
    return `_v(${node.type === 2
        ? node.expression
        : JSON.stringify(node.text)
    })`
}

const genComment = (node) => {
    return `_e(${JSON.stringify(node.text)})`
}


const  genComponent = (
    componentName,
    el,
    state
  ) => {
    const children = el.inlineTemplate ? null : genChildren(el, state, true)
    return `_c(${componentName},${genData(el, state)}${
      children ? `,${children}` : ''
    })`
  }


  function genProps (props) {
    let staticProps = ``
    let dynamicProps = ``
    for (let i = 0; i < props.length; i++) {
      const prop = props[i]
      const value = __WEEX__
        ? generateValue(prop.value)
        : transformSpecialNewlines(prop.value)
      if (prop.dynamic) {
        dynamicProps += `${prop.name},${value},`
      } else {
        staticProps += `"${prop.name}":${value},`
      }
    }
    staticProps = `{${staticProps.slice(0, -1)}}`
    if (dynamicProps) {
      return `_d(${staticProps},[${dynamicProps.slice(0, -1)}])`
    } else {
      return staticProps
    }
  }

  /* istanbul ignore next */
function generateValue (value) {
    if (typeof value === 'string') {
      return transformSpecialNewlines(value)
    }
    return JSON.stringify(value)
  }
  
  // 避免换行符产生的Bug
  function transformSpecialNewlines (text) {
    return text
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')
  }
  