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
            const res = await app.$axios.get('https://www.easy-mock.com/mock/5c45c89ffb5b9a1c074671d5/getPosition')
            const { data: { status, data }} = res;
            const { province, city } = data;
            commit('geo/setPosition',status === 200 ? { province, city} : { province: '', city: '' })
            //获取菜单
            // const menuRes = await app.$axios.get('https://www.easy-mock.com/mock/5c45c89ffb5b9a1c074671d5/getMenu')
            const menuRes = await app.$axios.get('geo/menu')
            const { data: { menu } } = menuRes
            commit('home/setMenu', menu ? menu:[])
            // 获取热门景点
            const hotPlaceRes = await app.$axios.get('search/hotPlace', {
                params: {
                    city: app.store.state.geo.position.city.replace('市','')
                }
            })
            const { data: { result }} = hotPlaceRes
            commit('home/setHotPlace',result ? result : [])
        }
    }
})

export default store