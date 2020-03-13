import Vue from 'vue';
import App from './App.vue'; //引入根组件
import './styles/common.less'; //准备通用样式
import './styles/iconfont.css'; //引入字体图标
import 'lib-flexible'; //导入媒体查询
import router from './router/index'; //导入路由模块

Vue.config.productionTip = false; //去掉控制提示信息
// const vm = new Vue({
//   el:'#app',
//   render:function(createElement) {
//     return createElement(App);
//   }
// })
//写法二
new Vue({
	render: c => c(App),
	router //关联路由实例
}).$mount('#app');
