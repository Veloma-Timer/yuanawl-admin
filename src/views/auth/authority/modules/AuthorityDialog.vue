<template>
  <el-dialog
    v-model="dialogVisible"
    title="权限"
    width="50%"
    top="12vh"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="role-table">
      <el-table :data="roleTable" border :height="360" style="width: 100%" :default-expand-all="false" row-key="name">
        <!--<template v-for="item in columns" :key="item">-->
        <!--  <el-table-column v-bind="item" :label="item.label" :prop="item.prop">-->
        <!--    <template #default="scope" v-if="item.prop === 'operation'">-->
        <!--      <div>-->
        <!--        <el-checkbox-->
        <!--          v-for="items in scope.row.operation"-->
        <!--          :key="items.name"-->
        <!--          v-model="items.value"-->
        <!--          :label="items.name"-->
        <!--          size="large"-->
        <!--        />-->
        <!--      </div>-->
        <!--    </template>-->
        <!--  </el-table-column>-->
        <!--</template>-->
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSetRoleMap">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
// import {useAuthStore} from "@/stores/modules/auth";
// import {useUserStore} from "@/stores/modules/user";

const dialogVisible = ref(false);
const roleTable = ref([]);
const roleId = ref("");
const roleObj = ref({});
// const columns: ColumnProps<Author.RoleList> = [
//   { prop: "name", label: "菜单", align: "center", width: 160, hasChildren: true },
//   { label: "功能", align: "center", prop: "operation" }
// ];
// 重置方法
const resetting = () => {
  // getButtonList();
  dialogVisible.value = false;
  roleId.value = "";
  roleTable.value = [];
};
// 获取权限数据
const acceptParams = (params: any) => {
  resetting();
  dialogVisible.value = true;
  roleObj.value = params;
  roleId.value = params.roleId;
  // getIdPower(params.powerId).then(res => {
  //   const { powerDetail = [] } = res || {};
  //   roleTable.value = powerDetail || [];
  // });
};
// 修改权限
const onSetRoleMap = () => {
  const params = {
    id: roleId.value,
    powerDetail: roleTable.value
  };
  // setPower(params.id, { powerDetail: params.powerDetail }).then(res => {
  //   const { success } = res;
  //   if (success) {
  //     ElMessage.success({ message: `权限修改成功` });
  //     roleObj.value.getTableList!();
  //     resetting();
  //   } else {
  //     ElMessage.error({ message: `权限修改失败` });
  //   }
  // });
};
// const userStore = useUserStore();
// const authStore = useAuthStore();
// const token = userStore.token; // 获取token
// const getButtonList = async () => {
//   const obj = JSON.parse(decryption("token", token));
//   await authStore.getAuthButtonList(obj.user);
// };
defineExpose({
  acceptParams
});
</script>
<style scoped lang="scss">
.role-table {
  width: 100%;
  height: 360px;
  overflow-y: auto;
}
</style>
