import axios from 'axios'
import store from '../store'
import { Notification } from 'element-ui';
import router from '@/router'
var instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 10000,
});
// 添加请求拦截器
instance.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    let url = config.url.substring(1, 5)
    if (url == 'apis') {
        config.headers['Authorization'] = store.state.user.token
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
        // 对响应数据做点什么
        // Message('操作成功')
        if (response.headers.authorization) {
            store.dispatch("setToken", response.headers.authorization);
        }
        console.log(response.status)
        if (response.data.status == 'success') {
            return Promise.resolve(response.data)
        } else if (response.data.status == 'error') {
            Notification.error({
                title: '错误提示',
                message: response.data.message,
            })
        } else if (response.data.code == 200 || response.status == 200) {
            return Promise.resolve(response.data)
        } else {
            Notification.error({
                title: '错误提示',
                message: response.data.message,
            })
        }
        // 打印错误信息
        return Promise.reject(response.data)
    },
    function(error) {
        // 对响应错误做点什么
        switch (error.response.status) {
            case 400:
                Notification.warning({
                    title: '错误提示',
                    message: error.response.data.message,
                    iconClass: 'el-icon-warning-outline'
                });
                break;
            case 401:
                Notification.warning({
                    title: '请求参数有误',
                    message: error.response.data.message,
                    iconClass: 'el-icon-warning-outline'
                });
                break;
            case 403:
                Notification.warning({
                    title: '用户权限提示',
                    message: error.response.data.message,
                    iconClass: 'el-icon-warning-outline',
                    onClose() {
                        router.push('/login')
                    },
                });
                break;
            case 404:
                Notification.warning({
                    title: '访问路径不正确',
                    message: error.response.data.message,
                    iconClass: 'el-icon-warning-outline'
                });
                break;
            case 422:
                Notification.warning({
                    title: '温馨提示',
                    message: error.response.data.message,
                    iconClass: 'el-icon-warning-outline',
                    onClose() {
                        store.dispatch("logOut")
                        router.push('/login')
                    },
                });
                break;
            case 429:
                Notification.warning({
                    title: '温馨提示',
                    message: error.response.data.message,
                    iconClass: 'el-icon-warning-outline'
                });
                break;
            case 500:
                Notification.error({
                    title: '网络提示',
                    message: '服务器连接失败，请稍后再试',
                });
                break;
            default:
                Notification.error({
                    title: '错误提示 ' + error.response.status,
                    message: error.response.data.message,
                });

        }
        return Promise.reject(error)
    });
export default instance;