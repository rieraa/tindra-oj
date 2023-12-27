import { defineStore } from "pinia";

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userInfo: {
        avatar:
          "https://oooooo.oss-cn-fuzhou.aliyuncs.com/readme/202312232252586.jpg",
        name: "未登录",
        isAuthenticated: false,
      },
    };
  },
  getters: {},
  actions: {
    getUserLoginInfo() {
      this.userInfo = {
        isAuthenticated: true,
        avatar:
          "https://oooooo.oss-cn-fuzhou.aliyuncs.com/readme/202312280036348.jpg",
        name: "test",
      };
    },
  },
});
