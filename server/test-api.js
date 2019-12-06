const api = require('./api')
const rp = require('request-promise')

const log = console.log

const itemId = '556114422870'
const itemNo = '609047593417'
const url = 'https://item.taobao.com/item.htm?id=556114422870'
const url2 = 'https://detail.tmall.com/item.htm?id=556114422870'
const tkl = '【加绒加厚打底衫女2019洋气秋冬宽松白色磨毛时尚中长米奇长袖t恤】，復zんíゞ这句话¢8ujYYyTqY3b¢后咑閞淘灬寳'
const tkl1 = '$gPKlYCbheXE$'
const keyword = '加绒加厚打底衫女2019洋气秋冬宽松白色磨毛时尚中长米奇长袖t恤'

//"综合","女装", "男装","母婴","食品","内衣","家居家装", "鞋包配饰","美妆个护","数码家电","运动户外"
const test = async()=>{
    // return await api.search({q:keyword,sort:'tk_rate_des'})
    // return await api.getJxList({material_id:3761})
    // return ( await api.getCats())

    // const url = ' http://api.web.21ds.cn/platform/getTbCategory?apkey=ceb27b54-7ebe-3d05-1095-a79bf893061b'
    // const list = JSON.parse(await rp(url))
    // return list.data.length

    return await api.getJuList({current_page:1,page_size:20,taobao_category_id:16})
}


test().then(log).catch(log)

