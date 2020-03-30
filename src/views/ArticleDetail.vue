<template>
	<div class="hm-articleList" :class="isShow ? 'pd150' : 'pd80'">
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
					@click="unfollow(detail.user.id)"
				>
					已关注
				</div>
				<div class="unfollow" v-else @click="follow(detail.user.id)">关注</div>
			</div>
		</header>
		<!-- 文章内容,动态渲染 -->
		<!-- 文章标题 -->
		<div class="article-title">
			<h5 class="title">{{ detail.title }}</h5>
			<div class="bottom">
				<span>{{ detail.user.nickname }}</span>
				<span>{{ detail.create_date | date }}</span>
			</div>
		</div>

		<!-- 文章内容-图片类内容 -->
		<div
			class="article-content"
			v-html="detail.content"
			v-if="detail.type === 1"
		>
			<!-- {{ detail.content }}有标签 -->
		</div>

		<!-- 文章内容-视频类文章 -->
		<!-- controls:是否显示控制条(播放进度条)
                   autoplay:控制视频是否自动播放
                   muted:控制视频是否静音
                   load:重新加载
                   paused:暂定
    play:播放-->
		<div class="article-content" v-else>
			<video :src="detail.content" controls muted></video>
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

		<!-- 评论区 -->
		<div class="hm-comments">
			<div class="title">精彩跟帖</div>
			<!-- 评论组件 -->
			<hm-comments
				v-for="item in comments"
				:key="item.id"
				:comment="item"
			></hm-comments>
			<!--改用bus @reply="reply" -->
		</div>

		<!-- 底部 -->
		<footer>
			<div class="input" v-if="!isShow">
				<input type="text" placeholder="写跟贴" @focus="handleFocus" />
				<span class="iconfont iconpinglun-">
					<span>{{ detail.comment_length }}</span>
				</span>
				<span
					class="iconfont iconshoucang"
					:class="{ active: detail.has_star }"
					@click="star"
				></span>
				<span class="iconfont iconfenxiang"></span>
			</div>
			<div class="textarea" v-else>
				<textarea
					:placeholder="`回复:${replyNickname}`"
					ref="textarea"
					@blur="handleBlur"
					v-model="content"
				></textarea>
				<span @click="addComment">发布</span>
			</div>
		</footer>
	</div>
</template>

<script>
export default {
	data() {
		return {
			detail: { user: {} }, //文章详情 解决nickname is undefined
			isShow: false, //处理textarea框的显示和隐藏
			comments: '', //评论数据
			content: '', //双向绑定评论的内容
			replyNickname: '', //回复的昵称,用于placeholder拼接
			replyId: '' //回复的id,发请求需要,从子组件传过来的id
		};
	},
	created() {
		this.getArticleDetail(); //获取文章数据
		this.getComments(); //获取评论数据

		// 在articleDetail一创建，就给给bus注册一个事件
		//接收孙子组件hm-floor的指定的事件replys
		this.$bus.$on('replys', async (id, nickname) => {
			//以下内容是和方式一reply方法处理一样的事情,代码复制
			//方式二:用公交车bus处理孙传爷通讯
			console.log('接收孙子组件hm-floor的数据是', id, nickname);
			//显示textare框
			this.isShow = true;
			//等待dom更新
			await this.$nextTick();
			//获取焦点
			this.$refs.textarea.focus();
			//父组件需要把子组件的id存起来，因为发送请求有需要
			//replyNickname是为了回复的占位符中拼接用
			this.replyId = id;
			this.replyNickname = nickname;
		});
	},
	methods: {
		//获取文章详情
		async getArticleDetail() {
			const id = this.$route.params.id;
			const res = await this.$axios.get('/post/' + id);
			// console.log(res);
			const { statusCode, data } = res.data;
			if (statusCode === 200) {
				this.detail = data;
				// console.log(this.detail);
			}
		},
		//获取评论数据
		async getComments() {
			const id = this.$route.params.id;
			const res = await this.$axios.get('/post_comment/' + id);
			// console.log(res);
			const { statusCode, data } = res.data;
			if (statusCode === 200) {
				this.comments = data;
				// console.log(data);
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

			if (!this.content) {
				//如果有内容不隐藏
				this.isShow = false;
				//清空id和昵称
				this.replyId = '';
				this.replyNickname = '';
			}
		},
		//方式一:点击评论组件里点击回复显示textare
		async reply(id, nickname) {
			//改成bus
			// console.log('接收子组件hm-commments的数据是', id, nickname);
			//父组件需要把子组件的id存起来，因为发送请求有需要
			//replyNickname是为了回复的占位符中拼接用
			this.replyId = id;
			this.replyNickname = nickname;
			//显示textare框
			this.isShow = true;
			//获取焦点
			await this.$nextTick();
			this.$refs.textarea.focus();
		},
		//点击发布添加评论
		async addComment() {
			const token = localStorage.getItem('token');
			if (!token) {
				this.$router.push({
					name: 'login',
					params: {
						back: true //回跳路由参数
					}
				});
				this.$toast('请先登陆');
				return;
			}
			// const res = await this.$axios({
			//   url: "/post_comment/" + this.detail.id, //文章的id
			//   method: "post",
			//   data: {
			//     content: this.content, //评论内容
			//     parent_id: this.replyId //回复id,从上面的reply获得从父组件传递过来的评论的id
			//   }
			// });
			//post请求的简写
			const res = await this.$axios.post('/post_comment/' + this.detail.id, {
				content: this.content, //评论内容
				parent_id: this.replyId //回复id,从上面的reply获得从父组件传递过来的评论的id
			});
			// console.log(res);
			const { statusCode, message } = res.data;
			if (statusCode === 200) {
				this.$toast.success(message);
				//成功后的处理
				this.content = ''; //清空文本框
				this.isShow = false; //隐藏textarea
				this.replyId = ''; //清空回复的id
				this.getComments(); //重新渲染
				this.getArticleDetail(); //解决评论数不及时更新问题
			}
		}
		// aa(id, nickname) {
		// 	//并不能直接接收到floor传递来的数据,需要先传给floor的父组件comments
		// 	//再从comments传给其父组件ArticleDetail
		// 	//由于也是需要点击floor里的回复调出textarea并恢复,逻辑同上面的reply方法一样
		// 	//所以直接将接收过来的自定义事件改成@reply ="reply"
		// 	console.log(
		// 		'ArticleDetail组件接收到floor传递来的id和nickname是',
		// 		id,
		// 		nickname
		// 	);
		// }
	}
};
</script>

<style lang="less" scoped>
.pd150 {
	margin-bottom: 150px;
}
.pd80 {
	margin-bottom: 80px;
}
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
	/deep/video {
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
//评论区
.hm-comments {
	.title {
		font-size: 14px;
		text-align: center;
		color: #333;
		height: 50px;
		line-height: 50px;
	}
}
//底部
footer {
	//解决底部两个盒子大小不一致蹦跳情况
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: #fff;
	width: 100%;

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
}
</style>
