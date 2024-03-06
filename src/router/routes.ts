import { RouteRecordRaw } from "vue-router";
import BaseLayout from "@/layouts/BaseLayout.vue";
import TemplateView from "@/views/TemplateView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import LoginView from "@/views/user/LoginView.vue";
import QuestionCreatView from "@/views/question/QuestionCreatView.vue";

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
    ],
  },
  {
    path: "/",
    name: "home",
    component: BaseLayout,
    children: [
      {
        path: "/template",
        name: "测试组件页面",
        component: TemplateView,
      },
      {
        path: "/question",
        name: "新增题目",
        component: QuestionCreatView,
        meta: {
          requireLogin: true,
        },
      },
    ],
  },
];
