<template>
  <div class="message barrages-drop" >

    <div style="width:100%;overflow:hidden">
      <vue-baberrage
          style="width:100%;height:100%"
          :isShow="barrageIsShow"
          :barrageList="messList"
          :maxWordCount="30"
          :loop="barrageLoop"
      >
      </vue-baberrage>
    </div>

    <div class="mess-body container ">
      <h1 class="mess-title blog-animation"><i class="el-icon-chat-line-square"></i>Speak freely!</h1>
      <new-comment class="blog-animation comment" @submit="submit"></new-comment>

    </div>
    <span @click="next('#next')" class="screen-next iconfont">
            &#xe623;
        </span>
  </div>
</template>
<script>
import NewComment from './NewComment'
import {vueBaberrage, MESSAGE_TYPE} from 'vue-baberrage'
import axios from "axios";

export default {
  name: 'AddMessage',
  components: {
    NewComment,
    vueBaberrage
  },
  props: {
    list: Array
  },
  data() {
    return {
      messSub: false,
      barrageIsShow: true,
      currentId: 0,
      barrageLoop: true,
      messList: [],
      style: ['green', 'red', 'blue', 'green', 'yellow'],
      FormData: {
        message: '',
        article_id: 0,
        user_id: '',
        user_name: ""
      },
      avatar_URL:[
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
      adminAvatar:require('@/assets/罗小黑.jpg')
    }
  },
  methods: {
    next(target) {
      let toElement = document.querySelector(target);
      toElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    },
    submit(comment) {
      this.FormData.message = comment.content;
      this.FormData.user_id = comment.userId;
      this.FormData.user_name = comment.userName;
      let that = this
      axios({
        method: "post",
        url: '/apis/reply',
        data: {
          reply_content: this.FormData.message,
          reply_user: this.FormData.user_id,
          first_name: this.FormData.user_name
        }
      })
          .then(function (res) {
            if(res.data.success === false) {
              this.$notify({
                title:'留言提示',
                type:'error',
                message:'发布失败，请重新发布'
              })
              //this.$message.error("发布失败，请重新发布");
            } else {
              that.$emit("submit");
              this.$notify({
                title:'留言提示',
                type:'success',
                message:'发布成功'
              })
              /*that.$message({
                showClose: true,
                message: "发布成功",
                type: 'success'
              });*/
            }
          })
          .catch(function (error) {

          })
    }
  },
  watch: {
    list() {
      let length = this.list.length
      if (length <= 20) {
        let i = 0
        if (this.list.length > 10) {
          i = Math.floor((this.list.length - 1) / 10) * 10
        }
        for (i; i < length; i++) {
          this.messList.push({
            id: this.list[i].message.reply_id,
           // avatar: this.list[i].user ? this.list[i].user.avatar_url : 'http://api.btstu.cn/sjtx/api.php?lx=c1&format=images',
            avatar: this.list[i].message.reply_user === 1 ? this.adminAvatar : this.avatar_URL[this.list[i].message.reply_user % this.avatar_URL.length],
            msg: this.list[i].message.reply_content,
            time: Math.ceil(Math.random() * 5 + 4),
            barrageStyle: this.style[Math.ceil(Math.random() * 4)]
          });
        }
      }


    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/style/home.styl';
.message
  height 100vh
  min-height 500px
  position relative
  background: url(https://scpic.chinaz.net/files/pic/pic9/201803/wpic078.jpg)
  box-sizing border-box
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  .mess-body
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    &:hover
      .mess-title
        color: #5adcce;

    .mess-title
      margin 30px
      font-size 60px
      color #fff

    .blog-animation
      margin 10px

    .comment
      background rgba(255, 255, 255, .2)
      transition all .5s

      &:hover
        background rgba(255, 255, 255, .8)

@media (max-width: 850px)
  .message
    .mess-title
      font-size 35px !important

</style>
<style lang="stylus" scoped>
.barrages-drop >>>
.baberrage-item
  padding 0
  padding-right 20px

  .normal
    background-color: transparent

//.barrages-drop >>>
.blue {
  border-radius: 100px;
  background: rgba(230, 255, 117, 0.7);
  color: #fff;
}

.green {
  border-radius: 100px;
  background: rgba(117, 255, 204, 0.7);
  color: #fff;
}

.red {
  border-radius: 100px;
  background: rgba(230, 143, 187, 0.7);
  color: #fff;
}

.yellow {
  border-radius: 100px;
  background: rgba(223, 200, 149, 0.7);
  color: #fff;
}
</style>