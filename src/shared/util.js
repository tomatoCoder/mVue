/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-10-28 13:42:29
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-28 17:34:20
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