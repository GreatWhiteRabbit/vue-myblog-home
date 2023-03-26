<template>
  <div class="route">
    <el-row>
      <el-col v-loading="loading" :md="{span:12,offset:6}" :sm="24" style="padding:30px 0">
        <el-form
          :model="userInfo"
          status-icon
          style="max-width:500px;margin-right:20px"
          ref="userInfo"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <div style="display: flex;margin-bottom:10px">
            <el-avatar
              style="margin-left:10px"
              :src="img"
              :size="80"
              shape="square"
            >
              <img src="https://iconfont.alicdn.com/t/b219af17-ee89-4bad-b48a-7d6c1147009d.png" />
            </el-avatar>
            <div style="padding-left:20px;">
              <p style="font-size:25px;color:#fff;">{{name}}</p>
              <p style="font-size:14px;color:#333">{{email}}</p>
              <p style="font-size:14px;color:#333">{{phone}}</p>
            </div>
          </div>
          <el-form
          :model="userInfo"
          status-icon
          ref="userName"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="name">
            <el-input v-model="userInfo.name">
              <el-button
                class="email"
                slot="append"
                @click="submitForm('userName')"
              >修改名称</el-button>
            </el-input>
          </el-form-item>
          </el-form>
          <el-form-item label="原密码" prop="password" class="password">
            <el-input type="password" v-model="userInfo.password">
            </el-input>
            <el-button
              icon="el-icon-edit"
              class="password-edit"
              @click="update"
              style="background: none;
            border: none;"
            ></el-button>
          </el-form-item>
          <div v-if="isUpdate">
             <el-form-item label="确认密码" prop="pass">
              <el-input type="password" v-model="userInfo.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="userInfo.checkPass" autocomplete="off"></el-input>
            </el-form-item>
          </div>
          <div class="user-btn">
<el-button  @click="submitForm('userInfo')">修改</el-button>

            <router-link style="color:#fff;font-size:14px"  to="/forget">忘记密码</router-link>
          </div>
            
          
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "UserInfo",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.userInfo.checkPass !== "") {
          this.$refs.userInfo.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userInfo.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      isUpdate: false,
      loading: true,
      name:'',
      email:'',
      phone:'',
      img:'',   
      userInfo: {
        pass: "",
        checkPass: "",
      },
      cloneInfo: {},
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 20个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "change" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["change", "change"],
          },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度在 11个字符", trigger: "blur" },
        ],
        avatar_url: [
          { required: true, message: "请输入头像地址", trigger: "blur" },
          {
            min: 3,
            max: 100,
            message: "长度在 3 到 100 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20个字符", trigger: "blur" },
        ],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    update() {
      this.isUpdate = !this.isUpdate;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          that.diffUserinfo();
          if(formName=='userName'){
            delete that.formData.pass
            that.formData.type="name"
          }
          that
            .$post("/apis/admin/update", that.formData)
            .then(function (res) {
              that.$store.dispatch("userInfo");
              that.getUserInfo();
              that.$message({
                message: res.message,
                type: "success",
              });
            })
            .catch(function (error) {});
        } else {
          return false;
        }
      });
    },
    // 比较数据
    diffUserinfo() {
      console.log("diff");
      this.formData = { ...this.userInfo };
      for (let k in this.cloneInfo) {
        if (this.cloneInfo[k] == this.formData[k]) {
          delete this.formData[k];
        }
      }
      if (this.formData["checkPass"]) {
        delete this.formData["checkPass"];
      }
    },
    getUserInfo() {
      let that = this;
      that.loading = true;
      that
        .$post("/apis/user/info")
        .then(function (res) {
          console.log(res.data);
          that.userInfo = res.data;
          that.loading = false;
          // that.userInfo["pass"] = "";
          that.cloneInfo = { ...res.data };
          that.img=res.data.avatar_url
          that.name=res.data.name
          that.email=res.data.email
        })
        .catch(function (error) {});
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>
<style lang="stylus" scoped>
.password {
  position: relative;

  .password-edit {
    position: absolute;
    right: 30px;
    top: 0;
  }
}

.user-btn {
  width: 80px;
  float: right;
}
</style>