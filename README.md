# 淘宝客API演示

> 淘宝客API演示

## 安装步骤

### 下载源码

``` bash
git clone https://github.com/luzhanbo/taobaokeapi.git
```

### 修改配置
1. nuxt.config.js 最后的环境参数，前端的访问地址
``` json
{
    env:{
        root:'[需要修改]前端的访问地址，如http://localhost:3000/'
    }
}
```

2. 修改 server/config.js 的配置
+ 通过[https://api.taobaokeapi.com/?tbklogin=1](https://api.taobaokeapi.com/?tbklogin=1) usertoken
+ 淘宝联盟的一个推广位信息，包括 site_id 和 adzone_id 

### 运行命令

``` bash
# 安装依赖模块
$ yarn install

# 启动项目，可通过这个地址访问， http://localhost:3000/
$ yarn dev

# 部署线上环境，先用以下命令构造，然后使用pm2 start进行部署 
$ yarn build
$ pm2 start 

```
