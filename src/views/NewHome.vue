<script src="../router/index.js"></script>
<template>
    <div class="home">
            <blog-info ></blog-info>
            <div class="blog-right">
                <div v-if="loading">
                  <new-loading v-for="item of 6" :key="item"></new-loading>
                </div>
                <blog-list v-else :list="list"></blog-list>
              <el-pagination v-if="list.length > 0"
                             :background="true"
                             layout="prev, pager, next"
                             :page-count="last_page"
                             :current-page="current_page"
                             @current-change="getList"
                             style="width:100%;display: flex;justify-content: center;margin-bottom:10px; flex-wrap:wrap"
              >
              </el-pagination>
                   <index-footer class="index-foot"></index-footer>
            </div>
    </div>
</template>
<script>
import BlogInfo from '../components/Article/BlogLeft';
import BlogList from '../components/Article/BlogList';
import IndexFooter from './IndexFooter';
import NewLoading from '../components/NewLoading'
import axios from "axios";
export default {
    name:'NewHome',
    components:{
        BlogInfo,
        BlogList,
        IndexFooter,
        NewLoading,
    },
    data(){
      return {
        current_page:1,//当前页
        list:[],//文章数据
        loading:true,
        size:10,
        last_page:1,
        total:0
      }
     
  },
  methods:{

    // 标签点击查询跳转
    change(item){
      this.current_page=1
      this.$router.push({
          path: '/blog',
          query: {
            label:item,
          }
        })
    },
    // 分页获取，防止刷新丢失
    getList(page){
        this.current_page=page
        let type={}
        if(this.$route.query.label){
          type={
            page:page,
            label:this.$route.query.label
          }
        }else if(this.$route.query.class){
          type={
            page:page,
            class:this.$route.query.class
          }
        }else if(this.$route.query.search){
          type={
            page:page,
            search:this.$route.query.search
          }
        }else{
          type={
            page:page
          }
        }
        this.$router.push({
          query: type
        })
      },
      // 共有访问，根据地址栏参数，获取文章，
      async getArticle(){
        this.current_page=this.$route.query.page ? parseInt(this.$route.query.page):1
        let that = this
        let type = ''
        let path = ''
        if(this.$route.query.label){
          type=this.$route.query.label;
          path = '/label/' + type + '/' + that.current_page + '/' + that.size;
          that.total = sessionStorage.getItem("label" + type)
          that.last_page =  Math.ceil(that.total/that.size);
          this.loading=true
          that.$get('/apis'+ path)
              .then(function(res){
                if(res.data.length !== 0){
                  that.list=res.data
                  that.loading=false
                }else{
                  that.$router.replace({path:'404'})
                }
              })
              .catch(function(error){
              })
        }else if(this.$route.query.class){
          type=this.$route.query.class
          path = '/category/' + type + '/' + that.current_page + '/' + that.size;
          that.total = sessionStorage.getItem("category" + type);
          that.last_page =  Math.ceil(that.total/that.size);
          this.loading=true
          that.$get('/apis'+ path)
              .then(function(res){
                if(res.data.length !== 0){
                  that.list=res.data
                  that.loading=false
                }else{
                  that.$router.replace({path:'404'})
                }
              })
              .catch(function(error){
              })
        }else if(this.$route.query.search){

          let info = this.$route.query.search;
          axios({
            method:'get',
            url:'/apis/blog/query',
            params:{
              info:info,
              page:that.current_page,
              size:10
            }
          }).then(res => {
            that.list = res.data.data.records;
            that.last_page = Math.ceil(res.data.data.total / 10);
            that.loading=false
          })
        }

      },
    // 获取首页固定
    getHomeShow() {

      axios({
        method:'get',
        url:'/apis/blog/home',
        params:{
          page:this.current_page,
          size:10
        }
      }).then(res => {

        this.list = res.data.data.blogVoList;
        this.last_page = Math.ceil(res.data.data.total / 10);
        this.loading = false;
      })
    }
  },

  created(){
       this.getArticle();
       this.getHomeShow();
  },
   watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
      if(to.name==='NewHome'){

        this.getArticle();
      }
    }
    }
}
</script>
<style lang="stylus" scoped>
.home-blog>>>
  .nav-top
          color #515151!important
  .nav-no-quiet
      // backdrop-filter: blur(6px);
      box-shadow: 0px 10px 20px 4px  rgba(195,199, 199,0.4);
      background-color:rgba(255,255,255,0.85)
      color:#515151
.home>>>
  .el-pagination.is-background .el-pager li:not(.disabled).active
    background-color var(--main-4)
  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li
    border-radius 20px
    font-weight: 900;
    background-color #fff
    &:hover
      color var(--main-6)
.home
  margin-top:60px
  overflow-x:hidden
  background-color #f8f8f8
  .blog-right
    margin-left 25%
    .index-foot
      margin 0 10px
@media(max-width: 992px)
    .blog-right
      margin-left 0!important
    .index-foot
      margin 0!important
</style>