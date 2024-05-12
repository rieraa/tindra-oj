<script setup lang="ts">
import { onMounted, ref, watch, defineExpose } from "vue";
import message from "@arco-design/web-vue/es/message";
import { Question, QuestionControllerService } from "../../request/question";

// 题目提交列表
const questionSubmitList = ref();
// 信息
const searchInfo = ref({
  questionId: undefined,
  current: 1,
  pageSize: 10,
  language: undefined,
});

// 总数
const total = ref(0);

const columns = [
  {
    title: "提交时间",
    slotName: "createTime",
    // sortable: {
    //   sortDirections: ["ascend", "descend"],
    // },
  },
  // {
  //   title: "提交编号",
  //   dataIndex: "id",
  // },
  {
    title: "语言",
    dataIndex: "language",

    filterable: {
      filters: [
        {
          text: "java",
          value: "java",
        },
        {
          text: "javascript",
          value: "javascript",
        },
      ],
      filter: (value, row) => {
        // 在这里修改语言并重新请求数据
        searchInfo.value.language = value[0];
        return true;
      },
    },
  },
  {
    title: "运行结果",
    slotName: "judgeInfo",
  },
  {
    title: "题目状态",
    slotName: "status",
  },
  // {
  //   title: "题目编号",
  //   dataIndex: "questionId",
  // },
  // {
  //   title: "提交用户",
  //   dataIndex: "userId",
  // },
];

/**
 * 获取题目提交记录列表
 */
const handleGetQuestionList = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchInfo.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    questionSubmitList.value = res.data?.records;
    console.log(
      "🚀 ~ file:QuestionSubmitList method:handleGetQuestionList line:85 -----questionSubmitList.value:",
      questionSubmitList.value
    );
    questionSubmitList.value.forEach((item: Question) => {
      if (item.createTime) {
        item.createTime = formatDateString(item.createTime);
      }
      if (item.updateTime) {
        item.updateTime = formatDateString(item.updateTime);
      }
    });
    total.value = Number(res.data?.total);
  } else {
    message.error("获取题目提交记录列表失败:" + res.message);
  }
};

/**
 * 分页改变时修改分页配置
 * @param page
 */
const handlePageChange = (page: number) => {
  searchInfo.value = {
    ...searchInfo.value,
    current: page,
  };
};

/**
 * 格式化日期
 * @param dateString
 */
function formatDateString(dateString: string) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 监听分页信息变化 变化时重新进行请求
 */
watch(
  () => searchInfo.value,
  (newValue, oldValue) => {
    // 在这里可以执行相应的逻辑
    if (newValue.language !== oldValue.language) {
      searchInfo.value.current = 0;
    }
    // todo 节流
    handleGetQuestionList();
  },
  { deep: true }
);

onMounted(() => {
  handleGetQuestionList();
});

defineExpose({
  handleGetQuestionList,
});
//
</script>

<template>
  <div id="questionSubmitList">
    <!--<a-form :model="searchInfo" layout="inline"> </a-form>-->
    <!--<a-divider size="0" />-->
    <a-table
      :columns="columns"
      :data="questionSubmitList"
      :pagination="{
        total,
        current: searchInfo.current,
        pageSize: searchInfo.pageSize,
      }"
      @page-change="
        (number) => {
          handlePageChange(number);
        }
      "
    >
      <template #createTime="{ record }">
        <span style="color: #888; font-size: smaller">{{
          record.createTime
        }}</span></template
      >
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo.message) }}
      </template>

      <template #status="{ record }">
        <a-tag color="cyan" v-if="record.status == 0">等待中</a-tag>
        <a-tag color="blue" v-else-if="record.status == 1">队列中</a-tag>
        <a-tag color="green" v-else-if="record.status == 2">已完成</a-tag>
        <a-tag color="red" v-else-if="record.status == 3">执行错误</a-tag>
      </template>
    </a-table>
  </div>
</template>

<style lang="scss">
#questionSubmitList {
  max-width: 1280px;
  margin: auto;
}
</style>
