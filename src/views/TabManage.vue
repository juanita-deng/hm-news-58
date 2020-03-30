<template>
	<div class="tab-manamge">
		<hm-header>栏目管理</hm-header>

		<div class="tab-content">
			<div class="title">点击删除以下频道(至少保留3个)</div>
			<div class="content">
				<div
					class="item"
					v-for="item in activeTab"
					:key="item.id"
					@click="del(item.id)"
				>
					{{ item.name }}
				</div>
			</div>

			<div class="title">点击添加以下频道</div>
			<div class="content">
				<div
					class="item"
					v-for="item in unactiveTab"
					:key="item.id"
					@click="add(item.id)"
				>
					{{ item.name }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			activeTab: [], //激活的栏目
			unactiveTab: [] //未激活的栏目
		};
	},
	async created() {
		//栏目管理一加载，应该先从缓存中获取数据，
		//如果缓存中没有数据，才考虑发请求去获取所有的栏目
		const activeTab = JSON.parse(localStorage.getItem('activeTab'));
		const unactiveTab = JSON.parse(localStorage.getItem('unactiveTab'));
		if (activeTab && unactiveTab) {
			this.activeTab = activeTab;
			this.unactiveTab = unactiveTab;
			return;
		}

		const res = await this.$axios.get('/category');
		// console.log(res);
		const { statusCode, data } = res.data;
		if (statusCode === 200) {
			this.activeTab = data;
			this.unactiveTab = []; //默认都是激活的
			// console.log(this.activeTab);
		}
	},
	methods: {
		del(id) {
			// console.log('删除的内容id是', id);
			if (this.activeTab.length <= 3) {
				this.$toast('至少保留3个');
				return;
			}
			const index = this.activeTab.findIndex(v => v.id === id);
			// console.log(index);
			//注意先添加后删除,否则会报id重复的错误
			this.unactiveTab.unshift(this.activeTab[index]); //添加到未激活数组中
			this.activeTab.splice(index, 1); //删除激活中id对应的栏目
		},
		add(id) {
			const index = this.unactiveTab.findIndex(v => v.id === id);
			this.activeTab.push(this.unactiveTab[index]);
			this.unactiveTab.splice(index, 1);
		}
	},
	watch: {
		activeTab: {
			handler(value) {
				//解决一刷新添加和修改的栏目变回初始情况
				console.log('activeTab变化了', value);
				localStorage.setItem('activeTab', JSON.stringify(this.activeTab));
				localStorage.setItem('unactiveTab', JSON.stringify(this.unactiveTab));
			}
		},
		deep: true
	}
};
</script>

<style lang="less" scoped>
.tab-content {
	padding: 10px 20px;

	.title {
		color: #999;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
	}
	.content {
		overflow: hidden;
		.item {
			float: left;
			padding: 10px 15px;
			background-color: #ddd;
			border: 1px solid #ccc;
			margin-right: 10px;
			margin-bottom: 10px;
		}
	}
}
</style>
