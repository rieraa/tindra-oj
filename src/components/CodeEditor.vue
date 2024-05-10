<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, defineProps, withDefaults, watch } from "vue";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";

// 定义组件props类型
interface Props {
  value: string;
  language: string;
  handleChange: (v: string) => void;
}

// 使用withDefaults为props提供默认值
const props = withDefaults(defineProps<Props>(), {
  value: "",
  language: "java",
  handleChange: (v: string) => {
    console.log("🚀 ~ file:CodeEditor method:handleChange line:15 -----c:", v);
  },
});
// 获取到编辑器的dom节点
const codeEditorDom = ref();
// 编辑器的实例
const codeEditor = ref();
watch(
  () => props.language,
  () => {
    if (codeEditor.value) {
      monaco.editor.setModelLanguage(
        toRaw(codeEditor.value).getModel(),
        props.language
      );
    }
  }
);

onMounted(() => {
  codeEditor.value = monaco.editor.create(codeEditorDom.value, {
    theme: "vs-dark", // 主题配置
    language: props.language,
    value: props.value,
    automaticLayout: true,
    lineNumbers: "on",
    minimap: {
      enabled: true,
    },
    roundedSelection: true,
    scrollBeyondLastLine: true,
    readOnly: false,
    colorDecorators: true,

    // lineNumbers: "off",
    // roundedSelection: false,
    // scrollBeyondLastLine: false,
  });

  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
  // codeEditor.value.getAction("editor.action.format").run();
  const modesIds = monaco.languages.getLanguages().map(function (lang) {
    return lang.id;
  });
  console.log("🚀 ~ file:CodeEditor method: line:76 -----modesIds:", modesIds);
});
</script>

<template>
  <div ref="codeEditorDom" style="min-height: 200px"></div>
</template>

<style scoped lang="scss"></style>
