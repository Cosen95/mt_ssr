import Vue from 'vue'
import Vuex from 'vuex'
import geo from './modules/geo'
import home from './modules/home'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    modules: {
        geo,
        home
    },
    actions: {
        async nuxtServerInit({ commit }, { req, app}) {
            //获取当前所在城市
            const { status, data: { province, city }} = await app.$axios.get('../static/getPosition.json')
            console.log(status,data);
            commit('geo/setPosition',status === 200 ? { province, city} : { province: '', city: '' })
            //获取菜单
            const { status: menuStatus, data: { menu }} = await app.$axios.get('/geo/menu')
            commit('home/setMenu', menuStatus === 200? menu:[])
        }
    }
})

export default store