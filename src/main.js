import Vue from 'vue';
import App from './App.vue'; //引入根组件
import './styles/common.less'; //准备通用样式
import './styles/iconfont.css'; //引入字体图标
import 'lib-flexible'; //导入媒体查询
import router from './router/index'; //导入路由模块
import axios from 'axios'; //导入ajax，为了注册全局ajax用

// axios的优化
Vue.prototype.$axios = axios; //把axios绑定到vue的原型上，所有的组件就可以通过this.$axios({})发送请求
axios.defaults.baseURL = 'http://localhost:3000'; //axios在发请求的时候，把url的路径自动拼接上baseURL
Vue.config.productionTip = false; //去掉控制提示信息

// ---------------------------
//注册全局组件
import HmHeader from './components/hm-header'; //导入头部组件
import HmLogo from './components/hm-logo.vue'; //导入logo组件
import HmButton from './components/hm-button'; //导入按钮组件
import HmInput from './components/hm-input.vue'; //导入input组件
Vue.component('hm-header', HmHeader);
Vue.component('hm-logo', HmLogo);
Vue.component('hm-button', HmButton);
Vue.component('hm-input', HmInput);

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
