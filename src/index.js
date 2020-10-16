/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-08-22 14:03:31
 * @LastEditors: qingyang
 * @LastEditTime: 2020-09-02 15:50:59
 */
import  MVue from './mVue'
let vue = new MVue({ 
    el: '#app',
    data : {
        list: [1,2,3,4],
        name: 'hello world'
    },  
})
console.log(vue.data.name); 
window.setTimeout(() => {
    // console.log('name值改变了');
    vue.data.name = 'canfoo';
    vue.data.list.push(5);
}, 2000);