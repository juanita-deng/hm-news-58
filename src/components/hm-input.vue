<template>
	<div class="hm-input">
		<input
			:type="type"
			:placeholder="placeholder"
			@input="inputFn"
			:value="value"
			:class="{
				success: status === 'success',
				error: status === 'error'
			}"
		/>
		<div class="tips" v-show="status === 'error'">{{ message }}</div>
	</div>
</template>

<script>
export default {
	// props: ["type", "placeholder"],
	props: {
		//用于接收父组件传递过来的数据
		type: {
			//接收type属性
			type: String,
			default: 'text'
		},
		placeholder: {
			//接收placeholdder属性
			type: String,
			default: '请输入...'
		},
		value: String, //动态获取到input框的value值,用户输入的内容(父组件)， 父传子
		rule: RegExp, //正则表达式
		message: String //校验的信息提醒
	},
	data() {
		return {
			status: '' //记录校验正则的状态
		};
	},
	methods: {
		inputFn(e) {
			//怎么通过事件对象获取到值
			// console.log(e.target); //能够获取到触发事件的元素
			//e.target.value相当于document.querrySelector('input').value
			const value = e.target.value;
			this.$emit('input', value); //需要把input框的值传给父组件 子传父

			//表单校验
			this.validate(value); //因为下面的校验value用不了，所以这里需要传参
		},
		validate(value) {
			//表单校验
			//表单校验，需要给一个返回值，返回校验的状态
			if (this.rule) {
				//判断输入的value值是否符合正则
				if (this.rule.test(value)) {
					this.status = 'success';
					return true;
				} else {
					this.status = 'error';
					return false;
				}
				console.log(this.status);
			}
		}
	}
};
</script>

<style lang="less" scoped>
.hm-input {
	margin: 20px;
	height: 50px;
	line-height: 50px;
	input {
		height: 30px;
		line-height: 30px;
		border: none; //去除未选中状态边框
		outline: none; //去除选中状态边框
		border-bottom: 2px solid #cccccc;
		width: 100%;
		font-size: 16px;
		color: #666;

		&.success {
			border-color: green;
		}
		&.error {
			border-color: red;
		}
	}
	.tips {
		color: red;
		font-size: 14px;
		height: 20px;
		line-height: 20px;
	}
}
</style>
