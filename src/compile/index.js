/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-08-27 15:18:16
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-30 18:03:08
 */
import Watcher from '../core/observer/watcher'
import { parse } from './parser/index' 
import { optimize } from './optimizer' 
import { generate } from './codegen/index'
import {createCompilerCreator} from './create-compiler'

// export const createCompiler = (template, options) => {
//     // 1.解析模板：用正则表达式解析template 模板中的指令，class, style等数据，形成AST
//     const ast = parse(template.trim(), options);
//     // 2.optimize 优化找出静态节点，并打上标记
//     optimize(ast, options);
//     console.log(ast)
//     // 3.代码生成阶段 将ast转化成渲染函数
//     const code = generate(ast, options);
//     return {
//       ast,
//       render: code.render,
//       staticRenderFns: code.staticRenderFns
//     }
// }

export const createCompiler = createCompilerCreator(function baseCompile (
    template,
    options
  ) {
    // 模板解析阶段：用正则等方式解析 template 模板中的指令、class、style等数据，形成AST
    const ast = parse(template.trim(), options)
    if (options.optimize !== false) {
      // 优化阶段：遍历AST，找出其中的静态节点，并打上标记；
      optimize(ast, options)
    }
    // 代码生成阶段：将AST转换成渲染函数；
    const code = generate(ast, options)
    return {
      ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  })