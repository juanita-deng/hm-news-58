<template>
  <div id="app">
    <!-- 
			指定路由的出口
			 		keep-alive:默认会缓存所有的组件
					 通过include属性可以设置keep-alive需要缓存的组件,
					 需要在数组中指定需要缓存的组件的名字,
					 组件如果需要被keep-alive缓存,也需要指定一个name

					 include用于控制是否需要缓存组件的,动态的控制include

					 缓存的思路:
					 		1.只要进入到首页,就应该把首页给缓存起来.
							2.只要离开首页的时候,需要判断了
								如果进入的是详情页,home组件依旧要被缓存
								如果进入的不是详情页,home组件就不应该被缓存
    -->
    <keep-alive :include="cacheList">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["cacheList"])
  }
};
</script>

<style lang="less"></style>
