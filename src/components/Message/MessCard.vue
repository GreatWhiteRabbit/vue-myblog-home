<template>
  <ul style="padding:0">
    <li
        class="mess-item"
        :class="car.left?'mess-item-left':'mess-item-right'"
        v-for="(item,index) of list"
        :key="item.message.reply_id"
        :style="{'animation-duration':(index+1)%10*100+200+'ms'}"
    >
      <div class="mess-info" :class="car.left?'mess-info-left':'mess-info-right'">
        <el-popconfirm
            v-if="(userInfo === item.message.reply_user && userInfo > 0)||(userInfo === 1)"
            title="这条留言确认删除吗？"
            @onConfirm="dele(-1,index)"
        >
          <a
              slot="reference"
              href="javascript:;"
              class="dele-mess el-icon-delete"
          ></a>
        </el-popconfirm>

        <div class="mess-header" :class="{'mess-header-dis':!car.pattern}">
          <div class="header-left a-tag">
            <div></div>
            <el-avatar
                shape="square"
                :src="item.message.reply_user === 1 ? adminAvatar : avatar[item.message.reply_user % avatar.length]"
                class="user-img"
            >
              <div
                  :style="'background-image: linear-gradient(270deg,'+setColor()+','+setColor()+')'"
              >{{ item.message.first_name }}
              </div>
            </el-avatar>
            <div v-if="car.pattern" class="header-right">
              <a
                  href="javascript:;"
                  class="el-icon-chat-line-round mess-name"
              >{{ item.message.first_name }}</a>
              <span
                  class="bolg-admin el-icon-sunny"
                  v-show="item.message.reply_user === 1"
              >博主</span>
              <p class="time">{{ getDateDiff(item.message.reply_time) }}</p>
            </div>

            <a
                v-if="car.pattern && item.message.reply_id !== 0"
                @click="reply(index)"
                class="header-reply"
                href="javascript:;"
            >{{ index === click_id && pattern ? '取消' : '回复' }}
            </a>

          </div>

        </div>

        <div class="mess-body">

          <my-marked :initialValue="item.message.reply_content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)" :copyCode="false"
                     :imgView="false"></my-marked>
        </div>

        <!-- 留言内容 end -->
        <transition name="down">
          <div class="mess-add" v-if="index === click_id && pattern">
            <new-comment @submit="submit" v-if="car.pattern"></new-comment>
          </div>
        </transition>

<!--        上面的代码运行正常-->
<!--        上面的代码运行正常-->
<!--     一级评论的回复-->
        <div class="mess-footer" v-show="item.replyed !== null">

          <div class="mess-info mess-reply" v-for="(reply,childrenIndex) in item.replyed" :key="'reply'+reply.reply_id" :id="'reply'+reply.reply_id"
               :class="flicker===reply.reply_id?'flicker':''">
            <el-popconfirm
                v-if="(userInfo ===reply.reply_user && userInfo > 0)||userInfo===1"
                title="这条留言确认删除吗？"
                @onConfirm="dele(index,childrenIndex)"
            >
              <a
                  slot="reference"
                  href="javascript:;"
                  class="dele-reply el-icon-delete"
              ></a>
            </el-popconfirm>
            <div class="mess-header">
              <div class="header-left a-tag">
                <el-avatar :src="reply.reply_user === 1 ? adminAvatar : avatar[reply.reply_user % avatar.length]" shape="square" class="user-img">
                  <div
                      :style="'background-image: linear-gradient(270deg,'+setColor()+','+setColor()+')'"
                  >{{ reply.first_name }}
                  </div>
                </el-avatar>
                <div class="header-right">
                  <a href="javascript:;" class="el-icon-sugar mess-name">{{ reply.first_name }}</a>
                  <span
                      class="bolg-admin el-icon-sunny"
                      v-show="reply.reply_user!=null&&reply.reply_user===1"
                  >博主</span>
                  <p>{{ getDateDiff(reply.reply_time) }}</p>
                </div>
                <a
                    v-if="car.pattern && reply.reply_id !== 0"
                    @click="replyMess(childrenIndex,index)"
                    class="header-reply-mess"
                    href="javascript:;"
                >{{ childrenIndex === childrenReplyId ? '取消' : '回复' }}</a>
              </div>
            </div>
            <div class="mess-body" style="border-bottom:1px dashed #ccc">
              <p class="mess-reply-replay" ><span class="replay-name">回复<a
                  style="color:#7bdddf" href="javascript:;"
                  @click="roll(reply.first_name)">@{{ reply.second_name }}</a></span><span><my-marked
                  :copyCode="false" :imgView="false"></my-marked></span></p>
              <my-marked :initialValue="reply.reply_content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)" :copyCode="false"
                         :imgView="false"></my-marked>
            </div>
            <!-- 留言内容 end -->
            <transition name="down">
              <div class="mess-add" v-if="childrenIndex === childrenReplyId && index === fatherReplyId">
                <new-comment @submit="submit" v-if="car.pattern"></new-comment>
              </div>
            </transition>
          </div>
        </div>
        <!-- 回复列表 end -->
      </div>
    </li>
  </ul>
</template>
<script>

import NewComment from "./NewComment";

import MyMarked from '../MyMarked'
import axios from "axios";

export default {
  name: "MessCard",
  props: {
    car: {
      pattern: Boolean, //留言模式
      left: Boolean, //left模式
    },
    list: {},
  },
  components: {
    NewComment,
    MyMarked
  },
  data() {
    return {
      open: false,
      flicker: 0,
      pattern: true,
      click_id: -1, // 鼠标点击父评论的哪一条
      responseData:{
        reply_id: "",
        reply_content:"",
        reply_user:"",
        response_user:"",
        blog_id: "",
        reply_time:"",
        first_name: "",
        second_name: "",
        replyed_id: ""
      },// 回复数据
      childrenReplyId:-1,
      fatherReplyId:-1,
      boo: false,
      FormData: {
        mess_id: "",
        reply: "",
      },
      avatar: [
        require('@/assets/avatar/比丢.jpg'),
        require('@/assets/avatar/猫老师.jpg'),
        require('@/assets/avatar/白兔.jpg'),
        require('@/assets/avatar/皮卡丘.jpg'),
        require('@/assets/avatar/鸭嘴兽.jpg'),
        require('@/assets/avatar/阿尼亚.jpg'),
        require('@/assets/avatar/波奇.jpg'),
        require('@/assets/avatar/虹夏.jpg'),
        require('@/assets/avatar/涂山苏苏.jpg'),
        require('@/assets/avatar/白月初.jpg'),
          require('@/assets/avatar/cat.jpg'),
          require('@/assets/avatar/cut.jpg'),
          require('@/assets/avatar/xiduo.jpg'),
          require('@/assets/avatar/dog.jpg'),
          require('@/assets/avatar/皮卡.jpg'),
          require('@/assets/avatar/蜡笔小新.jpg')
      ],
      adminAvatar: require('@/assets/罗小黑.jpg'),
      responseIndex: "", // 回复list中第几条留言,
      replyList: [],

    };
  },
  computed: {
    userInfo() {
      return parseInt(sessionStorage.getItem("SimpleUser_id"));

    },
  },
  methods: {
    roll(target) {
      this.flicker = target
      target = '#reply' + target
      let toElement = document.querySelector(target);
      toElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    },

    emotion(res) {
      let word = res.replace(/\#|\;/gi, "");
      const list = [
        "微笑",
        "撇嘴",
        "色",
        "发呆",
        "得意",
        "流泪",
        "害羞",
        "闭嘴",
        "睡",
        "大哭",
        "尴尬",
        "发怒",
        "调皮",
        "呲牙",
        "惊讶",
        "难过",
        "酷",
        "冷汗",
        "抓狂",
        "吐",
        "偷笑",
        "可爱",
        "白眼",
        "傲慢",
        "饥饿",
        "困",
        "惊恐",
        "流汗",
        "憨笑",
        "大兵",
        "奋斗",
        "咒骂",
        "疑问",
        "嘘",
        "晕",
        "折磨",
        "衰",
        "骷髅",
        "敲打",
        "再见",
        "擦汗",
        "抠鼻",
        "鼓掌",
        "糗大了",
        "坏笑",
        "左哼哼",
        "右哼哼",
        "哈欠",
        "鄙视",
        "委屈",
        "快哭了",
        "阴险",
        "亲亲",
        "吓",
        "可怜",
        "菜刀",
        "西瓜",
        "啤酒",
        "篮球",
        "乒乓",
        "咖啡",
        "饭",
        "猪头",
        "玫瑰",
        "凋谢",
        "示爱",
        "爱心",
        "心碎",
        "蛋糕",
        "闪电",
        "炸弹",
        "刀",
        "足球",
        "瓢虫",
        "便便",
        "月亮",
        "太阳",
        "礼物",
        "拥抱",
        "强",
        "弱",
        "握手",
        "胜利",
        "抱拳",
        "勾引",
        "拳头",
        "差劲",
        "爱你",
        "NO",
        "OK",
        "爱情",
        "飞吻",
        "跳跳",
        "发抖",
        "怄火",
        "转圈",
        "磕头",
        "回头",
        "跳绳",
        "挥手",
        "激动",
        "街舞",
        "献吻",
        "左太极",
        "右太极",
      ];
      let index = list.indexOf(word);
      return `![](https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif)`;
    },

    reply(index) {
      this.responseIndex = index; // 将list中第几个元素赋
      // 重复点击一个留言
      if (this.click_id === index) {
        this.pattern = !this.pattern;
      } else {
        this.click_id = index;
        this.pattern = true;
      }
      // 将数据封装到responseData中
      this.responseData.replyed_id = this.list[index].message.reply_id;
      this.responseData.second_name = this.list[index].message.first_name;
      this.responseData.first_name = sessionStorage.getItem("SimpleUserName");
      this.responseData.reply_user = this.userInfo;
      this.responseData.response_user = this.list[index].message.reply_user;
      console.log( this.responseData);
    },
    // 回复id
    replyMess(currentReplyId, fatherReplyId) {
      this.fatherReplyId = fatherReplyId;
      if(this.childrenReplyId === currentReplyId) {
        this.childrenReplyId = -1;
      } else {
        this.childrenReplyId = currentReplyId;
      }
      // 将数据封装到responseData中
      // 二级留言的回复ID应该归结到一级留言的id
      this.responseData.replyed_id = this.list[fatherReplyId].replyed[currentReplyId].replyed_id;
      this.responseData.second_name = this.list[fatherReplyId].replyed[currentReplyId].first_name;
      this.responseData.first_name = sessionStorage.getItem("SimpleUserName");
      this.responseData.reply_user = this.userInfo;
      this.responseData.response_user = this.list[fatherReplyId].replyed[currentReplyId].reply_user;

    },

    // 回复评论
    submit(comment) {
      axios({
          method: 'post',
          url: '/apis/reply',
          data:{
            replyed_id : this.responseData.replyed_id,
           second_name : this.responseData.second_name,
            first_name : sessionStorage.getItem("SimpleUserName"),
            reply_user : this.userInfo,
            response_user : this.responseData.response_user,
            reply_content : comment.content
          }
        }).then(res => {
          if(res.data.data === "false") {
            this.$notify({
              type:'error',
              title:'回复提示',
              message:'不能评论已被删除的留言'
            })
           // this.$message.error("不能评论已被删除的留言");
          } else {
            this.$notify({
              type:'success',
              title:'回复提示',
              message:'评论成功'
            })
           // this.$message.success("评论成功");
          }
        })

    },
    // 删除评论
    dele(fatherIndex,currentIndex) {
      // fatherIndex表示一级评论的下标，-1表示直接删除一级评论，不为-1表示删除二级评论
      // currentIndex删除当前评论的下标
      if(fatherIndex === -1) {
        // 直接删除一级评论
        let that = this;
        axios({
          method: 'delete',
          url: '/apis/reply',
          data: {
            reply_id: this.list[currentIndex].message.reply_id,
            reply_content:this.list[currentIndex].message.reply_content,
            reply_user: this.list[currentIndex].message.reply_user,
            response_user: this.list[currentIndex].message.response_user,
            blog_id: this.list[currentIndex].message.blog_id,
            reply_time: this.list[currentIndex].message.reply_time,
            first_name: this.list[currentIndex].message.first_name,
            second_name: this.list[currentIndex].message.second_name

          }
        }).then(function (res) {
          if (res.data.success === true) {
            that.$emit("submit");
            this.$notify({
              type:'success',
              title:'留言提示',
              message:'删除成功'
            })
          /*  that.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
            });*/
          } else {
            this.$notify({
              type:'error',
              title:'留言提示',
              message:'删除失败'
            })
            //this.$message.error("删除失败");
          }
        })
            .catch(function (error) {
            });
      }
      else {
        // 删除二级评论
        let that = this;
        axios({
          method: 'delete',
          url: '/apis/reply',
          data: {
            reply_id: this.list[fatherIndex].replyed[currentIndex].reply_id,
            reply_content:this.list[fatherIndex].replyed[currentIndex].reply_content,
            reply_user: this.list[fatherIndex].replyed[currentIndex].reply_user,
            response_user: this.list[fatherIndex].replyed[currentIndex].response_user,
            blog_id: this.list[fatherIndex].replyed[currentIndex].blog_id,
            reply_time: this.list[fatherIndex].replyed[currentIndex].reply_time,
            first_name: this.list[fatherIndex].replyed[currentIndex].first_name,
            second_name: this.list[fatherIndex].replyed[currentIndex].second_name,
            replyed_id: this.list[fatherIndex].replyed[currentIndex].replyed_id
          }
        }).then(function (res) {
          console.log(res.data);
          if (res.data.success === true) {
            that.$emit("submit");
            this.$notify({
              type:'success',
              title:'留言提示',
              message:'删除成功'
            })
          /*  that.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
            });*/
          } else {
            this.$notify({
              type:'error',
              title:'留言提示',
              message:'删除失败'
            })
          //  this.$message.error("删除失败");
          }
        })
            .catch(function (error) {
            });
      }


    },

    setColor() {
      let r = parseInt(Math.random() * 256);
      let g = parseInt(Math.random() * 256);
      let b = parseInt(Math.random() * 256);
      return `rgba(${r},${g},${b},0.3)`;
    },
    getDateDiff(dateTimeStamp) {
      var minute = 1000 * 60;
      var hour = minute * 60;
      var day = hour * 24;
      var halfamonth = day * 15;
      var month = day * 30;
      var now = new Date().getTime();
      var diffValue = now - dateTimeStamp;
      if (diffValue < 0) {
        return;
      }
      var monthC = diffValue / month;
      var weekC = diffValue / (7 * day);
      var dayC = diffValue / day;
      var hourC = diffValue / hour;
      var minC = diffValue / minute;
      var result = "";
      if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
      } else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
      } else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
      } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
      } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
      } else {
        result = "刚刚";
      }
      return result;
    },
  },

};
</script>
<style lang="stylus" scoped>
@import '~@/assets/style/home.styl';

.mess-item {
  position: relative;
  margin: 10px 0;

  // z-index 2

  &:hover:before {
    transform: scale(1.2, 1.2);
    z-index: 10 !important;
    background-color: var(--main-4);
  }

  &:before {
    position: absolute;
    top: 26px;
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: var(--main-6);
    animation: fadeIn 0.5s ease-in 0.6s 1 normal backwards;
    border: 3px solid #fff;
    z-index: 2;
  }

  .mess-info {
    width: 86%;
    margin: 0 7%;
    box-sizing: border-box;
    background-color: #ffffff;
    position: relative;
    padding: 10px;
    box-sizing: border-box;
    font-size: 14px;
    animation: moveLeft 0.3s ease-in 0.4s 1 normal backwards;
    border-radius: 4px;

    &:hover {
      .dele-mess {
        height: 30px;
      }

      .open {
        height 25px
      }

      .mess-body {
        &:before {
          width: 100%;
        }
      }

      .mess-header {
        .header-left {
          .header-reply {
            height: 30px;
          }
        }

        .time {
          routeHover();
        }
      }
    }

    &:before {
      position: absolute;
      content: '';
      top: 20px;
      border: 12px solid transparent;
    }

    .dele-mess, .dele-reply {
      float: right;
      height: 0;
      overflow: hidden;
    }

    .mess-header-dis {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .mess-header {
      .header-left {
        display: flex;
        align-items: center;

        .user-img {
          margin-right: 6px;
        }

        .header-left a {
          padding: 0 5px;
          acitve();
        }

        .header-right {
          transition: all 0.6s;
          color: #ccc;
          font-size: 14px;
          height: 40px;
          line-height: 20px;
          max-width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          a {
            height: 20px;
            font-size: 14px;
          }

          p {
            margin: 0;
            height: 20px;
            font-size: 12px;
          }
        }

        .header-reply, .header-reply-mess {
          margin-left: 10px;
          height: 0;
          overflow: hidden;
        }
      }

      .header-right {
        transition: all 0.6s;
        color: #ccc;
        font-size: 14px;
      }
    }

    .mess-add {
      padding: 2px 0 2px 0px !important;
    }

    .mess-body, .mess-add {
      position: relative;
      padding: 2px 0 2px 40px;
      line-height: 1.6;
      border-bottom: 1px double #ccc;

      &:before {
        position: absolute;
        left: 0;
        bottom: -1px;
        z-index: 2;
        content: '';
        width: 0;
        height: 1px;
        transition: width 0.6s;
        background-image: linear-gradient(270deg, var(--main-8), var(--main-6));
      }
    }

    .open {
      height 0px
      width 40px
      transition all .4s
      overflow hidden
      position absolute
      bottom 0px
      left 50%
      transform translateX(-50%)
      text-align center
      cursor pointer
      z-index 10

      &:hover {
        i {
          color var(--main-5)
        }
      }

      i {
        font-size 24px
        animation: next .6s linear infinite alternate;
        font-weight bold
        color var(--main-6)
      }

    }

    .mess-footer {
      .mess-info {
        width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 10px 10px 10px 40px;
      }

      .flicker {
        position relative

        &:after {
          content: ''
          position absolute
          height 40px
          width 40px
          max-height 90%
          top 50%
          right 10px
          transform translateY(-50%)
          background-image url(https://p.pstatp.com/origin/feab0002ddf50d4289c1)
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          transform-origin: center right
          animation: flicker .6s linear 1 normal;
        }

      }
    }
  }

  .mess-reply {
    &:hover {
      .dele-reply {
        height: 30px;
      }

      .mess-header {
        .header-left {
          .header-reply-mess {
            height: 30px;
          }
        }
      }
    }
  }

  .mess-reply-replay {
    background-color #f7f7f7
    padding: 4px
    border-radius 4px

    .replay-name {
      color #ccc
    }

    .marked {
      color: #a3a3a3 !important;
    }
  }
}

.mess-item-right {
  animation: moveRight 0.3s ease-in 0.4s 1 normal backwards;

  &:before {
    left: -8px;
    transition: all 0.3s;
  }

  .mess-info-right {
    &:before {
      left: -24px;
      border-right-color: #fff;
    }
  }
}

.mess-item-left {
  animation: moveLeft 0.3s ease-in 0.4s 1 normal backwards;

  &:before {
    right: -8px;
    transition: all 0.3s;
  }

  .mess-info-left {
    &:before {
      right: -24px;
      border-left-color: #fff;
    }
  }
}

.bolg-admin {
  color: var(--main-4);
  margin-left: 5px;
  border: 1px solid var(--main-4);
  font-size: 14px;
  padding: 1px 5px;
  border-radius: 10px;
}

>>> .markdown-body p {
  margin-bottom: 0;
}

.down-enter-active {
  transition: all 0.4s ease;
}

.down-leave-active {
  transition: all 0.3s ease;
}

.down-enter, .down-leave-to {
  transform: scale(0.1);
  opacity: 0.5;
}

@media (max-width: 992px) {
  .mess-group, .mess-item, .mess-info {
    &:before {
      display: none;
    }
  }

  .mess-item {
    .mess-info {
      width: 96%;
      margin: 0px 2%;
    }
  }
}

@keyframes flicker {
  0% {
    transform rotate(50deg) translateY(-50%)
  }
  100% {
    transform rotate(0deg) translateY(-50%)
  }
}

@keyframes next {
  0% {
    transform translateY(3px)
  }
  100% {
    transform translateY(0px)
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes moveLeft {
  0% {
    opacity: 0;
    transform: translateX(5%);
  }

  100% {
    opacity: 1;
    transform: translateX(0%);
  }
}

@keyframes moveRight {
  0% {
    opacity: 0;
    transform: translateX(-5%);
  }

  100% {
    opacity: 1;
    transform: translateX(0%);
  }
}
</style>