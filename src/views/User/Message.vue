<template>
  <div class="mess" v-loading="loading">
    <mess-card @submit="getMessList" :list="list" :car="car" v-if="list.length>0"></mess-card>
    <img
      v-else
      class="empty"
      src="https://iconfont.alicdn.com/s/59c83208-cad4-4477-951e-a2e36ee13b72.svg"
    />
    <el-pagination
      v-if="list.length>0"
      :background="true"
      layout="prev, pager, next"
      :page-count="last_page"
      :current-page="current_page"
      @current-change="getMessList"
      style="width:100%;display: flex;justify-content: center;margin-bottom:10px; flex-wrap:wrap"
    ></el-pagination>
  </div>
</template>
<script>
import MessCard from "../../components/Message/MessCard";
export default {
  name: "Message",
  components: {
    MessCard,
  },
  data() {
    return {
      list: [],
      loading: false,
      car: {
        pattern: true, //留言模式
        left: true, //left模式
      },
      current_page: 1, //当前页
      last_page: 1, //最后一页
    };
  },
  methods: {
    // 获取留言列表
    getMessList(page) {
      this.current_page = page ? page : 1;
      this.loading = true;
      let that = this;
      that
        .$get("/apis/message/list?id=-1&page=" + that.current_page)
        .then(function (res) {
          that.list = res.data.data;
          that.last_page = res.data.last_page;
          that.current_page = res.data.current_page;
          that.loading = false;
        })
        .catch(function (error) {
          that.loading = false;
        });
    },
  },
  created() {
    this.getMessList();
  },
};
</script>
<style lang="stylus" scoped>
.empty {
  display: block;
  width: 300px;
  margin: 20px auto;
}
</style>