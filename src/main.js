import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import sakura from './utils/sakura'
import MouseMove from './utils/MouseMove'
// axios
import http from '@/utils/httpindex'
import axios from 'axios'
// 阿里巴巴字体图标
import '@/assets/iconfont/iconfont.css'
//引入nprogress
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' //这个样式必须引入
import VueDOMPurifyHTML from 'vue-dompurify-html'
import {
    Pagination,
    Input,
    Autocomplete,
    Button,
    Form,
    FormItem,
    Divider,
    Icon,
    Row,
    Col,
    Tabs,
    TabPane,
    Image,
    Avatar,
    Popover,
    Loading,
    Message,
    Backtop,
    Carousel,
    CarouselItem,
    scrollbar,
    Popconfirm,
    Notification,
    Dialog,
    Tooltip,
    Slider,
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(scrollbar);
Vue.use(Input);
Vue.use(Autocomplete);
Vue.use(Slider);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Divider);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Image);
Vue.use(Tooltip);
Vue.use(Avatar);
Vue.use(Popover);
Vue.use(Backtop);
Vue.use(Dialog);
Vue.use(Popconfirm);
Vue.use(sakura)
Vue.use(MouseMove)
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.use(VueDOMPurifyHTML)
    //在main.js定义自定义指令 
Vue.directive('highlight', function(el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    })
})
Vue.prototype.$get = http.get;
Vue.prototype.$post = http.post;
Vue.prototype.$axios = axios;
Vue.prototype.$partyLogin = process.env.VUE_APP_API_URL;
http.defaults.baseURL = process.env.VUE_APP_URL;
// Vue.use(animated)
// 百度统计
// var _hmt = _hmt || [];
// (function() {
//     var hm = document.createElement("script");
//     hm.src = "https://hm.baidu.com/hm.js?68f23509711f01e6938f3f4dc081c230";
//     var s = document.getElementsByTagName("script")[0];
//     s.parentNode.insertBefore(hm, s);
// })();

Vue.config.productionTip = false
    // 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
router.beforeEach((to, from, next) => {
    NProgress.start()
    if (to.meta.title) {
        document.title = to.meta.title
    }
    // if (_hmt) {
    //     if (to.path) {
    //         console.log(to.fullPath)
    //         _hmt.push(['_trackPageview', '/#' + to.fullPath]);
    //     }
    // }
    next()
    const route = document.getElementsByClassName('route-content')[0]
    if (route) {
        route.classList.remove('route-filter')
    }
})

router.afterEach(() => {
        NProgress.done()
    })
    // #在main.js定义自定义指令 
    // Vue.directive('highlight', function(el) {
    //         let blocks = el.querySelectorAll('pre code');
    //         blocks.forEach((block) => {
    //             hljs.highlightBlock(block)
    //         })
    //     })
    // Vue.prototype.$EventBus = new Vue();
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')