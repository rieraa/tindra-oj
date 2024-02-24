<script setup lang="ts"></script>

<template>
  <div id="userLayout">
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
#userLayout {
  background: #00c1c1
    url(https://img.bosszhipin.com/static/file/2022/zlqc2m9fao1667185843533.png)
    bottom/100% auto no-repeat;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
</style>
