<template>
	<div class="hm-comments">
		<div class="title">
			<div class="left">
				<img :src="$axios.defaults.baseURL + comment.user.head_img" alt />
			</div>
			<div class="center">
				<div>{{ comment.user.nickname }}</div>
				<div>{{ comment.create_date | date2 }}</div>
			</div>
			<div
				class="right"
				@click="$emit('reply', comment.id, comment.user.nickname)"
			>
				<span>回复</span>
			</div>
		</div>

		<!-- 楼层  -->
		<!-- 只有当评论有parent, 才会去渲染楼层组件
         把楼层展示数据传递给楼层组件(父传子)
    -->
		<hm-floor
			:count="getCount(0, comment)"
			v-if="comment.parent"
			:comment="comment.parent"
			@replys="receptFloor"
		></hm-floor>

		<div class="content">
			<span>{{ comment.content }}</span>
		</div>
	</div>
</template>

<script>
import HmFloor from './hm-floor';
export default {
	props: {
		comment: Object //接收从articleDetail传递过来的评论数据
	},
	components: {
		HmFloor //注册局部楼层组件
	},
	methods: {
		//递归方法,用于统计楼层的层数
		getCount(num, obj) {
			//形参
			if (obj.parent) {
				return this.getCount(num + 1, obj.parent);
			} else {
				return num;
			}
		},
		//点击回复 一行代码直接写在html中
		// reply() {//点击回复的方法函数
		// 	// console.log("我是评论的id和昵称是：", id, nickname);
		// 	this.$emit('reply', this.comment.id, this.comment.user.nickname); //把id传给父组件 子传父
		// },
		receptFloor(id, nickname) {
			//接收floor子组件的自定义函数
			console.log('comment组件接收floor组件传递的数据', id, nickname);
			this.$emit('reply', id, nickname); //将接收floor的id和nickname传给父组件articleDetail
		}
	}
};
</script>

<style lang="less" scoped>
.hm-comments {
	padding: 10px 20px;
	border-bottom: 1px solid #ccc;
	.title {
		display: flex;
		margin-bottom: 5px;
		.left img {
			width: 35px;
			height: 35px;
			border-radius: 50%;
		}
		.center {
			flex: 1;
			padding-left: 10px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			& :nth-child(1) {
				font-size: 12px;
			}
			& :nth-child(2) {
				font-size: 10px;
				color: #999;
			}
		}
		.right {
			font-size: 10px;
			color: #999;
		}
	}
	.content {
		font-size: 14px;
		padding: 10px 0;
		//解决单纯字母或数字不换行问题
		word-break: break-all;
	}
}
</style>
