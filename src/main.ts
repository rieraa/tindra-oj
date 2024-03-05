import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import { createPinia } from "pinia";

import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
// 根据权限需求动态引入 若不需要权限控制则注释掉
import "@/api/core/interceptor";
import "@/authority/index";
// MarkDown编辑器
import "bytemd/dist/index.css";
createApp(App).use(router).use(ArcoVue).use(createPinia()).mount("#app");
