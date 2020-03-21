<template>
	<div class="hm-comments">
		<hm-header>我的跟帖</hm-header>
		<van-list
			v-model="loading"
			:finished="finished"
			finished-text="没有更多了"
			:immediate-check="false"
			@load="onload"
			:offset="50"
		>
			<div class="list" v-for="item in list" :key="item.id">
				<div class="item">
					<div class="time">
						<span>{{ item.create_date | date('YYYY-MM-DD HH:mm') }}</span>
					</div>
					<!-- 动态灰色评论区 -->
					<!-- item.parent有内容就显示 -->
					<div class="comments" v-if="item.parent">
						<div>
							回复:
							<span class="response">{{ item.parent.user.nickname }}</span>
						</div>
						<div>{{ item.parent.content }}</div>
					</div>

					<div class="content">
						<span>{{ item.content }}</span>
					</div>

					<div
						class="article"
						@click="$router.push(`/post-detail/${item.post.id}`)"
					>
						<span>原文:{{ item.post.title }}</span>
						<span class="iconfont iconjiantou1"></span>
					</div>
				</div>
			</div>
		</van-list>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			loading: false, //用于指定list组件的加载状态,控制频繁触发的问题
			finished: false,
			pageIndex: 1, //当前页
			pageSize: 10 //每页的条数
		};
	},
	created() {
		this.getList();
	},
	methods: {
		getList() {
			this.$axios({
				url: '/user_comments',
				method: 'get',
				//注意：在axios中，如果post请求有数据，需要放到data参数中，
				//			如果是get请求数据,需要放到params中
				params: {
					pageIndex: this.pageIndex,
					pageSize: this.pageSize
				}
			}).then(res => {
				// console.log(res);
				const { statusCode, data } = res.data;
				if (statusCode === 200) {
					//因为涉及到分页，不能简单的把响应的data让data数据给覆盖了，而应该是追加
					// this.list = data;
					// this.list = this.list.concat(data); //合并数组
					this.list = [...this.list, ...data]; //展开运算符，同上
					// console.log(this.list);

					//额外处理
					//数据加载完成了，接的让loading改成false，不然无法触发下一次的加载
					this.loading = false;
					//判断是否还有更多数据？如果返回的数据的条数比每页的条数少，说明没有更多数据
					if (data.length < this.pageSize) {
						this.finished = true; //没有更多数据了
					}
				}
			});
		},
		onload() {
			console.log('当list触底了就会触发');
			setTimeout(() => {
				//发送ajax请求,加载更多数据即可
				this.pageIndex++;
				this.getList(); //重新发送ajax即可
			}, 1000);
		}
	}
};
</script>

<style lang="less" scoped>
.item {
	padding: 10px;
	border-bottom: 1px solid #ccc;
	.time {
		height: 30px;
		line-height: 30px;
		font-size: 14px;
		color: #999;
	}
	.comments {
		background-color: #ddd;
		padding: 10px;
		div {
			height: 30px;
			line-height: 30px;
			color: #999;
			font-size: 12px;
		}
		.response {
			padding: 8px;
		}
	}
	.content {
		height: 40px;
		line-height: 40px;
		font-size: 14px;
	}
	.article {
		color: #999;
		font-size: 14px;
		display: flex;
		& :nth-child(1) {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>
