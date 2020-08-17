module.exports = {
	devServer: {
		open: true, //自动打开浏览器
		port: 3000, //修改端口号
		//配置反向代理(跨域问题)
		proxy: {
			'/api': {
				target: 'http://localhost:3000', //代理路径
				pathRewrite: { '^/api': '' }, //路径重写
				secure: true, //匹配https也能通过访问
				changeOrigin: true, //修改请求头host信息
			},
		},
	},
	//配置postcss-px2rem
	css: {
		loaderOptions: {
			css: {},
			postcss: {
				plugins: [
					require('postcss-px2rem')({
						//rem的单位：因为使用了lib-flexble会把所有的屏幕分成10等份
						//所以1rem就应该配置为设计图的1/10  640
						//如果设置为75px,如果项目中还用到了第三方库van-ui，单位也是px,也会被转成rem
						remUnit: 36, //一倍图的1/10，设计图是360，不是二倍图
						//如果拿到750设计图，记得缩小一倍量设计图，这样就不会影响到第三方库
						//如果750设计图1rem = 75px直接1：1量设计图
						//如果先把设计图缩小一倍1rem = 37.5px量设计图把750的设计图缩小到375
					}),
				],
			},
		},
	},
	//配置externals,排除打包的文件
	//参考链接:https://segmentfault.com/q/1010000017056065
	configureWebpack: {
		externals: {
			// vue: 模块名字
			// 'Vue' 全局变量Vue
			// 告诉webpack  import Vue from 'vue'
			vue: 'Vue',
			'vue-router': 'VueRouter',
			moment: 'moment',
			axios: 'axios',
			lodash: '_',
		},
	},
};
