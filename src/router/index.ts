import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/routes";

// todo 如何配置createRouter
const router = createRouter({
  // todo 为什么要用process.env.BASE_URL
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
});

export default router;
