/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-23 17:16:59
 * @LastEditors: qingyang
 * @LastEditTime: 2020-11-02 15:01:53
 */
import {init} from './init'
import { createCompiler } from '../../compile/index'
const baseOptions = {
  expectHTML: true
};
const { compile, compileToFunctions } = createCompiler(baseOptions)
export default class Vue {
    constructor(options) {
        const vm = this;
        vm._self = vm;
        this.$options = options;
        this.data = options.data;
        this.$mount =  this.mount;  
        init(this);         
    }
    mount(el) {
        const options = this.$options
        // 如果用户没有手写render函数
        if (!options.render) {
          // 获取模板，先尝试获取内部模板，如果获取不到则获取外部模板
          let template = options.template
          if (template) {
      
          } else {
            template = getOuterHTML(el)
          }
          const { render, staticRenderFns } = compileToFunctions(template, {
            // shouldDecodeNewlines,
            // shouldDecodeNewlinesForHref,
            delimiters: options.delimiters,
            comments: options.comments
          }, this)
          options.render = render
          options.staticRenderFns = staticRenderFns
        }
    }
}

function getOuterHTML (el) {
    if (el.outerHTML) {
      return el.outerHTML
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML
    }
  }