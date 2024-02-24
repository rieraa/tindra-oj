<template>
  <div id="LoginView">
    <div class="container">
      <h3 class="title">用户登录/注册</h3>
      <a-radio-group
        class="radio-group"
        type="button"
        size="large"
        v-model="radioValue"
        @change="radioChange"
      >
        <a-radio class="radio" value="login">登录</a-radio>
        <a-radio class="radio" value="register">注册</a-radio>
      </a-radio-group>
      <a-form class="form" :model="form" label-align="left">
        <a-form-item class="form-item" field="userAccount" label="用户名">
          <a-input class="input" v-model="form.userAccount" />
        </a-form-item>
        <a-form-item class="form-item" field="userPassword" label="密码">
          <a-input-password
            class="input"
            v-model="form.userPassword"
            :defaultVisibility="false"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          class="form-item"
          v-if="radioValue === 'register'"
          field="checkPassword"
          label="重复密码"
        >
          <a-input-password
            class="input"
            v-model="form.checkPassword"
            :defaultVisibility="false"
            allow-clear
          />
        </a-form-item>
      </a-form>
      <a-button
        v-if="radioValue === 'login'"
        class="button"
        type="primary"
        html-type="submit"
        @click="handleSubmit"
        >登录</a-button
      >
      <a-button
        v-if="radioValue === 'register'"
        class="button"
        type="primary"
        html-type="submit"
        @click="handleSubmit"
        >注册</a-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { UserControllerService } from "@/api";
import message from "@arco-design/web-vue/es/message";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "vue-router";

// 路由实例
const router = useRouter();
// 用户信息全局管理
const userStore = useUserStore();
// 表单数据
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
});
// 登录/注册被选中的值
const radioValue = ref("login");

const radioChange = (e: string) => {
  radioValue.value = e;
  console.log(
    "🚀 ~ file:LoginView method:radioChange line:51 -----radioValue:",
    radioValue
  );
};

/**
 *  提交表单
 */
const handleSubmit = async () => {
  const { checkPassword, ...loginForm } = form;
  if (radioValue.value === "login") {
    {
      const res = await UserControllerService.userLogin(loginForm);
      if (res.code === 0) {
        console.log("登录成功" + JSON.stringify(res.data));
        message.success("登录成功");
        await userStore.getUserLoginInfo();
        // 如果用户已经登录，则跳转到首页
        if (userStore.userInfo.loginStatus) {
          setTimeout(() => {
            router.push({ path: "/", replace: true });
          }, 1000);
        }
      } else {
        message.error(res.message as string);
      }
    }
  } else if (radioValue.value === "register") {
    if (form.userPassword !== form.checkPassword) {
      message.error("两次密码不一致");
      return;
    }
    const res = await UserControllerService.userRegister(form);
    if (res.code === 0) {
      console.log("注册成功" + JSON.stringify(res.data));
      message.success("注册成功");
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      message.error(res.message as string);
    }
  }
};
</script>

<style lang="scss">
#LoginView {
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    //padding: 250px;
    border: white solid 1px;
    height: 580px;
    width: 728px;
    border-radius: 28px;
    background: #fff;
    box-shadow: 0 6px 13px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    .title {
      font-size: 22px;
      font-weight: 500;
      color: #222;
      line-height: 30px;
      margin-bottom: 60px;
    }
    .radio-group {
      width: 420px;
      .radio {
        width: 210px;
        height: 50px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .form {
      padding-top: 40px;
      height: 200px;
      width: 420px;
      margin-bottom: 20px;
      &-item {
        //font-size: 18px;
        .arco-form-item-label-col > .arco-form-item-label {
          font-size: 17px;
        }
        .input {
          height: 50px;
        }
      }
    }
    .button {
      width: 420px;
      height: 60px;
      border-radius: 10px;
      font-size: 18px;
      background-color: #01abab;
    }
  }
}
</style>
