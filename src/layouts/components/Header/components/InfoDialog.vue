<template>
  <el-dialog
    v-model="dialogVisible"
    title="个人信息"
    width="500px"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >

    <el-descriptions
      :column="2"
      border
    >
      <el-descriptions-item label="姓名">{{ userStore.userInfo?.name }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ userStore.userInfo?.tel }}</el-descriptions-item>
      <el-descriptions-item label="所在组">{{ userStore.userInfo?.set?.label }}</el-descriptions-item>
      <el-descriptions-item label="门店">{{ userStore.userInfo?.branch?.branchName }}</el-descriptions-item>
      <el-descriptions-item label="账号">{{ userStore.userInfo?.code }}</el-descriptions-item>
      <el-descriptions-item label="角色">{{ roleName }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/modules/user";
import { getRoleDetail } from '@/api/modules/role';

const userStore = useUserStore();

const dialogVisible = ref(false);

const roleName = ref<string>('');

const openDialog = async () => {
  const roleId = userStore.userInfo?.roleId;
  if (roleId) {
    const { data } = await getRoleDetail(roleId);
    roleName.value = data.name;
  }
  dialogVisible.value = true;
};
defineExpose({ openDialog });
</script>

