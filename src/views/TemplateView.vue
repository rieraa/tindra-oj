<script setup lang="ts">
import { ref } from "vue";
import MarkDownEditor from "@/components/MarkDownEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue"; // @ is an alias to /src

const codeValue = ref("代码内容");
const codeOnChange = (v: string) => {
  console.log("🚀 ~ file:HomeView.vue method:codeOnChange line:11 -----v:", v);
  codeValue.value = v;
};
const markValue = ref("markdown");
const markOnChange = (v: string) => {
  console.log("🚀 ~ file:HomeView.vue method:markOnChange line:17 -----v:", v);
  markValue.value = v;
};
</script>
<template>
  <div class="home">
    <MarkDownEditor :value="markValue" :handle-change="markOnChange" />
    <CodeEditor :value="codeValue" :handle-change="codeOnChange" />
  </div>
</template>
