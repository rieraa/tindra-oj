<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
</script>
<!--全局默认布局-->
<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
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
    margin-bottom: 5px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  }

  .content {
    padding: 20px;
    margin-bottom: 16px;
  }

  .footer {
    padding: 16px;
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
  }
}
</style>
