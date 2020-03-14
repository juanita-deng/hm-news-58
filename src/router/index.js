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
		{ path: '/login', component: Login },
		{ path: '/register', component: Register },
		{ path: '/user', component: User }
	]
});

export default router;
