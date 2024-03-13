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
    console.log(
      "🚀 ~ file:CodeEditor method:watch ~ props.language",
      props.language
    );
    const oldModel = toRaw(codeEditor.value).getModel(); //获取旧模型
    const value = toRaw(codeEditor.value).getValue(); //获取旧的文本
    //创建新模型，value为旧文本，id为modeId，即语言（language.id）
    //modesIds即为支持语言
    var modesIds = monaco.languages.getLanguages().map(function (lang) {
      return lang.id;
    });
    console.log(
      "🚀 ~ file:CodeEditor method: line:41 -----modesIds:",
      modesIds
    );
    const newModel = monaco.editor.createModel(value, props.language);
    //将旧模型销毁
    if (oldModel) {
      oldModel.dispose();
    }
    //设置新模型
    toRaw(codeEditor.value).setModel(newModel);
  }
);

onMounted(() => {
  codeEditor.value = monaco.editor.create(codeEditorDom.value, {
    theme: "vs-light",
    language: props.language,
    value: props.value,
    automaticLayout: true,
    lineNumbers: "on",
    minimap: {
      enabled: false,
    },
    roundedSelection: false,
    scrollBeyondLastLine: false,
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
