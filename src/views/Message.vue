<template>
    <div class="messa">
        <add-message  @submit="getMess"  :list="list"></add-message>
        <div class="mess-bg" >
            <add-link></add-link>
            <message-list :list="list"  @submit="getMess"></message-list>
            <p class="next" >
              <span v-loading="loading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="#f8f8f8"  @click="next">
                <i class="next-icon" :class="current_page===last_page?'el-icon-arrow-up':'el-icon-arrow-down'">

                </i>  {{current_page===last_page?'没有更多了！快去留言吧！^o^':'点击查看更多'}}</span>
            </p>
        </div>
    </div>
</template>
<script>
import AddMessage from '../components/Message/AddMessage'
import AddLink from '../components/FrendLink/AddLink'
import MessageList from '../components/Message/MessageList'
import axios from "axios";

export default {
    name:'Message',
    components:{
        AddLink,
        AddMessage,
        MessageList,
    },
    data(){
        return {
            list:[],
            current_page:1,
            last_page:1,
            loading:false
        }
    },
    methods:{
        getMessList(){
            var that=this;
            this.loading=true
          axios({
            method:'get',
            url:'/apis/reply/getReply',
            params:{
              page:that.current_page,
              size:10
            }
          })
            .then(function(res){
                that.list=that.list.concat(res.data.data.replyList)
              that.last_page=res.data.data.total;
              that.last_page = Math.ceil(that.last_page / 10);
              if(that.last_page === that.current_page) {
                that.loading = false;
              }
            })

        },
         getMess(){
                var that=this;
           axios({
             method:'get',
             url:'/apis/reply/getReply',
             params:{
               page:that.current_page,
               size:10
             }
           }).then(function(res){
             if(res.data.success === true) {
               that.list=res.data.data.replyList;
               that.last_page=res.data.data.total;
               that.last_page = Math.ceil(that.last_page / 10);
               if(that.last_page === that.current_page) {
                 that.loading = false;
               }
             }
                })
                .catch(function(error){
                })
          },
          next(){
              if(this.current_page<this.last_page){
                  this.current_page++
                  this.getMessList()
              } 
          },
      // 获取发送留言的提示
      getMessageInfo() {
          let type = sessionStorage.getItem("MessageType");
          let title = sessionStorage.getItem("MessageTitle");
          let message = sessionStorage.getItem("Message");
        sessionStorage.removeItem("MessageType");
        sessionStorage.removeItem("MessageTitle");
        sessionStorage.removeItem("Message");
          if(type !== null) {
            this.$notify({
              type:type,
              title:title,
              message:message
            });
          }
      }
    },  
    created() {
       this.getMess();
       this.getMessageInfo();
    },
}
</script>
<style lang="stylus" scoped>
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
</style>
