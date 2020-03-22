<template>
  <div class="hm-collection">
    <hm-header>我的收藏</hm-header>
    <div class="list" v-for="item in list" :key="item.id">
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
    </div>
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
      const res = await this.$axios.get("/user_star"); //等价于之前的写法
      // console.log(res);
      const { statusCode, data } = res.data;
      if (statusCode === 200) {
        this.list = data;
        console.log(this.list);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.content {
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
}
</style>
