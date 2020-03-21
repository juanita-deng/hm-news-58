//配置路由信息

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Login from '../views/Login.vue'; //导入登录组件
import Register from '../views/Register.vue'; //导入注册组件
import User from '../views/User.vue'; //导入个人中心组件
import Edit from '../views/Edit.vue'; //导入个人中心组件
import Test from '../views/Test.vue'; //导入个人中心组件
import Focus from '../views/Focus.vue'; //导入我的关注
import Comments from '../views/Comments.vue'; //导入我的评论
import Collection from '../views/Collection.vue'; //导入我的收藏collection
const router = new VueRouter({
	routes: [
		//配置路由的规则
		{ path: '/', redirect: '/login' },
		//命名路由：给每一个路由规则起一个名字，指定name即可
		{ path: '/login', component: Login, name: 'login' },
		{ path: '/register', component: Register, name: 'register' },
		{ path: '/user', component: User, name: 'user' },
		{ path: '/edit', component: Edit, name: 'edit' },
		{ path: '/test', component: Test, name: 'test' },
		{ path: '/focus', component: Focus, name: 'focus' },
		{ path: '/comments', component: Comments, name: 'comments' },
		{ path: '/collection', component: Collection, name: 'collection' }
	]
});

//在导出路由之前进行注册全局的导航守卫  登录拦截
const authUrl = ['/user', '/edit']; //需要授权的路径，需要登陆才能访问的路径
router.beforeEach(function(to, from, next) {
	// console.log('所有的路由跳转都必须经过导航守卫');
	// console.log('to:', to);//参数to:到哪里去
	// console.log('from:', from);//参数from:从哪里来

	const token = localStorage.getItem('token');
	//如果去个人中心，必须先登陆
	if (authUrl.includes(to.path) && !token) {
		next('/login'); //如果去的是user并且还没有token,就去登录页
	} else {
		next(); //放行
	}
});
export default router;
