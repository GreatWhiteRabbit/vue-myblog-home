<template>
  <div class="login">
    <el-row class="row">
      <el-col :xl="6" :md="8" :sm="12" :xs="22" class="login-con blog-animation">
        <div class="login-img" >
          <img style="margin-left: 40%" src="~@/assets/logo.svg" />
        </div>
        <p class="login-welcome">欢迎登录！</p>
        <el-form :model="formCustom" status-icon :rules="rules" ref="formCustom">
          <el-form-item prop="name">
            <el-input
              prefix-icon="el-icon-user"
              type="text"
              v-model="formCustom.name"
              placeholder="用户名"
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
          <div class="login-btn">
            <el-button v-loading="loading" class="btn" @click="login('formCustom')">登录</el-button>
            <div class="a-tag user">
              <router-link to="/sign">立即注册</router-link>
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
  name: "Login",
  data() {
    return {

      loading: false,
      restaurants: [],
      formCustom: {
        name: "",
        email: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2到 20 个字符",
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
      },
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          if (!that.loading) {
            that.loading = true;
            axios({
              method:"post",
              url:'/apis/users/login',
              data:{
                user_name:this.formCustom.name,
                user_email:this.formCustom.email
              }
            })
              .then(res => {
                if(res.data.success === false) {
                  this.$notify({
                    type:'error',
                    title:'登录提示',
                    message:'用户不存在，请先注册'
                  })
                //  this.$message.error("用户不存在，请先注册");
                } else {
                  that.$router.push("/blog");
                  this.$notify({
                    type:'success',
                    message:'登录成功',
                    title:"登录提示"
                  })
                 /* that.$message({
                    showClose: true,
                    message: "登录成功",
                    type: "success",
                  });*/
                  var user_name = res.data.data.user_name;
                  var user_id = res.data.data.user_id;
                  sessionStorage.setItem("SimpleUser_id",user_id);
                  sessionStorage.setItem("SimpleUserName",user_name);
                }
              })
              .catch(function (error) {
                that.loading = false;
              });
          } else {
            that.$message({
              showClose: true,
              message: "正在登录中……",
              type: "success",
            });
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "按照提示正确填写账号和密码",
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
  created(){
    console.log(this.$partyLogin )
     if (this.$route.query.token){
        this.$store.dispatch("setToken", this.$route.query.token);
        this.$store.dispatch("userInfo");
        this.$router.push("/blog");
        this.$notify({
          message:'登录成功',
          type:'success',
          title:'登录提示'
        })
      /*  this.$message({
                showClose: true,
                message: "登录成功",
                type: "success",
        });*/
    }
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
};
</script>
<style lang="stylus" scoped>
@import '~@/assets/style/login.styl';

.row 
  min-height: 680px;
  .el-divider__text
    font-size 13px
    color #8c92a4
  .share
    .iconfont
      font-size:23px
      margin:10px
      cursor pointer
      color #ffffff
      border-radius 50%
      padding 7px
      transition all .5s
    .qq
      color rgb(27,193,250)
      border: 2px solid #efefef;
      &:hover
        color #fff
        background-color rgba(27,193,250,.3)
        border: 2px solid rgb(27,193,250);
    .gitee
      color  #fe7300
      border: 2px solid #efefef;
      &:hover
        color #fff
        background-color rgba(254,115,0,.3);
        border: 2px solid  #fe7300;
    .github
      color  #0a0203
      border: 2px solid #efefef;
      &:hover
        color #fff
        background-color rgba(10, 2, 3,.3);
        border: 2px solid  #0a0203;
  

</style>