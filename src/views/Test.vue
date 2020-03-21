<template>
	<div class="test">
		<!-- 因为vue-cropper该盒子宽高100%，所以父盒子一定要有高 -->

		<!-- 图片裁剪的配置 -->
		<!-- img:用于指定裁剪哪张图片 (图片必须是在线地址)
         outputSize:用于指定裁剪图片的质量 默认值1  可选值0.1-1 记得加冒号
         outputType:用于指定裁剪出来的图片的格式 jpeg(默认值)|png|webp
         autoCrop:是否生成裁剪框  fasle(默认值) | true 记得加冒号
         info:是否显示裁剪框的信息(裁剪的尺寸) 默认true
         canScale:图片是否允许滚轮缩放 默认true
         autoCropWidth:指定默认生成裁剪框的宽度  记得加冒号才能得到数字型
         autoCropHeight:指定默认生成裁剪框的高度  记得加冒号
         fixed:是否开启裁剪框宽高比固定 默认值true
         fixedNumber:指定宽高比 默认1:1
         fixedBox:是否固定裁剪框的大小,不允许调整大小
         canMove:图片是否可以移动 默认true
         canMoveBox:裁图框能否拖动 默认true
    -->
		<vue-cropper
			ref="cropper"
			img="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2829387590,2128721795&fm=26&gp=0.jpg"
			outputType="jpeg"
			:outputSize="1"
			:autoCrop="true"
			:info="true"
			:fixed="true"
			:autoCropHeight="150"
			:autoCropeWidth="150"
		></vue-cropper>
		<van-button type="primary" @click="crop">裁剪</van-button>
	</div>
</template>

<script>
import { VueCropper } from 'vue-cropper';
export default {
	components: {
		VueCropper
	},
	methods: {
		crop() {
			//裁剪图片,获取的是图片的base64编码，可以用于展示
			this.$refs.cropper.getCropData(data => {
				console.log(data); //data是图片的base编码
				//base64编码是不能用于上传到服务器的，想要上传到服务器，必须是一个文件的格式
			});

			//需求：把base64编码转成文件，只有文件格式才能上传后台
			this.$refs.cropper.getCropBlob(data => {
				console.log(data); //data是blob格式文件，可以上传给后台
			});
		}
	}
};
</script>

<style lang="less" scoped>
.test {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
}
</style>
