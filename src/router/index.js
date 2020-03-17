//配置路由信息

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Login from '../views/Login.vue'; //导入登录组件
import Register from '../views/Register.vue'; //导入注册组件
import User from '../views/User.vue'; //导入个人中心组件

const router = new VueRouter({
	routes: [
		//配置路由的规则
		{ path: '/', redirect: '/login' },
		//命名路由：给每一个路由规则起一个名字，指定name即可
		{ path: '/login', component: Login, name: 'login' },
		{ path: '/register', component: Register, name: 'register' },
		{ path: '/user', component: User, name: 'user' }
	]
});

//在导出路由之前进行注册全局的导航守卫  登录拦截
router.beforeEach(function(to, from, next) {
	console.log('所有的路由跳转都必须经过导航守卫');
	// console.log('to:', to);//参数to:到哪里去
	// console.log('from:', from);//参数from:从哪里来
	const token = localStorage.getItem('token');
	if (to.path === '/user' && !token) {
		next('/login'); //如果去的是user并且还没有token,就去登录页
	} else {
		next(); //放行
	}
});
export default router;
