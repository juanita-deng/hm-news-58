<template>
	<div class="hm-articleList">
		<header>
			<div class="left">
				<span class="iconfont iconjiantou2" @click="$router.back()"></span>
			</div>
			<div class="center">
				<span class="iconfont iconnew"></span>
			</div>
			<div class="right">
				<div
					class="followed"
					v-if="detail.has_follow"
					@click="unfollow(detail.id)"
				>
					已关注
				</div>
				<div class="unfollow" v-else @click="follow(detail.id)">关注</div>
			</div>
		</header>
		<!-- 文章内容,动态渲染 -->
		<!-- 文章标题 -->
		<div class="article-title">
			<h5 class="title">{{ detail.title }}</h5>
			<div class="bottom">
				<span>{{ detail.user.nickname }}</span>
				<span> {{ detail.create_date | date }} </span>
			</div>
		</div>
		<!-- 文章内容 -->
		<div class="article-content" v-html="detail.content">
			<!-- {{ detail.content }}有标签 -->
		</div>
		<!-- 点赞 -->
		<div class="article-like">
			<div class="like" :class="{ active: detail.has_like }" @click="like">
				<span class="iconfont icondianzan"></span>
				<span>{{ detail.like_length || 0 }}</span>
			</div>
			<div class="weixin">
				<span class="iconfont iconweixin"></span>
				<span>微信</span>
			</div>
		</div>
		<!-- 底部 -->
		<footer>
			<div class="input" v-if="!isShow">
				<input type="text" placeholder="写跟贴" @focus="handleFocus" />
				<span class="iconfont iconpinglun-">
					<span> {{ detail.comment_length }} </span>
				</span>
				<span
					class="iconfont iconshoucang"
					:class="{ active: detail.has_star }"
					@click="star"
				>
				</span>
				<span class="iconfont iconfenxiang"></span>
			</div>
			<div class="textarea" v-else>
				<textarea
					placeholder="回复:"
					ref="textarea"
					@blur="handleBlur"
				></textarea>
				<span>发布</span>
			</div>
		</footer>
	</div>
</template>

<script>
export default {
	data() {
		return {
			detail: { user: '' }, //文章详情 解决nickname is undefined
			isShow: false //处理textarea框的显示和隐藏
		};
	},
	created() {
		this.getArticleDetail();
	},
	methods: {
		async getArticleDetail() {
			const id = this.$route.params.id;
			const res = await this.$axios.get('/post/' + id);
			// console.log(res);
			const { statusCode, data } = res.data;
			if (statusCode === 200) {
				this.detail = data;
				console.log(this.detail);
			}
		},
		//点击关注功能
		async follow(id) {
			/*  思路1:先判断是否登陆(token),
                 如果没有登陆,就让他跳到登录页
                 如果登陆了,就发送请求,
            好处:减少发送一次请求
      */
			const token = localStorage.getItem('token');
			if (!token) {
				this.$router.push({
					name: 'login', //必须时命名路由
					params: {
						back: true //处理未登录状态需要回跳
					}
				});
				this.$toast('请先登陆');
				return;
			}
			//  思路2:直接发送请求进行关注
			const res = await this.$axios.get('/user_follows/' + id);
			// console.log(res);
			const { statusCode, message } = res.data;
			if (statusCode === 200) {
				this.$toast.success(message);
				this.detail.has_follow = true; //让已关注的样式显示
			}
		},
		//根据文章id取消关注功能
		async unfollow(id) {
			const res = await this.$axios.get('/user_unfollow/' + id);
			// console.log(res);
			const { statusCode, message } = res.data;
			if (statusCode === 200) {
				this.$toast.success(message);
				this.detail.has_follow = false; //方式一：让关注的样式显示
				// this.getArticleDetail(); //方式二：重新渲染
			}
		},
		//点赞功能
		async like() {
			//如果没有登陆去登录页并携带back参数,以供首页实现回调
			const token = localStorage.getItem('token');
			if (!token) {
				this.$router.push({
					name: 'login',
					params: {
						back: true
					}
				});
				this.$toast('请先登陆');
				return;
			}
			//根据文章id发送请求
			const res = await this.$axios.get('/post_like/' + this.detail.id);
			// console.log(res);
			const { statusCode, message } = res.data;
			if (statusCode === 200) {
				this.$toast.success(message);
				this.getArticleDetail(); //重新渲染数据
			}
		},
		//收藏功能
		async star() {
			//判断是否登陆,逻辑同点赞/关注
			const token = localStorage.getItem('token');
			if (!token) {
				this.$router.push({
					name: 'login',
					params: {
						back: true //回跳的路由参数
					}
				});
				this.$toast('请先登陆');
				return;
			}
			const res = await this.$axios.get('/post_star/' + this.detail.id);
			// console.log(res);
			const { statusCode, message } = res.data;
			if (statusCode === 200) {
				this.$toast.success(message);
				this.getArticleDetail(); //重新渲染
			}
		},
		//处理底部input聚焦
		async handleFocus() {
			//当点击input获取焦点时,显示textarea框,
			//并让textarea有焦点

			this.isShow = true;
			// this.$refs.textarea.focus();//error  'focus' of undefined
			//因为刚修改完数据,dom不会立更新,所以用nextTick

			// this.$nextTick(() => {
			// 	this.$refs.textarea.focus();
			// });
			await this.$nextTick(); //等待DOM更新完成
			this.$refs.textarea.focus();
		},
		//textarea失焦隐藏
		handleBlur() {
			// 当textarea框没有焦点，重新显示input框
			this.isShow = false;
		}
	}
};
</script>

<style lang="less" scoped>
header {
	padding: 0 20px;
	display: flex;
	align-items: center;
	.center {
		flex: 1;
		height: 50px;
		line-height: 50px;
		padding-left: 10px;
		span {
			font-size: 50px;
			text-align: center;
		}
	}
	.right {
		div {
			color: #666;
			height: 20px;
			line-height: 20px;
			padding: 0 10px;
			border: 1px solid #ccc;
			border-radius: 10px;
			font-size: 12px;
		}
		.unfollow {
			color: white;
			background-color: red;
			border: none;
		}
	}
}
//文章标题
.article-title {
	padding: 0 20px;
	.title {
		padding: 10px 0;
		font-size: 16px;
		color: #333;
	}
	.bottom {
		color: #999;
		font-size: 12px;

		& :nth-child(2) {
			padding-left: 10px;
		}
	}
}
//文章内容
.article-content {
	padding: 10px 20px;
	font-size: 14px;
	/deep/p {
		text-indent: 24px;
	}
	/deep/img {
		display: block;
		margin: 0 auto;
		width: 100%;
	}
}
.active {
	color: red;
}
//点赞
.article-like {
	padding: 20px;
	display: flex;
	justify-content: space-around;
	border-bottom: 3px solid #ccc;
	div {
		width: 80px;
		height: 30px;
		border: 1px solid #ccc;
		border-radius: 30px;
		text-align: center;
		line-height: 30px;
		font-size: 14px;
	}
	.weixin {
		& :nth-child(1) {
			color: #00c800;
		}
	}
}
//底部input
.input {
	padding: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 12px;
	input {
		width: 180px;
		height: 30px;
		line-height: 30px;
		background-color: #ddd;
		border-radius: 15px;
		border: none;
		outline: none;
		text-indent: 12px;
	}
	.iconfont {
		font-size: 22px;
	}
	.iconpinglun- {
		position: relative;
		span {
			font-size: 12px;
			color: white;
			background-color: red;
			position: absolute;
			right: -11px;
			top: -6px;
			border-radius: 8px;
			padding: 0 5px;
		}
	}
}
//底部textare
.textarea {
	display: flex;
	align-items: flex-end;
	padding: 20px;
	textarea {
		flex: 1;
		height: 80px;
		border-radius: 10px;
		background-color: #ddd;
		border: none;
		outline: none;
		padding: 10px;
	}
	span {
		width: 60px;
		height: 30px;
		line-height: 30px;
		margin-left: 15px;
		font-size: 14px;
		background-color: red;
		color: white;
		border-radius: 30px;
		text-align: center;
	}
}
</style>
