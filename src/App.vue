<template>
  <div id="app" class="home-blog">

    <new-header></new-header>


    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="route-content"></router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive" class="route-content"></router-view>

    <index-footer :route="$route.path"></index-footer>
    <transition name="slide-fade">
        <el-backtop :right="20" >

          <div class="iconfont backtop">&#xe601;</div>
        </el-backtop>
    </transition>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="35%">
      <my-marked :initialValue="content"></my-marked>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-tooltip class="item" effect="light" content="点击确定，下次不再弹出！" placement="top">
          <el-button type="primary" @click="confirm" style="background-color:var(--main-6)">确定</el-button>
        </el-tooltip>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import NewHeader from "./views/NewHeader";
import IndexFooter from "./views/IndexFooter";

import MyMarked from "./components/MyMarked";

export default {
  name: "app",
  components: {
    IndexFooter,
    NewHeader,

    MyMarked,
  },
  data() {
    return {
      dialogVisible: false,
      title: "公告",
      content: "",
      id: 0,
    };
  },
  methods: {
    getSysMess() {
      let that = this;
      that
        .$get("/apis/system/getSystemInfo")
        .then(function (response) {

            that.title = response.data.title;
            that.content = response.data.content;
            that.id = response.data.id;
            let sysMess_id = localStorage["sysMess_id"];
            if (sysMess_id != response.data.id) {
              that.dialogVisible = true;
            }
        })
        .catch(function (error) {

        });
    },
    confirm() {
      this.dialogVisible = false;
      localStorage["sysMess_id"] = this.id;
    },

  },
  mounted() {
    this.getSysMess();

  },
};
</script>
<style>
@import "~@/assets/style/reset.css";
@import "~@/assets/style/pie.css";
</style>
<style lang="stylus">
.screen{
  position relative
}
.screen-next{
  position absolute 
  bottom 10px
  left 50%
  transform translateX(-50%)
  font-size 30px!important
  animation: next 0.6s linear infinite alternate;
  color rgb(255, 255 ,255, .4)
  cursor pointer
  transition all .3s
  z-index 1000
}
.screen-next:hover{
  color #fff
}

.el-avatar {
  // background:transparent#b5e7f3
  background: #b5e7f3;
}

.el-notification .el-icon-warning {
  color: #fdbc5b;
}

.backtop {
  height: 100%;
  width: 100%;
  background-color: #585d5d;
  text-align: center;
  line-height: 40px;
  font-size: 30px !important;
  color: #fff;
  font-weight: bold;
  transition all .5s
  &:hover{
    line-height: 36px;
    background: linear-gradient(to right, #8EC5FC,#9FACE6)
  }
}

.el-dialog__body {
  padding: 10px 20px !important;
}

.el-dialog__title {
  font-weight: bold;
  color: var(--main-6);
}

.el-input.is-active .el-input__inner, .el-input__inner:focus {
  border-color: var(--main-6);
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

.v-note-wrapper {
  min-width: 1px !important;
  min-height: 1px !important;
  box-shadow: none !important;
  background-color: transparent !important;
}

.v-show-content {
  padding: 0 !important;
  background-color: transparent !important;
}

.route {
  padding-top: 60px;
}

p {
  word-wrap: break-word;
  word-break: normal;
}

#nprogress .bar {
  background: linear-gradient(120deg, #84fab0 0%, #51cacc 100%) !important; // 自定义颜色
}

.blog-animation {
  animation-name: swcrawl;
  animation-duration: 1s;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}
@media (max-width: 850px) {
  .route-content {
    transition: all 0.2s;
    filter: none;
  }

  .route-filter {
    transition: all 0.2s;
    filter: blur(10px);
  }

  .el-dialog {
    width: 90% !important;
  }
}
@keyframes next {
  0% {
    transform: translate(-50%,3px);
  }

  100% {
    transform: translate(-50%,0px);
  }
}
@keyframes swcrawl {
  0% {
    // transform:rotateY(90deg) translateY(300px);
    transform: scale(0.9);
    opacity: 0;
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

</style>