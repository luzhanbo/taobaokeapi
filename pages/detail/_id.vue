<template>
  <div id="main">
    <van-nav-bar left-text="返回" title="商品详情" left-arrow @click-left="onBack" />
    <div v-if="item">
      <div>
        <van-image :src="item.pict_url" />
      </div>
      <div id="title">
        <van-image :src="icon" width="20" height="20" />
        {{item.title}}
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
          优惠券 <span class="fee">¥ {{item.quan}}</span>
        </van-col>
        <van-col span="7" class="sub-title right">
          佣金
          <span class="fee">¥{{item.fee}}</span>
        </van-col>
      </van-row>
      <div v-if="list && list.length>1">
        <div class="relate">相似商品</div>
        <item-list v-for="i in list" :key="i.item_id" :item="i" />
      </div>
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" text="客服" @click="onClickIcon" />
        <van-goods-action-icon icon="cart-o" text="购物车" @click="onClickIcon" />
        <van-goods-action-button type="warning" text="加入购物车" @click="onClickButton" />
        <van-goods-action-button
          type="danger"
          text="立即购买"
          @click.stop="copyOk=true"
          v-clipboard:copy="item.tkl"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        />
      </van-goods-action>
    </div>
    <div v-else class="notFoundInfo">
       商品已下架或者商品已退出淘宝联盟推广
    </div>
  </div>
</template>
<script>
import { Toast, Dialog } from "vant";
import ItemList from "@/components/ItemList";

const root = process.env.root;

export default {
  components: {
    ItemList
  },
  async asyncData({ params, $axios, req }) {
    const item_id = params.id;
    const ret = await $axios.post(`${root}api/detail`, { item_id, total: 10 });
    return {
      ...ret.data,
      copyOk: false
    };
  },
  computed: {
    icon() {
      if (this.item.shop_type == "B") {
        return "https://static.luzhanbo.cn/logo/tm.png";
      } else {
        return "https://static.luzhanbo.cn/logo/tb.png";
      }
    }
  },
  methods: {
    onBack() {
      this.$router.back();
    },
    onClickIcon() {
      Toast("功能暂未实现");
    },
    onClickButton() {
      Toast("功能暂未实现");
    },
    onCopy(e) {
      Dialog.alert({
        title: "温馨提示",
        message: "淘口令已粘贴，打开淘宝APP购买"
      }).then(() => {
        // on close
      });
    },
    onError(e) {
      alert("拷贝失败");
    }
  }
};
</script>

<style scoped>
#main {
  margin-bottom: 50px;
}
#title {
  font-size: 16px;
  color:#555;
  padding-left: 10px;
  padding-right: 10px;
}

.item-info {
  padding: 5px;
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
  font-size: 20px;
  color: red;
}

.old-price {
  text-decoration: line-through;
}
.sub-title {
  font-size: 14px;
  color: grey;
}
.fee {
  font-size: 18px;
  color: red;
}
.relate {
  height: 48px;
  line-height: 48px;
  color: chocolate;
  font-size: 16px;
  text-align: center;
  background-color: #eee;
}
</style>