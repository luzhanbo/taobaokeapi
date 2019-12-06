<template>
  <div class="list-item">
    <div class="item-box" @click="showDetail" >
      <div class="item-image">
        <van-image :src="item.url" />
      </div>
      <div class="item-detail">
        <div class="van-multi-ellipsis title">
          <van-image :src="icon" width="18" height="18" />
          {{title}}
        </div>
        <van-row class="item-info">
          <van-col class="sub-title" span="16">{{item.shop_title}} {{item.city}}</van-col>
          <van-col class="sub-title right" span="8">月销量：{{item.quan}}</van-col>
        </van-row>
        <van-row class="item-info">
          <van-col span="9" class="sub-title">
            <span class="new-price">¥{{item.new_price}}</span>
            <span class="old-price">{{item.old_price}}</span>
          </van-col>
          <van-col class="sub-title" span="8">
            优惠券<span class="fee">¥ {{item.quan}}</span>
          </van-col>
          <van-col span="7" class="sub-title right">
            佣金
            <span class="fee">¥{{item.fee}}</span>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ItemList",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    icon() {
      if (this.item.shop_type == "B") {
        return "https://static.luzhanbo.cn/logo/tm.png";
      } else {
        return "https://static.luzhanbo.cn/logo/tb.png";
      }
    },
      title(){
        //short_title 有些为：{}
        if(this.item.short_title && this.item.short_title.length>5){
          return this.item.short_title
        }else{
          return this.item.title
        }
      }
  },
  methods: {
    showDetail() {
      const id = this.item.item_id;
      this.$router.push(`/detail/${id}`);
    }
  }
};
</script>

<style scoped>
.list-item {
  background-color: white;
  padding: 5px;
  margin-bottom: 1px;
}
.item-box {
  display: flex;
  flex-direction: row;
}
.item-image {
  width: 90px;
  height: 90px;
  overflow: hidden;
}
.item-detail {
  /* margin-left: 5px; */
  flex: 1;
}
.item-info {
  padding: 5px;
}
.title {
  color: #555;
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

.old-price {
  text-decoration: line-through;
}
.sub-title {
  font-size: 12px;
  color: grey;
}
.fee {
  font-size: 14px;
  color: red;
}
</style>