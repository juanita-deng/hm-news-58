<template>
	<div class="hm-header">
		<div
			class="header-left iconfont iconjiantou2"
			@click="$router.go(-1)"
		></div>
		<div class="title">
			<slot></slot>
		</div>
		<div class="header-right"></div>
	</div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.hm-header {
	display: flex;
	height: 40px;
	line-height: 40px;
	.header-left,
	.header-right {
		width: 30px;
		text-align: center;
		font-weight: 700;
	}
	.title {
		flex: 1;
		text-align: center;
		font-size: 18px;
	}
}
</style>
