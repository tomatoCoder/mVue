/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-30 15:03:21
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-30 15:06:03
 */
export function baseWarn (msg, range) {
    console.error(`[Vue compiler]: ${msg}`)
}

export function pluckModuleFunction (
    modules,
    key
  ) {
    return modules
      ? modules.map(m => m[key]).filter(_ => _)
      : []
  }