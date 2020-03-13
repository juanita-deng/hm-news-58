//配置路由信息

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Login from '../views/Login.vue'; //导入登录组件
import Register from '../views/Register.vue'; //导入注册组件
const router = new VueRouter({
	routes: [
		//配置路由的规则
		{ path: '/login', component: Login },
		{ path: '/register', component: Register }
	]
});

export default router;
