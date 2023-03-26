<template>
  <div class="link-header screen content-bg">
    <el-row class="link-top">
    </el-row>
    <span @click="next('#next')" class="screen-next iconfont">
      &#xe623;
    </span>
  </div>
</template>
<script>

export default {
  name: "LinkHeader",
  components: {

  },
  methods:{
    next(target){
        let toElement = document.querySelector(target);
          toElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/assets/style/home.styl';

.link-top {
  min-height 450px
  height:70vh ;
  padding: 0;
  position: relative;

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background url("https://img.zmtc.com/2019/0815/20190815113419267.jpg")
  // background-size:100% 100%;
  .link-info {
    padding: 30px;
    box-sizing: border-box;
    position: sticky;
    top: 50%;
    flex-shrink: 0;
    // position: sticky;
    // top: 50%;
    // left: 50%;
    transform: translateY(-50%);

    .mess-title {
      margin: 0;
      font-size: 25px;
      color: #5adcce;
    }

    .load-text {
      // text-align center
      text-shadow: rgba(99, 88, 88, 0.878) 20px 10px 5px;
      line-height: 40px;
      font-weight: bold;
      color: #607D8B;
      font: 1.5rem 'Montserrat', sans-serif;
    }
  }
}

@media (max-width: 992px) {
  .mess-title {
    font-size: 25px !important;
  }

  .load-text {
    font-size: 18px !important;
  }
}
</style>