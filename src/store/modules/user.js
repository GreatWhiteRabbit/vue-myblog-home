import http from '@/utils/httpindex.js'
const user = {
    state: {
        user: '',
        token: localStorage.getItem('user_token') || '',
    },
    mutations: {
        setToken(state, data) { //写入token
            state.token = data
        },
        userInfo(state, data) { //写入个人信息
            state.user = data
        },
        logOut(state) { //退出
            state.token = ''
            state.user = ''
        }
    },
    actions: {
        setToken({ commit }, data) {
            // localStorage.setItem("so_token", data);
            commit('setToken', data)
        },
        async userInfo({ commit }) {
            const res = await http.get('/apis/user/info')
            commit('userInfo', res.data)
        },
        async logOut({ commit }) {
            // await http.get('/apis/user/logout')
            await http.get('/apis/user/logout')
                // localStorage.removeItem("so_token");
            commit('logOut')
        },
    }
}
export default user