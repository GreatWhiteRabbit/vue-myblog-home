<template>
  <div class="cont">
    <div class="user container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个人信息" name="UserInfo">
          <span slot="label">
            <i class="el-icon-user"></i> 个人信息
          </span>
        </el-tab-pane>
        <el-tab-pane label="我的留言" name="Message">
          <span slot="label">
            <i class="el-icon-chat-line-round"></i> 我的留言
          </span>
        </el-tab-pane>
        <el-tab-pane label="发表文章" name="Add">
          <span slot="label">
            <i class="el-icon-edit"></i> 发表文章
          </span>
        </el-tab-pane>
        <el-tab-pane label="系统消息" name="SysMess">
          <span slot="label">
            <i class="el-icon-chat-dot-square"></i> 系统消息
          </span>
        </el-tab-pane>
        <div :is="activeName" keep-alive></div>
      </el-tabs>
    </div>

    <!--:is 的作用：会将div标签转换成 currentView 变量绑定的这个组件-->
  </div>
</template>
<script>
export default {
  name: "User",
  components: {
    UserInfo: (resolve) => {
      require(["./UserInfo.vue"], resolve);
    },
    Message: (resolve) => {
      require(["./Message.vue"], resolve);
    },
    SysMess: (resolve) => {
      require(["./SysMess.vue"], resolve);
    },
    Add: (resolve) => {
      require(["./Add.vue"], resolve);
    },
  },
  computed: {
    click() {
      let route = this.$route.params.id;
      switch (route) {
        case "info":
          route = "UserInfo";
          break;
        case "message":
          route = "Message";
          break;
        case "add":
          route = "Add";
          break;
        case "sysmess":
          route = "SysMess";
          break;
        default:
          route = "UserInfo";
      }
      this.activeName = route;

    },
  },
  data() {
    return {
      activeName: "UserInfo",
    };
  },
  methods: {
    handleClick(tab, event) {
      let route = "";
      switch (this.activeName) {
        case "UserInfo":
          route = "info";
          break;
        case "Message":
          route = "message";
          break;
        case "Add":
          route = "add";
          break;
        case "SysMess":
          route = "sysmess";
          break;
        default:
          route = "info";
      }
      let rou = "/user/";
      this.$router.push({ path: rou + route });
    },
    choice() {
      var blog='-大白兔'
      let route = this.$route.params.id;
      switch (route) {
        case "info":
          document.title='个人信息'+blog
          route = "UserInfo";
          break;
        case "message":
          document.title='我的留言'+blog
          route = "Message";
          break;
        case "add":
          document.title='发表文章'+blog
          route = "Add";
          break;
        case "sysmess":
          document.title='系统消息'+blog
          route = "SysMess";
          break;
        default:
          document.title='个人信息'
          route = "UserInfo";
      }
      this.activeName = route;
    },
  },
  mounted() {
    this.choice();
  },
  created(){
    console.log("user");
    if (!this.$store.state.user.token) {

        this.$router.push("/login");
    }
  },
  watch: {
    "$route.params.id"(newVal) {
      this.choice();
    },
  },
};
</script>
<style lang="stylus" scoped>
>>>.route {
  padding: 0 !important;
}

>>>.el-tabs__item.is-active {
  color: var(--main-6);
}

>>>.el-tabs__active-bar {
  background-color: var(--main-5);
}

// >>>.el-tab-pane
// color:var(--main-5)
// font-weight:bold
// font-size:18px
.cont {
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -2;
    background-image: url('https://p.pstatp.com/origin/feca0003544cbfdb49bd');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    filter: blur(6px);
    z-index: -1;
  }

  .user {
    padding: 65px 10px 40px 10px;
    box-sizing: border-box;
  }
}
</style>