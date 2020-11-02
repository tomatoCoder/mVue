/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-30 17:45:52
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-30 17:57:07
 */


import { createCompileToFunctionFn } from './to-function'

export function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options,
    ) {
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []

      const compiled = baseCompile(template.trim(), finalOptions)
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}
