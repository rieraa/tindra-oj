<script setup lang="ts">
import { useRoute } from "vue-router";
import { onBeforeMount, ref } from "vue";
import {
  QuestionControllerService,
  type QuestionSubmitRequest,
  QuestionVO,
} from "../../../api";
import CodeEditor from "@/components/CodeEditor.vue";
import MarkDownView from "@/components/MarkDownView.vue";
import message from "@arco-design/web-vue/es/message";

const route = useRoute();
const questionDetail = ref<QuestionVO>({} as QuestionVO);

// 用户提交代码表单
const codeForm = ref<QuestionSubmitRequest>({
  language: "java",
  questionId: "",
  code: "",
});

/**
 * 获取题目详情
 */
const handleGetQuestionDetail = async () => {
  const res = await QuestionControllerService.getQuestionVoById(route.query.id);
  if (res.code === 0) {
    questionDetail.value = res.data;
  } else {
    console.error("获取题目详情失败" + res.message);
  }
};

/**
 * 保存用户输入的代码
 * @param v
 */
const handleCodeChange = (v: string) => {
  codeForm.value.code = v;
};

/**
 * 用户提交代码
 */
const handleRunCode = async () => {
  const res = await QuestionControllerService.questionSubmit({
    ...codeForm.value,
    questionId: route.query.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败" + res.message);
  }
};

onBeforeMount(() => {
  handleGetQuestionDetail();
});
</script>

<template>
  <div id="QuestionDetailView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24" class="col">
        <a-tabs>
          <a-tab-pane key="1">
            <template #title> 题目描述 </template>
            <a-card :title="questionDetail.title">
              <template #extra>
                <a-space>
                  <a-tooltip
                    :content="`${questionDetail.judgeConfig?.timeLimit}ms`"
                  >
                    <a-button>时间限制</a-button>
                  </a-tooltip>
                  <a-tooltip
                    :content="`${questionDetail.judgeConfig?.memoryLimit}kb`"
                  >
                    <a-button>内存限制</a-button>
                  </a-tooltip>
                </a-space>
              </template>
              <a-space></a-space>
              <a-space>
                <a-tag
                  color="cyan"
                  v-for="tag in questionDetail.tags"
                  :key="tag"
                >
                  {{ tag }}
                </a-tag>
              </a-space>
              <MarkDownView :value="questionDetail" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #title> 提交记录 </template>
            Content of Tab Panel 3
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col class="col" :md="12" :xs="24">
        <a-tabs>
          <a-tab-pane key="1">
            <template #title> 代码 </template>
            <a-space style="margin-bottom: 10px">
              <a-select
                :style="{ width: '320px' }"
                v-model="codeForm.language"
                placeholder="选择编程语言"
              >
                <a-option>java</a-option>
                <a-option>javascript</a-option>
                <a-option>html</a-option>
              </a-select>
              <a-button @click="handleRunCode">运行 </a-button></a-space
            >

            <CodeEditor
              :value="codeForm.code"
              :language="codeForm.language"
              :handle-change="handleCodeChange"
              style="height: 475px"
            />
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #title> 测试用例 </template>
          </a-tab-pane>
          <a-tab-pane key="3">
            <template #title> 运行结果 </template>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss">
#QuestionDetailView {
  max-width: 2560px;
  margin: 0 auto;
  height: 540px;

  .col {
    height: 600px;
    overflow-y: auto;
    padding-bottom: 50px;
  }
}
</style>
