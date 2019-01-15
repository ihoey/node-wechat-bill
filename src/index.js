const Koa = require('koa')
const KoaRouter = require('koa-router')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')
const config = require('../config')

const app = new Koa()
// 创建 router 实例对象
const router = new KoaRouter()
const wechatBill = require('./controllers/wechatBill')

// session存储配置
const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))

// 配置控制台日志中间件
app.use(koaLogger())

// 配置ctx.body解析中间件
app.use(bodyParser())

//注册路由
router.get('/', async ctx => {
  ctx.body = 'welcome~'
})

router.post('/wechatBill', wechatBill)

// 添加路由中间件
app.use(router.routes())

// 对请求进行一些限制处理
app.use(router.allowedMethods())

// 监听启动端口
app.listen(config.port)
console.log(`the server is start at port ${config.port}`)
