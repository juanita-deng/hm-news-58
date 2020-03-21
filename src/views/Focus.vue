<template>
	<div class="hm-focus">
		<hm-header>我的关注</hm-header>
		<div class="list" v-for="item in list" :key="item.id">
			<div class="left">
				<img :src="$axios.defaults.baseURL + item.head_img" alt="" />
			</div>
			<div class="center">
				<div>{{ item.nickname }}</div>
				<div>{{ item.create_date | date }}</div>
			</div>
			<div class="right">
				<span @click="cancel(item.id)">取消关注</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: {}
		};
	},
	created() {
		this.getList();
	},
	methods: {
		async getList() {
			const res = await this.$axios({
				url: '/user_follows/',
				method: 'get'
			});

			// .then(res => {

			// console.log(res);
			const { statusCode, message, data } = res.data;
			if (statusCode === 200) {
				this.list = data;
				// console.log(this.list);
			}

			// });
		},
		async cancel(id) {
			try {
				await this.$dialog.confirm({
					title: '温馨提示',
					message: '确定要取消关注吗？'
				});

				// .then(() => {

				//发送Ajax请求取消关注
				const res = await this.$axios({
					url: '/user_unfollow/' + id,
					method: 'get'
				});

				// .then(res => {
				// console.log(res);
				const { statusCode, message } = res.data;
				if (statusCode === 200) {
					this.$toast.success(message);
					//重新渲染
					this.getList();
				}
				// });

				// })
			} catch {
				// .catch(() => {
				this.$toast.success('操作已取消');
				// });
			}
		}
	}
};
</script>

<style lang="less" scoped>
.hm-focus {
	.list {
		display: flex;
		align-items: center;
		padding: 5px 20px;
		border-bottom: 1px solid #ccc;
		.left img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
		}
		.center {
			margin-left: 15px;
			flex: 1;
			& :nth-child(1) {
				font-size: 14px;
				color: #333;
			}
			& :nth-child(2) {
				font-size: 12px;
				color: #999;
			}
		}
		.right {
			font-size: 10px;
			padding: 10px 20px;
			background-color: #ddd;
			color: #000;
			border-radius: 20px;
		}
	}
}
</style>
