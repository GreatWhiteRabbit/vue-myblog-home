<template>
<div style="overflow-x:hidden">
    <div class="screen">
        <el-carousel  :interval="5000" height="100vh">
            <el-carousel-item v-for="(item,index) in list" :key="item.id">
            <div class="index">
                <div class="index-bg"  :style="{ 'background-image':' url('+changeImgUrl(item.imgurl)+')'}"></div>
                <div class="index-con">
                    <div class="container"  v-if="index === 0">
                        <div class="bounce reveal-right">
                            <span  class="letter" v-for="(item,index) of hello" :key="index" v-html="item" :style="{animationDelay:.5+index*0.05+'s'}"></span>
                        </div>
                        <div class="index-btn-group reveal-left">
                            <a href="https://github.com/GreatWhiteRabbit"  target="_blank" class="index-btn green">Gihub</a>
                            <router-link to="/blog" class="index-btn purple " > 博客</router-link>
                        </div>
                    </div>
                    <a  v-else :href="item.link?item.link:'javascript:;'">

                        <div  class="container">
                            <div class="bounce reveal-right" v-if="item.title">
                                <h3 class="show-title">{{item.title}}</h3>
                            </div>
                            <div class="index-btn-group reveal-left " v-if="item.info">
                                <p class="show-info">{{item.info}}<i class="el-icon-thumb"></i></p>
                            </div>
                        </div>
                    </a>

                </div>
            </div>
            </el-carousel-item>
        </el-carousel>
        <span @click="next('#next')" class="screen-next iconfont">
            &#xe623;
        </span>
    </div>

   <div class="framing" style="background-color: #dcfcfc">
     <div class="container">
       <h1 class="title" id="next">更新日志</h1>
       <update-log-list :list="updateList"></update-log-list>
     </div>
   </div>

  <div class="framing a-tag" >
        <div class="container">
            <div class="top reveal-scale">
                <h1 class="title" id="next"><i class="el-icon-position"></i>关于框架</h1>
                <p class="title-info">
                    前端使用vue
                    后端使用springboot
                </p>
                <p style="font-size:20px;text-align: center;">

                </p>
            </div>
            <div class="content">
                 <div class="left public reveal-top-two">
                    <span>vue</span>
                    <ul >
                        <li><a href="javascript:;">route</a> </li>
                        <li><a href="javascript:;">echarts</a></li>
                        <li><a href="javascript:;">element ui</a></li>
                        <li><a href="javascript:;">axios</a></li>
                        <li><a href="javascript:;">.....</a></li>
                    </ul>

                </div>
                <div class="right public reveal-top">
                    <span>springboot</span>
                    <ul>
                        <li><a href="https://redis.io/docs/" style="color:var(--main-4)">redis</a></li>
                        <li><a href="https://www.elastic.co/cn/elasticsearch/" style="color:var(--main-4)">elasticsearch</a></li>
                        <li><a href="https://spring.io/projects/spring-boot" style="color:var(--main-4)">springboot</a></li>
                        <li><a href="javascript:;" style="color:var(--main-4)">.....</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- <hr/> -->
    <div class="about a-tag">
        <div class="top">
            <h1 class="title reveal-scale"><i class="el-icon-postcard"></i>关于我</h1>
            <p class="title-info reveal-left">
                挺勤奋的一个JAVA程序员，奈何JAVA太卷，我不得不勤奋╮(╯﹏╰）╭<br />

            </p>
            <p class="title-info reveal-right">
               主要用于分享框架、技术和个人经历
            </p>
          <p class="title-info reveal-right" style="color: #f8b3b3">
            博客搭建过程
          </p>
            <p class="title-info  reveal-scale">
                前端：借鉴<a href="https://gitee.com/baymaxsjj/by-vue-blog" target="_blank">云墨白</a>码云上的前端代码。<br />
               <span style="color: #E0C3FC">后端</span>
              <br>
              <span style="color: #6363f2">springboot</span>
              <span style="color: #1abc9c">完成主要框架的搭建</span>
              <br>
              <span style="color: #6363f2">redis</span>
              <span style="color: #1abc9c">数据的缓存</span>
              <br>
              <span style="color: #6363f2">elasticsearch</span>
              <span style="color: #1abc9c">自动补全和全文检索</span>
              <br>
            </p>
            <p class="title-info reveal-left">
                <span class=" ">本站已经平稳运行</span>

            </p>
            <p class="title-info reveal-right">
                
                <span class="blog-time">{{daysold}}</span><span>天</span>
                <span class="blog-time">{{hrsold}}</span><span>时</span>
                <span class="blog-time">{{minsold}}</span><span>分</span>
                <span class="blog-time">{{seconds}}</span><span>秒</span>
            </p>
        </div>
    </div>
</div>
    
</template>
<script>
import scrollReveal from 'scrollreveal';
import axios from "axios";
import UpdateLogList from "@/views/UpdateLogList";

export default {
    name:'Index',
  components: {UpdateLogList},
  data(){
        return {
            list:[
                {
                    id:'1',
                    title:'大白兔',
                    info:'',
                    link:'',
                    img_url:''
                }
            ],
            daysold:"0",
            hrsold:"0",
            minsold:"0",
            seconds:"0",
            scrollReveal:scrollReveal(),
            welcome:'H,e,l,l,o,!&nbsp;&nbsp;,W,e,l,c,o,m,e&nbsp;&nbsp;,t,o&nbsp;&nbsp;,b,l,o,g.',
            updateList:[],

        }
    },
    computed:{
        hello(){
            return this.welcome.split(',');
        },
      // 数据库中存放的是图片的相对位置，需要进行转换
      changeImgUrl() {
        return (url) => {
          return  "/apis" + "/blog/static/img/" + url;
        }
      }
    },
    methods:{
        next(target){
            let toElement = document.querySelector(target);
            toElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
            })
        },
         getShow(){
            let that=this
            that.$get('/apis/home/get')
            .then(function (response) {

                 that.list=response.data
                 that.welcome=response.data[0].info
            })
            .catch(function (error) {

            });
        },
        sendMessage() {
          axios({
            method:'get',
            url:'/apis/browse/user'
          })
        },
      // 获取更新日志
      getUpdateLog() {
          axios({
            method:"get",
            url:"/apis/updateLog/getAll",
            params:{
              page:1,
              size:10
            }
          }).then(res => {
            this.updateList = res.data.data.updateLogList;
          })
      }

    },
    mounted() {
        this.getShow();
        this.getUpdateLog();
            setTimeout(
                ()=>{
                    console.log(this.scrollReveal)
                    this.scrollReveal.reveal('.reveal-scale', {
                        // 动画的时长
                        duration: 1000,
                        // 延迟时间
                        delay: 200,
                        // 动画开始的位置，'bottom', 'left', 'top', 'right'
                        // origin: 'top',
                        // 回滚的时候是否再次触发动画
                        reset: true,
                        // 在移动端是否使用动画
                        mobile: true,
                        // 滚动的距离，单位可以用%，rem等
                        // distance: '200px',
                        // 其他可用的动画效果
                        opacity: 0.001,
                        easing: 'linear',
                        scale: 0.8,
                    });
                    this.scrollReveal.reveal('.reveal-top', {
                        // 动画的时长
                        duration: 500,
                        // 延迟时间
                        delay: 200,
                        // 动画开始的位置，'bottom', 'left', 'top', 'right'
                        origin: 'bottom',
                        // 回滚的时候是否再次触发动画
                        reset: true,
                        // 在移动端是否使用动画
                        mobile: true,
                        // 滚动的距离，单位可以用%，rem等
                        distance: '50px',
                        // 其他可用的动画效果
                        opacity: 0.001,
                        easing: 'linear',
                    });
                    this.scrollReveal.reveal('.reveal-top-two', {
                        // 动画的时长
                        duration: 500,
                        // 延迟时间
                        delay: 800,
                        // 动画开始的位置，'bottom', 'left', 'top', 'right'
                        origin: 'bottom',
                        // 回滚的时候是否再次触发动画
                        reset: true,
                        // 在移动端是否使用动画
                        mobile: true,
                        // 滚动的距离，单位可以用%，rem等
                        distance: '50px',
                        // 其他可用的动画效果
                        opacity: 0.001,
                        easing: 'linear',
                    });
                    this.scrollReveal.reveal('.reveal-left', {
                        // 动画的时长
                        duration: 1000,
                        // 延迟时间
                        delay: 200,
                        // 动画开始的位置，'bottom', 'left', 'top', 'right'
                        origin: 'left',
                        // 回滚的时候是否再次触发动画
                        reset: true,
                        // 在移动端是否使用动画
                        mobile: true,
                        // 滚动的距离，单位可以用%，rem等
                        distance: '200px',
                        // 其他可用的动画效果
                        opacity: 0.001,
                        easing: 'linear',
                    });
                    this.scrollReveal.reveal('.reveal-right', {
                        // 动画的时长
                        duration: 1000,
                        // 延迟时间
                        delay: 200,
                        // 动画开始的位置，'bottom', 'left', 'top', 'right'
                        origin: 'right',
                        // 回滚的时候是否再次触发动画
                        reset: true,
                        // 在移动端是否使用动画
                        mobile: true,
                        // 滚动的距离，单位可以用%，rem等
                        distance: '200px',
                        // 其他可用的动画效果
                        opacity: 0.001,
                        easing: 'linear',
                    }); 
                },1000)
        setInterval(()=>{
                let birthDay =new Date("2023-03-14");
                let today=new Date();
                let timeold=today.getTime()-birthDay.getTime();
                let sectimeold=timeold/1000
                let secondsold=Math.floor(sectimeold);
                let msPerDay=24*60*60*1000;
                let e_daysold=timeold/msPerDay;
                this.daysold=Math.floor(e_daysold)<10?"0"+Math.floor(e_daysold):Math.floor(e_daysold);
                let e_hrsold=(this.daysold-e_daysold)*-24;
                this.hrsold=Math.floor(e_hrsold)<10?"0"+Math.floor(e_hrsold):Math.floor(e_hrsold);
                let e_minsold=(this.hrsold-e_hrsold)*-60;
                this.minsold=Math.floor((this.hrsold-e_hrsold)*-60)<10?"0"+Math.floor((this.hrsold-e_hrsold)*-60):Math.floor((this.hrsold-e_hrsold)*-60);
                this.seconds=Math.floor((this.minsold-e_minsold)*-60)<10?"0"+Math.floor((this.minsold-e_minsold)*-60):Math.floor((this.minsold-e_minsold)*-60)
        }, 1000);
  },
  created() {
      this.sendMessage();

  }

}
</script>
<style lang="stylus" scoped>
@import '~@/assets/style/home.styl'
    .index
        position relative
        width:100%
        height 100vh
        min-height 500px

        .index-bg
            content: "";
            width:100%;
            height:100%;
            position: absolute;
            left:0px;
            top:0;

            background-color: #bbf9f9

            background-repeat:no-repeat;
            background-position:center;
            background-size: cover;
            background-attachment: fixed;
            transition all .8s
            z-index -1
            display: block;
            visibility: visible;
            -webkit-mask-image: url('~@/assets/circle.png');
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: center center;
            -webkit-mask-size: 300%;
            animation: circle 1.2s ease-in;
        .index-con
            width:100%
            height 100%
            display flex
            justify-content center
            align-items center
            flex-direction column
            .show-title
                font-size 30px
                ellipsis()
                padding:0 20px
                text-shadow: rgba(99,88,88,0.878) 20px 10px 5px;
            .show-info
                text-align center
                font: 1.5rem 'Montserrat', sans-serif;
                text-transform: uppercase;
                letter-spacing: 0.2rem;
                text-align:justify;
                font-weight: 700;
                background-image:  linear-gradient(360deg, rgb(246,227,177), rgb(225,107,145),rgb(246,227,177));
                background-clip: text;
                -webkit-text-fill-color: transparent;
                box-decoration-break: clone;
            .index-btn-group
                display flex
                align-items: center;
                justify-content: center;
                flex-wrap wrap
                .index-btn
                    display: block;
                    width:180px
                    text-align center
                    margin:20px;
                    text-transform: uppercase;
                    font-size: 20px;
                    font-weight: bold;
                    padding: 12px 50px;
                    border-radius: 50px;
                    color: white;
                    position: relative;
                    &:before
                        content: '';
                        display: block;
                        background: linear-gradient(to left, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.4) 50%);
                        background-size: 210% 100%;
                        background-position: right bottom;
                        height: 100%;
                        width: 100%;
                        position: absolute;
                        top: 0;
                        bottom:0;
                        right:0;
                        left: 0;
                        border-radius: 50px;
                        transition: all 1s;
                        -webkit-transition: all 1s;
                .green 
                    background-image: linear-gradient(to right, rgba(255, 222, 233,.5), rgba(181, 255, 252 ,.5))
                    box-shadow: 0 4px 15px 0 rgba(255, 222, 233,.75);
                .purple
                    background-image: linear-gradient(to right, rgba(133, 255 ,189,.5), rgba(255 ,251, 125 ,.5))
                    box-shadow: 0 4px 15px 0 rgba(133, 255 ,189,.75);
                .purple:hover:before 
                    background-position: left bottom;
                .green:hover:before 
                    background-position: left bottom;



    .framing
        width 100%
        height 450px
        padding-top 40px
        display: flex;
        justify-content: center;
        align-items: center;
        background-color #fff

        background-attachment: fixed;

        background-repeat:no-repeat;
        background-position:center;
        background-size: cover;

        .content
            display flex
            justify-content center
            flex 1
            height:380px
            .public
                position relative
                h1 
                    color var(--main-6)
                span
                    display block
                    height 150px
                    width 150px
                    border-radius 150px
                    line-height 150px
                    text-align center
                    font-size 30px
                    color #fff
                ul
                    position absolute
                    color #ccc
                    font-size 20px
                    width 100%
            .left
                transform translate(20px,20px)
                span
                    background-color rgba(142, 197, 252, 0.5)
                    opacity .5
                ul
                    padding 10px 20px 10px 0
                    right 50%
                    text-align right 
                    border-right 2px dashed var(--main-6)

            .right
                transform translateX(-20px)
                span
                    background-color rgba(245, 108, 108, 0.5)
                ul
                    padding 10px 0px 10px 20px
                    left 50%
                    text-align left 
                    border-left 2px dashed var(--main-5)



    .about
        height 450px
        display: flex;
        justify-content: center;
        align-items: center;

        position relative
        &:before
            content ''
            position absolute
            top 0 
            left 0
            width: 100%;
            height: 100%;
            background:#fff url(https://p.pstatp.com/origin/1373e0001435e411dd94b)
            background-repeat:no-repeat;
            background-position:center;
            background-size: cover;
            background-attachment: fixed;
            filter: blur(10px);
        .blog-time
            font-weight bold
            display: inline-block;
            height: 40px;
            line-height: 40px;
            text-align: center;
            padding: 0 10px;
            border-radius: 5px;
            border 1px dashed  #ccc
            
.title
    margin 10px 0
    text-align center
    font-size: 35px;
    color:#666
    transition all .4s
    text-shadow: 1px 1px 0 hsla(0,0%,100%,.5);
    // backdrop-filter: blur(2px);
.title-info
    font-size 16px
    color:#ccc
    letter-spacing: 2px;    
    text-align center
 @media(max-width: 700px)
    

    .title
        color var(--main-6)
    .title-info
        font-size 14px
        letter-spacing: 1px;    
    .about 
        p
            font-size:12px
    .framing 
        .container 
            transform: scale(0.8);
    .about 
        .top 
            .title
                transform: scale(0.8);
@keyframes circle {
    0% {
        opacity: 0;
        -webkit-mask-size: 30%;
    }

    40% {
        opacity: .6;
        -webkit-mask-size: 60%;
    }
    100% {
        opacity: 1;
        -webkit-mask-size: 300%;
    }
}
</style>
<style lang="stylus" scoped>
.bounce {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font: normal bold 6rem "Product Sans", sans-serif;
    white-space: nowrap;
    color: transparent;
    -webkit-text-stroke: 1px #fff;
    letter-spacing: 0.04em;
    font-weight bold
}

.letter {
    animation: bounce 4s linear infinite alternate;
    display: inline-block;
    transform: translate3d(0, 0, 0);
    margin-top: 0.5em;
    text-shadow: 0 210px 6px #fff
    font: normal 500 1.5rem 'Varela Round', sans-serif;
}
@media(max-width: 767px){
    .index-btn{
        transform scale(0.8)
    }
    .bounce{
        transform scale(0.8)
    }
    .letter {
        // text-shadow: 0 305px 6px #fff
        text-shadow: 0 405px 6px #fff
    }
}
@keyframes bounce {
  0% {
    transform: matrix(0,0,0,0,0,0);
    }
    1.66667% {
        transform: matrix(.19514,0,0,.19514,0,-3.8179);
    }
    3.33333% {
        transform: matrix(.48061,0,0,.48061,0,-16.89184);
    }
    5% {
        transform: matrix(.78868,0,0,.78868,0,-35.82897);
    }
    6.66667% {
        transform: matrix(1.06298,0,0,1.06298,0,-54.24398);
    }
    8.33333% {
        transform: matrix(1.26541,0,0,1.26541,0,-67.42532);
    }
    10% {
        transform: matrix(1.37835,0,0,1.37835,0,-73.79667);
    }
    11.6667% {
        transform: matrix(1.40302,0,0,1.40302,0,-74.15221);
    }
    13.3333% {
        opacity: 1;
        transform: matrix(1.35507,0,0,1.35507,0,-70.32855);
    }
    15% {
        transform: matrix(1.25874,0,0,1.25874,0,-64.25506);
    }
    16.6667% {
        transform: matrix(1.14088,0,0,1.14088,0,-57.53621);
    }
    18.3333% {
        transform: matrix(1.02595,0,0,1.02595,0,-51.35907);
    }
    20% {
        transform: matrix(.93241,0,0,.93241,0,-46.51039);
    }
    21.6667% {
        transform: matrix(.87106,0,0,.87106,0,-43.40452);
    }
    23.3333% {
        transform: matrix(.84491,0,0,.84491,0,-42.11433);
    }
    25% {
        transform: matrix(.85043,0,0,.85043,0,-42.42524);
    }
    26.6667% {
        transform: matrix(.87962,0,0,.87962,0,-43.92027);
    }
    28.3333% {
        transform: matrix(.92232,0,0,.92232,0,-46.08478);
    }
    30% {
        transform: matrix(.96839,0,0,.96839,0,-48.40959);
    }
    31.6667% {
        transform: matrix(1.00942,0,0,1.00942,0,-50.47334);
    }
    33.3333% {
        transform: matrix(1.0397,0,0,1.0397,0,-51.99258);
    }
    35% {
        transform: matrix(1.05659,0,0,1.05659,0,-52.83794);
    }
    36.6667% {
        transform: matrix(1.06028,0,0,1.06028,0,-53.02083);
    }
    38.3333% {
        transform: matrix(1.05311,0,0,1.05311,0,-52.65993);
    }
    40% {
        transform: matrix(1.0387,0,0,1.0387,0,-51.93743);
    }
    41.6667% {
        transform: matrix(1.02107,0,0,1.02107,0,-51.05459);
    }
    43.3333% {
        transform: matrix(1.00388,0,0,1.00388,0,-50.19419);
    }
    45% {
        transform: matrix(.98989,0,0,.98989,0,-49.4943);
    }
    46.6667% {
        transform: matrix(.98072,0,0,.98072,0,-49.03539);
    }
    48.3333% {
        transform: matrix(.9768,0,0,.9768,0,-48.83983);
    }
    50% {
        transform: matrix(.97763,0,0,.97763,0,-48.88146);
    }
    51.6667% {
        transform: matrix(.98199,0,0,.98199,0,-49.09973);
    }
    53.3333% {
        transform: matrix(.98838,0,0,.98838,0,-49.41905);
    }
    55% {
        transform: matrix(.99527,0,0,.99527,0,-49.76363);
    }
    56.6667% {
        transform: matrix(1.00141,0,0,1.00141,0,-50.07044);
    }
    58.3333% {
        transform: matrix(1.00594,0,0,1.00594,0,-50.29687);
    }
    60% {
        transform: matrix(1.00846,0,0,1.00846,0,-50.4232);
    }
    61.6667% {
        transform: matrix(1.00902,0,0,1.00902,0,-50.4508);
    }
    63.3333% {
        transform: matrix(1.00794,0,0,1.00794,0,-50.39716);
    }
    65% {
        transform: matrix(1.00579,0,0,1.00579,0,-50.28941);
    }
    66.6667% {
        transform: matrix(1.00315,0,0,1.00315,0,-50.15758);
    }
    68.3333% {
        transform: matrix(1.00058,0,0,1.00058,0,-50.02902);
    }
    70% {
        transform: matrix(.99849,0,0,.99849,0,-49.9244);
    }
    71.6667% {
        transform: matrix(.99712,0,0,.99712,0,-49.85578);
    }
    73.3333% {
        transform: matrix(.99653,0,0,.99653,0,-49.82653);
    }
    75% {
        transform: matrix(.99665,0,0,.99665,0,-49.8327);
    }
    76.6667% {
        transform: matrix(.99731,0,0,.99731,0,-49.86535);
    }
    78.3333% {
        transform: matrix(.99826,0,0,.99826,0,-49.91311);
    }
    80% {
        transform: matrix(.99929,0,0,.99929,0,-49.96465);
    }
    81.6667% {
        transform: matrix(1.00021,0,0,1.00021,0,-50.01054);
    }
    83.3333% {
        transform: matrix(1.00089,0,0,1.00089,0,-50.0444);
    }
    85% {
        transform: matrix(1.00127,0,0,1.00127,0,-50.0633);
    }
    86.6667% {
        transform: matrix(1.00135,0,0,1.00135,0,-50.06743);
    }
    88.3333% {
        transform: matrix(1.00119,0,0,1.00119,0,-50.0594);
    }
    90% {
        transform: matrix(1.00087,0,0,1.00087,0,-50.04329);
    }
    91.6667% {
        transform: matrix(1.00047,0,0,1.00047,0,-50.02357);
    }
    93.3333% {
        transform: matrix(1.00009,0,0,1.00009,0,-50.00434);
    }
    95% {
        transform: matrix(.99977,0,0,.99977,0,-49.98869);
    }
    96.6667% {
        transform: matrix(.99957,0,0,.99957,0,-49.97843);
    }
    98.3333% {
        transform: matrix(.99948,0,0,.99948,0,-49.97405);
    }

    100% {
        opacity: 1;
        transform: matrix(1,0,0,1,0,-50);
    }
}
</style>