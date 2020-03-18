<template>
  <div class="hm-user">
    <hm-header>个人中心</hm-header>

    <div class="hm-info" @click="$router.push('/edit')">
      <div class="left">
        <img :src="$axios.defaults.baseURL + info.head_img" alt />
      </div>
      <div class="center">
        <p
          class="iconfont"
          :class="{
						iconxingbienv: info.gender === 0,
						iconxingbienan: info.gender === 1
					}"
        >{{ info.nickname }}</p>
        <p>{{ info.create_date | date }}</p>
      </div>
      <div class="right">
        <span class="iconfont iconjiantou1"></span>
      </div>
    </div>

    <hm-navbar title="我的关注" content="关注的用户"></hm-navbar>
    <hm-navbar title="我的跟帖" content="跟帖/回复"></hm-navbar>
    <hm-navbar title="我的收藏" content="文章/视频"></hm-navbar>
    <hm-navbar title="设置" @clickFn="$router.push('/edit')"></hm-navbar>
    <hm-navbar title="退出" @clickFn="logout"></hm-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {} //存放个人信息
    };
  },
  created() {
    //获取到登录页存储到本地的信息
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    this.$axios({
      url: "/user/" + user_id,
      method: "get",
      headers: {
        Authorization: token
      }
    }).then(res => {
      // console.log(res);
      //根据获取到的后台返回的信息动态渲染
      const { statusCode, data } = res.data; //解构赋值
      if (statusCode === 200) {
        this.info = data; //请求成功的时候，把个人中心的信息存起来
        //根据后台返回的data,动态渲染头像,昵称,性别,日期
      }
    });
  },
  methods: {
    logout() {
      console.log("退出");
      this.$dialog
        .confirm({
          title: "温馨提示",
          message: "你确定要退出本系统吗？"
        })
        .then(res => {
          console.log("确定了");
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          this.$router.push("/login");
          this.$toast.success("退出成功");
        })
        .catch(res => {
          console.log("取消了");
          this.$toast.fail("取消退出");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.hm-info {
  display: flex;
  height: 100px;
  align-items: center;
  border-bottom: 2px solid #ccc;
  .left {
    margin: 20px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .center {
    flex: 1;
    font-size: 14px;
    color: #333;
    & :nth-child(2) {
      color: #999;
    }
    .iconxingbienan {
      color: skyblue;
    }
    .iconxingbienv {
      color: pink;
    }
  }
  .right {
    padding: 10px;
  }
}
</style>
