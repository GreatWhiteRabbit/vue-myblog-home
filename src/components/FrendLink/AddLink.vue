<template>
    <div class="link container">
        <h1 class="mess-title" id="next"><i class="el-icon-thumb"></i>交个朋友吧！</h1>
                <el-form :model="FormData" class="link-form" :rules="rules" ref="FormData" @change="linkAdd=true">
                    <el-row>
                        <el-col :md="6" :sm="12">
                            <el-form-item  prop="name">
                                <el-input
                                    @focus="linkAdd=true"
                                    @blur="linkAdd=FormData.name.length>0?true:false"
                                    prefix-icon="el-icon-sugar"
                                    v-model="FormData.name"
                                    placeholder="网站名称"
                                    type="text" >

                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="12">
                            <el-form-item  prop="info"> 
                                <el-input
                                    @focus="linkAdd=true"
                                    @blur="linkAdd=FormData.info.length>0?true:false"
                                    prefix-icon="el-icon-postcard"
                                    v-model="FormData.info"
                                    placeholder="网站介绍"
                                    type="text" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="12">
                            <el-form-item prop="link">
                                <el-input
                                    @focus="linkAdd=true"
                                    @blur="linkAdd=FormData.link.length>0?true:false"
                                    prefix-icon="el-icon-position"
                                    v-model="FormData.link"
                                    placeholder="网站地址"
                                    type="text" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :md="6" :sm="12">
                            <el-form-item  prop="imgUrl">
                                <el-input
                                    @focus="linkAdd=true"
                                    @blur="linkAdd=FormData.imgurl.length>0?true:false"
                                    prefix-icon="el-icon-picture-outline"
                                    v-model="FormData.imgurl"
                                    placeholder="网站图标地址"
                                    type="text" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-collapse-transition> -->
                        <transition name="down">
                        <div class="link-group a-tag" v-show="linkAdd">
                            <a href="javascrip:;" class="link-title" >功能已停用:请在留言区,按上表单格式添加</a>
                             <el-tooltip class="item" effect="light" content="请在留言区留下友链信息" placement="top">
                                <el-button @click="submit('FormData')" class="link-btn">添加友链</el-button>
                             </el-tooltip>
                        </div>
                        </transition>
                    <!-- </el-collapse-transition> -->
                </el-form>
    </div>
</template>
<script>
import axios from "axios";

export default {
    name:'AddLink',
    data(){
        return{
            FormData:{
                name:'',
                info:'',
                link:'',
                imgurl:''
            },
            linkAdd:false,
            rules: {
                name: [
                    { required: true, message: '请输入网站名称', trigger: 'blur,change' },
                    { min: 3, max: 20, message: '长度在 3 到 10个字符', trigger: 'blur' }
                ],
                info: [
                    { required: true, message: '请输入网站介绍', trigger: 'blur,change' },
                    { min: 3, max: 30, message: '网站介绍长度在 3 到 30个字符', trigger: 'blur' }
                ],
                link: [
                    { required: true, message: '请输入网站地址', trigger: 'blur,change' },
                    { min: 3, max: 50, message: '网站地址长度在 3 到 50个字符', trigger: 'blur' }
                ],
                imgurl: [
                    { required: true, message: '请输入网站图标地址', trigger: 'blur,change' },
                    { min: 3, max: 100, message: '长度在 3 到 100个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods:{
         submit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let that=this
                    this.$post('/apis/link',this.FormData)
                    .then(function(res){

                        if(res.success === true) {
                          that.$message.success("申请成功，等待管理员审核");
                        } else {
                          that.$message.error("服务器异常");
                        }
                    })

                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/style/home.styl';
    .link-form>>>.el-input__inner
        background rgba(255,255,255,.3);
    .link
        &:hover
            .mess-title
                color: #5adcce;
        .mess-title
            maring 0
            font-size 25px
            color #ccc
        .link-form
            >>>.el-input
                width 90%
                margin 0 5%
            .link-group
                display flex
                justify-content space-between
                align-items center
                padding 0 20px
            .link-title
                height 40px
                margin:5px
                line-height:40px
                color:$color  
                ellipsis() 
    .down-enter-active {
      transition: all 0.4s ease;
	}
	.down-leave-active {
		transition: all 0.4s ease;
	}
	.down-enter, .down-leave-to{
		transform: translateY(10%)
		opacity .5
	}   
</style>