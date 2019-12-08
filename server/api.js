const rp = require('request-promise')
const dayjs = require('dayjs')
const getReturnRate = require('./getReturnRate')

const root = 'https://api.taobaokeapi.com/'

const { usertoken, site_id, adzone_id } = require('./config')

const round = (v) => {
    return Math.round(v * 100) / 100
}

/*
找到指定文本中的淘口令，没有返回空串
*/
const findTkl = (text) => {
    const regTkl = /[a-zA-Z0-9]{11}/
    const len = text.length
    if (len.length < 13) {
        return ''
    }
    for (let i = 0; i < len - 12; i++) {
        const st = text.substr(i, 1)
        const et = text.substr(i + 12, 1)
        const token = text.substr(i + 1, 11)
        if (((st === et) || (st === '(' && et === ')') || (st === '（' && et === '）') || (st === '[' && et === ']')) && regTkl.test(token)) {
            return st + token + et
        }
    }
    return ''
}

const getItemUrl = (item_id) => {
    return `https://item.taobao.com/item.htm?id=${item_id}`
}

const getTbkUrlResult = async (name, params) => {
    const url = `${root}?usertoken=${usertoken}&method=${name}`
    const result = await rp(url, { method: 'POST', json: true, body: params })
    console.log(result)

    return result
}

const getShopTitle = (title) => {
    if (title && !title.length) {
        return '未知'
    }
    if (title && title.length > 15) {
        const temps = title.split(' ')
        return temps[0]
    }
    return title
}

const mapItem = (item, fields) => {
    const category_id = item.category_id
    const commission_rate = (item.commission_rate - 0) / 10000
    const item_id = item.item_id - 0
    const item_url = item.item_url
    const pict_url = item.pict_url
    const url = pict_url + '_240x240.jpg'   //小图用于列表显示
    const post_fee = item.real_post_fee - 0
    const title = item.title
    const short_title = item.short_title
    const sale_num = item.volume - 0
    const shop_type = item.user_type == '1' ? 'B' : 'C'
    const quan = item.coupon_amount ? (item.coupon_amount - 0) : 0
    const old_price = item.zk_final_price - 0
    const new_price = round(old_price - quan)
    const fee = Math.round(commission_rate * 100 * new_price) / 100
    const rate = getReturnRate(fee*0.9)
    const total = round(rate*fee*0.9)
    let share_url = quan == 0 ? item.url : item.coupon_share_url
    const shop_title = getShopTitle(item.shop_title)
    const city = item.provcity
    if (share_url.startsWith('//')) {
        share_url = 'https:' + share_url
    }
    const info = {
        category_id, commission_rate, share_url, item_id, item_url, shop_title, city,
        pict_url, url, post_fee, title, short_title, sale_num, shop_type, quan, 
        old_price, new_price, fee,total
    }
    if (fields) {
        const ret = {}
        for (let i = 0; i < fields.length; i++) {
            const fname = fields[i]
            ret[fname] = info[fname]
        }
        return ret
    } else {
        return info
    }
}

/*
淘口令转商口ID
*/
const getIdFromTkl = async (text) => {
    const params = { password_content: text, site_id, adzone_id }
    return await getTbkUrlResult('taobao.tbk.sc.tpwd.convert', params)
}

/*
获取全网淘客商品
*/
const search = async (params) => {
    const regUrl = /.*?https:.*?id=(\d+).*/
    const st = new Date()

    let list
    let total = 0
    let tryTime = 0
    const fields = params.fields
    delete params.fields
    const q = params.q
    if (q && findTkl(q)) {  //包含淘口令
        const ret = await getIdFromTkl(q)
        const { data } = ret
        if (!data) {
            return {}
        }
        params = { q: getItemUrl(data.num_iid), page_size: 1 }
    } else if (q && q.match(regUrl)) {
        params = { q: getItemUrl(q.replace(regUrl, '$1')), page_size: 1 }
    }
    params.site_id = site_id
    params.adzone_id = adzone_id
    while (tryTime < 2) {
        tryTime++
        const { result_list, total_results, code, sub_code ,msg  } = await getTbkUrlResult('taobao.tbk.sc.material.optional', params)
        if (result_list) {
            total = total_results - 0
            const data = result_list.map_data
            if (data.length) {
                list = data
            } else {
                list = [data]
            }
            break
        } else if (code == '15' && sub_code == '50001') {
            console.log('重试一次')
            continue
        }else{   //出错信息
            console.log(msg)
        }
    }
    const lastTime = (new Date()) - st
    if (list) {
        list = list.map(item => mapItem(item, fields))
    }
    return { total, list, lastTime }
}

/*
生成推广短链接
*/
const shortUrl = async (url) => {
    const params = { url }
    const ret = await getTbkUrlResult('taobao.tbk.spread.get', params)
    return ret.results.tbk_spread.content
}

/*
生成淘口令
*/
const tkl = async ({ text, url, logo }) => {
    const params = {
        text, url, logo
    }
    const ret = await getTbkUrlResult('taobao.tbk.tpwd.create', params)
    return ret.data.model
}

/*
获取指定商品ID的详情信息
*/
const detail = async (item_id) => {
    const st = new Date()
    const item_url = getItemUrl(item_id)
    const params = {
        q: item_url
    }
    const ret = await search(params)
    if (ret.total == 1) {
        const item = ret.list[0]
        const text = item.title
        const url = item.share_url
        const logo = item.url
        const results = await Promise.all([shortUrl(url), tkl({ text, url, logo })])
        item.share_url = results[0]
        item.tkl = results[1]
        const lastTime = (new Date()) - st
        item.lastTime = lastTime
        return item
    }
}

/*
获取指定商品ID的详情信息，同时获取相似商品（根据同一分类下相同标题来找查，按佣金比从高到低排
*/
const detailWithRelates = async ({ item_id, total }) => {
    const st = new Date()
    const item = await detail(item_id)

    const cat = item.category_id
    const q = item.title
    const fields = ['item_id', 'title', 'quan', 'new_price', 'total', 'url', 'post_fee', 'city', 'shop_title']
    const params = { cat, q, page_size: total, fields, sort: 'tk_rate_des' }
    const p1 = search(params)
    const p2 = search({ ...params, need_free_shipment: true })   // 优先包邮
    const results = await Promise.all([p1, p2])
    const list1 = results[0].list
    const list2 = results[1].list
    const list = []
    if (list2.length > 0) {
        for (let i = 0; i < list2.lengt; i++) {
            const it = list2[i]
            if (it.item_id != item_id) {
                list.push(it)
            }
        }
    }
    const rest = total - list.length
    for (let i = 0; i < rest; i++) {
        if (list1 && list1.length > i) {
            const it = list1[i]
            if (it.item_id != item_id) {
                list.push(it)
            }
        }
    }
    const lastTime = (new Date()) - st
    return {
        item, list, lastTime
    }
}

/*
同步订单

flag = all 同步本月及上个月的所有订单
flag = day 同步指日期一天的订单，需要传 y年 m月 d日
flag = time 同步指定一个时间段的订单，平时不超过3小时；如618、双11、年货节等大促期间不超过20分钟，
        需要指定 start_time enc_time ，时间格式为 YYYY-MM-DD HH:mm:ss
flag = new 或者不传，同步最近30分钟的订单，一般用于新订单检查 
*/
const syncOrder = async({flag,y,m,d,start_time,end_time})=>{
    if(flag=='all'){   
        return await syncLastMonthOrder()
    }else if(flag=='day'){
        return await syncOneDayOrder({y,m,d})
    }else if(flag=='time'){
        const st = new Date()
        const orders =  await syncOneTimeOrder({start_time,end_time})
        const lastTime = (new Date()) - st 
        return {lastTime,orders}
    }else{
        return await syncNewOrder()
    }
}

/*
同步一天的订单
*/
const syncOneDayOrder = async({y,m,d})=>{
    const st = new Date()
    const stime = dayjs(`${y}-${m}-${d}`).startOf('day')
    const et = stime.endOf('day')
    let time = stime 
    let orders = []
    while(time.isBefore(et)){
        const start_time = formatTime(time)
        time = time.add(3,'hour')
        const end_time = formatTime(time)
        const list = await syncOneTimeOrder({start_time,end_time})
        orders = orders.concat(list)
    }
    const lastTime = (new Date()) - st 
    return {lastTime,orders}
}
/*
同下过去一个月的订单
*/
const syncLastMonthOrder = async()=>{
    const st = new Date()
    const stime = dayjs()
    const et = stime.subtract(1,'month').startOf('month')
    let time = stime 
    let orders = []
    let times = 0
    while(time.isAfter(et)){
        const end_time = formatTime(time)
        time = time.subtract(3,'hour')
        const start_time = formatTime(time)
        console.log({start_time,end_time})
        times++
        const list = await syncOneTimeOrder({start_time,end_time})
        orders = orders.concat(list)
    }
    console.log({times})
    const lastTime = (new Date()) - st 
    return {lastTime,orders}
}

/*
同步新订单 
*/
const syncNewOrder = async ()=>{
    const now  = dayjs()
    const start_time = formatTime(now.subtract(3,'hour'))
    const end_time = formatTime(now)
    const st = new Date()
    const orders =  await syncOneTimeOrder({start_time,end_time})
    const lastTime = (new Date()) - st 
    return {orders,lastTime}
}

/*
同步一个时间段的订单，20分钟，或者3小时
*/
const syncOneTimeOrder = async ({start_time,end_time,page_no,position_index}) => {
    const params = {
        page_size: 10,
        start_time,
        end_time,
        page_no:page_no?(page_no-0):1
    }
    if(position_index){
        params.position_index = position_index
    }
    // console.log(params)
    const ret = await getTbkUrlResult('taobao.tbk.sc.order.details.get', params)
    // console.log(ret)
    const { data } = ret
    let orders = []
    if (data) {
        const {has_next,position_index,page_no,results} = data 
        if(results){
            const publisher_order_dto = results.publisher_order_dto
            const list = publisher_order_dto.length?publisher_order_dto:[publisher_order_dto]
            orders = list.map(item => mapOrder(item))
        }
        if(has_next=='true'){
            const list = await syncOneTimeOrder({position_index,page_no:(page_no-0)+1,start_time,end_time})
            orders = orders.concat(list)
        }
    }
    return orders
}


const formatTime = (t) => {
    return t.format('YYYY-MM-DD HH:mm:ss')
}

const mapOrder = (order) => {
    const { site_id, adzone_id, alipay_total_price, item_id, item_img, item_num, item_title,
        order_type, pub_share_fee, pub_share_pre_fee, refund_tag, tk_create_time, tk_status, trade_id, trade_parent_id } = order
    const ret =
    {
        site_id,
        adzone_id,
        alipay_total_price:(alipay_total_price-0),
        item_id,
        item_img,
        item_num:(item_num-0),
        item_title,
        order_type,
        pub_share_fee:(pub_share_fee-0),
        pub_share_pre_fee:(pub_share_pre_fee-0),
        refund_tag:(refund_tag-0),
        create_time:dayjs(tk_create_time).toDate(),
        tk_status:(tk_status-0),
        trade_id,
        trade_parent_id
    }
    return ret
}

module.exports = {
    search, detail, detailWithRelates, syncOrder
}