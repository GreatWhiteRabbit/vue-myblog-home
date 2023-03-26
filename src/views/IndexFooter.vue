<template>

    <footer class="footer" v-show="route!='/blog'">
        <div class="container">
            <div class="foot-row service">
                <p class="title">DBrabbit•记录个人经历，分享技术</p>
                    <ul class="link">
                        <li><router-link to="/link">友链</router-link></li>

                        <li><router-link to="/route">随笔</router-link></li>

                        <li><router-link to="/message">留言</router-link></li>

                        <li><router-link to="/blog">博客</router-link></li>

                        <li><router-link to="/">主页</router-link></li>
                    </ul>
            </div>
            <div class="foot-row provide">


            </div>
            <div class="foot-row publicity">
      </div>
            <hr/>
            <div class="foot-row bottom">
                <p class="copyright">© 2020 - {{year}} <a href="https://blog.csdn.net/qq_62038093">大白兔</a> All Rights Reserved.
                  <a href="https://db-rabbit.work" target="_blank" >网站地图</a></p>

            </div>
        </div>
    </footer>
    
</template>
<script>
export default {
    name:'IndexFooter',
    props:{
      route:String
    },
    data(){
        return{
            year:2020,
        }
    },
   created(){
       let date=new Date();
       this.year=date.getFullYear()
   }
}
</script>
<style lang="stylus" scoped>
    .footer
        padding: 10px 30px;
        font-size 12px
        color #a7a7a7
        // background:rgba(248, 249, 250, 0.9)
        background:#fff
        font-weight:bolder
        letter-spacing: 2px;
        padding:10px
        line-height 26px
        a
            color #a7a7a7
            font-size 12px
            transition all .3s
            &:hover
                text-decoration underline 
        .container
            padding 0 10px
            box-sizing: border-box;
            .foot-row
                display: flex;
                justify-content space-between
                align-items: center;
                flex-wrap wrap 
            .service
                font-size 16px
                .link
                    li
                        
                        float right
                        margin 0 20px
                        a
                            font-size 14px
            .provide
                .a-flex
                    display: flex;
                    justify-content:stretch;
                    align-items: center;
                    .ypy
                        height 22px
                .search-wrap 
                    width: 300px;
                    height 22px
                    position: relative;
                    padding 2px 0
                    .search-ipt 
                        height 20px
                        position absolute 
                        right 0
                        top 0
                        width: 240px;
                        color: var(--main-6);
                        background: none;
                        border: none;
                        border-bottom: 2px solid var(--main-1);
                        font-family: Roboto, serif;
                        font-size: 1rem;
                        line-height: 1.75;
                        transition all .4s
                        &:focus
                            width 100%
                    .icon 
                        outline:none;
                        background-color: transparent;
                        border: none;
                        padding 7px
                        line-height 0
                        position: absolute;
                        right: 0;
                        color: var(--main-4);
                        cursor: pointer;
           
            hr
                background-color #f0f0f0
            .bottom
                .share
                    .iconfont
                        display inline-block
                        height 30px
                        width 30px
                        line-height 28px
                        font-size:16px
                        margin:5px
                        cursor pointer
                        color #a7a7a7
                        border-radius 50%
                        text-align center
                        transition all .5s
                        box-sizing border-box
                        &:hover  
                            text-decoration none 
                    .qq
                        // color rgb(27,193,250)
                        // border 1px solid rgb(27,193,250)
                        &:hover
                            color #fff
                            background-color rgb(27,193,250)
                    .gitee
                        // color  #fe7300
                        // border 1px solid  #fe7300
                        &:hover
                            color #fff
                            background-color #fe7300
                    .github
                        // color  #0a0203
                        // border 1px solid  #0a0203
                        &:hover
                            color #fff
                            background-color #0a0203 

                    

            
     @media(max-width: 700px)
        .footer
            padding 10px
            font-size 12px
            letter-spacing: 2px;
            line-height 24px
            .container
                padding 0!important
                .foot-row
                    justify-content center!important
                .service
                    .title
                        font-size 14px
                    .link
                        li
                            margin 0 5px!important
                .provide
                    .search-wrap
                        padding 1px 0!important
                        .search-ipt 
                            right 50%!important
                            transform translateX(50%)
                .publicity
                    span 
                        margin 0 5px
                .bottom
                    .copyright
                        letter-spacing: 1px;
                
</style>