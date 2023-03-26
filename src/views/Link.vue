<template>
    <div class="link">
        <link-header></link-header>
        <link-friends :friends="friends"></link-friends>
    </div>
</template>
<script>
import LinkHeader from '../components/FrendLink/LinkHeader'
import LinkFriends from '../components/FrendLink/LinkFriends'

export default {
    name:'Link',
    components:{
        LinkHeader,
        LinkFriends,
    },
    data(){
        return {
            friends:[]
        }
    },
    methods:{
       getFriends(){
            let that=this
            that.$get('/apis/link/getLink')
            .then(function (response) {

                 that.friends=response.data
            })
            .catch(function (error) {

            });
        }
    },
    created(){
        this.getFriends()
    }
}
</script>
<style lang="stylus" scoped>
    .link
        background-color #afaff2
        .link-bg
            position:fixed
            top:0
            right:0
            bottom:0
            left:0
            margin:auto
            z-index:-1
</style>