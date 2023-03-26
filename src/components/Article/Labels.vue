<template>
    <div  v-loading="loading">
        <router-link :to="'/blog?label='+item.label_id" class="label blog-animation"  v-for="(item,key) in label" :key="key" :style="{background:color}">
            {{item.label_name}}
        </router-link>
    </div>
</template>
<script>
export default {
    name:'Labels',
    data(){
        return {
            label:{},
            color:'',
            loading:false
        }
       
    },
    methods:{
        setColor(){
                this.color = 'rgba(220,20,60,0.3)'
        },
        getLabel(){
            let that=this
            this.loading=true
            that.$get('/apis/label/list')
            .then(function(res){
                that.label=res.data
              for(let i = 0; i < that.label.length; i++) {
                // 将每个标签的博客总数存放在浏览器中
                sessionStorage.setItem("label" + that.label[i].label_id,
                    that.label[i].blogIdList.length)
              }
                that.loading=false
            })
            .catch(function(error){
                that.loading=false
            })
        }
    },
    created(){
        this.getLabel()
        this.setColor()
    }
}
</script>
<style lang="stylus" scoped>
    .label
        margin:4px
        display:inline-block
        height 20px
        padding:0 15px
        border:1px solid #ccc
        text-align center
        line-height 20px
        color:#fff
        font-size 12px
        box-shadow:1px 1px 1px #ccc
        border-radius:15px
        transition:all .3s
        cursor:pointer
    .label:hover
        box-shadow:2px 2px 2px #ccc
        border:1px solid #fff

</style>