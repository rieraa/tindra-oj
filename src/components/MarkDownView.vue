<script setup lang="ts">
import { Viewer } from "@bytemd/vue-next";
import { defineProps, withDefaults } from "vue";

// 定义组件props类型
interface Props {
  value: string;
}

// 使用withDefaults为props提供默认值
withDefaults(defineProps<Props>(), {
  value: () => "",
});
</script>

<template>
  <div id="markdownEditor">
    <Viewer class="viewer" :value="value.content" />
  </div>
</template>

<style lang="scss"></style>
