<template>
  <el-dialog
    v-model="drawerVisible"
    :title="`${drawerProps.title}开户`"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="开户人姓名" prop="openAccountName">
        <el-input v-model="drawerProps.row!.openAccountName" placeholder="请输入开户人姓名" clearable />
      </el-form-item>
      <el-form-item label="开户号码" prop="openAccountNumber">
        <el-input v-model="drawerProps.row!.openAccountNumber" :maxlength="11" placeholder="请输入开户号码" clearable />
      </el-form-item>
      <el-form-item label="运营商" prop="VNO">
        <el-select v-model="drawerProps.row!.VNO" placeholder="请选择运营商" filterable>
          <el-option v-for="item in operateList" :key="item.value" :label="item.label" :value="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="drawerProps.row!.remark" type="textarea" placeholder="请输入备注" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="PhoneDrawer">
import { Commodity } from "@/api/interface/commodity/commodity";
import { ElMessage, FormInstance } from "element-plus";

const rules = reactive({
  openAccountName: [{ required: true, message: "请输入开户人姓名" }],
  openAccountNumber: [{ required: true, message: "请输入开户号码" }],
  VNO: [{ required: true, message: "请选择运营商" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Commodity.phoneLibrary>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
const operateList = [
  { label: "移动", value: 1 },
  { label: "联通", value: 2 },
  { label: "电信", value: 3 }
];
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

<style scoped lang="scss">
.edit-btn {
  div {
    color: var(--el-color-white) !important;
  }
}
</style>
