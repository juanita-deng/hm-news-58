<template>
	<div class="hm-collection">
		<hm-header>我的收藏</hm-header>
		<!-- 写死的单一图片的结构 -->
		<!-- <div class="list" v-for="item in list" :key="item.id">
      <div class="content">
        <div class="article">
          <p>{{ item.title }}</p>
          <div class="bottom">
            <span>{{item.user.nickname}}</span>
            <span>{{item.comments.length}}跟帖</span>
          </div>
        </div>
        <div class="right">
          <img :src="item.cover[0].url" alt />
        </div>
      </div>
    </div> -->

		<!-- 封装的组件
            :post="article"父传子 article相当于item 
                                 post是子组件需要用props接收的数据自定义属性
     -->
		<hm-article
			v-for="article in list"
			:key="article.id"
			:post="article"
		></hm-article>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: []
		};
	},
	created() {
		this.getList();
	},
	methods: {
		async getList() {
			const res = await this.$axios.get('/user_star'); //等价于之前的写法
			// console.log(res);
			const { statusCode, data } = res.data;
			if (statusCode === 200) {
				//解决封装组件中具体跟帖数目显示的问题
				// 跟帖的条数后台给的是comments
				//而组件hm-post中后台给的是comment_length
				data.forEach(v => {
					v.comment_length = v.comments.length; //给本文中的list添加封装的hm-article组件的comment_length属性
				});
				this.list = data;
				console.log(this.list);
			}
		}
	}
};
</script>

<style lang="less" scoped>
/* .content {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .article {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 16px;
    }
    .bottom {
      font-size: 12px;
      color: #999;
      & :nth-child(2) {
        margin-left: 12px;
      }
    }
  }
  .right img {
    width: 121px;
    height: 75px;
    display: block;
    //图片失真的处理
    //类似于backgroundSize:cover/contain
    object-fit: cover; //可以图片等比例的压缩 取值:cover/contain
  }
} */
</style>
