<template>
	<div class="register">
		<hm-header>注册</hm-header>
		<hm-logo></hm-logo>

		<hm-input
			v-model="username"
			placeholder="用户名 / 手机号"
			:rule="/^1\d{4,10}$/"
			message="用户名必须是5~11位数字"
			ref="username"
		></hm-input>

		<!-- 昵称的校验：中文[3,7]位 -->
		<hm-input
			v-model="nickname"
			placeholder="昵称"
			:rule="/^[\u4e00-\u9fa5]{3,7}$/"
			message="用户的昵称必须是3-7位的中文"
			ref="nickname"
		></hm-input>

		<hm-input
			v-model="password"
			placeholder="密码"
			:rule="/^\d{3,12}$/"
			message="密码必须是3~12位数字"
			ref="password"
		></hm-input>

		<hm-button @click="register">注册</hm-button>

		<div class="go-login">
			已有账号？去
			<router-link to="/login">登录</router-link>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			username: '',
			nickname: '',
			password: ''
		};
	},
	methods: {
		async register() {
			console.log('注册了');
			const result1 = this.$refs.username.validate(this.username);
			const result2 = this.$refs.password.validate(this.password);
			const result3 = this.$refs.nickname.validate(this.nickname);
			console.log(result1, result2, result3);
			//只有三个校验都通过了，才发送ajax请求
			if (!result1 || !result2 || !result3) {
				return;
			}

			const res = await this.$axios({
				url: '/register',
				method: 'post',
				data: {
					username: this.username,
					password: this.password,
					nickname: this.nickname
				}
			});
			// .then(res => {
			console.log(res.data);
			if (res.data.statusCode === 200) {
				//注册成功去登录页
				this.$toast.success(res.data.message);
				this.$router.push({
					//$router.push()进行路由跳转，还可以传递额外的参数
					name: 'login',
					//通过params传参，必须是命名路由
					params: {
						username: this.username,
						password: this.password
					}
				});
			} else {
				this.$toast.fail(res.data.message);
			}
			// });
		}
	},
	created() {}
};
</script>

<style lang="less" scoped>
.go-login {
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
