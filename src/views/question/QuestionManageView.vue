<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from "vue";

import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import { Question, QuestionControllerService } from "../../../request/question";
import { IconEdit, IconDelete } from "@arco-design/web-vue/es/icon";
// 返回路由实例
const router = useRouter();
// 题目列表
const questionList = ref();
// 分页信息
const pageInfo = ref({
  current: 1,
  pageSize: 20,
  tags: [],
  content: "",
});
// 总数
const total = ref(0);

const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  // {
  //   title: "描述",
  //   dataIndex: "content",
  // },
  {
    title: "标签",
    slotName: "tags",
  },
  // {
  //   title: "答案",
  //   dataIndex: "answer",
  // },
  // {
  //   title: "提交数",
  //   dataIndex: "submitNum",
  // },
  // {
  //   title: "通过数",
  //   dataIndex: "acceptedNum",
  // },
  // {
  //   title: "测试用例",
  //   dataIndex: "judgeCase",
  // },
  // {
  //   title: "题目配置",
  //   dataIndex: "judgeConfig",
  // },
  // {
  //   title: "创建者id",
  //   dataIndex: "creatorId",
  // },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

/**
 * 获取题目列表
 */
const handleGetQuestionList = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    pageInfo.value
  );
  if (res.code === 0) {
    questionList.value = res.data?.records;
    questionList.value.forEach((item: Question) => {
      if (item.createTime) {
        item.createTime = moment(item.createTime).format("YYYY-MM-DD");
      }
      if (item.updateTime) {
        item.updateTime = moment(item.updateTime).format("YYYY-MM-DD");
      }
    });
    // if (!questionList.value.judgeCase) {
    //   questionList.value.judgeCase = [
    //     {
    //       input: "",
    //       output: "",
    //     },
    //   ];
    // } else {
    //   questionList.value.judgeCase = JSON.parse(questionList.value.judgeCase);
    // }
    // if (!questionList.value.judgeConfig) {
    //   questionList.value.judgeConfig = {
    //     timeLimit: 1000,
    //     memoryLimit: 128,
    //   };
    // } else {
    //   questionList.value.judgeConfig = JSON.parse(
    //     questionList.value.judgeConfig
    //   );
    // }
    questionList.value.forEach((item: Question) => {
      if (!item.tags) {
        item.tags = [];
      } else {
        item.tags = JSON.parse(item.tags);
      }
    });

    total.value = Number(res.data?.total);
  } else {
    message.error("获取题目列表失败:" + res.message);
  }
};

/**
 * 删除题目
 * @param question
 */
const handleDelete = (question: Question) => {
  QuestionControllerService.deleteQuestionUsingPost({ id: question.id }).then(
    (res) => {
      if (res.code === 0) {
        message.success("删除成功");
        handleGetQuestionList();
      } else {
        message.error("删除失败:" + res.message);
      }
    }
  );
};
const handleUpdate = (question: Question) => {
  console.log(
    "🚀 ~ file:QuestionManageView method:handleUpdate line:36 -----question:",
    question
  );
  router.push({
    path: "/question/update",
    query: {
      id: question.id,
    },
  });
};

/**
 * 分页改变时修改分页配置
 * @param page
 */
const handlePageChange = (page: number) => {
  pageInfo.value = {
    ...pageInfo.value,
    current: page,
  };
};

/**
 * 监听分页信息变化 变化时重新进行请求
 */
// watchEffect(() => {
//   handleGetQuestionList();
// });

watch(
  pageInfo,
  (newValue, oldValue) => {
    console.log("change");
    // 在这里可以执行相应的逻辑
    if (newValue.tags !== oldValue.tags) {
      pageInfo.value.current = 0;
    }
    if (newValue.title !== oldValue.title) {
      pageInfo.value.current = 0;
    }
    // todo 节流
    handleGetQuestionList();
  },
  { deep: true }
);

onMounted(() => {
  handleGetQuestionList();
});
//
</script>

<template>
  <div id="questionListView">
    <a-form layout="inline">
      <a-form-item field="name" label="题目名称">
        <a-input v-model="pageInfo.title" placeholder="输入题目名称" />
      </a-form-item>
      <a-form-item field="name" label="题目介绍">
        <!--<a-select :style="{ width: '320px' }" placeholder="">-->
        <!--  <a-option>JAVA</a-option>-->
        <!--  <a-option>C</a-option>-->
        <!--</a-select>-->
        <a-input v-model="pageInfo.content" placeholder="输入题目内容" />
      </a-form-item>
      <a-form-item field="post" label="题目标签">
        <a-input-tag
          style="width: 300px"
          v-model="pageInfo.tags"
          placeholder="请输入标签，按回车添加"
        />
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :columns="columns"
      :data="questionList"
      :pagination="{
        total,
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
      }"
      @page-change="
        (number) => {
          handlePageChange(number);
        }
      "
    >
      <template #optional="{ record }">
        <div style="display: flex; gap: 2px">
          <a-button @click="() => handleUpdate(record)" status="warning">
            <template #icon>
              <icon-edit />
            </template>
            编辑</a-button
          >
          <a-popconfirm
            content="确认要删除吗？"
            @ok="() => handleDelete(record)"
          >
            <a-button status="danger">
              <template #icon>
                <icon-delete />
              </template>
              删除</a-button
            >
          </a-popconfirm>
        </div>
      </template>
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag color="cyan" v-for="tag in record.tags" :key="tag">
            {{ tag }}
          </a-tag>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<style lang="scss">
#questionListView {
}
</style>
