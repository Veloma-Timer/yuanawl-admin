<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="code">
      <el-input v-model="loginForm.code" placeholder="账号">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user/>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" placeholder="密码" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock/>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import {initDynamicRouter} from "@/routers/modules/dynamicRouter";
import {Lock, User} from "@element-plus/icons-vue";
import {useKeepAliveStore} from "@/stores/modules/keepAlive";
import {useUserStore} from "@/stores/modules/user";
import {useTabsStore} from "@/stores/modules/tabs";
import {loginApi} from "@/api/modules/login";
import type {ElForm} from "element-plus";
import {ElMessage} from "element-plus";
import {Login} from "@/api/interface";
import {useRouter} from "vue-router";
import md5 from "js-md5";
import {getTimeState} from "@/utils";

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  code: [{required: true, message: "请输入账号", trigger: "blur"}],
  password: [{required: true, message: "请输入密码", trigger: "blur"}]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  code: "",
  password: ""
});

const onSendNotification = () => window.osApi.sendNotification({ title: getTimeState(), body: '欢迎登录元阿网络后台!' });

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const res = await loginApi({
        ...loginForm,
        password: md5(loginForm.password)
      });

      const {success, data, message} = res;

      if (success) {
        userStore.setToken(data.access_token);
        userStore.setUserInfo(data.user);
        // 2.添加动态路由
        await initDynamicRouter();
        // 3.清空 tabs、keepAlive 数据
        tabsStore.closeMultipleTab();
        keepAliveStore.setKeepAliveName();

        onSendNotification();
        // 4.跳转到首页
        router.push("/");
      } else {
        ElMessage.error(message || "登录失败");
      }
    } finally {
      loading.value = false;
    }
  });
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});
</script>
<style scoped lang="scss">
@import "../index.scss";
</style>
