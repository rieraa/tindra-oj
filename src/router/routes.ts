import { RouteRecordRaw } from "vue-router";
import BaseLayout from "@/layouts/BaseLayout.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import LoginView from "@/views/user/LoginView.vue";
import QuestionCreatView from "@/views/question/QuestionCreatView.vue";
import QuestionManageView from "@/views/question/QuestionManageView.vue";
import QuestionListView from "@/views/question/QuestionListView.vue";
import QuestionDetailView from "@/views/question/QuestionDetailView.vue";
import UserListView from "@/views/admin/UserListView.vue";
import UserInfoView from "@/views/user/UserInfoView.vue";

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
        path: "/question/list",
        name: "题目列表",
        component: QuestionListView,
        meta: {
          requireLogin: true,
        },
      },
      {
        path: "/question/detail",
        name: "做题页面",
        component: QuestionDetailView,
        meta: {
          requireLogin: true,
          hide: true,
        },
      },
      // {
      //   path: "/template",
      //   name: "测试组件页面",
      //   component: TemplateView,
      // },
      {
        path: "/question/add",
        name: "新增题目",
        component: QuestionCreatView,
        meta: {
          requireLogin: true,
          requireAuth: true,
        },
      },
      {
        path: "/question/update",
        name: "更新题目",
        component: QuestionCreatView,
        meta: {
          requireLogin: true,
          requireAuth: true,
          hide: true,
        },
      },
      {
        path: "/question/manage",
        name: "题目管理",
        component: QuestionManageView,
        meta: {
          requireLogin: true,
          requireAuth: true,
        },
      },
      {
        path: "/user/list",
        name: "用户管理",
        component: UserListView,
        meta: {
          requireLogin: true,
          requireAuth: true,
        },
      },
      {
        path: "/user/info",
        name: "用户信息",
        component: UserInfoView,
        meta: {
          requireLogin: true,
          hide: true,
        },
      },
    ],
  },
];
