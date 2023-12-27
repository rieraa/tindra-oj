import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/routes";
import { useUserStore } from "@/store/userStore";

// todo 如何配置createRouter
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
});
// 鉴权逻辑

// 添加导航守卫
router.beforeEach((to, from, next) => {
  // 注册router总比pinia先 todo
  const userStore = useUserStore();
  // 如果路由需要鉴权
  if (to.meta.requiresAuth) {
    // 查看当前用户权限
    if (userStore.userInfo.isAuthenticated) {
      next();
    } else {
      console.log("🚀 ~ file:index method: line:17 -----无权限:");
      next("/");
    }
  } else {
    next();
  }
});

export default router;
