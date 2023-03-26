<template>
  <div class="mess">
    <img class="empty" src="http://iconfont.alicdn.com/s/fc6ab7a6-ced0-469f-b1e5-06644dc270fc_origin.svg" />
  </div>
</template>
<script>
export default {
  name: "Add",

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