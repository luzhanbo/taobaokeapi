<template>
  <div>
    <van-nav-bar left-text="返回" :title="title" left-arrow @click-left="onHome">
      <van-icon :name="displayType" size="20" slot="right" @click="toggle" />
    </van-nav-bar>

    <div v-if="searchType=='search'">
      <van-search placeholder="请输入商品名称或链接或淘口令" show-action shape="round" v-model="q">
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
      <div v-if="!list">
        <van-row class="tag-line">
          <van-col span="12">
            <div class="tag-title">历史搜索</div>
          </van-col>
          <van-col span="12" style="text-align:right;">
            <van-icon name="delete" size="20" @click="deleteHistory" />
          </van-col>
        </van-row>
        <div class="tag-line">
          <div v-for="w in historys" :key="w" class="tag" @click="onTag(w)">
            <van-tag round color="#eee" text-color="#333">{{w}}</van-tag>
          </div>
        </div>
        <div class="tag-line">
          <div class="tag-title">热门搜索</div>
          <div v-for="w in words" :key="w" class="tag" @click="onTag(w)">
            <van-tag round color="#eee" text-color="#333">{{w}}</van-tag>
          </div>
        </div>
      </div>
    </div>
    <van-dropdown-menu class="condition" v-if="list">
      <van-dropdown-item v-model="sort" :options="sortList" @change="refresh" />
      <van-dropdown-item title="筛选条件" ref="condition">
        <van-switch-cell v-model="need_free_shipment" title="包邮" />
        <van-switch-cell v-model="has_coupon" title="优惠券" />
        <van-switch-cell v-model="is_tmall" title="天猫商品" />
        <van-switch-cell v-model="is_overseas" title="海外商品" />
        <van-switch-cell v-model="need_prepay" title="加入消费者保障" />
        <van-switch-cell v-model="include_rfd_rate" title="退款率是否低于行业均值" />
        <van-switch-cell v-model="include_pay_rate_30" title="成交转化是否高于行业均值" />
        <van-switch-cell v-model="include_good_rate" title="好评率是否高于行业均值" />
        <van-button block type="info" @click="onConfirm">确认</van-button>
      </van-dropdown-item>
    </van-dropdown-menu>
    <!-- <van-divider>共有{{total}}个商品</van-divider> -->
    <div id="container" v-if="list">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-row v-if="displayType=='apps-o'">
          <item-box v-for="item in list" :key="item.item_id" :item="item" />
        </van-row>
        <item-list v-else v-for="item in list" :key="item.item_id" :item="item" />
      </van-list>
    </div>
  </div>
</template>
<script>
import ItemBox from "@/components/ItemBox";
import ItemList from "@/components/ItemList";
import searchInfo from "@/lib/search.json";
import { Toast, Dialog } from "vant";

const root = process.env.root;
const { params, displayType, sortList, words } = searchInfo;

export default {
  components: {
    ItemBox,
    ItemList
  },
  async asyncData({ query, $axios, req, store }) {
    const searchInfo = store.state.searchInfo;
    let result;
    let finished = false 

    if (searchInfo) {
      const { searchType, displayType, total, list } = searchInfo;
      result = { ...searchInfo.params, searchType, displayType, total, list };
      if(total < 15){
        finished = true 
      }
    } else {
      const q = query.q;
      params.q = q;
      result = {
        ...params,
        searchType: "search",
        displayType: "apps-o"
      };
      console.log({root})
      if (q) {
        const ret = await $axios.post(`${root}api/search`, params);
        const { status, data } = ret;
        if (data && data.list) {
          result.list = data.list;
          result.total = data.total;
          result.searchType = "list";
        }
      } else {
        result.list = null;
        result.total = 0;
      }
      store.commit('setSearchInfo',result)
    }
    return {
      ...result,
      sortList,
      words,
      historys:[],
      loading: false,
      finished
    };
  },
  computed: {
    title() {
      if (this.searchType == "list") {
        return this.q;
      } else {
        return "搜索";
      }
    }
  },
  mounted(){
    const historys = localStorage.getItem('historys')
    if(historys){
      this.historys = historys.split(',')
    }
  },
  methods: {
    async onSearch() {
      const q = this.q;
      if (!q) {
        Dialog.alert({
          title: "温馨提示",
          message: "请输入商品名称或链接或淘口令"
        }).then(() => {});
        return;
      }
      
      this.addHistory(q)

      await this.refresh();
    },
    async onTag(q) {
      this.q = q;
      this.addHistory(q)
      await this.refresh();
    },
    addHistory(q){
      const historys = this.historys

      if(!historys.includes(q)){
        historys.push(q)
        localStorage.setItem('historys',historys.join(','))
        this.historys = historys
      }
    },
    deleteHistory(){
      localStorage.removeItem('historys')
      this.historys = []
    },
    async onConfirm() {
      this.$refs.condition.toggle();
      await this.refresh();
    },
    async onLoad() {
      console.log('onLoad...')
      await this.refresh(true);
      this.loading = false;
    },
    async refresh(loadMore) {
      this.$nuxt.$loading.start();
      try {
        const params = {
          q:this.q,
          fields:this.fields,
          page_no: loadMore?this.page_no + 1:1 ,
          page_size:this.page_size,
          need_free_shipment:this.need_free_shipment,
          has_coupon:this.has_coupon,
          sort:this.sort,
          is_tmall: this.is_tmall,
          is_overseas: this.is_overseas,
          need_prepay: this.need_prepay,
          include_good_rate: this.include_good_rate,
          include_rfd_rate: this.include_rfd_rate,
          include_pay_rate_30: this.include_pay_rate_30
        }
        const ret = await this.$axios.post(`${root}api/search`, params);
        const { status, data } = ret;
        const list = data.list ? data.list : [];
        if (list.length <15) {
          this.finished = true;
        }
        if (loadMore) {
          this.list = this.list.concat(list);
          this.page_no = params.page_no;
        } else {
          this.list = list;
        }
        
        const searchInfo = {
          params,
          searchType: this.searchType,
          displayType: this.displayType,
          total: this.total,
          list: this.list
        };
        this.$store.commit("setSearchInfo", searchInfo);
      } catch (e) {
        Toast(e.message);
      }
      this.$nuxt.$loading.finish();
    },
    onHome() {
      this.$router.replace("/");
    },
    toggle() {
      if (this.displayType == "apps-o") {
        this.displayType = "notes-o";
      } else {
        this.displayType = "apps-o";
      }
    }
  }
};
</script>
<style scoped>
#container {
  margin: 5px;
}
.button {
  text-align: center;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
}
.condition {
  background-color: #eee;
}

.tag-line {
  margin-left: 20px;
  margin-right: 20px;
}

.tag-title {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 14px;
}
.tag {
  padding: 5px;
  display: inline-block;
}
</style>