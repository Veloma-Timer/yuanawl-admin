<template>
  <el-dialog
    v-model="drawerVisible"
    :title="`${drawerProps.title}`"
    :destroy-on-close="true"
    width="880px"
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="工号" prop="code">
            <el-input v-model="drawerProps.row!.code" placeholder="请输入" clearable class="order-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="drawerProps.row!.name" placeholder="请输入" clearable class="order-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="drawerProps.row!.roleId" placeholder="请选择" class="check-select w-full" filterable>
              <template v-for="item in drawerProps.roleList" :key="item.id">
                <el-option :label="item.name" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属门店" prop="branchId">
            <el-select v-model="drawerProps.row!.branchId" placeholder="请选择" class="check-select w-full" filterable>
              <template v-for="item in branchList" :key="item.id">
                <el-option :label="item.branchName" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="tel">
            <el-input
              v-model="drawerProps.row!.tel"
              :maxlength="11"
              placeholder="请输入"
              clearable
              class="order-input"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在部门" prop="deptId">
            <el-select v-model="drawerProps.row!.deptId" placeholder="请选择所在部门" class="check-select w-full" filterable>
              <el-option v-for="item in setIdList" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理员" prop="isAdmin">
            <el-radio-group v-model="drawerProps.row!.isAdmin" class="ml-4">
              <el-radio label="1" size="large">是</el-radio>
              <el-radio label="0" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主管" prop="isManager">
            <el-radio-group v-model="drawerProps.row!.isManager" class="ml-4">
              <el-radio label="1" size="large">是</el-radio>
              <el-radio label="0" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在职状态" prop="jobStatus ">
            <el-radio-group v-model="drawerProps.row!.jobStatus " class="ml-4">
              <el-radio label="在职" size="large">在职</el-radio>
              <el-radio label="离职" size="large">离职</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="form-password">默认密码: 123456</span>
      <el-button @click="drawerVisible = false">关闭</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance } from "element-plus";
import { checkPhoneNumber } from "@/utils/eleValidate";
import { getAllBranch } from "@/api/modules/branch";
import { getDept } from "@/api/modules/dict";
import { User } from "@/api/interface";
import { Dict } from "@/typings/dict";
import md5 from "js-md5";
import { Role } from "@/typings/role";

const rules = reactive({
  code: [{ required: true, message: "必填项不能为空" }],
  name: [{ required: true, message: "必填项不能为空" }],
  tel: [
    { required: true, message: "必填项不能为空" },
    { required: true, validator: checkPhoneNumber, trigger: "blur" }
  ],
  password: [{ required: true, message: "必填项不能为空" }],
  roleId: [{ required: true, message: "必填项不能为空" }],
  branchId: [{ required: true, message: "必填项不能为空" }],
  deptId: [{ required: true, message: "必填项不能为空" }],
  isAdmin: [{ required: true, message: "必填项不能为空" }],
  isManager: [{ required: true, message: "必填项不能为空" }]
});

interface DrawerProps {
  time?: Date | null;
  title: string;
  isView: boolean;
  row: Partial<User.ResUser>;
  roleList: Role.Item[];
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  time: null,
  roleList: [],
  isView: false,
  title: "",
  row: {}
});

type BranchObj = { branchName: string; id: number };
const branchList = ref<BranchObj[]>([]);
const setIdList = ref<Dict.IDataItem[]>([]);

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps & any) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  await userListMap();
  await setListMap();
};
const userListMap = async () => {
  const { data } = await getAllBranch();
  branchList.value = data;
};
const setListMap = async () => {
  const { data } = await getDept();
  setIdList.value = data;
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row,
        password: md5("123456")
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
  color: #000;
  background: #fee2e2;
  padding: 5px 10px;
  border-radius: 4px;
}
</style>
