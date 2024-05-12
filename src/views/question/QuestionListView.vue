<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { Question, QuestionControllerService } from "../../../request/question";
// 返回路由实例
const router = useRouter();
// 题目列表
const questionList = ref();
// 信息
const searchInfo = ref({
  current: 1,
  pageSize: 9,
  title: "",
  tags: [],
});

// 总数
const total = ref(0);

const columns = [
  {
    title: "题目编号",
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "",
    slotName: "optional",
  },
];

/**
 * 获取题目列表
 */
const handleGetQuestionList = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchInfo.value
  );
  console.log(
    "🚀 ~ file:QuestionListView method:handleGetQuestionList line:47 -----res:",
    res
  );
  if (res.code === 0) {
    questionList.value = res.data?.records;
    questionList.value.forEach((item: Question) => {
      if (item.createTime) {
        item.createTime = formatDateString(item.createTime);
      }
      if (item.updateTime) {
        item.updateTime = formatDateString(item.updateTime);
      }
    });
    total.value = Number(res.data?.total);
  } else {
    message.error("获取题目列表失败:" + res.message);
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
  console.log(
    "🚀 ~ file:QuestionListView method:handlePageChange line:76 -----searchInfo.value :",
    searchInfo.value
  );
};

/**
 * 跳转到题目详情页
 */
const handleCellClick = (record: Question) => {
  console.log("record", record);
  router.push({
    path: "/question/detail",
    query: {
      id: record.id,
    },
  });
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
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
/**
 * 监听分页信息变化 变化时重新进行请求
 */
watch(
  searchInfo,
  (newValue, oldValue) => {
    console.log("change");
    // 在这里可以执行相应的逻辑
    if (newValue.tags !== oldValue.tags) {
      searchInfo.value.current = 0;
    }
    if (newValue.title !== oldValue.title) {
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
//
</script>

<template>
  <div id="questionListView">
    <a-form :model="searchInfo" layout="inline">
      <a-form-item field="name" label="题目名称">
        <a-input v-model="searchInfo.title" placeholder="输入题目名称" />
      </a-form-item>
      <a-form-item field="post" label="题目标签">
        <a-input-tag
          style="width: 300px"
          v-model="searchInfo.tags"
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
        current: searchInfo.current,
        pageSize: searchInfo.pageSize,
      }"
      @page-change="
        (number) => {
          handlePageChange(number);
        }
      "
      @cell-click="(record) => handleCellClick(record)"
    >
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag color="arcoblue" v-for="tag in record.tags" :key="tag">
            {{ tag }}
          </a-tag>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<style lang="scss">
#questionListView {
  max-width: 1280px;
  margin: auto;
}
</style>
