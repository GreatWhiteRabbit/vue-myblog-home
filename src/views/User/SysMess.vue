<template>
  <div class="mess">
    <img class="empty" src="https://iconfont.alicdn.com/s/59c83208-cad4-4477-951e-a2e36ee13b72.svg" />
  </div>
</template>
<script>
export default {
  name: "Message",

  data() {
    return {
      list: [],
    };
  },
  methods: {
    // 获取留言列表
    getMessList(page) {
      this.current_page = page ? page : 1;
      let that = this;
      that
        .$get("/apis/message/list?id=-1&page=" + that.current_page)
        .then(function (res) {
          that.list = res.data.data;
          that.last_page = res.data.last_page;
          that.current_page = res.data.current_page;
        })
        .catch(function (error) {});
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