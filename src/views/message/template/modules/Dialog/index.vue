<template>
  <el-dialog
    v-model="drawerVisible"
    :title="`${drawerProps.title}`"
    :destroy-on-close="true"
    width="480px"
    draggable
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
      <el-form-item label="签名" prop="signature">
        <el-input v-model="drawerProps.row!.signature" placeholder="请输入" clearable class="order-input"></el-input>
      </el-form-item>
      <el-form-item label="正文" prop="text">
        <el-input v-model="drawerProps.row!.text" placeholder="请输入" clearable class="order-input"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="corporateName">
        <el-input v-model="drawerProps.row!.corporateName" placeholder="请输入" clearable class="order-input"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">关闭</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Message } from "@/api/interface";
const rules = reactive({
  corporateName: [{ required: true, message: "必填项不能为空" }],
  signature: [{ required: true, message: "必填项不能为空" }],
  text: [{ required: true, message: "必填项不能为空" }]
});

interface DrawerProps {
  time?: Date | null;
  title: string;
  isView: boolean;
  row: Partial<Message.Template>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  time: null,
  isView: false,
  title: "",
  row: {}
});
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps & any) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row
      };
      await drawerProps.value.api!(params);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
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

<style lang="scss" scoped>
.check-select {
  :deep(.el-input__wrapper) {
    width: 300px;
  }
}
.form-password {
  float: left;
  font-size: 12px;
  color: #666666;
}
</style>
