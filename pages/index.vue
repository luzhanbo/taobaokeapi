<template>
  <div>
    <van-nav-bar title="分类"/>
    <van-search placeholder="请输入商品名称或链接或淘口令" @click="search" />
    <van-tree-select height="100%" :items="items" :main-active-index.sync="catIndex" @click-nav="changeCat">
      <template slot="content">
        <div v-for="item in subItems" :key="item.next_name">
          <h1 class="title">{{item.next_name}}</h1>
          <van-row>
            <van-col span="8" v-for="c in item.info" :key="c.son_name" @click="list(c.son_name)">
              <div class="cat-img">
                <van-image width="80" height="80" :src="c.imgurl" />
              </div>
              <div class="sub-title">{{c.son_name}}</div>
            </van-col>
          </van-row>
        </div>
      </template>
    </van-tree-select>
    <van-tabbar v-model="active" :safe-area-inset-bottom="true">
      <van-tabbar-item icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">教程</van-tabbar-item>
      <van-tabbar-item icon="cluster-o">分类</van-tabbar-item>
      <van-tabbar-item icon="after-sale">分享</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import cats from "@/lib/tbcats.json";

export default {
  asyncData({store}) {
    const catIndex = store.state.catIndex;
    const items = cats.map(item => ({ text: item.main_name }));
    const subItems = cats[catIndex].data;
    store.commit('setSearchInfo',null)   //reset search result
    return {
      active: 2,
      catIndex,
      items,
      subItems
    };
  },
  
  methods:{
    changeCat(index){
      this.subItems = cats[index].data
      this.$store.commit('setCatIndex',index)
    },
    search(){
      this.$router.push('/search')
    },
    list(keyword){
      this.$router.push('/search?q=' + keyword)
    }
  }
};
</script>

<style scoped>
.van-tree-select__content {
  flex: 5;
}
.title {
  font-size: 14px;
  line-height: 36px;
  text-align: center;
}
.cat-img {
  text-align: center;
}
.sub-title {
  color: gray;
  text-align: center;
  padding-bottom: 10px;
  font-size: 12px;
}
</style>