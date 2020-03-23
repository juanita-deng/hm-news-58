<template>
	<div class="hm-home">
		<div class="hm-header">
			<div class="left">
				<span class="iconfont iconnew"></span>
			</div>
			<div class="center" @click="$router.push('/search')">
				<span class="iconfont iconsearch">搜索新闻</span>
			</div>
			<div class="right" @click="$router.push('/user')">
				<span class="iconfont iconwode"></span>
			</div>
		</div>

		<!-- tab栏 -->
		<van-tabs v-model="active" animated swipeable sticky>
			<van-tab :title="item.name" v-for="item in tabList" :key="item.id">
				<!-- 下拉加载更多的组件 -->
				<van-list
					v-model="loading"
					@load="onload"
					:immediate-check="false"
					:offset="50"
					:finished="finished"
					finished-text="没有更多了"
				>
					<!-- tab栏列表下对应的文章列表 -->
					<hm-article
						:post="article"
						v-for="article in articleList"
						:key="article.id"
					>
					</hm-article>
				</van-list>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
export default {
	data() {
		return {
			active: 0, //激活的tab下标(高亮的那个下标)
			tabList: [], //tab栏分类列表
			articleList: [], //分类下的文章列表
			loading: false, //控制下拉更新加载状态
			pageIndex: 1, //当前页
			pageSize: 5, //每页的条数
			finished: false //控制加载完成还有更多数据
		};
	},
	created() {
		this.getTabList();
	},
	methods: {
		async getTabList() {
			//获取tab栏目列表
			const res = await this.$axios.get('/category');
			// console.log(res);
			const { statusCode, data } = res.data;
			if (statusCode === 200) {
				this.tabList = data;
				// console.log(this.tabList);
				//加载完分类列表,还需要加载默认高亮的文章列表
				//获取默认选中的文章的数据
				this.getArticleList(this.tabList[this.active].id);
			}
		},
		async getArticleList(id) {
			//id为形参,分类的id  实参为监听属性的id
			//获取tab栏下文章的列表
			//需要获取文章列表对应栏目列表的id
			// console.log('我需要去获取分类id为', id, '下面的文章数据');
			const res = await this.$axios.get('/post', {
				//需要分页,所以要传参
				params: {
					category: id,
					pageSize: this.pageSize,
					pageIndex: this.pageIndex
				}
			});
			// console.log(res);
			const { statusCode, data } = res.data;
			if (statusCode === 200) {
				// this.articleList = data;
				this.articleList = [...this.articleList, ...data];
				console.log(this.articleList);
				//请求结束时需要将loading的状态改成false(以便获取更多的数据)
				this.loading = false;
				//判断还有没有更多数据
				if (data.length < this.pageSize) {
					this.finished = true; //触发没有更多数据了文本显示
				}
			}
		},
		onload() {
			// 上拉加载会执行的函数
			console.log('加载事件');
			const id = this.tabList[this.active].id;
			setTimeout(() => {
				this.pageIndex++;
				this.getArticleList(id);
			}, 1000);
		}
	},
	watch: {
		//监听active的变化，在active变化的时候，重新获取文章的数据
		active(value) {
			// console.log('active变化了', value);

			//切换栏目的时候,需要初始化所有的状态
			this.articleList = [];
			this.pageIndex = 1;
			this.finished = false;
			//初始化时loading应该为true,这样可以保证切换的时候不会触发onload事件
			this.loading = true;

			//增加切换时加载中的效果
			setTimeout(() => {
				const id = this.tabList[value].id; //切换分类的id
				this.getArticleList(id); //id为实参
			}, 1000);
		}
	}
};
</script>

<style lang="less" scoped>
.hm-home {
	.hm-header {
		display: flex;
		height: 30px;
		line-height: 30px;
		padding: 10px;
		text-align: center;
		color: white;
		background-color: red;
		.left span {
			font-size: 50px;
		}
		.center {
			flex: 1;
			text-align: center;
			color: white;
			background-color: rgba(255, 255, 255, 0.5);
			border-radius: 30px;
			margin: 0 15px;
		}
	}
	//tab栏深度作用选择器
	/deep/.van-tabs__nav {
		background-color: #dddddd;
	}
}
</style>
