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

export default router;
