const api = require('./api')

const get_client_ip = function (req) {
    var ipStr = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    var ipReg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    if (ipStr.split(',').length > 0) {
        ipStr = ipStr.split(',')[0]
    }
    var ip = ipReg.exec(ipStr);
    return ip[0];
};

const main = (app)=>{
    app.post('/api/test',(req,res)=>{
        console.log(req.body)
        res.json(req.body)
    })
  
    app.post('/api/search', async (req, res) => {
        const ret = await api.search(req.body)
        res.json(ret)
    })
    app.post('/api/detail',async (req,res)=>{
        const {item_id,total} = req.body 
        let ret 
        if(total){
            ret  = await api.detailWithRelates(req.body)
        }else{
            ret = await api.detail(item_id)
        }
        
        res.json(ret)
    })    
}

module.exports = main 