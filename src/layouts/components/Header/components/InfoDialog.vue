<template>
  <el-dialog
    v-model="dialogVisible"
    title="个人信息"
    width="500px"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="that-person">
      <p>
        <span>所在组: </span>
        {{ obj.set.label }}
      </p>
      <p>
        <span>门店: </span>
        {{ oldUserObj.branch!.branchName }}
      </p>
      <p>
        <span>账号: </span>
        {{ oldUserObj.account }}
      </p>
      <p>
        <span>姓名: </span>
        {{ oldUserObj.name }}
      </p>
      <p>
        <span>手机号: </span>
        {{ oldUserObj.tel }}
      </p>
      <p>
        <span>角色: </span>
        {{ oldUserObj.role!.name }}
      </p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();

const dialogVisible = ref(false);
let oldUserObj = ref({});
const obj = userStore.userInfo;
const openDialog = () => {
  oldUserObj.value = obj;
  dialogVisible.value = true;
};
defineExpose({ openDialog });
</script>
<style lang="scss" scoped>
.that-person {
  p {
    margin: 10px 0;
    font-size: 16px;
    span {
      display: inline-block;
      width: 60px;
      font-weight: bold;
      color: #333333;
    }
  }
}
</style>
