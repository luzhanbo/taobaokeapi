<template>
  <van-col span="12" class="item-box" @click="showDetail">
    <div class="item-image">
      <van-image :src="item.url" fit="cover" width="175" height="175" />
    </div>
    <div class="van-ellipsis title"><van-image :src="icon" width="18" height="18"/>{{title}}</div>
    <van-row class="item-info">
      <van-col span="12" class="sub-title">
        优惠券 <span class="fee">¥{{item.quan}}</span>
      </van-col>
      <van-col span="12" class="sub-title right">
        月销量 {{item.sale_num}}
      </van-col>
    </van-row>
    <van-row class="item-info">
      <van-col span="12" class="sub-title">
        <span class="new-price">¥{{item.new_price}}</span>
        <!-- <span class="old-price">{{item.old_price}}</span> -->
      </van-col>
      <van-col span="12" class="sub-title right">
        佣金 <span class="fee">¥{{item.fee}}</span>
      </van-col>
    </van-row>
  </van-col>
</template>
<script>
export default {
  name: "ItemBox",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed:{
      icon(){
          if(this.item.shop_type=='B'){
              return 'https://static.luzhanbo.cn/logo/tm.png'
          }else{
              return 'https://static.luzhanbo.cn/logo/tb.png'
          }
      },
      title(){
        //short_title 有些为：{} 或者 空
        if(this.item.short_title && this.item.short_title.length>5){
          return this.item.short_title
        }else{
          return this.item.title
        }
      }
  },
  methods:{
      showDetail(){
          const id = this.item.item_id 
          this.$router.push(`/detail/${id}`)
      }
  }
};
</script>

<style scoped>
.item-box {
  /* padding: 5px; */
  background-color: white;
  overflow: hidden;
}
.item-image {
  padding:5px;
}
.item-info {
  padding-left: 5px;
  padding-right: 5px;
}
.title {
  color: gray;
  text-align: center;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 14px;
}
.right {
  text-align: right;
}

.new-price {
  font-size: 16px;
  color: red;
}

/* .old-price {
  text-decoration: line-through;
} */
.sub-title {
  font-size: 12px;
  color: grey;
}
.fee {
  font-size: 14px;
  color: red;
}
</style>