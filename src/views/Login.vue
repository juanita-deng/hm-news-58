<template>
	<div class="hm-login">
		<hm-header>登录</hm-header>
		<hm-logo></hm-logo>

		<hm-input
			type="username"
			placeholder="用户名/手机号码"
			v-model="username"
			:rule="/^1\d{4,10}$/"
			message="用户名不对"
			ref="username"
		></hm-input>

		<hm-input
			type="password"
			placeholder="密码"
			v-model="password"
			:rule="/\d{3,12}$/"
			message="密码不对"
			ref="password"
		></hm-input>

		<hm-button @click="login">登录</hm-button>
		<div class="go-register">
			没有账号？去
			<router-link to="/register">注册</router-link>
		</div>
	</div>
</template>

<script>
// import axios from 'axios';//改成全局的了，在main.js中引入了
export default {
	methods: {
		login() {
			// console.log('登录了');

			//登陆时也需要表单校验，也所以需要表单校验信息的提醒
			const result1 = this.$refs.username.validate(this.username);
			const result2 = this.$refs.password.validate(this.password);
			// console.log(result1, result1);

			//如果校验成功,就发送请求，否则不发送请求
			if (!result1 || !result2) {
				return;
			}
			this.$axios({
				url: '/login',
				method: 'post',
				data: {
					username: this.username,
					password: this.password
				}
			}).then(res => {
				console.log(res.data); //res.data才是后台返回的数据
				const { statusCode, message, data } = res.data;
				if (statusCode === 200) {
					this.$toast.success(message);
					//去个人中心前添加token和user_id,后面个人中心数据渲染要用
					localStorage.setItem('token', data.token);
					localStorage.setItem('user_id', data.user.id);

					this.$router.push('/user'); //登陆成功去用户中心
				} else {
					this.$toast.fail(message);
				}
			});
		}
	},
	data() {
		return {
			username: '',
			password: ''
		};
	},
	created() {
		// console.log(this.$route);
		this.username = this.$route.params.username;
		this.password = this.$route.params.password;
	}
};
</script>

<style lang="less" scoped>
.go-register {
	font-size: 16px;
	text-align: right;
	color: #999;
	padding: 10px;
	a {
		color: red;
		padding: 5px;
	}
}
</style>
