import { RouteRecordRaw } from "vue-router";
import BaseLayout from "@/layouts/BaseLayout.vue";
import HomeView from "@/views/HomeView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import LoginView from "@/views/user/LoginView.vue";
import RegisterView from "@/views/user/RegisterView.vue";

// 路由信息（菜单）
export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    meta: {
      hide: true,
    },
    children: [
      {
        path: "/user/login",
        name: "login",
        component: LoginView,
      },
      {
        path: "/user/register",
        name: "register",
        component: RegisterView,
      },
    ],
  },
  {
    path: "/",
    name: "home",
    component: BaseLayout,
    children: [
      {
        path: "",
        component: HomeView,
      },
      {
        path: "/about",
        name: "about",
        meta: {
          requireAuth: true,
          requireLogin: true,
        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
      },
    ],
  },
];
