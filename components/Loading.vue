<template>
    <van-overlay :show="loading">
      <div id="main">
          <van-loading  size="60" />
      </div>
    </van-overlay>
</template>
<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped>
#main  {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>