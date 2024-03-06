<script setup lang="ts">
import { ref } from "vue";
import MarkDownEditor from "@/components/MarkDownEditor.vue";
import { QuestionControllerService } from "../../../api";
import message from "@arco-design/web-vue/es/message";

const form = ref({
  title: "题目",
  content: "内容",
  tags: ["javascript"],
  answer: "答案",
  judgeCase: [{ input: "1,2,3", output: "3,2,1" }],
  judgeConfig: {
    timeLimit: 1000,
    memoryLimit: 128,
  },
});

/**
 * 测试用例的删除
 * @param index
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

/**
 * 测试用例的新增
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

const contentOnChange = (v: string) => {
  form.value.content = v;
};

const answerOnChange = (v: string) => {
  form.value.answer = v;
};
/**
 * 提交表单
 */
const doSubmit = async () => {
  console.log("form", form.value);
  const res = await QuestionControllerService.addQuestion(form.value);
  if (res.code === 0) {
    message.success("新增成功");
  } else {
    message.error("新增失败" + res.message);
  }
};
</script>

<template>
  <div id="questionCreatView">
    <a-form style="width: 70%" :model="form" label-align="left">
      <!--题目-->
      <a-form-item field="title" label="题目">
        <a-input
          v-model="form.title"
          placeholder="请输入题目"
          style="width: 670px"
        />
      </a-form-item>
      <!--题目内容-->
      <a-form-item field="content" label="题目内容">
        <MarkDownEditor
          :value="form.content"
          :handle-change="contentOnChange"
        />
      </a-form-item>
      <!--题目标签-->
      <a-form-item field="content" label="标签">
        <a-input-tag
          v-model="form.tags"
          :default-value="['test']"
          style="width: 670px"
          placeholder="回车添加"
          allow-clear
        />
      </a-form-item>
      <!--示例答案-->
      <a-form-item field="answer" label="题目答案">
        <MarkDownEditor :value="form.answer" :handle-change="answerOnChange" />
      </a-form-item>
      <!--运行限制-->
      <a-form-item
        style="width: 670px"
        label="题目配置"
        :content-flex="false"
        :merge-props="false"
      >
        <a-space direction="vertical" style="min-width: 670px">
          <a-form-item field="form.judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              mode="button"
              placeholder="ms"
            />
          </a-form-item>
          <a-form-item field="form.judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              mode="button"
              placeholder="kb"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <!--用例-->
      <a-form-item
        style="width: 670px"
        label="题目用例"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(element, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <div style="display: flex">
            <a-space direction="vertical" style="min-width: 750px">
              <!--输入用例-->
              <a-form-item
                :field="`element[${index}].input`"
                :label="`输入用例-${index}`"
                :key="index"
              >
                <a-input v-model="element.input" placeholder="输入用例" />
              </a-form-item>
              <a-form-item
                :field="`element[${index}].output`"
                :label="`输出用例-${index}`"
                :key="index"
              >
                <a-input v-model="element.output" placeholder="输出用例." />
              </a-form-item>
            </a-space>
            <a-button
              status="danger"
              style="margin-left: 100px"
              @click="handleDelete(index)"
              >删除用例
            </a-button>
          </div>
        </a-form-item>
        <a-button status="success" @click="handleAdd">新增用例</a-button>
      </a-form-item>

      <a-button style="max-width: 400px" type="primary" @click="doSubmit"
        >提交
      </a-button>
    </a-form>
  </div>
</template>

<style lang="scss">
#questionCreatView {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
