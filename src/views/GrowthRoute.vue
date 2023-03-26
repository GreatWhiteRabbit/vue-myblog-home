<template>
  <div class="route">

    <div class="container">
      <h1 class="mess-title blog-animation" style="margin-top:20px">
        <i class="el-icon-goods"></i>个人项目
      </h1>
      <div style="width: 100%">
        <el-carousel
          v-if="carousel.length>0"
          class="blog-animation"
          :interval="4000"
          :type="card"
          style="padding:10px 0;"
        >
          <el-carousel-item
            v-for="item in carousel"
            :key="item.id"
            :style="{'background-color': setColor(),'background-image':'url('+changeImgUrl(item.imgurl)+')',
           }"
          >
            <a :href="item.link" target="_blank">
              <div class="medium">
                <h4 class="route-title">{{ item.name }}</h4>
                <p class="route-content">{{item.info}}</p>
              </div>
            </a>
            <el-avatar :size="40" class="car-img" shape="square" fit="fit" :src="changeImgUrl(item.imgurl)">

            </el-avatar>
          </el-carousel-item>
        </el-carousel>
      </div>

      <h1 class="mess-title blog-animation">
        <i class="el-icon-reading"></i>随笔
      </h1>
     <essay-list :list="list"></essay-list>
      <div class="messa">
        <p class="next" >
              <span v-loading="loading" element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="#f8f8f8"  @click="next">
                <i class="next-icon" :class="currentPage===lastPage?'el-icon-arrow-up':'el-icon-arrow-down'">
                </i>  {{currentPage === lastPage?'没有更多了^o^':'点击查看更多'}}</span>
        </p>
      </div>

    </div>
  </div>
</template>

<script>
import EssayList from "../components/Essay/EssayList";
import axios from "axios";
export default {
  name: "GrowthRoute",
  components: {
    EssayList,
  },
  data() {
    return {
      list: [],
      card: document.body.clientWidth > 885 ? "card" : "",
      carousel: [],
      currentPage:1,
      lastPage:1,
      loading:false
    };
  },
  methods: {
    setColor() {
      let r = parseInt(Math.random() * 256);
      let g = parseInt(Math.random() * 256);
      let b = parseInt(Math.random() * 256);
      return `rgba(${r},${g},${b},0.3)`;
    },
    change(x) {
      console.log(this.list[x].content);
      this.title = this.list[x].category;
      this.content = this.list[x].content;
    },
    getEssayList() {
      let that = this;
     axios({
       method:"get",
       url:'/apis/essay/show',
       params:{
         page:this.currentPage,
         size:10
       }
     }).then(res =>  {
       that.list=that.list.concat(res.data.data.essayList);
          that.lastPage =Math.ceil( res.data.data.total / 10) ;
        })
        .catch(function (error) {});
    },
    getCarousel() {
      axios({
        method:'get',
        url:'/apis/project/getCondition'
      })
        .then(res => {
          this.carousel = res.data.data;
        })
        .catch(function (error) {
        });
    },
    next(){
      if(this.currentPage<this.lastPage){
        this.currentPage++
        this.getEssayList()
      }
    }
  },
  created() {
    this.getEssayList();
    this.getCarousel();
  },
  computed:{
    changeImgUrl() {
      return (url) => {
        return  "/apis" + "/blog/static/img/" + url;
      }
    },
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/assets/style/home.styl';
.messa
  background-color #d9d9ed
  padding-bottom:15px
  .next
    text-align center
    color:var(--main-5)
    transition all .3s
    &:hover
      color:var(--main-6)
    span
      cursor pointer
      .next-icon
        animation: next .6s linear infinite alternate;
@keyframes next {
  0%{
    transform translateY(3px)
  }
  100%{
    transform translateY(0px)
  }
}

.route {

  background-color: #f5d0d0;
  background: linear-gradient(#f8e3e3, #f9d5da, #fec7d2, #f8a4b4,#fec3ce);
  // z-index:-4
  &:hover {
    .mess-title {
      color: #91f8ed;
    }
  }

  >>>.el-carousel__mask {
    display: block !important;
    width 100%
    left 0
    right 0
  }

  .medium {
    text-align: center;
    margin-top: 50px;
    padding: 0 10%;

    // background:rgba(255,255,255,.5)
    .route-title {
      font-size: 25px;
      routeHover();
    }
  }

  .mess-title {
    margin: 0;
    font-size: 20px;
    color: #ccc;
    ellipsis();
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item {
    backdrop-filter: blur(20px);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    // filter: blur(20px);
  }
  .el-avatar {
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    background: transparent;
  }
}
</style>