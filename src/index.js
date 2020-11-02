/*
 * @Description: 
 * @Author: qingyang
 * @Date: 2020-08-22 14:03:31
 * @LastEditors: qingyang
 * @LastEditTime: 2020-11-02 15:03:28
 */
import Vue from './core/instance'

let vue = new Vue({ 
    el: '#app',
    template: ` <div id="NLRX" @click="test"><p>Hello {{name}}</p></div>  `,
    data : {
        list: [1,2,3,4],
        name: 'hello world'
    }, 
    beforeCreate() {
        console.log('创建组件前')
    },
    created() {
        console.log('创建组件')
        debugger
    }
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