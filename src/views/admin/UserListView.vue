<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { User, UserControllerService } from "../../../request/user";
import { Question } from "../../../request/question";
import {
  IconUser,
  IconSun,
  IconDelete,
  IconEdit,
} from "@arco-design/web-vue/es/icon";

// 返回路由实例
const router = useRouter();
// 用户列表
const userList = ref();
// 筛选条件
const searchInfo = ref({
  current: 1,
  pageSize: 9,
  userAccount: "",
  userName: "",
});

// 总数
const total = ref(0);

const columns = [
  // {
  //   title: "用户编号",
  //   dataIndex: "id",
  // },
  {
    title: "账号",
    dataIndex: "userAccount",
  },
  {
    title: "用户名",
    dataIndex: "userName",
  },
  {
    title: "头像",
    slotName: "userAvatar",
  },
  {
    title: "用户角色",
    slotName: "userRole",
  },
  {
    title: "",
    slotName: "optional",
  },
];

/**
 * 获取题目列表
 */
const handleGetUserList = async () => {
  const res = await UserControllerService.listUserByPageUsingPost(
    searchInfo.value
  );
  if (res.code === 0) {
    userList.value = res.data?.records;
    userList.value.forEach((item: Question) => {
      if (item.createTime) {
        item.createTime = formatDateString(item.createTime);
      }
      if (item.updateTime) {
        item.updateTime = formatDateString(item.updateTime);
      }
    });
    total.value = Number(res.data?.total);
  } else {
    message.error("获取用户列表异常" + res.message);
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
 * 删除该用户
 * @param question
 */
const handleDelete = async (user: User) => {
  const res = await UserControllerService.deleteUserUsingPost({
    id: user.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    handleGetUserList();
  } else {
    message.error("删除失败:" + res.message);
  }
};

/**
 * 编辑用户
 * @param user
 */
const handleEdit = (user: User) => {
  router.push({
    path: "/user/info",
    query: {
      id: user.id,
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
    handleGetUserList();
  },
  { deep: true }
);

onMounted(() => {
  handleGetUserList();
});
//
</script>

<template>
  <div id="userListView">
    <a-form :model="searchInfo" layout="inline">
      <a-form-item field="userAccount" label="登录账号">
        <a-input v-model="searchInfo.userAccount" placeholder="输入登录账号" />
      </a-form-item>
      <a-form-item field="userName" label="用户名">
        <a-input v-model="searchInfo.userName" placeholder="输入用户名" />
      </a-form-item>
      <a-form-item>
        <a-button
          @click="
            () => {
              router.push({
                path: '/user/info',
              });
            }
          "
          >新增用户</a-button
        >
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :columns="columns"
      :data="userList"
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
      <template #userAvatar="{ record }">
        <!--用户头像-->
        <a-avatar>
          <img :src="record.userAvatar" />
        </a-avatar>
      </template>
      <!--相关操作-->
      <template #optional="{ record }">
        <div style="display: flex; gap: 2px">
          <a-button
            status="warning"
            @click="
              () => {
                handleEdit(record);
              }
            "
          >
            <template #icon> <icon-edit /> </template>编辑</a-button
          >
          <a-popconfirm
            content="确认要删除吗？"
            @ok="() => handleDelete(record)"
          >
            <a-button status="danger">
              <template #icon> <icon-delete /> </template>
              删除
            </a-button>
          </a-popconfirm>
        </div>
      </template>

      <template #userRole="{ record }">
        <a-tag v-if="record.userRole === 'admin'" color="orangered">
          <template #icon> <icon-sun /> </template>
          管理员
        </a-tag>
        <a-tag v-else color="gold">
          <template #icon>
            <icon-user />
          </template>
          普通用户
        </a-tag>
      </template>
    </a-table>
  </div>
</template>

<style lang="scss">
#userListView {
  max-width: 1280px;
  margin: auto;
}
</style>
