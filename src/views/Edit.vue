<template>
  <div class="hm-edit">
    <hm-header>编辑资料</hm-header>
    <!-- avatar头像 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt />
      <!-- 头像上传组件 -->
      <van-uploader :after-read="afterRead" class="uploader" />
    </div>

    <!-- 裁剪头像的遮罩 -->
    <div class="mask" v-show="show4">
      <van-button class="crop" type="primary" @click="crop">裁剪</van-button>
      <van-button class="cancel" type="info" @click="cancel">取消</van-button>
      <vue-cropper
        ref="cropper"
        :img="img"
        :outputSize="1"
        :info="true"
        :autoCrop="true"
        :autoCropWidth="150"
        :autoCropHeight="150"
        :fixed="true"
      ></vue-cropper>
    </div>

    <hm-navbar title="昵称" :content="info.nickname" @clickFn="showNickname"></hm-navbar>
    <!-- 修改昵称的弹窗组件通过v-model="show"通过show的值控制显示和隐藏 -->
    <van-dialog v-model="show1" title="修改昵称" show-cancel-button @confirm="editNickname">
      <van-field v-model="nickname" placeholder="请输入用户昵称" />
    </van-dialog>

    <hm-navbar title="密码" :content="info.password.replace(/./g, '*')" @clickFn="showPassword"></hm-navbar>
    <!-- 修改密码的弹窗 -->
    <van-dialog v-model="show2" title="修改密码" show-cancel-button @confirm="editpassword">
      <van-field v-model="password" placeholder="请输入密码" />
    </van-dialog>

    <hm-navbar title="性别" :content="info.gender === 0 ? '女' : '男'" @clickFn="showGender"></hm-navbar>
    <!-- 修改性别的弹窗 -->
    <van-dialog v-model="show3" title="修改性别" show-cancel-button @confirm="editGender">
      <van-radio-group v-model="info.gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <van-radio slot="right-icon" :name="1" />
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <van-radio slot="right-icon" :name="0" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
//局部引入图片裁剪的插件
import { VueCropper } from "vue-cropper";
export default {
  data() {
    return {
      info: {
        //获取个人信息
        password: "" //用于密码位数正则校验的报错解决
      },
      show1: false, //用于修改昵称弹窗的显示和隐藏
      show2: false, //用于密码框弹窗的显示和隐藏
      show3: false, //用于修改性别弹窗的显示和隐藏
      show4: false, //用于裁剪图片的遮罩的显示和隐藏
      nickname: "", //用于昵称回显
      password: "", //用于修改密码
      gender: "", //用于修改性别
      head_img: "", //用于修改上传的图片
      img: "" //用于遮罩需要裁剪的图片的显示
    };
  },
  created() {
    this.getInfo(); //获取个人信息
  },
  components: {
    VueCropper //修改图片的组件
  },
  methods: {
    async getInfo() {
      // 发送ajax请求,渲染个人信息
      const user_id = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");
      const res = await this.$axios({
        url: `/user/+${user_id}`,
        method: "get",
        headers: {
          Authorization: token
        }
      });

      // .then(res => {
      // console.log(res);
      const { message, statusCode, data } = res.data;
      if (statusCode === 200 && message === "获取成功") {
        this.info = data;
        // console.log(this.info);
      }
      // });
    },
    async editUser(data) {
      //修改用户信息，接收需要修改的数据
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");
      const res = await this.$axios({
        url: `/user_update/${user_id}`,
        method: "post",
        data, //根据需求提供,作为形参传出去，由外面提供
        headers: {
          Authorization: token
        }
      });

      // .then(res => {
      // console.log(res);
      const { statusCode, message } = res.data;
      if (statusCode === 200 && message === "修改成功") {
        //重新渲染
        this.getInfo();
        //给一个修改成功的提示
        this.$toast.success(message);
      }

      // });
    },
    showNickname() {
      //显示修改昵称的弹窗
      this.show1 = true;
      this.nickname = this.info.nickname; //昵称回显到input框中
    },
    editNickname() {
      //点击确认按钮修改昵称
      // console.log('我要修改昵称了');

      //发送Ajax修改昵称
      // 	const token = localStorage.getItem('token');
      // 	const user_id = localStorage.getItem('user_id');
      // 	this.$axios({
      // 		url: `/user_update/${user_id}`,
      // 		method: 'post',
      // 		data:{
      // 			nickname: this.nickname
      // 		},
      // 		headers: {
      // 			Authorization: token
      // 		}
      // 	}).then(res => {
      // 		console.log(res);
      // 		const { statusCode, message, data } = res.data;
      // 		if (statusCode === 200 && message === '修改成功') {
      // 			//重新渲染
      // 			this.getInfo();
      // 			//给一个修改成功的提示
      // 			this.$toast.success(message);
      // 		}
      // 	});
      // }
      this.editUser({
        nickname: this.nickname
      });
    },
    showPassword() {
      //修改密码框弹窗
      this.show2 = true;
      this.password = this.info.password;
    },
    editpassword() {
      //点击确认按钮修改密码
      //发送ajax请求,修改密码
      this.editUser({
        password: this.password
      });
    },
    showGender() {
      this.show3 = true;
      this.gender = this.info.gender;
    },
    editGender() {
      //修改性别
      this.editUser({
        gender: this.gender
      });
    },
    afterRead(file) {
      // console.log(file);//原图片的信息
      this.show4 = true; //显示遮罩
      this.img = file.content; //用于裁剪图片的展示 content是图片的base64编码
      //文件上传完毕后会触发after-read回调函数，
      //获取到对应的file对象

      //上传前需要裁剪

      //需要Ajax通过formdata异步的上传文件
      // const fd = new FormData();
      // fd.append('file', file.file);
      // const token = localStorage.getItem('token');
      // this.$axios({
      // 	method: 'post',
      // 	url: '/upload',
      // 	headers: {
      // 		Authorization: token
      // 	},
      // 	data: fd
      // }).then(res => {
      // 	// console.log(res.data);
      // 	const { statusCode, data } = res.data;
      // 	if (statusCode === 200) {
      // 		//发送ajax请求，渲染数据
      // 		console.log(data.url);
      // 		this.editUser({
      // 			//能够拿到上传的图片的地址，还需要修改掉用户的图像
      // 			head_img: data.url
      // 		});
      // 	}
      // });
    },
    //下面已经加了裁剪大小及格式，此处则不需要校验
    // beforeread(file) {
    // 	//图片上传的校验 只接受200k以下的jpg格式文件
    // 	//van-uploader中:beforeread="function"
    // 	//返回true表示校验通过，false表示校验失败
    // 	console.log(file);
    // 	if (file.size / 1024 >= 200) {
    // 		this.$toast.fail('图片上传不能超过200k');
    // 		return false;
    // 	}
    // 	if (file.type !== 'image/jpeg') {
    // 		this.$toast('图片上传必须是jpg图片');
    // 		return false;
    // 	}
    // 	return true;
    // },
    crop() {
      //裁剪功能
      //获取到裁剪的图片并发送Ajax异步上传
      this.$refs.cropper.getCropBlob(async data => {
        // console.log(data); //裁剪后的图片
        //发送ajax请求异步上传
        const fd = new FormData();
        fd.append("file", data);
        const res = await this.$axios({
          url: "/upload",
          method: "post",
          data: fd
        });
        // .then(res => {

        // console.log(res);
        const { statusCode, message, data: data1 } = res.data;
        if (statusCode === 200) {
          // console.log(data.url);
          //裁剪头像渲染
          this.editUser({
            head_img: data1.url
          });
          //让裁剪框隐藏
          this.show4 = false;
        }
      });

      // });
    },
    cancel() {
      this.show4 = false; //取消让遮罩隐藏
    }
  }
};
</script>

<style lang="less" scoped>
.hm-edit {
  .avatar {
    position: relative;
    img {
      display: block;
      margin: 30px auto;
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    .uploader {
      position: absolute;
      top: 0;
      right: 50%;
      transform: translate(50%);
      opacity: 0;
    }
  }
  //修改组件样式
  .van-dialog {
    padding: 0 10px;
  }
  .van-field {
    border: 1px solid #ccc;
    margin: 10px 0;
  }
  //遮罩样式
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
  }
  //裁剪和取消按钮
  .crop {
    position: absolute;
    left: 0;
    z-index: 2;
  }
  .cancel {
    position: absolute;
    right: 0;
    z-index: 2;
  }
}
</style>
