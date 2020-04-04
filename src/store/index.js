import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		//用于提供状态
		//需要被keep-alive缓存的一个数组
		cacheList: [],
	},
	mutations: {
		//缓存组件
		//name:需要缓存的组件的名字
		//组件通过this.$store.commit('cache','home')提交
		cache(state, name) {
			console.log(state, name);
			if (!state.cacheList.includes(name)) {
				//如果缓存中没有home就添加
				state.cacheList.push(name);
			}
		},

		//不缓存
		//组件通过this.$store.commit('uncache','home')提交
		uncache(state, name) {
			if (state.cacheList.includes(name)) {
				//如果不需要缓存就删除名字
				state.cacheList = state.cacheList.filter((v) => v !== name);
			}
		},
	},
});
export default store;
