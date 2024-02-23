<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import { useUserStore } from "@/store/userStore";

// 用户登录信息全局管理
const userStore = useUserStore();
// 返回路由实例
const router = useRouter();
// 返回当前路由
const route = useRoute();
// 普通用户可见菜单
const routeToUser = computed(() => {
  return routes.filter((item) => {
    // 没有设置 requireAuth 属性的菜单或者当前用户是管理员，则显示该菜单
    return (
      (!item.meta?.requireAuth && !item.meta?.hide) ||
      userStore.userInfo.isAdmin
    );
  });
});

// 被选中的菜单路由
const selectedKeys = ref(["/"]);

// 监听路由变化 修改菜单栏样式
watch(
  () => route.path,
  (to) => {
    selectedKeys.value = [to];
  }
);

/**
 * @description 处理菜单栏点击事件
 * @param key
 */
const handleMenuItemClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>
<!--全局导航栏组件-->
<template>
  <a-row id="navigationBar" class="grid-navigation" align="center">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        @menu-item-click="handleMenuItemClick"
        :selected-keys="selectedKeys"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="logo">
            <img class="img" src="../assets/logo.jpg" alt="logo" />
          </div>
        </a-menu-item>
        <!--todo 过滤掉/user下的路由-->
        <a-menu-item v-for="item in routeToUser" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <a-avatar :image-url="userStore?.userInfo?.avatar ?? ''">A</a-avatar>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
.grid-navigation {
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);

  .logo {
    display: flex;
    align-items: center;

    .img {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
