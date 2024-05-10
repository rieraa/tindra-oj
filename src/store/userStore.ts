import { defineStore } from "pinia";
import { UserControllerService } from "../../request/user";

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userInfo: {
        isAdmin: false,
        loginStatus: null as boolean | null,
      },
    };
  },
  getters: {},
  actions: {
    /**
     * 获取用户登录信息
     */
    async getUserLoginInfo() {
      const result = await UserControllerService.getLoginUserUsingGet();
      if (result.code === 0) {
        this.userInfo = {
          ...result.data,
          loginStatus: true,
          isAdmin: result.data?.userRole === "admin",
        };
      }
    },

    async logOut() {
      const result = await UserControllerService.userLogoutUsingPost();
    },
  },
});
