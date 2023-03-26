<template>
  <div class="login">
    <el-row class="row">
      <el-col :xl="6" :md="8" :sm="12" :xs="22" class="login-con blog-animation">
        <div class="login-img" >
          <img style="margin-left: 40%" src="~@/assets/logo.svg" />
        </div>
        <p class="login-welcome">欢迎注册！</p>
        <el-form :model="formCustom" status-icon :rules="rules" ref="formCustom">
          <el-form-item prop="name">
            <el-input
              prefix-icon="el-icon-user"
              type="text"
              placeholder="用户昵称(字母、数字、文字)"
              v-model="formCustom.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-autocomplete
              style="width:100%"
              prefix-icon="el-icon-message"
              type="email"
              placeholder="邮箱地址"
              v-model="formCustom.email"
              autocomplete="off"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item prop="Code"  class="checkCode">
            <el-input
                v-model="formCustom.code"
                placeholder="请输入6位验证码"
                type="text"
                autocomplete="off"
            ></el-input>
            <el-button
                @click.stop="sendVerificationCode"
                type="primary"
                style="margin-left: 10px"
                v-if="show"
            >发送验证码</el-button
            >
            <el-button
                type="primary"
                style="margin-left: 10px"
                v-if="!show"
                disabled
            >{{ count }}秒后重发</el-button>
          </el-form-item>
          <div class="login-btn">
            <el-button v-loading="loading" class="btn" @click="login('formCustom')" >注册</el-button>
            <div class="a-tag user">
              <router-link to="/login">立即验证邮箱登录</router-link>
            </div>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Sign",
  data() {
    return {
      show: true,
      count: "",
      loading: false,
      restaurants: [],
      canLogin:false, // 是否允许登录
      formCustom: {
        name: "",
        email: "",
        code:""
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "change" },
          {
            min: 2,
            max: 20,
            message: "账号长度在 2到 20 个字符",
            trigger: "change",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "change" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["change", "change"],
          },
        ],
        code:[
            {required: true, message: '请输入6位验证码', trigger: 'change' },
          {
            type: "code",
            message: "请输入验证码",
            trigger: "change",
            min: 6,
            max: 6,
          },]
      },
    };
  },
  methods: {
    sendVerificationCode() {
      var length = this.formCustom.email.indexOf("@");
      if(length === -1 || length === 0) {
        this.$message.error("请输入邮箱");
        return;
      }
      let TIME_COUNT = 180;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
        this.getCode();
      }
    },
    //通过用户输入的邮箱发送到指定的邮箱中取
    getCode() {

     axios({
      method:'get',
       url:'/apis/users/sendEmail',
       params:{
         user_email:this.formCustom.email
       }
     }).then((res) => {
       if(res.data.data === null) {
         this.canLogin = true;
       } else {
         this.canLogin = false;
         this.$message.error("邮箱所属账户已存在，登录成功");
         var user_name = res.data.data.user_name;
         var user_id = res.data.data.user_id;
         sessionStorage.setItem("SimpleUser_id",user_id);
         sessionStorage.setItem("SimpleUserName",user_name);
        this.$router.push("/blog");
       }
      });
    },
    login(formName) {
      if(this.canLogin === false) {
        this.$message.error("请先获取验证码");
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          if (!that.loading) {
            that.loading = true;
            axios({
              method:'post',
              url:'/apis/users/testCode',
              data:{
                 user_name:that.formCustom.name,
                 user_email:that.formCustom.email,
                 testCode:that.formCustom.code
              }
            })
              .then(res => {
                if(res.data.success === true) {
                  var user_name = res.data.data.user_name;
                  var user_id = res.data.data.user_id;
                  sessionStorage.setItem("SimpleUser_id",user_id);
                  sessionStorage.setItem("SimpleUserName",user_name);
                  this.$message.success("注册成功，欢迎留言");
                  this.$router.push("/blog");
                } else {
                  this.$message.error("验证码错误或邮箱错误");
                }
                that.loading = false;

              })
              .catch(function (error) {
                that.loading = false;
              });
          } else {
            that.$message({
              showClose: true,
              message: "正在注册中……",
              type: "success",
            });
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "按照提示正确填写信息",
          });
          return false;
        }
      });
    },
    querySearch(queryString, callback) {
      let restaurants = this.restaurants;
      let results = JSON.parse(JSON.stringify(restaurants)); //把数组的浅复制换成深复制
      for (let item in results) {
        results[item].value =
          queryString.split("@")[0] + "" + restaurants[item].value;
      }
      callback(results);
    },
    loadAll() {
      return [
        { value: "@qq.com" },
        { value: "@126.com" },
        { value: "@163.com" },
        { value: "@sohu.com" },
      ];
    },
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
};
</script>
<style lang="stylus" scoped>
@import '~@/assets/style/login.styl';

.row {
  min-height: 680px;
}
.checkCode ::v-deep .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>