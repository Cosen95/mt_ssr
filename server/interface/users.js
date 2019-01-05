import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from './utils/axios'

let router = new Router({
    prefix: '/users'
})

let Store = new Redis().client

router.post('/signup',async (ctx) => {
    const { username, password, email, code } = ctx.request.body;

    if(code) {
        const saveCode = await Store.hget(`nodemail:${username}`,'code')
        const saveExpire = await Store.hget(`nodemail:${username}`,'expire')
        if(code === saveCode) {
            if(new Date().getTime() - saveExpire > 0) {
                ctx.body = {
                    code: -1,
                    msg: '验证码已过期，请重新尝试'
                }
                return false
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '请填写正确的验证码'
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '请填写验证码'
        }
    }

    let user = await User.find({
        username
    })
    if(user.length) {
        ctx.body = {
            code: -1,
            msg: '已被注册'
        }
        return
    }
    let nuser = await User.create({
        username,
        password,
        email
    })
    if(nuser) {
        let res = await axios.post('/users/signin', {
            username,
            password
        })
        if (res.data && res.data.code === 0) {
            ctx.body = {
                code: 0,
                msg: '注册成功',
                user: res.data.user
            }
        } else {
            ctx.body = {
                code: -1,
                msg: 'error'
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '注册失败'
        }
    }
})