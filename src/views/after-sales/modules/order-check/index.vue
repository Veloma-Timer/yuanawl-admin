<template>
  <div class="icon-box">
    <el-dialog
      v-model="dialogVisible"
      title="审核"
      top="50px"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef">
        <el-form-item label="审核人姓名：" prop="orderCheckerId">
          <el-select v-model="form.orderCheckerId" placeholder="请选择" class="order-input" filterable disabled>
            <template v-for="item in userList" :key="item.id">
              <el-option :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="审核结果：" prop="checkerResult">
          <el-select v-model="form.checkerResult" placeholder="请选择" class="order-input" filterable>
            <el-option label="通过" value="1" />
            <el-option label="未通过" value="0" />
          </el-select>
        </el-form-item>
        <template v-if="form.checkerResult === '0'">
          <el-form-item label="未通过原因：" prop="reason">
            <el-input v-model="form.reason" placeholder="请输入" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="onSubmit()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { getAllUser } from "@/api/modules/branch";
import { checkSalesOrder } from "@/api/modules/ticket";
const dialogVisible = ref(false);

interface Form {
  orderCheckerId: string;
  checkerResult: string;
  reason: string;
}

// 当前用户的id
const geekerUser: any = window.sessionStorage.getItem("user") || "{}";
const id = JSON.parse(geekerUser)?.userInfo?.id;

const form = reactive<Form>({
  orderCheckerId: id,
  checkerResult: "",
  reason: ""
});

type DialogProps = { row: { id: number }; getTableList: () => {} };
const dialogProps = ref<DialogProps>();

type UserObj = { name: string; id: number };
const userList = ref<UserObj[]>([]);

const openDialog = async (row: any) => {
  dialogProps.value = row;
  const { data } = await getAllUser({});
  userList.value = data;
  dialogVisible.value = true;
};

const ruleFormRef = ref<FormInstance>();

const rules = reactive<FormRules>({
  orderCheckerId: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  checkerResult: [{ required: true, message: "必填项不能为空", trigger: "change" }],
  reason: [{ required: true, message: "必填项不能为空", trigger: "change" }]
});

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const cancel = () => {
  Object.keys(form)?.forEach(key => {
    form[key as keyof typeof form] = "";
  });
  resetForm(ruleFormRef.value);
  dialogVisible.value = false;
};

const onSubmit = async () => {
  await ruleFormRef?.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      await checkSalesOrder(dialogProps!.value!.row!.id, form);
      ElMessage.success({ message: `操作成功！` });
      dialogProps.value!.getTableList();
      cancel();
    } else {
      console.log("error submit!", fields);
    }
  });
};

defineExpose({
  openDialog
});
</script>

<style lang="scss" scoped>
.check-select,
.order-input {
  width: 100%;
}
</style>
