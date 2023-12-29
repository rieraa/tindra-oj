<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
</script>

<template>
  <div id="basicLayout">
    <a-layout style="height: 400px">
      <!--导航栏-->
      <a-layout-header class="header">
        <!--导航组件-->
        <NavigationBar />
      </a-layout-header>
      <!--内容-->
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
      <!--底部信息-->
      <a-layout-footer class="footer">aneto-oj</a-layout-footer>
    </a-layout>
  </div>
</template>

<style lang="scss" scoped>
#basicLayout {
  .header {
  }

  .content {
    padding: 20px;
    background-color: bisque;
    margin-bottom: 16px;
  }

  .footer {
    background-color: chartreuse;
    padding: 16px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
  }
}
</style>
