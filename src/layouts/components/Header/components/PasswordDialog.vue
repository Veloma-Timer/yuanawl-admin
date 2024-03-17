<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改密码"
    width="500px"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="ruleFormRef" label-width="120px" label-suffix=" :" :rules="rules" :model="newUserObj">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          type="password"
          show-password
          autocomplete="new-password"
          v-model="newUserObj.oldPassword"
          placeholder="请输入"
          class="order-input"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          type="password"
          show-password
          autocomplete="new-password"
          v-model="newUserObj.newPassword"
          placeholder="请输入"
          class="order-input"
        ></el-input>
      </el-form-item>
      <el-form-item label="二次确认密码" prop="password">
        <el-input
          type="password"
          show-password
          autocomplete="new-password"
          v-model="newUserObj.password"
          placeholder="请输入"
          class="order-input"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { logoutApi } from "@/api/modules/login";
import { editUser } from "@/api/modules/user";
import { decryption } from "@/utils/AESUtil";
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import md5 from "js-md5";
import { LOGIN_URL } from "@/config";
import { User } from "@/api/interface";

const dialogVisible = ref(false);
const userStore = useUserStore();

const newUserObj = ref({
  newPassword: "",
  password: "",
  oldPassword: ""
});
const oldUserObj = ref({
  password: ""
});

const ruleFormRef = ref<FormInstance>();
const router = useRouter();
const rules = reactive({
  oldPassword: [{ required: true, message: "必填项不能为空" }],
  newPassword: [{ required: true, message: "必填项不能为空" }],
  password: [{ required: true, message: "必填项不能为空" }]
});
const openDialog = () => {
  oldUserObj.value = userStore.userInfo;
  dialogVisible.value = true;
};
// 判断新旧密码密码
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    const newPassword = md5(newUserObj.value.newPassword);
    const password = md5(newUserObj.value.password);
    if (newPassword === oldUserObj.value.password) {
      return ElMessage.error("旧密码和新密码相同,请重新修改");
    }
    if (password !== newPassword) {
      return ElMessage.error("两次密码输入不一致");
    }
    try {
      let password = md5(newUserObj.value.newPassword);
      const params = {
        ...oldUserObj.value,
        password
      };
      await editUser(params as User.ResUser);
      ElMessage.success({ message: `修改密码成功， 请重新登录！` });
      dialogVisible.value = false;
      // 1.执行退出登录接口
      await logoutApi();

      // 2.清除 Token
      userStore.cleanToken();

      // 3.重定向到登陆页
      router?.replace(LOGIN_URL);
    } catch (error) {
      console.log(error);
    }
  });
};
defineExpose({ openDialog });
</script>
