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
		></hm-input>

		<hm-input
			type="password"
			placeholder="密码"
			v-model="password"
			:rule="/\d{3,12}$/"
			message="密码不对"
		></hm-input>

		<hm-button @click="login"></hm-button>
	</div>
</template>

<script>
import axios from 'axios';
export default {
	methods: {
		login() {
			// console.log('登录了');
			this.$axios({
				url: '/login',
				method: 'post',
				data: {
					username: this.username,
					password: this.password
				}
			}).then(res => {
				// console.log(res);//res.data才是后台返回的数据
				if (res.data.statusCode === 200) {
					alert(res.data.message);
					this.$router.push('/user'); //登陆成功去用户中心
				} else {
					alert(res.data.message);
				}
			});
		}
	},
	data() {
		return {
			username: '',
			password: ''
		};
	}
};
</script>

<style lang="less" scoped></style>
