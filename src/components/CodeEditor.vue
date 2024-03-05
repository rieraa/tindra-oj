<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, defineProps, withDefaults } from "vue";

// 定义组件props类型
interface Props {
  value: string;
  handleChange: (v: string) => void;
}

// 使用withDefaults为props提供默认值
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  handleChange: (v: string) => {
    console.log("🚀 ~ file:CodeEditor method:handleChange line:15 -----c:", v);
  },
});

// 获取到编辑器的dom节点
const codeEditorDom = ref();
// 编辑器的实例
const codeEditor = ref();

onMounted(() => {
  codeEditor.value = monaco.editor.create(codeEditorDom.value, {
    language: "javascript",
    value: props.value,
    automaticLayout: true,
    lineNumbers: "on",
    minimap: {
      enabled: false,
    },
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    theme: "vs-dark",
    colorDecorators: true,

    // lineNumbers: "off",
    // roundedSelection: false,
    // scrollBeyondLastLine: false,
  });

  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>

<template>
  <div ref="codeEditorDom" style="min-height: 200px"></div>
</template>

<style scoped lang="scss"></style>
