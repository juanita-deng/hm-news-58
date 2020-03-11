import Vue from 'vue';
import App from './App.vue';//引入根组件

Vue.config.productionTip = false;//去掉控制提示信息
// const vm = new Vue({
//   el:'#app',
//   render:function(createElement) {
//     return createElement(App);
//   }
// })
//写法二
new Vue({
  render:c => c(App)
}).$mount('#app')