/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-08-27 15:18:16
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-28 18:01:31
 */
import Watcher from '../core/observer/watcher'
import { parse } from './parser/index' 
export default class Compile {
    constructor (el,vm) {
        this.vm = vm;
        this.el = document.querySelector(el);
        this.fragment = null;
        this.init();
    }
    init() {
        if(this.el) {
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.log('Dom元素不存在')
        }
    }
    nodeToFragment(el) {
        var fragment = document.createDocumentFragment();
        var child = el.firstChild;
        while (child) {
            // 将Dom元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild
        }
        return fragment; 
    }
    compileElement(el) {
        var childNodes = el.childNodes;
        [].slice.call(childNodes).forEach((node) => {
            var reg = /\{\{\s*(.*?)\s*\}\}/;
            var text = node.textContent;
            
            if(this.isElementNode(node)) {
                this.compileDirective(node)
            }else if (this.isTextNode(node) && reg.test(text)) {  // 判断是否是符合这种形式{{}}的指令
                this.compileText(node, reg.exec(text)[1]);
            }

            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node);  // 继续递归遍历子节点
            }
        });
    }
    compileDirective(node) {
        var nodeAttrs = node.attributes;
        var self = this;
        Array.prototype.forEach.call(nodeAttrs, (attr) => {
            var attrName = attr.name;
            if (this.isDirective(attrName)) {
                var exp = attr.value;
                var dir = attrName.substring(2);
                // v-model 指令
                this.compileModel(node, this.vm, exp, dir);
                
                node.removeAttribute(attrName);
            }
        });
    }
    compileModel(node, vm, exp, dir) {
        var val = this.vm.data[exp];
        this.modelUpdater(node, val);
        new Watcher(this.vm, exp, (value) => {
            this.modelUpdater(node, value);
        });
    }
    compileText(node, exp) {
        var initText = this.vm.data[exp];
        this.updateText(node, initText);  // 将初始化的数据初始化到视图中
        new Watcher(this.vm, exp, (value) => { // 生成订阅器并绑定更新函数
            this.updateText(node, value);
        });
    }
    updateText(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    }
    modelUpdater(node, value) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
    isElementNode(node) {
        return node.nodeType == 1;
    }
    isTextNode(node) {
        return node.nodeType == 3;
    }
    isDirective(attr) {
        return attr.indexOf('v-') == 0;
    }
}


export const createCompiler = (template, options) => {
    // 1.解析模板：用正则表达式解析template 模板中的指令，class, style等数据，形成AST
    const ast = parse(template.trim(), options)
    debugger
    // optimize(ast, options) //2.optimize
    // const code = generate(ast, options) //3.generate
    // return {
    //   ast,
    //   render: code.render,
    //   staticRenderFns: code.staticRenderFns
    // }
}