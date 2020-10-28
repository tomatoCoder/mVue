/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-09-02 13:29:16
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-27 15:24:19
 */
/* @flow */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

/**
 * Check if a string starts with $ or _
 */
export function isReserved () {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}
export const emptyObject = Object.freeze({})


// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
export function isUndef (v) {
  return v === undefined || v === null
}

export function isDef (v) {
  return v !== undefined && v !== null
}

export function isTrue (v) {
  return v === true
}

export function isFalse (v) {
  return v === false
}


export function noop (a, b, c) {}

export const hasProto = '__proto__' in {}
/**
 * Check whether an object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function isObject (obj) {
    return obj !== null && typeof obj === 'object'
}

/**
 * Define a property.
 */
export function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    const l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

export const bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind



/**
 * Parse simple path.
 */
// const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
// export function parsePath (path: string): any {
//   if (bailRE.test(path)) {
//     return
//   }
//   const segments = path.split('.')
//   return function (obj) {
//     for (let i = 0; i < segments.length; i++) {
//       if (!obj) return
//       obj = obj[segments[i]]
//     }
//     return obj
//   }
// }
