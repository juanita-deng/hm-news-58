<template>
	<div class="hm-article">
		<div class="list">
			<!-- 
      如果type为2说明是视频类文章 
      如果type为1，说明是图片类文章
        判断cover的长度为小于3，显示单图片结构
        cover的长度大于等于3，显示多图片结构
    -->

			<!-- 视频结构 -->
			<div class="video-img" v-if="post.type === 2">
				<div class="content">
					<div class="article">
						<p>{{ post.title }}</p>
					</div>
					<div class="center">
						<div class="play">
							<span class="iconfont iconshipin"></span>
						</div>
						<img :src="getUrl(post.cover[0].url)" alt="" />
					</div>
					<div class="bottom">
						<span>{{ post.user.nickname }}</span>
						<span>{{ post.comment_length }}跟帖</span>
					</div>
				</div>
			</div>
			<!-- 单图片的结构 -->
			<div class="single-post-img" v-else-if="post.cover.length < 3">
				<div class="content">
					<div class="article">
						<p>
							{{ post.title }}
						</p>
						<div class="bottom">
							<span>{{ post.user.nickname }}</span>
							<span>{{ post.comment_length }}跟帖</span>
						</div>
					</div>
					<div class="right">
						<img :src="getUrl(post.cover[0].url)" alt />
					</div>
				</div>
			</div>

			<!-- 3张图以上的结构 -->
			<div class="multiple-post-img" v-else>
				<div class="content">
					<div class="article">
						<p>{{ post.title }}</p>
					</div>
					<div class="center">
						<img :src="getUrl(post.cover[0].url)" alt="" />
						<img :src="getUrl(post.cover[1].url)" alt="" class="middle" />
						<img :src="getUrl(post.cover[2].url)" alt="" />
					</div>
					<div class="bottom">
						<span>{{ post.user.nickname }}</span>
						<span>{{ post.comment_length }}跟帖</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		post: Object //接收父组件传递过来的post自定义属性
	},
	methods: {
		// 处理图片的地址网络地址和本地地址问题
		// 形参  实参getUrl(post.cover[0].url)
		getUrl(url) {
			if (url.startsWith('http')) {
				return url; //相当于post.cover[0].url
			} else {
				return this.$axios.defaults.baseURL + url;
			}
		}
	}
};
</script>

<style lang="less" scoped>
//3中样式的公共样式
.article {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	p {
		font-size: 16px;
	}
}
.bottom {
	font-size: 12px;
	color: #999;
	& :nth-child(2) {
		margin-left: 12px;
	}
}
//单图片结构样式
.single-post-img {
	.content {
		display: flex;
		padding: 10px;
		border-bottom: 1px solid #ccc;
		.right img {
			width: 121px;
			height: 75px;
			display: block;
			//图片失真的处理
			//类似于backgroundSize:cover/contain
			object-fit: cover; //可以图片等比例的压缩 取值:cover/contain
		}
	}
}
//多图片结构样式
.multiple-post-img {
	.content {
		padding: 10px;
		border-bottom: 1px solid #ccc;
		.center img {
			width: 112px;
			height: 74px;
			object-fit: cover;
			padding: 10px 0;
		}
		.middle {
			margin: 0 2px;
		}
	}
}
//视频结构样式
.video-img {
	.content {
		padding: 10px;
		border-bottom: 1px solid #ccc;
		.center {
			position: relative;
			.play {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				width: 46px;
				height: 46px;
				line-height: 46px;
				background-color: rgba(0, 0, 0, 0.3);
				text-align: center;
				border-radius: 50%;
				span {
					color: white;
					font-size: 32px;
				}
			}
			img {
				width: 340px;
				height: 170px;
				object-fit: cover;
				padding: 10px 0;
			}
		}
	}
}
</style>
