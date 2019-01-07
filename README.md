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