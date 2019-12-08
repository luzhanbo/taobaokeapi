const api = require('./api')

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