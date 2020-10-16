/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-08-22 14:03:31
 * @LastEditors: qingyang
 * @LastEditTime: 2020-10-16 15:46:51
 */
import  MVue from './mVue'
let vue = new MVue({ 
    el: '#app',
    data : {
        list: [1,2,3,4],
        name: 'hello world'
    },  
})
let inputEl = document.getElementById('input');
inputEl.oninput = (e) => {
    console.log(e.target.value);
    vue.data.name = e.target.value;
}
window.setTimeout(() => {
    // console.log('name值改变了');
    vue.data.name = 'name has changed';
    vue.data.list.push(5);
}, 2000);