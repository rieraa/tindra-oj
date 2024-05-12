<script setup lang="ts">
import { useRoute } from "vue-router";
import { UserControllerService } from "../../../request/user";
import { onBeforeMount, ref } from "vue";
import { IconEdit } from "@arco-design/web-vue/es/icon";
import message from "@arco-design/web-vue/es/message";
import router from "@/router";

const route = useRoute();
// 新增或者更新标志
const flag = ref("create");

const userDetail = ref({
  id: "",
  userName: "",
  userAvatar: "",
  userProfile: "",
  userAccount: "",
});

/**
 * 获取用户个人信息
 */
const handleGetUserDetail = async () => {
  const id = route.query.id;
  if (!id) return;
  flag.value = "update";
  const res = await UserControllerService.getUserByIdUsingGet(id);
  if (res.code === 0) {
    userDetail.value = res.data;
  } else {
    console.error("获取用户信息失败:" + res.message);
  }
};

/**
 * 保存用户信息
 */
const handleSave = async () => {
  if (flag.value === "update") {
    const res = await UserControllerService.updateUserUsingPost(
      userDetail.value
    );
    if (res.code === 0) {
      message.success("更新用户信息成功");
      router.push("/user/list");
    } else {
      message.error("更新用户信息失败:" + res.message);
    }
  } else {
    const res = await UserControllerService.addUserUsingPost(userDetail.value);
    if (res.code === 0) {
      message.success("新增用户成功");
    } else {
      message.error("创建用户失败:" + res.message);
    }
  }
};

const handleUploadAvatar = () => {
  // 触发文件上传 input 的点击事件
  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.click();
  }
};

const handleFileChange = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files;
  if (fileList && fileList.length > 0) {
    const file = fileList[0];
    // 上传文件
    uploadImage(file);
  }
};

const uploadImage = async (file: File) => {
  if (!file) {
    console.log("请选择文件");
    return;
  }

  try {
    const uploadRes = await UserControllerService.uploadUsingPost(file);
    userDetail.value.userAvatar = uploadRes.data.url;
    if (uploadRes.code === 0) {
      message.success("上传头像成功");
    } else {
      message.error("上传头像失败:" + uploadRes.message);
    }
    if (flag.value === "create") return;
    const updateRes = await UserControllerService.updateUserUsingPost({
      id: userDetail.value.id,
      userAvatar: uploadRes.data.url,
    });
    if (updateRes.code === 0) {
      message.success("更新用户头像成功");
    } else {
      message.error("更新用户头像失败:" + updateRes.message);
    }
    // 更新用户头像等逻辑
  } catch (error) {
    console.error("上传失败:", error);
    // 处理上传失败的情况
  }
};

onBeforeMount(() => {
  handleGetUserDetail();
});
</script>

<template>
  <div id="UserInfoView">
    <a-card :title="flag === 'create' ? '新增用户' : '信息编辑'">
      <a-space>
        <a-form
          :model="userDetail"
          :style="{ width: '700px' }"
          @submit="handleSubmit"
        >
          <!-- 隐藏的文件上传 input -->
          <input
            type="file"
            id="fileInput"
            style="display: none"
            @change="handleFileChange"
          />

          <a-avatar
            :size="74"
            style="margin: 20px auto 30px auto"
            trigger-type="mask"
            :image-url="userDetail.userAvatar"
            @click="handleUploadAvatar"
          >
            <template #trigger-icon>
              <IconEdit />
            </template>
          </a-avatar>
          <a-form-item field="userAccount" label="登录账号">
            <a-input
              v-model="userDetail.userAccount"
              placeholder="输入登录账号"
            />
          </a-form-item>
          <a-form-item field="userName" label="昵称">
            <a-input v-model="userDetail.userName" />
          </a-form-item>
          <a-form-item field="post" label="用户id">
            <a-input :disabled="true" v-model="userDetail.id" />
          </a-form-item>
          <a-form-item field="userProfile" label="个人介绍">
            <a-textarea
              v-model="userDetail.userProfile"
              placeholder="该用户很懒，什么也没留下"
              allow-clear
            />
          </a-form-item>
          <a-form-item>
            <a-button @click="handleSave">保存</a-button>
          </a-form-item>
          <!--{{ userDetail }}-->
        </a-form>
      </a-space>
    </a-card>
  </div>
</template>

<style scoped lang="scss">
#UserInfoView {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
