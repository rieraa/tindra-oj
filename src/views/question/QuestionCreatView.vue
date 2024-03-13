<script setup lang="ts">
import { onMounted, ref } from "vue";
import MarkDownEditor from "@/components/MarkDownEditor.vue";
import { QuestionControllerService } from "../../../api";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";

const route = useRoute();
// 新增或者更新标志
const flag = ref("create");
const form = ref({
  title: "",
  content: "",
  tags: [],
  answer: "",
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    timeLimit: 1000,
    memoryLimit: 128,
  },
});

/**
 * 获取题目
 */
const handleGetQuestion = async () => {
  const id = route.query.id;
  if (!id) return;
  flag.value = "update";
  const res = await QuestionControllerService.getQuestionById(id);
  if (res.code === 0) {
    Object.assign(form.value, res.data);
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        timeLimit: 1000,
        memoryLimit: 128,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags);
    }
  } else {
    message.error("获取题目失败" + res.message);
  }
};

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
  if (flag.value === "update") {
    const res = await QuestionControllerService.updateQuestion(form.value);
    if (res.code === 0) {
      message.success("更新成功");
    } else {
      message.error("更新失败" + res.message);
    }
    return;
  } else {
    const res = await QuestionControllerService.addQuestion(form.value);
    if (res.code === 0) {
      message.success("新增成功");
    } else {
      message.error("新增失败" + res.message);
    }
  }
};

onMounted(() => {
  handleGetQuestion();
});
</script>

<template>
  <div id="questionCreatView">
    <a-card title="新增题目">
      <a-form :model="form" label-align="left">
        <!--题目-->
        <a-form-item field="title" label="题目">
          <a-input
            v-model="form.title"
            placeholder="请输入题目"
            style="width: 670px"
          />
        </a-form-item>
        <!--题目介绍-->
        <a-form-item field="content" label="题目介绍">
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
          <MarkDownEditor
            :value="form.answer"
            :handle-change="answerOnChange"
          />
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
                style="margin-left: 40px"
                @click="handleDelete(index)"
                >删除用例
              </a-button>
            </div>
          </a-form-item>
          <a-button status="success" @click="handleAdd">新增用例</a-button>
        </a-form-item>
      </a-form>
      <a-button style="min-width: 400px" type="primary" @click="doSubmit"
        >{{ flag === "create" ? "新增" : "更新" }}题目
      </a-button></a-card
    >
  </div>
</template>

<style lang="scss">
#questionCreatView {
  width: 1080px;
  margin: 0 auto;
}
</style>
