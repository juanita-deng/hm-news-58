<template>
	<div class="wrapper">
		<!-- 递归组件 -->
		<hm-floor
			v-if="comment.parent"
			:comment="comment.parent"
			:count="count - 1"
			@replys="$emit('replys', comment.id, comment.user.nickname)"
		></hm-floor>

		<div class="hm-floor" :class="{ bd: !comment.parent }">
			<div class="title">
				<div class="left">
					{{ count }}楼
					<span>{{ comment.user.nickname }}</span>
				</div>
				<div class="center">{{ comment.create_date | date2 }}</div>
				<div
					class="right"
					@click="$emit('replys', comment.id, comment.user.nickname)"
				>
					回复
				</div>
			</div>
			<div class="content">{{ comment.content }}</div>
		</div>
	</div>
</template>

<script>
export default {
	//想在组件中使用组件本身,需要给组件指定name属性
	name: 'hm-floor',
	props: {
		comment: Object, //接收父组件hm-comments传递过来的数据
		count: Number //接收父组件传递过来的楼层函数
	},
	methods: {
		//一行代码，在html中,子传爷(子-->父-->爷)
		// replys(id, nickname) {
		// 	console.log('floor的数据', id, nickname);
		// 	this.$emit('replys', id, nickname);
		// @click="replys(comment.id, comment.user.nickname)
		// }
	}
};
</script>

<style lang="less" scoped>
.hm-floor {
	padding: 10px;
	border: 1px solid #000;
	border-top: none;
	background-color: #eee;
	&.bd {
		border-top: 1px solid #000;
	}
	.title {
		display: flex;
		font-size: 12px;
		.left {
			span {
				padding-left: 5px;
			}
		}
		.center {
			flex: 1;
			padding: 0 30px;
			font-size: 10px;
			color: #999;
		}
		.right {
			font-size: 10px;
			color: #999;
		}
	}
	.content {
		font-size: 14px;
		padding: 10px 0;
		//解决纯字母和数字不换行问题
		word-break: break-all;
	}
}
</style>
