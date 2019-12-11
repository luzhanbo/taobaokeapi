# 淘宝客API演示

> 淘宝客API演示，请扫下面二维码进行体验

![demo](images/qrcode.png)

## 涉及的淘宝客API
+ [获取全网淘客商品](http://www.taobaokeapi.com/doc/taobao.tbk.sc.material.optional.html)
+ [淘口令生成](http://www.taobaokeapi.com/doc/taobao.tbk.tpwd.create.html)
+ [淘口令解析&转链](http://www.taobaokeapi.com/doc/taobao.tbk.sc.tpwd.convert.html)
+ [所有订单查询](http://www.taobaokeapi.com/doc/taobao.tbk.sc.order.details.get.html)

## 使用技术

+ nodejs
+ nuxt.js
+ vant 

## 安装步骤

### 下载源码

``` bash
git clone https://github.com/luzhanbo/taobaokeapi.git
```

### 修改配置
1. nuxt.config.js 最后的环境参数，前端的访问地址
``` json
{
    "env":{
        "root":"[需要修改]前端的访问地址，如http://localhost:3000/"
    }
}
```

2. 修改 server/config.js 的配置
+ 通过[https://api.taobaokeapi.com/?tbklogin=1](https://api.taobaokeapi.com/?tbklogin=1) 获取到的usertoken
+ 淘宝联盟的一个推广位信息，包括 site_id 和 adzone_id 

### 运行命令

``` bash
# 安装依赖模块
使用yarn 安装
$ yarn install

使用npm 安装 
$ npm install

# 启动项目，可通过这个地址访问， http://localhost:3000/
使用yarn 运行
$ yarn dev

使用npm 运行
$ npm dev  

# 部署线上环境，先用以下命令构建，然后使用pm2 start进行部署 
使用yarn 构建 
$ yarn build

使用npm 构建
$ npm build 

$ pm2 start 

```

## 界面演示

> 淘宝客API演示-分类及商品详情页

![分类](images/demo1.jpg)

> 淘宝客API演示-商品列表页

![商品列表1](images/demo2.jpg)

## 更多功能关注《陆陆购》公众号体验

![陆陆购](https://static.luzhanbo.cn/qrcode/qrcode_pc.jpg)

## 联系我 
+ QQ：61315986
+ 留言：淘宝客API 