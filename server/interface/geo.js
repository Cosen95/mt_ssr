import Router from 'koa-router'
import axios from './utils/axios'

let router = new Router({
    prefix: '/geo'
})

router.get('/getPosition', async(ctx) => {
    let res = await axios.get('https://www.easy-mock.com/mock/5c45c89ffb5b9a1c074671d5/getPosition')
    ctx.body = {
        res
    }
    // if(status === 200) {
    //     ctx.body = {
    //         province,
    //         city
    //     }
    // } else {
    //     ctx.body = {
    //         province: '',
    //         city: ''
    //     }
    // }
})

router.get('/menu', async (ctx) => {
    let res = await axios.get('https://www.easy-mock.com/mock/5c45c89ffb5b9a1c074671d5/getMenu');
    console.log('getMenu接口返回',res)
    // if(status === 200) {
    //     ctx.body = {
    //         menu
    //     }
    // } else {
    //     ctx.body = {
    //         menu: []
    //     }
    // }
})



export default router