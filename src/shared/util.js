/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-28 13:42:29
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-30 15:08:18
 */
/* @flow */

export const emptyObject = Object.freeze({})
export const no = (a, b, c) => false
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
export function makeMap (
  str,
  expectsLowerCase
)  {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

export const cached = (fn) =>{
  const cache = Object.create(null)
  return (function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}

export const isBuiltInTag = makeMap('slot,component', true)

/**
 * Mix properties into target object.
 */
export const extend = (to, _from) => {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}