<template>
  <div class="container mess-list">
    <h1 class="mess-title">
      <i class="el-icon-ice-cream-round"></i>瞅啥！快去留言吧！
    </h1>
    <div class="mess-group">
      <el-row>
        <el-col :md="12" :sm="24">
          <mess-card @submit="getMess" :list="MessListLeft" :car="left"></mess-card>
        </el-col>
        <el-col v-if="!isShow" :md="12" :sm="24">
          <mess-card @submit="getMess" :list="MessListRight" :car="right"></mess-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import MessCard from "./MessCard";
export default {
  name: "MessageList",
  props: {
    list: Array,
  },
  components: {
    MessCard,
  },
  computed: {
    MessListLeft() {
      if(this.isShow){
         return this.list
      }
      let arr = [];
      for(let i = 0;i < this.list.length; i ++) {
        if(i % 2=== 0) {
          arr.push(this.list[i]);
        }
      }
      return arr;
     /* return this.list.filter(function (reply_id) {
        return reply_id % 2 === 0;
      });*/
    },
    MessListRight() {
      if(!this.isShow){
        let arr = [];
        for(let i = 0;i < this.list.length; i ++) {
          if(i % 2 !== 0) {
            arr.push(this.list[i]);
          }
        }
        return arr;
           /*return this.list.filter(function (reply_id) {
            return reply_id % 2 !== 0;
          });*/
      }
    },
  },
  data() {
    return {
      isShow: document.body.clientWidth <= 992,
      left: {
        pattern: true, //留言模式
        left: true, //left模式
      },
      right: {
        pattern: true, //留言模式
        left: false, //left模式
      },
    };
  },
  methods: {
    getMess() {
      this.$emit("submit");
    },
  },
};
</script>
<style lang="stylus" scoped>
@import '~@/assets/style/home.styl';

.mess-list {
  &:hover {
    .mess-title {
      color: #5adcce;
    }
  }

  .mess-title {
    margin: 0;
    font-size: 25px;
    color: #ccc;
  }

  .mess-group {
    position: relative;
    padding: 10px 0;

    &:before {
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: -4px;
      content: '';
      height: 100%;
      width: 8px;
      background: #fff;
      border-radius: 8px;
    }
  }
}

@media (max-width: 992px) {
  .mess-group, .mess-item, .mess-info, .mess-loging {
    &:before {
      display: none;
    }
  }

  .mess-group {
    &:after {
      display: none;
    }
  }
}
</style>
