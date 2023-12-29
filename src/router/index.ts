import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/routes";
import { useUserStore } from "@/store/userStore";

// todo 如何配置createRouter
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
});
// 鉴权逻辑

// 根据当前用户的登录状态导航
router.beforeEach((to, from, next) => {
  // router总比pinia先注册 todo
  const userStore = useUserStore();
  // 如果路由需要登录
  if (to.meta.requireLogin) {
    // 查看当前是否登录
    if (userStore.userInfo.loginStatus) {
      next();
    } else {
      console.log("🚀 ~ file:index method: line:17 -----未登录:");
      next("/");
    }
  } else {
    next();
  }
});

export default router;
