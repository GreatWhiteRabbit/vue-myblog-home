<template>
  <div class="div_container">
      <!--滚动的列表-->
      <div>
        <sapn class="update_left">更新说明</sapn>
        <span class="update_right">更新时间</span>
      </div>
      <vue-seamless-scroll :data="list"  class="auto-scorll-table" :class-option="optionSingleHeight">
        <div v-for="(item,index) in list" >
            <span class="span_container_left"  >
               {{item.update_info}}
             </span>
                <span class="span_container_right">
              {{dateChange(item.update_time)}}
            </span>

        </div>
      </vue-seamless-scroll>

  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
export default {
  name: "UpdateLogList",
  components:{
    vueSeamlessScroll
  },
  props:{
    list:Array
  },
  data(){
    return{
      defaultOption: {
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 0, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1500 // 单步运动停止的时间(默认值1000ms)
      },
    }
  },
  computed: {
    optionSingleHeight() {
      return {
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 0, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1500 // 单步运动停止的时间(默认值1000ms)
      }
    },
    dateChange() {
      return (time) => {
        var date = new Date(time);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        return Y + M + D;
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.div_container{
  height 100%;
  width 100%;
}
@media(max-width: 700px){

  .span_container_left{
    font-size 16px
    color #f5b0b0
  }
  .span_container_right{
    font-size 16px
    position absolute
    right 5%
    color #d7b5f7
  }
  .update_left{
    font-size 18px
  }
  .update_right{
    position absolute
    font-size 18px
    height: 30px;
    right  5%
  }
}
@media(min-width: 700px){
  .update_left{
    margin-left 20%
    font-size 20px
  }
  .update_right{
    position absolute
    font-size 20px
    right  20%
  }
  .span_container_left{
    color #f5b0b0
    margin-top 15px
    font-size 18px
    height: 30px;
    margin-left 20%
  }
  .span_container_right{
    position absolute
    font-size 18px
    right  20%
    color #d7b5f7
  }
}

.auto-scorll-table {
  height: calc(100% - 34px);
  overflow: hidden;
}

</style>