# mt_ssr 

## 基于nuxt实现的ssr电商管理后台

## 命令介绍

1.`yarn install`
  * 安装所有依赖

2.`yarn run dev`
  * 启动本地服务

3.`yarn run lint-fix`
  * 自动fix eslint问题 
  
## 项目依赖

### koa

#### koa-generator
1.安装 
`yarn global add koa-generator`
2.创建项目
`koa2 -e project-name` （使用ejs模板）

#### koa中间件

1.`koa-generic-session`
2.`koa-redis`

#### koa-router

#### cookie和session

### mongodb
1.安装及介绍
参考文档：https://segmentfault.com/a/1190000016977614
2.mongodb可视化工具RoBo 3T安装及使用
安装地址：https://robomongo.org/
3.mongoose
文档地址：https://mongoose.kkfor.com/quickstart.html

### redis
1.安装及介绍
参考文档：http://www.runoob.com/redis/redis-install.html
2.启用redis服务
打开一个 cmd 窗口 使用 cd 命令切换目录到 C:\redis 运行：`redis-server.exe redis.windows.conf`
再打开一个cmd窗口，在相同目录下运行：`redis-cli.exe -h 127.0.0.1 -p 6379`

### nuxt.js
1.安装及运行(首次运行可能报错，最新版本会有问题，降低nuxt版本到1.4.2即可)
* `yarn add npx`
* `npx create-nuxt-app <项目名>` 或 `yarn create nuxt-app <项目名>`
* `yarn run dev`启动项目

2.nuxt框架存在问题
* nuxt本身不支持es6语法（import/export）
解决方法：修改package.json中的scripts字段
```
"scripts": {
    "dev": "cross-env NODE_ENV=development nodemon server/index.js --watch server --exec babel-node",
    "start": "cross-env NODE_ENV=production node server/index.js --exec babel-node",
  },

```
并且增加.babelrc文件（安装babel-preset-es2015和babel-cli依赖）
```
{
    "presets": ["es2015"]
}

```
参考文档：http://www.hangge.com/blog/cache/detail_1690.html
https://www.jb51.net/article/120001.htm

* 项目中采用scss的话需要单独安装sass-loader和node-sass
`yarn add sass-loader node-sass`

3.配置相关（`nuxt.config.js`）
```
/*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/reset.css',
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/main.css'
  ],
```

## 项目结构

### layouts
`default.vue`
```
<template>
  <el-container class="layout-default">
    <el-header height="197px">
      <my-header />
    </el-header>
    <el-main>
      <nuxt/>
    </el-main>
    <el-footer height="100%">
      <my-footer/>
    </el-footer>
  </el-container>
</template>

<script>
import MyHeader from '@/components/public/header/index.vue'
import MyFooter from "@/components/public/footer/index.vue"
export default {
  components: {
    MyHeader,
    MyFooter
  }
}
</script>

<style>

</style>

```

### pages
`index.vue`
```
<template>
  <div class="page-index">
    <el-row>
      <el-col :span="5">
        <emenu/>
      </el-col>
      <el-col :span="19">
        <life/>
      </el-col>
    </el-row>
    <el-row :span="24">
      <artistic/>
    </el-row>
  </div>
</template>

<script>
import Emenu from '@/components/index/menu.vue'
import Life from '@/components/index/life.vue'
import Artistic from '@/components/index/artistic.vue'
export default {
  components: {
    Emenu,
    Life,
    Artistic
  }
}
</script>

<style lang="scss">
   @import "@/assets/css/index/index.scss";
</style>


```

### components
`components/public/header/index.vue`
```
<template>
  <div class="m-header">
    <el-row>
      <el-col>
        <top-bar/>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <search-bar/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import topBar from './topbar.vue'
import searchBar from './searchbar.vue'
export default {
    components: {
        topBar,
        searchBar
    }
}
</script>

<style lang="scss">
    @import "@/assets/css/public/header/index.scss";    
</style>

```

## 接口设计

### 登录注册相关接口实现

* 需要开启腾讯邮箱POP3/SMTP服务和IMAP/SMTP服务
* 登录注册需要用到crypto-js中的MD5加密

#### 数据库、redis、邮箱服务（smtp）相关配置
`server/dbs/config.js`
```
export default {
    dbs: 'mongodb://127.0.0.1:27017/student',
    redis: {
        get host(){
            return '127.0.0.1'
        },
        get port(){
            return 6379
        }
    },
    smtp: {
        get host(){
            return 'smtp.qq.com'
        },
        get user(){
            return '1263215592@qq.com'
        },
        get pass(){
            return 'fbqerqpaibrpbaga'
        },
        get code(){
            return () => {
                return Math.random().toString(16).slice(2,6).toUpperCase()
            }
        },
        get expire(){
            return () => {
                return new Date().getTime()+60*60*1000
            }
        }
    },
}

```

#### 数据库模型创建(采用mongoose)
`server/dbs/models/users.js`
```
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
})

export default mongoose.model('User',UserSchema)

```

#### 接口相关utils函数封装
`server/interface/utils/axios.js`
```
import axios from 'axios'

const instance = axios.create({
    baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
    timeout: 1000,
    headers: {

    }
})

export default instance

```

`server/interface/utils/passport.js`
```
import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users'

passport.use(new LocalStrategy(async function(username,password,done){
    let where = {
        username
    };
    let result = await UserModel.findOne(where)
    if (result !== null) {
        if (result.password === password) {
            return done(null,result)
        } else {
            return done(null,false,'密码错误')
        }
    } else {
        return done(null,false,'用户不存在')
    }
}))

// 序列化
passport.serializeUser(function(user,done){
    done(null,user)
})

// 反序列化
passport.deserializeUser(function(user,done){
    return done(null,user)
})

export default passport

```
#### 接口实现
`server/interface/users.js`
```
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

// 注册接口
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


// 登录接口
router.post('/signin', async (ctx,next) => {
    return Passport.authenticate('local', function(err,user,info,status){
        if(err) {
            ctx.body = {
                code: -1,
                msg: err
            }
        } else {
            if(user) {
                ctx.body = {
                    code: 0,
                    msg: '登录成功',
                    user
                }
                return ctx.login(user)
            } else {
                ctx.body = {
                    code: 1,
                    msg: info
                }
            }
        }
    })(ctx,next)
})

// 邮箱验证接口
router.post('/verify', async (ctx, next) => {
    let { username } = ctx.request.body.username
    const saveExpire = await Store.hget(`nodemail:${username}`,'expire')
    if(saveExpire && new Date().getTime() - saveExpire < 0) {
        ctx.body = {
            code: -1,
            msg: '验证请求过于频繁，1分钟内1次'
        }
        return false
    }
    let transporter = nodeMailer.createTransport({
        host: Email.smtp.host,
        port: 587,
        secure: false,
        auth: {
            user: Email.smtp.user,
            pass: Email.smtp.pass
        }
    })
    let ko = {
        code: Email.smtp.code(),
        expire: Email.smtp.expire(),
        email: ctx.request.body.email,
        user: ctx.request.body.username
    }
    let mailOptions = {
        from: `“认证邮件” <${Email.smtp.user}>`,
        to: ko.email,
        subject: '《nuxt全栈站点》注册码',
        html: `您在《nuxt全栈站点》注册，您的邀请码是${ko.code}`
    }
    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.log('error')
        } else {
            Store.hmset(`nodemail:${ko.user}`,'code',ko.code,'expire',ko.expire,'email',ko.email)
        }
    })
    ctx.body = {
        code: 0,
        msg: '验证码已发送，可能会有延时，有效期1分钟'
    }
})

// 退出（注销）接口
router.get('/exit', async (ctx, next) => {
    await ctx.logout()
    if (!ctx.isAuthenticated()) {
        ctx.body = {
            code: 0
        }
    } else {
        ctx.body = {
            code: -1
        }
    }
})

// 获取用户信息接口
router.get('/getUser', async (ctx) => {
    if(ctx.isAuthenticated()) {
        const { username, email } = ctx.session.passport.user
        ctx.body = {
            user: username,
            email
        }
    } else {
        ctx.body = {
            user: '',
            email: ''
        }
    }
})

export default router


```
#### 接口配置
`server/index.js`
```
+import mongoose from 'mongoose'
+import bodyParser from 'koa-bodyparser'
+import session from 'koa-generic-session'
+import Redis from 'koa-redis'
+import json from 'koa-json'
+import dbConfig from './dbs/config'
+import passport from './interface/utils/passport'
+import users from './interface/users'

+app.keys = ['mt', 'keyskeys']
+app.proxy = true
+app.use(session({
  key: 'mt',
  prefix: 'mt:uid',
  store: new Redis()
}))

+app.use(bodyParser({
  extendTypes: ['json', 'form', 'text']
}))
+app.use(json())

+mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})
+app.use(passport.initialize())
+app.use(passport.session())

+app.use(users.routes()).use(users.allowedMethods())


```