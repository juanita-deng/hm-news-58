import Vue from 'vue';
import App from './App.vue'; //引入根组件
import './styles/common.less'; //准备通用样式
import './styles/iconfont.css'; //引入字体图标
import 'lib-flexible'; //导入媒体查询
import router from './router/index'; //导入路由模块
import axios from 'axios'; //导入ajax，为了注册全局ajax用
import store from './store'; //导入vuex

//--------vant-ui处理(方式一：全局导入,不推荐)---------
// import Vant from 'vant';
// import 'vant/lib/index.css';
// Vue.use(Vant); //使用vant插件
//-------vant-ui处理(方式二：全局注册按需导入,推荐)
import {
	Button,
	Field,
	Toast,
	Dialog,
	Radio,
	RadioGroup,
	Cell,
	CellGroup,
	Uploader,
	List,
	Tab,
	Tabs,
	Icon,
	PullRefresh,
} from 'vant';
Vue.use(Button);
Vue.use(Field);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Uploader);
Vue.use(List);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Icon);
Vue.use(PullRefresh),
	//----------------- axios的优化------------------------
	(Vue.prototype.$axios = axios); //把axios绑定到vue的原型上，所有的组件就可以通过this.$axios({})发送请求
axios.defaults.baseURL = 'http://localhost:3000'; //axios在发请求的时候，把url的路径自动拼接上baseURL
//配置axios的响应拦截器
// 问题:不仅要判断是否有token,还要判断token的时效性
//      (比如token7天后过期,还有清楚本地缓存，加一个假的token也能跳过拦截)
// 优化:判断所有的请求响应，如果某个请求的状态码是401，并且提示消息是“用户信息验证失败”
//      就拦截跳转到登录页
axios.interceptors.response.use((res) => {
	// console.log('所有的axios的响应会先经过拦截器', res);
	const { statusCode, message } = res.data;
	if (statusCode === 401 && message === '用户信息验证失败') {
		router.push('/login'); //注意：此处不是vue不能用this.$router,可以用router变量代替
		localStorage.removeItem('token'); //删除过期的token,user_id
		localStorage.removeItem('user_id'); //删除过期的token,user_id
		Toast.fail(message); //此处不能用this.$toast原理同上
	}
	return res; //一定要有返回值
});
//问题：每次都要获取token,user_id
//解决：设置请求拦截器
axios.interceptors.request.use((config) => {
	// console.log('拦截了所有的请求', config);
	//统一给所有的请求添加token 则其他页面的设置响应头里的token可以省去了
	const token = localStorage.getItem('token');
	//如有token，我们就给请求添加token
	if (token) {
		config.headers.Authorization = token;
	}
	return config; //一定要有返回值
});

// ------注册全局组件---------------------
import HmHeader from './components/hm-header'; //导入头部组件
import HmLogo from './components/hm-logo.vue'; //导入logo组件
import HmButton from './components/hm-button'; //导入按钮组件
import HmInput from './components/hm-input.vue'; //导入input组件
import HmNavBar from './components/hm-navbar.vue'; //导入导航条组件
import HmArticle from './components/hm-article.vue'; //导入文章组件
import HmComments from './components/hm-comments.vue'; //导入评论组件

Vue.component('hm-header', HmHeader);
Vue.component('hm-logo', HmLogo);
Vue.component('hm-button', HmButton);
Vue.component('hm-input', HmInput);
Vue.component('hm-navbar', HmNavBar);
Vue.component('hm-article', HmArticle);
Vue.component('hm-comments', HmComments);

//-------注册全局过滤器-------------------
import moment from 'moment';
Vue.filter('date', (input, str = 'YYYY-MM-DD') => moment(input).format(str)); //str设置默认参数
//评论区的过滤器
Vue.filter('date2', (input) => {
	const time = new Date(input);
	const now = new Date();
	const hour = ((now - time) / 1000 / 60 / 60) | 0;
	// console.log(hour);
	if (hour < 1) {
		return '1小时内';
	} else if (hour < 24) {
		return hour + '小时前';
	} else {
		return moment(input).format('YYYY-MM-DD HH:mm:ss');
	}
});
Vue.config.productionTip = false; //去掉控制提示信息

//--------------注册全局bus(初始化)----------------
const bus = new Vue();
Vue.prototype.$bus = bus; //把bus绑定到vue的原型上，所有的组件就可以通过this.$bus发送请求

// const vm = new Vue({
//   el:'#app',
//   render:function(createElement) {
//     return createElement(App);
//   }
// })
//写法二
new Vue({
	render: (c) => c(App),
	router, //关联路由实例
	store, //关联vuex实例
}).$mount('#app');
