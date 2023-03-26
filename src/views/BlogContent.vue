<template>
  <div class="content">
    <el-row class="container-marked">
      <new-loading v-if="loading"></new-loading>
      <el-col v-else class="blog-content" :span="22" :offset="1">
        <div>
          <header class="article-header blog-animation" :class="{isimg:changeImgUrl(content.blog_cover)}">
            <div
                class="article-img"
                v-if="changeImgUrl(content.blog_cover)"
                :style="{background: 'url( '+ changeImgUrl(content.blog_cover) +')'+' no-repeat center'}"
            ></div>
            <div :class="{istitle:changeImgUrl(content.blog_cover)}">
              <h1
                  class="article-title"
              >{{ content.blog_title }}</h1>
              <div class="archive-article-date">
              <span>
                <i class="icon iconfont iconshu"></i> 分类:
                <span>{{ content.category_name }}</span>
              </span>

                <span>
                <i class="icon iconfont iconbiaoqian1"></i> 标签:
                <span>{{ content.label_name }}</span>
              </span>
                <span>
                <i class="icon iconfont iconyuedu"></i> 阅读数:
                <span>{{ content.blog_browse }}</span>次
              </span>
                <span>
                  <i class="iconfont iconriqi icon"></i>
                  {{ timeChange(content.blog_date) }}
              </span>
              </div>
            </div>
          </header>
          <hr/>
        </div>

        <div id="write" class="blog-content blog-animation" style="padding-bottom: 20px;">
          <my-marked :dompurify="false" :markedOptions="{breaks:true}" :tocNav="true"
                     :initialValue="content.md_content"></my-marked>
        </div>
        <el-divider content-position="center">
          <div class="share">
            <el-tooltip class="item" effect="light" content="可匿名~次数不限" placement="top">
              <a
                  href="javascript:;"
                  :class="{like:click}"
                  class="iconfont icon-love"
                  @click="setClick"
              >
                &#xe605;
                <p>{{ content.blog_likes }}</p>
              </a>
            </el-tooltip>
          </div>
        </el-divider>
      </el-col>


      <el-col v-if="messageShow" :span="22" :offset="1" class="blog-mess">
        <new-comment @submit="submit" class="blog-animation"></new-comment>
        <a href="javascript:;" name="comment">
          <h2 id="comment" style="margin: 20px 0;">评论</h2>
        </a>
        <mess-card @submit="getMess" :list="list" :car="car" v-if="list.length>0"></mess-card>
        <p class="next">
          <span
              v-loading="load"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="#f8f8f8"
              @click="next"
          >
            <i
                class="next-icon"
                :class="current_page===last_page?'el-icon-arrow-up':'el-icon-arrow-down'"
            ></i>
            {{ current_page === last_page ? '没有更多了！快去评论吧！^o^' : '点击查看更多' }}
          </span>
        </p>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import NewLoading from "../components/NewLoading";
import MessCard from "../components/Message/MessCard";
import NewComment from "../components/Message/NewComment";
import MyMarked from './../components/MyMarked'

import ClipboardJS from 'clipboard'
import axios from "axios";

export default {
  name: "BlogContent",
  data() {
    return {
      content: {},
      list: [],
      page: 1,
      last_page: 1,
      current_page: 1,
      busy: false,
      car: {
        pattern: true, //留言模式
        left: true, //left模式
      },

      FormData: {
        message: "",
        article_id: this.$route.params.id,
        user_name: "",
        user_id: ""
      },
      loading: false,
      load: false,
      click: false,
      clipboard: '',
      messageShow: true
    };
  },
  components: {
    //  VueMarkdown,
    MessCard,
    NewComment,
    NewLoading,
    //  mavonEditor
    MyMarked,
  },
  computed: {
    timeChange() {
      return (time) => {
        var date = new Date(time);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y + M + D + h + m + s
      }
    },
    changeImgUrl() {
      return (url) => {
        return "/apis" + "/blog/static/img/" + url;
      }
    }
  },
  methods: {
    getArticle() {
      let that = this;
      let id = that.$route.params.id;
      this.loading = true;
      that
          .$get("/apis/blog/getBlogById/" + id)
          .then(function (res) {
            that.content = res.data;
            that.loading = false;
              that.getMessList();
          })
          .catch(function (error) {
          });
    },
    setClick() {
      if (this.click) return;
      let that = this;
      axios({
        method: "put",
        url: '/apis/blog/data',
        data: {
          blog_id: that.content.blog_id,
          blog_browse: that.content.blog_browse,
          blog_likes: that.content.blog_likes + 1
        }
      })
          .then(function (res) {
            if (res.data.success) {
              that.click = true;
              that.content.blog_likes += 1;
            } else {
              this.$message.error("服务器异常");
            }
          })
          .catch(function (error) {
          });
    },


    // 获取留言列表
    getMessList() {
      let that = this;
      this.load = true;
      axios({
        method: 'get',
        url: "/apis/reply/getBlogReply",
        params: {
          blog_id: that.$route.params.id,
          page: this.current_page,
          size: 10
        }
      }).then(function (res) {
        that.list = that.list.concat(res.data.data.replyList);
        that.last_page = res.data.data.total;
 	that.last_page = Math.ceil(that.last_page / 10);
              if(that.last_page === that.current_page) {
                that.loading = false;
              }
        
      })
          .catch(function (error) {
            that.load = false;
          });
    },
    // 提交留言
    submit(comment) {
      this.FormData.message = comment.content;
      this.FormData.user_id = comment.userId;
      this.FormData.user_name = comment.userName;
      let that = this;
      axios({
        method: 'post',
        url: '/apis/reply/blog',
        data: {
          reply_content: this.FormData.message,
          reply_user: this.FormData.user_id,
          first_name: this.FormData.user_name,
          blog_id: this.FormData.article_id
        }
      }).then(function (res) {
        if(res.data.success === false) {
          this.$message.error("留言发布失败，请重新发送");
        } else {
          that.getMess();
          that.$message({
            showClose: true,
            message: "评论成功",
            type: "success",
          });
        }
      })
          .catch(function (error) {
          });
    },
    // 获取留言
    getMess() {
      let that = this;
      axios({
        method: 'get',
        url: "/apis/reply/getBlogReply",
        params: {
          blog_id: that.$route.params.id,
          page: this.current_page,
          size: 10
        }
      }).then(res => {
            console.log(res);
            that.list = res.data.data.replyList;
            that.last_page = res.data.data.total;
            that.last_page = Math.ceil(that.last_page / 10);
          })
          .catch(function (error) {
          });
    },
    next() {
      if (this.current_page < this.last_page) {
        this.current_page++;
        this.getMessList();
      }
    },
  },
  mounted() {
    let that = this
    this.clipboard = new ClipboardJS('.copy-code', {
      target: function (trigger) {
        that.$message({
          showClose: true,
          message: '复制成功',
          type: "success",
        });
        trigger.innerText = '已复制'
        setTimeout(() => {
          trigger.innerText = '复制代码'
          if (window.getSelection) {

            var selection = window.getSelection();

            selection.removeAllRanges();
          } else if (document.selection && document.selection.empty) {

            document.selection.empty();

          }
        }, 1300)

        return trigger.nextElementSibling;
      }
    });

  },
  destroyed() {
    this.clipboard.destroy();
    console.log('离开文章')
  },
  created() {
    this.getArticle();
  },
  watch: {
    '$route'(to, from) {
      // 对路由变化作出响应...
      if (to.name == 'BlogContent') {

        this.list = []
        this.current_page = 1;
        this.getArticle();
        this.getMessList();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.container >>> .el-divider__text {
  background-color: #f8f8f8;
}

.content {
  padding: 60px 0 30px 0;

  .container-marked {
    border-radius: 6px;
    background-color #fff
    margin auto;
    max-width: 1320px;
    width: 95%;

    .share {
      display: flex;
      align-items: center;

      a {
        display: inline-block;
        width: 34px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        font-size: 22px;
        margin: 6px;
        border-radius: 50%;
        border: 1px solid;
      }

      .icon-qzone {
        color: #fdbe3d;
        border-color: #fdbe3d;

        &:hover {
          background-color: #fdbe3d;
          color: #fff;
        }
      }

      .icon-qq {
        color: #56b6e7;
        border-color: #56b6e7;

        &:hover {
          background-color: #56b6e7;
          color: #fff;
        }
      }

      .like {
        background-color: var(--main-5);
        color: #fff !important;
      }

      .icon-love {
        width: 50px;
        height: 50px;
        color: var(--main-5);
        border-color: var(--main-5);
        font-size: 24px;

        &:hover {
          background-color: var(--main-5);
          color: #fff;
        }

        p {
          font-size: 16px;
          line-height: 10px;
          font-family: georgia;
          font-weight: bold;
        }
      }

      .icon-weibo {
        color: #ff763b;
        border-color: #ff763b;

        &:hover {
          background-color: #ff763b;
          color: #fff;
        }
      }

      .icon-wechat {
        color: #7bc549;
        border-color: #7bc549;

        &:hover {
          background-color: #7bc549;
          color: #fff;
        }
      }
    }

    .blog-info {
      border-left: 3px solid var(--main-6);
      padding-left: 8px;
      border-radius: 4px;
      margin: 30px 0
    }

    .blog-info p {
      text-align: left;
      color: #4d4d4d;
      font-size: 14px;
      margin: 0;
    }

    .article-prev-next {
      margin: 10px 0;
      overflow hidden
    }

    .article-prev-next i {
      font-weight bold
    }

    .article-prev-next .prev {
      float left
      color #969696
    }

    .article-prev-next .next {
      float right
      color #969696
    }

    .blog-mess {
      padding-bottom: 15px;

      .next {
        text-align: center;
        color: var(--main-5);
        transition: all 0.3s;

        &:hover {
          color: var(--main-6);
        }

        span {
          cursor: pointer;

          .next-icon {
            animation: next 0.6s linear infinite alternate;
          }
        }
      }
    }
  }
}

@keyframes next {
  0% {
    transform: translateY(3px);
  }

  100% {
    transform: translateY(0px);
  }
}

@media (max-width: 992px) {
  .isimg {
    height: 240px !important;
  }

  .article-title {
    font-size: 22px !important;
  }

  .container-marked {
    width: 100% !important
  }

}
</style>
<style lang="stylus" scoped>
.article-header {
  border-left: 5px solid #4d4d4d;
  padding: 30px 0 15px 25px;
  position: relative;
  color: #4d4d4d;
  overflow: hidden;
  border-radius: 4px;
}

.article-title {
  margin: 10px 0;
  text-align: left;
  font-size: 30px;
  font-weight: 700;
}

.article-title:after {
  display none
}

.article-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  filter: blur(6px);
}

.isimg {
  height: 350px;
  border: none;
  text-align: center;
  padding: 0;
}

.istitle {
  position: absolute;
  width: 90%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  color: #51cacc;

  span {
    color: #51cacc;
  }
}

.archive-article-date {
  color: #999;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  text-align: left;
}

.archive-article-date .icon {
  margin: 5px 5px 5px 0;
}

[class*=' icon-'], [class^=icon-] {
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>