<template>
  <div>
    <article
      class="article article-type-post article-index blog-animation"
      v-for="(item,index) of list" :key="Id(index)"
      :style="{'animation-duration':(index+1)*600+'ms'}"
    >
      <div class="article-inner">
     <router-link class="article-more-a article-title"  :to="'/blog/'+Id(index)">

        <header class="article-header">
            <div style="margin-right:7.6923%">
              <h3 class="title">
                {{item.blog_title}}
              <i class="el-icon-thumb"></i>
                点击查看详情
              </h3>

              <span class="archive-article-date">
                <a href="javascritp:;" style="color:#bebebe;font-size:16px">
<!--                  需要加一个计算属性将时间戳转成标准时间-->
                  <i class="iconfont iconriqi"></i> {{timeChange(item.blog_date)}}
                </a>
              </span>
            </div>
        </header>
        <div class="article-entry" itemprop="articleBody" style="overflow:hidden">
<!--          加上一个计算属性获得真实的img地址-->
              <el-image style="width: 30%;height: 30%"
              v-if="item.blog_cover"
              fit='cover'
              class="article-img"
              :src="changeImgUrl(item.blog_cover)"
              > 
              <div slot="error" class="image-slot">
                <!-- <i class="el-icon-picture-outline">加载失败</i> -->
                <img style="object-f:cover;width:100%" src="https://p.pstatp.com/origin/1379300008dada52a7875"/>
              </div>
            </el-image>
            <div style="font-size: 20px; color: #f97f7f" >摘要：{{item.blog_description}}</div>
        </div>
     </router-link>
        <div class="article-info article-info-index">
          <div class="blog-info">
            <router-link style="color:var(--main-5)" :to="'/blog/'+Id(index)"><i class="icon iconfont iconzuanshi" style="color:var(--main-5)"></i>{{item.blog_browse}}</router-link>

            <router-link  :to="'/blog/'+Id(index)+'#comment'"><i class="iconfont iconaixin"></i>{{item.blog_likes}}</router-link>
          </div>
          <div class="article-group" style="display:flex">
              <div class="article-category tagcloud" >
                <i class="iconfont iconshu icon"></i>
                <ul class="article-tag-list">
                  <li class="article-tag-list-item">
                    <router-link :to="'/blog?class='+item.category_id" class="article-tag-list-link color3">{{item.category_name}}</router-link>
                  </li>
                </ul>
              </div>
              <div class="article-tag tagcloud">
                <i class="iconfont iconbiaoqian1 icon"></i>
                <ul class="article-tag-list">
                  <li class="article-tag-list-item"  >
                    <router-link :to="'/blog?label='+item.label_id" class="js-tag article-tag-list-link color3">{{item.label_name}}</router-link>
                  </li>
                </ul>
              </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
<script>
export default {
  name: "BlogList",
  props:{
      list:Array,
  },
  computed:{
    timeChange() {
      return (time) => {

        if(time === undefined || time === null){
          var today = new Date();

//日期
          var DD = String(today.getDate()).padStart(2, '0'); // 获取日
          var MM = String(today.getMonth() + 1).padStart(2, '0'); //获取月份，1 月为 0
          var yyyy = today.getFullYear(); // 获取年

    return yyyy + '-' + MM + '-' + DD;

        }

        var date = new Date(time);
        let  Y = date.getFullYear() + '-';
        let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let  D = date.getDate() + ' ';
        let  h = date.getHours() + ':';
        let  m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y + M + D + h + m + s
      }
    },
    changeImgUrl() {
      return (url) => {
        return  "/apis" + "/blog/static/img/" + url;
      }
    },
    Id() {
      return(index) => {
        if(this.list[index].blog_id === undefined) {
          return this.list[index].id;
        }
        return this.list[index].blog_id;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.article {
  margin: 10px;
  position: relative;
  border: 1px solid #ddd;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  background: #fff;
  transition: all 0.2s ease-in;
  border-radius: 4px;
  &:hover{
    box-shadow: 8px 14px 38px rgba(231, 238, 239, 0.81);
    transition: transform .5s
    color #34495e
    .article-header{
      border-left 5px solid var(--main-6)
    }
    .el-icon-thumb{
      color:var(--main-5)
    }
    >>>.el-image__inner{
      transform scale(1.1)
    }
  }
  >>>.el-image__inner{
    transition: transform .5s
  }
}
@media(max-width: 996px){
  .article-header{
    position relative
  }
  .article-img{
    float none!important
    display block
    width: auto!important;
    height: auto!important;

  }

  .archive-article-date{
      position: absolute;
      transform: translateY(50%);
      bottom: 0;
      right: 7.7%;
  }
  .cont-desc{
    margin:0 10px !important
    color #ee7a7b
    font-size 20px;
    height 30px
  }
}
.blog-info a{
  margin-right: 10px;
  color: #b4b4b4;
  transition: .1s ease-in;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  transition all .2s
  &:hover{
    color:var(--main-6)
    i{
      color:var(--main-6)
    }
  }
 
}
.blog-info i{
  color  #bebebe
  margin-right:1px
}

.iconfont {
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.article-inner h1.article-title, .article-title {
  color: #333;
  display: inherit;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5
}
.article-group{
  display flex
  flex-wrap: wrap
  
}
.article-category .icon, .article-tag .icon {
    color: #bebebe;
    float: left;
    margin-right: 10px;
    margin-top: 6px;
    overflow hidden
}
.article-tag-list{
  overflow hidden
}
.article-tag-list .article-tag-list-item {
    float: left;
}

.article-inner {
  border-color: #d1d1d1;
}
.article-more-a:visited {
    color: #969696;
}

.article-header {
  transition all .5s
  border-left: 5px solid #dddcdc;
  padding: 30px 0 15px 25px;
  padding-left: 7.6923%;
  border-radius: 4px;

}
.article-header .title{
  font-size:16px
  display: inline;
  margin 0

}
.article-header .title:before{
  content:''
}

.article-entry {
  line-height: 1.8em;
  margin-right: 7.6923%;
  margin-left: 7.6923%;
  border-top:1px dashed #ddd
}
.article-entry .el-image{
  width: 300px; 
  height: 180px;
  vertical-align:text-top;
  margin:0 10px;
  float:left;
  border-radius: 4px;
}
.article-entry{
  padding 10px 0
  font-size 20px
}

.article-entry .cont-desc,p{
  margin:-6px 10px
  font-size: 13px;
  line-height: 24px;
  color: #bebebe
  cursor pointer
}
.article-info-index.article-info {
  display flex
  justify-content space-between
  flex-wrap:wrap
  align-items: center;
  margin: 0px 7.6923% 0;
  min-height: 72px;
  border-top: 1px solid #ddd;
}



.archive-article-date {
  color: #bebebe;
  float: right;
}

.tagcloud a.color3 {
  background: #bebebe;
  &:hover{
    color:var(--main-6)
  }
}

.tagcloud a {
  display: inline-block;
  text-decoration: none;
  font-weight: 400;
  font-size: 10px;
  color: #fff;
  height: 18px;
  line-height: 18px;
  float: left;
  padding: 0 5px 0 10px;
  position: relative;
  border-radius: 0 5px 5px 0;
  margin: 5px 9px 5px 8px;
  font-family: Menlo, Monaco, Andale Mono, lucida console, Courier New, monospace;
}

.tagcloud a.color3:before {
  border-right-color: #bebebe;
}

.tagcloud a:before {
  content: ' ';
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: -18px;
  border: 9px solid transparent;
}

.tagcloud a:after {
  content: ' ';
  width: 4px;
  height: 4px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 7px;
  left: 2px;
}

.article-more-link a {
  background: #4d4d4d;
  color: #fff;
  font-size: 12px;
  padding: 5px 8px;
  line-height: 16px;
  border-radius: 2px;
  transition: background 0.3s;
}
// .article-inner p {
//   margin: 1.6em 0;
// }

.article-more-link {
  margin-top: 0;
  text-align: left;
  float: right;
}
</style>