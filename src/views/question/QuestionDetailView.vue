<script setup lang="ts">
import { useRoute } from "vue-router";
import { onBeforeMount, ref } from "vue";

import CodeEditor from "@/components/CodeEditor.vue";
import MarkDownView from "@/components/MarkDownView.vue";
import message from "@arco-design/web-vue/es/message";
import QuestionSubmitList from "@/components/QuestionSubmitList.vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitRequest,
  QuestionVO,
} from "../../../request/question";

const route = useRoute();
const questionDetail = ref<QuestionVO>({} as QuestionVO);
const questionDetailRaw = ref<Question>({} as Question);

// 用户提交代码表单
const codeForm = ref<QuestionSubmitRequest>({
  language: "java",
  questionId: undefined,
  code:
    "public class Main {\n" +
    "    public static void main(String[] args) {\n" +
    "        // 以下为示例代码 根据提示可以从args中获取到参数\n" +
    "        // 从命令行参数中获取第一个整数\n" +
    "        int a = Integer.parseInt(args[0]);\n" +
    "        // 从命令行参数中获取第二个整数\n" +
    "       int b = Integer.parseInt(args[1]);\n" +
    "        int sum = a + b;\n" +
    "        System.out.println(sum);\n" +
    "    }\n" +
    "}\n",
});

/**
 * 获取题目详情
 */
const handleGetQuestionDetail = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    route.query.id
  );
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
  const res = await QuestionControllerService.questionSubmitUsingPost({
    ...codeForm.value,
    questionId: route.query.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败" + res.message);
  }
};

/**
 * tab切换回调
 * @param key
 */
const tabsChange = async (key: string) => {
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    route.query.id
  );
  console.log(
    "🚀 ~ file:QuestionDetailView method:tabsChange line:73 -----questionDetailRaw.value:",
    JSON.parse(res.data?.judgeCase)
  );
  questionDetailRaw.value = res.data;
  questionDetailRaw.value.judgeCase = JSON.parse(res.data?.judgeCase);
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
            <template #title> 题目描述</template>
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
            <template #title> 提交记录</template>
            <QuestionSubmitList></QuestionSubmitList>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col class="col" :md="12" :xs="24">
        <a-tabs @change="tabsChange">
          <a-tab-pane key="1">
            <template #title> 代码</template>
            <a-space style="margin-bottom: 10px">
              <a-select
                :style="{ width: '320px' }"
                v-model="codeForm.language"
                placeholder="选择编程语言"
              >
                <a-option>java</a-option>
                <!--<a-option>javascript</a-option>-->
                <!--<a-option>html</a-option>-->
              </a-select>
              <a-button @click="handleRunCode">运行</a-button>
            </a-space>

            <CodeEditor
              :value="codeForm.code"
              :language="codeForm.language"
              :handle-change="handleCodeChange"
              style="height: 475px"
            />
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #title> 示例输出</template>
            <a-tabs size="small" type="rounded">
              <template
                :key="index"
                v-for="(instance, index) in questionDetailRaw.judgeCase"
              >
                <a-tab-pane :key="index" v-if="instance.visible">
                  <template #title> {{ "Case" + (index + 1) }}</template>
                  <p style="font-size: 11px; color: #8a8a8e">输入=</p>
                  <div
                    style="
                      background-color: #f2f3f5;
                      min-width: 100%;
                      height: 40px;
                      border-radius: 8px;
                      padding: 0 10px;
                      line-height: 40px;
                    "
                  >
                    {{ instance.input }}
                  </div>
                </a-tab-pane>
              </template>
            </a-tabs>
          </a-tab-pane>
          <a-tab-pane key="3">
            <template #title> 运行结果</template>
            <a-tabs size="small" type="rounded">
              <template
                :key="index"
                v-for="(instance, index) in questionDetailRaw.judgeCase"
              >
                <a-tab-pane :key="index" v-if="instance.visible">
                  <template #title> {{ "Case" + (index + 1) }}</template>
                  <p style="font-size: 11px; color: #8a8a8e">输入=</p>
                  <div
                    style="
                      background-color: #f2f3f5;
                      min-width: 100%;
                      height: 40px;
                      border-radius: 8px;
                      padding: 0 10px;
                      line-height: 40px;
                    "
                  >
                    {{ instance.input }}
                  </div>
                  <p style="font-size: 11px; color: #8a8a8e">实际输出=</p>
                  <div
                    style="
                      background-color: #f2f3f5;
                      min-width: 100%;
                      height: 40px;
                      border-radius: 8px;
                      padding: 0 10px;
                      line-height: 40px;
                      /*color: red;*/
                    "
                  >
                    8
                  </div>
                  <p style="font-size: 11px; color: #8a8a8e">预期输出=</p>
                  <div
                    style="
                      background-color: #f2f3f5;
                      min-width: 100%;
                      height: 40px;
                      border-radius: 8px;
                      padding: 0 10px;
                      line-height: 40px;
                    "
                  >
                    {{ instance.output }}
                  </div>
                </a-tab-pane>
              </template>
            </a-tabs>
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
