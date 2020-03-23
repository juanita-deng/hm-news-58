<template>
  <div class="top">
    <div class="hm-header">
      <div class="header-left iconfont iconjiantou2" @click="$router.go(-1)"></div>
      <div class="title">
        <slot></slot>
      </div>
      <div class="header-right"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.top {
  height: 40px;
}
.hm-header {
  position: fixed;
  width: 100%;
  background-color: #fff;
  z-index: 999;
  top: 0;
  display: flex;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  .header-left,
  .header-right {
    width: 40px;
    text-align: center;
    font-weight: 700;
  }
  .title {
    flex: 1;
    text-align: center;
    font-size: 18px;
  }
}
</style>
