<script setup lang="ts"></script>

<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <!--导航栏-->
      <a-layout-header class="header"></a-layout-header>
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
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
  }
}
</style>
