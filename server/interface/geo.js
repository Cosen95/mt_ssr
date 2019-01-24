import Router from 'koa-router'
import axios from './utils/axios'
import Province from '../dbs/models/province'
import Menu from '../dbs/models/menu'

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
    const result = await Menu.findOne()
    ctx.body = {
        menu: result.menu
    }
    let res = await axios.get('https://www.easy-mock.com/mock/5c45c89ffb5b9a1c074671d5/getMenu');
})

router.get('/province', async (ctx) => {
    let province = await Province.find()
    ctx.body = {
        province: province.map(item => {
            return {
                id: item.id,
                name: item.value[0]
            }
        })
    }
})



export default router