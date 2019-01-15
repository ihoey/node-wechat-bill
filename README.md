# node-wechat-bill
微信没有年度账单？怎么破，nodejs自己撸呗~

> 思路来自于 [wechatbill](https://github.com/tombcato/wechatbill)

运行环境：

>node 7.x  
mysql  

开发框架：
>koa2.x  
及相关中间件


## 1、先执行 `init/sql` 目录下的 `wechat.sql` 脚本。  

mysql 执行方法：

>在终端中输入"mysql -u root -p   
输入密码：  
进入Mysql数据库  
输入“source 文件路径*.sql;  
执行*.sql文件，数据库及表即建立完成。

## 2、修改 `config.js` 中的 `mysql` 数据库信息

```js
database: {
  DATABASE: 'wechatbill',
  USERNAME: 'root',
  PASSWORD: '000000',
  PORT: '3306',
  HOST: 'localhost'
}
 ```
## 项目启动后，可以通过接口访问
请求参数如下：
`wechat_id`、`exportkey`、`userroll_encryption`、`userroll_pass_ticket`、`AUTH`、`GUID`、`UA2`、`ClientId`
![](https://cdn.dode.top//tmp/data.png)
