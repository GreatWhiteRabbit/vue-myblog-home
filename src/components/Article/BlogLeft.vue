<template>
<div class="left-col">
  <el-scrollbar style="height:100%">
    <div class="intrude-less">
      <header id="header" class="inner">
        <a href="javascript:;" class="profilepic blog-animation">
          <img :src="imgUrl" alt="大白兔" class="js-avatar"
               :data-scr="changeImgUrl(adminInfo.user_image)" />
        </a>
        <hgroup>
          <h1 class="header-author blog-animation">
            <a href="javascript:;"><span style=" color: transparent;
    -webkit-text-stroke: 1px var(--main-6);
    letter-spacing: 0.04em;
    font-weight bold">大白兔</span></a>
          </h1>
        </hgroup>
      <li class="blog-animation"> {{adminInfo.user_description}}</li>
        <nav class="header-menu">
          <div class="class-search blog-animation">
            <el-form>
              <div class="search-wrap">
<!--              @input="searchInfo" input中的标签，本来是elasticsearch自动补全，但是服务器带不动elasticsearch   -->
                <input
                  class="search-ipt"
                  v-model="search"
                  type="text"
                  placeholder="查找文章"
                  @focus="searchInfoShow=true"
                  @blur="closeSearchInfo"

                />
                <i class="icon-search icon el-icon-search" @click="searchBtn"></i>
              </div>
            </el-form>
            <!-- 结果列表 -->
            <!-- <transition name="down"> -->
              <ul class="search-info a-tag blog-animation" v-show="searchInfoShow&&search.length>0">
                <li v-show="searchList.length === 0">
                  <a href="javascrpt:;" style="color: red">没有查找到请！更换搜索词</a>
                  <a href="javascrpt:;" style="color: red">支持自动补全和全文检索功能</a>
                  <a href="javascrpt:;" style="color: red">由于服务器性能原因，暂不支持自动不全和全文检索</a>

                </li>
                <li v-for="(item,index) in searchList" >
                  <div @click="searchArticle(index)">{{item}}</div>
                </li>
              </ul>
            <!-- </transition> -->
            <ul
              class="hidden-sm-and-down"
              v-loading="loading"
              style="padding:0;margin:0"
              ref="class"
            >
              <li class="blog-animation">
                <router-link to="/blog">全部文章</router-link>
              </li>
              <li v-for="(item,index) in classList" :key="index" class="label blog-animation">
                <router-link :to="'/blog?class='+item.category_id" style="color: floralwhite">
                  {{item.category_name}}  {{item.blogList.length}}篇</router-link>
              </li>
            </ul>
          </div>
        </nav>
        <nav class="blog-animation" style="margin: 10px auto;color: var(--main-6);font-weight: bold;">总文章数  {{count}}</nav>
        <nav class="header-smart-menu blog-animation">
          <router-link to="/index">主页</router-link>

          <router-link to="/message">留言</router-link>

          <router-link to="/link">友链</router-link>
          <router-link to="/route">随笔</router-link>
        </nav>
        <nav class="blog-animation" >网站总访问量 {{browseSum}}</nav>
        <nav class="header-nav blog-animation">
          <div class="social">
            <a href="https://github.com/GreatWhiteRabbit" target="_blank">
              <span class="github" title="github">
                <i class="iconfont icongithub1"></i>
              </span>
            </a>
              <a target="_blank" href="https://blog.csdn.net/qq_62038093">
                <span class="qq" title="CSDN">
                    <i title="CSDN" class="iconfont icongithub"></i>
                </span>
              </a>

          </div>
          <div class="hidden-sm-and-down">
<!--            <labels class="reveal-bottom"></labels>-->
          </div>
          <nav class="blog-animation" >交流QQ号</nav>
          <img  class="blog-animation" style="width:100%;margin:10px 0;box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);" :src="bottomUrl"/>
        </nav>
      </header>
    </div>
  </el-scrollbar>
  </div>
</template>
<script>

import Labels from "./Labels";
import axios from "axios";
export default {
  name: "BlogLeft",
  components: {
    Labels,
  },
  data() {
    return {
      classList: [], //文章类型列表
      searchList: [], //搜索文章得到的结果
      isLoading: true, //是否
      searchInfoShow: false, //搜索结果栏是否显示,
      search: "",
      count: 0,
      loading: false,
      adminInfo:"",
      imgUrl : require('@/assets/罗小黑.jpg'),
      bottomUrl:require('@/assets/img.png'),
      browseSum:0
    };
  },
  methods: {
    // 搜索栏失去焦点一秒钟后隐藏
    closeSearchInfo() {
      let that = this;
      setTimeout(function () {
        that.searchInfoShow = false;
      }, 500);
    },

    // 点击搜索
    searchBtn() {

      if (this.search.length > 0 && this.$route.query.search != this.search) {
        this.$router.push({
          path: "/blog",
          query: {
            search: this.search,
          },
        });
      }
    },
    searchArticle(index) {
      this.search = this.searchList[index];
      this.searchBtn();
    },
    // 通过搜索使用elasticsearch检索功能
    searchInfo() {
      if (this.search !== '') {
        axios({
          method:'get',
          url:'/apis/blog/suggestion',
          params:{
            info:this.search,
            size:10
          }
        }).then(res => {
          console.log(res);
          this.searchList = res.data.data;
        })
      }
    },

    // 获取文章分类
    getClass() {
      let that = this;
      that
        .$get("/apis/category/list")
        .then(function (res) {
          that.classList = res.data;
          for(let i = 0; i < that.classList.length; i++) {
            // 将每个分类的博客总数存放在浏览器中
            sessionStorage.setItem("category" + that.classList[i].category_id,
                that.classList[i].blogList.length)

          }
        })
        .catch(function (error) {});
    },

    // 获取文章总数
    getTotalArticel() {
      let that = this;
      this.loading = true;
      that
        .$get("/apis/blog/getBlogSum")
        .then(function (res) {
          that.count = res.data;
          that.loading = false;
        })
        .catch(function (error) {
          that.loading = false;
        });
    },

    // 获取管理员基本信息
      getAdminInfo() {
      axios({
        method:'get',
        url:'/apis/userInfo/getAdminInfo/1'
      }).then(res => {
        this.adminInfo = res.data.data;
      })
      },

    // 获取网站访问总人数
    getBrowseSum() {
    axios({
      method:'get',
      url:'/apis/browse/sum'
    }).then(res => {
      this.browseSum = res.data.data;
    })
    }
  },
  computed:{
    changeImgUrl() {
      return (url) => {
        return  "/apis" + "/blog/static/img/" + url;
      }
    }
  },
  created() {
    this. getTotalArticel();
    this.getBrowseSum();
    this.getClass();
    this.getAdminInfo();
  },
};
</script>
<style lang="stylus" scoped>
@import '~@/assets/style/home.styl';
.label
  margin:4px
  display:inline-block
  height 20px
  padding:0 15px
  border:1px solid #ccc
  text-align center
  line-height 20px
  color:#fff
  font-size 12px
  box-shadow:1px 1px 1px #ccc
  border-radius:15px
  transition:all .3s
  cursor:pointer
  background-color rgba(220,20,60,0.3)
.label:hover
  box-shadow:2px 2px 2px #ccc
  border:1px solid #fff

.class-search {
  position: relative;

  .el-input-group__append {
    padding: 0;
  }

  .search-info {
    transition all .5s
    width: 100%;
    position: absolute;
    left: 0;
    border-radius: 5px;
    padding: 5px 3px;
    box-sizing: border-box;
    margin: 0;
    background-color: #fff;
    z-index: 20;
    box-shadow: 8px 14px 38px rgba(231, 238, 239, 0.99);
    div {
      height 20px;
      width 100%;
      color : #ed7d7e
      background-color #c7f1e3
      font-size :15px
      text-align center
      line-height 20px
    }
    li {
      width: 100%;

      a {
        min-width: 50px !important;
        display: block;
        ellipsis();
        height: 25px;
        line-height: 25px;
        text-align: left;
        border-bottom: 1px dashed rgba(204, 204, 204, 0.278);
      }
    }
  }
}
@media(max-width: 992px)
	.left-col
		position relative!important
		width 100%!important
		min-height 500px!important
		top 0!important

</style>
<style lang="stylus" scoped>
#header .header-nav .social {
  margin-top: 10px;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.search-wrap {
  width: 100%;
  position: relative;
}

.search-wrap .search-ipt {
  width: 100%;
  color: var(--main-6);
  background: none;
  border: none;
  border-bottom: 2px solid var(--main-1);
  font-family: Roboto, serif;
  font-size: 1rem;
  line-height: 1.75;
}

.search-wrap .icon {
  position: absolute;
  right: 0;
  top: 7px;
  color: var(--main-4);
  cursor: pointer;
}

.left-col {
  position: fixed;
  top: 60px;
  bottom: 0px;
  left:0px
  background: #fff;
  width: 25%;
  min-width: 200px;
  transition: all 0.2s ease-in;
}

.left-col .overlay {
  width: 100%;
  height: 100%;
  position: absolute;
}

.overlay img {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 100px;
}

.left-col .intrude-less {
  width: 76%;
  text-align: center;
  margin: 0px auto;
  padding-top: 15px;
  position: relative;
}

.left-col #header {
  width: 100%;
  height: 100%;
  position: relative;
  border-bottom: 1px solid color-border;
  overflow: visible;
}

.left-col #header a {
  color: #696969;
}

.left-col #header a:hover {
  color: #b0a0aa;
}

.left-col #header .header-subtitle {
  text-align: center;
  color: #999;
  font-size: 14px;
  line-height: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.left-col #header .header-menu {
  font-weight: 300;
  line-height: 31px;
  float: none;
  text-align: center;
}

.left-col #header .header-menu li {
  cursor: default;
}

.left-col #header .header-menu li a {
  font-size: 14px;
  min-width: 300px;
}

.left-col #header .header-smart-menu {
  font-size: 12px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.left-col #header .header-smart-menu a:after {
  content: '/';
}

.left-col #header .header-smart-menu a:last-child:after {
  content: '';
}

.left-col #header .profilepic {
  display: block;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: #fff;
  text-align: center;
  border: 6px solid var(--main-6);
  padding: 2px;
  box-sizing: border-box;
}

.left-col #header .profilepic img {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 50%;
  transition: transform 1s ease-out;
}

.left-col #header .profilepic img.show {
  width: 100%;
  height: 100%;
  opacity: 1;
}

.left-col #header .profilepic img:hover {
  transform: rotate(1turn);
}

.left-col #header .header-author {
  text-align: center;
  margin: 0.67em 0;
  font-family: Roboto, serif;
  font-size: 30px;
  transition: 0.3s;
}

#header .header-nav {
  width: 100%;
  transition: transform 0.3s ease-in;
  padding-bottom: 20px;
}

#header .header-nav .social {
  margin-top: 10px;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

#header .header-nav .social span {
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
  zoom: 1;
  margin: 0 8px 15px;
  transition: 0.3s;
  text-align: center;
  color: #fff;
  opacity: 0.7;
  width: 28px;
  height: 28px;
  line-height: 26px;
}

#header .header-nav .social span:hover {
  opacity: 1;
}

#header .header-nav .social span.weibo {
  background: #aaf;
  border: 1px solid #aaf;
}

#header .header-nav .social span.weibo:hover {
  border: 1px solid #aaf;
}

#header .header-nav .social span.github {
  background: #afb6ca;
  border: 1px solid #afb6ca;
}

#header .header-nav .social span.github:hover {
  border: 1px solid #909ab6;
}

#header .header-nav .social span.weixin {
  background: #4caf50;
  border: 1px solid #4caf50;
}

#header .header-nav .social span.weixin:hover {
  border: 1px solid #4caf50;
}

#header .header-nav .social span.qq {
  background: #34baad;
  border: 1px solid #34baad;
}

#header .header-nav .social span.qq:hover {
  border: 1px solid #34baad;
}

#header .header-nav .social span.gitee {
  background: #c71d23;
  border: 1px solid #c71d23;
}

#header .header-nav .social span.gitee:hover {
  border: 1px solid #c71d23;
}

.down-enter-active {
  transition: all 0.4s ease;
}

.down-leave-active {
  transition: all 0.4s ease;
}

.down-enter, .down-leave-to {
  transform: translateY(10%);
  opacity: 0.5;
}
</style>