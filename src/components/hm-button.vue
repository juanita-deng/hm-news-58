<template>
	<div class="hm-button" @click="$emit('click')">
		<span>
			<slot></slot>
		</span>
	</div>
</template>

<script>
export default {};
</script>

<style>
.hm-button {
	margin: 20px;
	height: 50px;
	line-height: 50px;
	text-align: center;
	border-radius: 25px;
	background-color: #d93e00;
	color: #fff;
	font-size: 18px;
}
</style>
