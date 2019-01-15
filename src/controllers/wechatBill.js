const axios = require('axios')
const { parseTime } = require('../../util')
const { query } = require('../../util/db')
const PAGE_SIZE = 50

const sleep = (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const wechatList = []

module.exports = async (ctx) => {

  const {
    wechat_id,
    exportkey,
    userroll_encryption,
    userroll_pass_ticket,
    AUTH = '',
    GUID = '',
    UA2 = '',
    ClientId = ''
  } = ctx.request.body

  let lastResp = {}
  let Loop = true


  if (wechatList.includes(wechat_id)) {
    ctx.body = {
      code: 1,
      res: 'wechatId异常或冲突，创建任务失败...'
    }
    return false
  }

  while (Loop) {

    if (lastResp.last_create_time < 1514736000) {
      wechatList.splice(wechatList.indexOf(wechat_id) >>> 0, 1)
      Loop = false
      console.log('任务处理完毕，2018全部数据已存入');
    }

    axios.request({
      url: `https://wx.tenpay.com/userroll/userrolllist`,
      method: 'get',
      headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,en-US;q=0.8",
        "Connection": "keep-alive",
        "Cookie": `userroll_encryption=${userroll_encryption}; userroll_pass_ticket=${userroll_pass_ticket}`,
        "Host": "wx.tenpay.com",
        "Q-Auth": AUTH,
        "Q-GUID": GUID,
        "Q-UA2": UA2,
        "Referer": "https://wx.tenpay.com/?classify_type=0",
        "User-Agent": "Mozilla/5.0 (Linux; Android 8.0; MIX 2 Build/OPR1.170623.027; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044408 Mobile Safari/537.36 MMWEBID/4508 MicroMessenger/7.0.1380(0x27000038) Process/tools NetType/WIFI Language/zh_CN",
        "X-DevTools-Emulate-Network-Conditions-Client-Id": ClientId,
        "X-Requested-With": "com.tencent.mm",
      },
      params: {
        classify_type: 0,
        count: PAGE_SIZE,
        exportkey,
        last_bill_id: lastResp.last_bill_id,
        last_bill_type: lastResp.last_bill_type,
        last_create_time: lastResp.last_create_time,
        last_trans_id: lastResp.last_trans_id,
        sort_type: 1,
        start_time: lastResp.start_time,
      }

    }).then((res) => {

      lastResp = res.data

      if (!lastResp || lastResp.ret_code != 0 || !lastResp.record) {
        console.log(lastResp);
        Loop = false
        ctx.body = {
          code: 2,
          res: lastResp.ret_msg || '任务请求失败'
        }
        throw new Error(`任务请求失败`)
      }

      ctx.body = {
        code: 0,
        res: '创建任务成功，正在获取账单中...'
      }

      const dataList = res.data.record.map(e => ({ wechat_id, ...e }))
      dataList.map(async e => {
        delete e.coupon
        const sql = `INSERT INTO orders(${Object.keys(e)}) VALUES (${JSON.stringify(Object.values(e))})`
        const data = await query(sql.replace(/\[|\]/g, ""))
        console.log(`存入成功`, data.insertId)
      })

    }).catch((err) => {
      console.log(err)
    });
    await sleep(1000)
  }
}
