<template>
  <div class="hm-search">
    <div class="header">
      <div class="left" @click="back">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <span class="iconfont iconsearch"></span>
        <input
          type="text"
          @keyup.enter="search"
          placeholder="请输入要搜索的内容"
          v-model="keyword"
          @input="recommend"
        />
      </div>
      <div class="right" @click="search">搜索</div>
    </div>
    <!-- 渲染推荐列表 -->
    <div class="recommend" v-if="recommendList.length > 0">
      <p
        class="item"
        v-for="item in recommendList"
        :key="item.id"
        @click="history_search(item.title)"
      >{{ item.title }}</p>
    </div>

    <!-- 渲染文章列表 -->
    <div class="postlist" v-else-if="searchList.length > 0">
      <hm-article :post="search" v-for="search in searchList" :key="search.id"></hm-article>
    </div>

    <div class="content" v-else>
      <div class="history">
        <h5>历史记录</h5>
        <div
          class="item"
          v-for="item in historyList"
          :key="item"
          @click="history_search(item)"
        >{{ item }}</div>
      </div>

      <div class="hot">
        <h5>热门搜索</h5>
        <div class="item" v-for="item in hotList" :key="item">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
//导入lodash,节流使用
import _ from "lodash";
export default {
  data() {
    return {
      keyword: "",
      searchList: [],
      historyList: [],
      hotList: [],
      recommendList: []
    };
  },
  created() {
    this.historyList = JSON.parse(localStorage.getItem("history")) || [];
    this.hotList = ["情火", "亲爱的", "新冠肺炎", "复工"];
  },
  methods: {
    async search() {
      // 搜索时，关闭推荐
      this.recommendList = [];
      //添加之前判断历史记录中是否还有这个历史记录,如果有先删除
      this.historyList = this.historyList.filter(v => v !== this.keyword);
      if (this.keyword.trim() === "") {
        this.$toast("不能为空");
        return;
      }
      this.historyList.unshift(this.keyword);
      localStorage.setItem("history", JSON.stringify(this.historyList));
      const res = await this.$axios.get("/post_search", {
        params: {
          keyword: this.keyword,
          pageIndex: 1,
          pageSize: 5
        }
      });
      // console.log(res);
      const { statusCode, data } = res.data;
      if (statusCode === 200) {
        this.searchList = data;
        // console.log(this.searchList);
      }
    },
    history_search(item) {
      //点击历史记录进行搜索
      this.keyword = item;
      this.search();
    },
    back() {
      if (this.keyword) {
        this.keyword = "";
      } else {
        this.$router.go(-1);
      }
    },
    // async recommend() {
    // 	// 如果输入的内容是空，不推荐
    // 	if (!this.keyword) return;
    // 	const res = await this.$axios.get('/post_search_recommend', {
    // 		params: {
    // 			keyword: this.keyword
    // 		}
    // 	});
    // 	// console.log(res);
    // 	const { statusCode, data } = res.data;
    // 	if (statusCode === 200) {
    // 		this.recommendList = data;
    // 		console.log(this.recommendList);
    // 	}
    // }

    //加入节流后效果--优化性能
    //注意_.debounce此处不能使用箭头函数
    recommend: _.debounce(async function() {
      // console.log('我触发了input事件');
      // 如果输入的内容是空，不推荐
      if (!this.keyword) return;

      // 发送请求，获取推荐数据
      const res = await this.$axios.get("/post_search_recommend", {
        params: {
          keyword: this.keyword
        }
      });
      // console.log(res);
      const { statusCode, data } = res.data;
      if (statusCode === 200) {
        this.recommendList = data;
        // console.log(this.recommendList);
      }
    }, 500)
  },
  watch: {
    keyword(value) {
      // console.log('input的值发生了变化', value);
      //如果keyword为空,就显示历史记录和热门搜索
      if (!value) {
        this.searchList = [];
        this.recommendList = [];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.hm-search {
  position: relative;
  .header {
    padding: 0 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    .left span {
      font-size: 18px;
    }
    .center {
      flex: 1;
      position: relative;
      margin: 10px 20px;
      input {
        font-size: 12px;
        text-indent: 20px;
        height: 20px;
        line-height: 20px;
        color: #999;
        padding: 5px 10px;
        width: 100%;
        border-radius: 20px;
        border: 1px solid #ccc;
      }
      span {
        position: absolute;
        left: 14px;
        top: 8px;
      }
    }
    .right {
      padding: 10px;
      font-size: 16px;
    }
  }
  .recommend {
    width: 100%;
    position: absolute;
    z-index: 999;
    background-color: #fff;
    .item {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      border-bottom: 1px solid #ccc;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .content {
    .history,
    .hot {
      padding: 0 20px;
      overflow: hidden;
    }

    h5 {
      font-size: 18px;
      font-weight: 700;
      padding: 20px 0;
    }
    .item {
      padding: 10px;
      background-color: #ddd;
      border: 1px solid #ccc;
      float: left;
      margin-right: 10px;
      margin-bottom: 10px;
      font-size: 12px;
    }
  }
}
</style>
