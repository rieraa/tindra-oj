<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor } from "@bytemd/vue-next";
import { defineProps, withDefaults } from "vue";

// 定义组件props类型
interface Props {
  value: string;
  handleChange: (v: string) => void;
  mode?: string;
}

// 使用到的插件
const plugins = [gfm(), highlight()];

// 使用withDefaults为props提供默认值
withDefaults(defineProps<Props>(), {
  value: () => "",
  handleChange: (v: string) => {
    console.log(
      "🚀 ~ file:MarkDownEditor method:handleChange line:25 -----v:",
      v
    );
  },

  mode: () => "split",
});
</script>

<template>
  <div id="markdownEditor">
    <Editor
      :value="value"
      :plugins="plugins"
      :mode="mode"
      @change="handleChange"
    />
  </div>
</template>

<style lang="scss"></style>
