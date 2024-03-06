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
  return routes[1].children?.filter((item) => {
    // 没有设置 requireAuth 属性的菜单或者当前用户是管理员，则显示该菜单
    return (
      (!item.meta?.requireAuth || userStore.userInfo.isAdmin) &&
      !item.meta?.hide
    );
  });
});

// 被选中的菜单路由
const selectedKeys = ref(["/"]);
// 初始化选中的菜单
selectedKeys.value = [route.path];
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
  <div id="navigationBar">
    <a-row class="grid-navigation" align="center">
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
        <a-avatar :image-url="userStore?.userInfo?.userAvatar ?? ''"
          >A</a-avatar
        >
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
#navigationBar {
  .grid-navigation {
    .logo {
      display: flex;
      align-items: center;

      .img {
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>
