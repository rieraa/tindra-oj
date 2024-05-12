<script setup lang="ts">
import * as monaco from "monaco-editor";
import {
  onMounted,
  ref,
  toRaw,
  defineProps,
  withDefaults,
  watch,
  defineExpose,
} from "vue";
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
  mode: "vs-light",
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

watch(
  () => props.mode,
  () => {
    toRaw(codeEditor.value).updateOptions({
      theme: props.mode,
    });
  }
);

onMounted(() => {
  codeEditor.value = monaco.editor.create(codeEditorDom.value, {
    theme: props.mode, // 主题配置
    language: props.language,
    value: props.value,
    minimap: {
      enabled: false,
    },
    roundedSelection: true,
    readOnly: false,
    folding: true, // 是否折叠
    foldingHighlight: true, // 折叠等高线
    foldingStrategy: "indentation", // 折叠方式  auto | indentation
    showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
    disableLayerHinting: true, // 等宽优化
    emptySelectionClipboard: false, // 空选择剪切板
    selectionClipboard: false, // 选择剪切板
    automaticLayout: true, // 自动布局
    codeLens: false, // 代码镜头
    scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
    colorDecorators: true, // 颜色装饰器
    accessibilitySupport: "off", // 辅助功能支持  "auto" | "off" | "on"
    lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
    lineNumbersMinChars: 5, // 行号最小字符   number

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

const handleFormat = (v) => {
  toRaw(codeEditor.value).setValue(v);
};

defineExpose({
  handleFormat,
});
</script>

<template>
  <div ref="codeEditorDom" style="min-height: 200px"></div>
</template>

<style scoped lang="scss"></style>
