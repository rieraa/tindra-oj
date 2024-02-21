// 根据当前用户的登录状态导航
import { useUserStore } from "@/store/userStore";
import router from "@/router";

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // 判断用户是否登录（未登录/登录失败）
  if (
    userStore.userInfo.loginStatus === null ||
    !userStore.userInfo.loginStatus
  ) {
    // 未登录就获取用户登录信息（如session还未过期就能够成功获得）
    await userStore.getUserLoginInfo();
  }

  // 如果路由需要登录
  if (to.meta.requireLogin) {
    if (userStore.userInfo.loginStatus) {
      // 已登录
      next();
    } else {
      // 未登录
      next(`/user/login?redirect=${to.fullPath}`);
    }
  } else {
    next();
  }
});
