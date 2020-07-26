<!--
 * @Author: weicong
 * @Date: 2020-07-17 09:59:18
 * @LastEditTime: 2020-07-26 15:08:28
 * @LastEditors: weicong
 * @Description:
-->
<template>
  <div class="home">
    <div></div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  beforeCreate() {
    // 测试注释
    console.log("得分");
    debugger;
  }
};
</script>
<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  background: url("~@/assets/img/28.png");
  div {
    background: url("~@/assets/img/0.jpg");
  }
}
</style>
