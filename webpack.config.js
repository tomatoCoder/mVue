/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-08-22 14:12:01
 * @LastEditors: qingyang
 * @LastEditTime: 2020-08-22 16:43:59
 */
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist'
  }
};