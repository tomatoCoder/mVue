/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-30 15:03:21
 * @LastEditors: qingyang
 * @LastEditTime: 2020-11-02 15:18:37
 */
import { emptyObject } from '../shared/util'
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


  export function addHandler (
    el,
    name,
    value,
    modifiers,
    important,
    warn,
    range,
    dynamic
  ) {
    modifiers = modifiers || emptyObject
    // warn prevent and passive modifier
    /* istanbul ignore if */
    if (
      process.env.NODE_ENV !== 'production' && warn &&
      modifiers.prevent && modifiers.passive
    ) {
      warn(
        'passive and prevent can\'t be used together. ' +
        'Passive handler can\'t prevent default event.',
        range
      )
    }
  }