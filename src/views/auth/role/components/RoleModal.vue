<template>
  <el-dialog
    v-model="visible"
    width="65%"
    :destroy-on-close="true"
    :title="`${title}角色`"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="formRef" label-width="110px" label-suffix=" :" :rules="rules" :model="form" :hide-required-asterisk="isView">
      <el-row>
        <el-col :span="20">
          <el-col :span="12">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="form.name" placeholder="请填写角色名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="说明" prop="remark">
              <el-input v-model="form.remark" placeholder="请填写字典说明" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限" prop="remark">
              <el-tree
                :props="{ label: 'title', children: 'children' }"
                :data="menuList"
                :default-checked-keys="form.permissions"
                ref="treeSelectRef"
                check-strictly
                show-checkbox
                node-key="id"
                value-key="id"
                empty-text="加载中，请稍候"
                class="tree-border max-h-[400px] overflow-auto"
              >
                <template #default="{ node }">
                  <span class="custom-tree-node">
                    {{ node.label }}
                  </span>
                </template>
              </el-tree>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="状态" prop="address">
              <el-radio-group v-model="form.status">
                <el-radio v-for="({ label, value }, index) of common_status" :key="index" :label="value">{{ label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="setVisible(false)">取消</el-button>
      <el-button v-show="!isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="tsx" name="RoleModal">
import { ElMessage, ElTreeSelect, FormInstance } from "element-plus";
import { getRoleDetail } from "@/api/modules/role";
import { getMenuList } from "@/api/modules/menu";
import { reactive, ref, toRefs } from "vue";
import { Role } from "@/typings/role";
import { Dict } from "@/typings/dict";
import { Menu } from "@/typings/menu";
import { handleTree } from "@/utils";
import { isEmpty } from "@/utils/is";

interface IState {
  title: string;
  isView: boolean;
  form: Partial<Role.Item>;
  common_status: Dict.IDataItem[];
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const rules = {
  name: [{ required: true, message: "请填写字典名称", trigger: "blur" }],
  type: [{ required: true, message: "请填写字典别名", trigger: "blur" }],
  label: [{ required: true, message: "请填写字典键名", trigger: "blur" }],
  value: [{ required: true, message: "请填写字典键值", trigger: "blur" }]
};

const treeSelectRef = ref<InstanceType<typeof ElTreeSelect> | null>();

const visible = ref(false);

const formRef = ref<FormInstance>();

const state = reactive<IState>({
  isView: false,
  title: "",
  common_status: [],
  form: {}
});

const menuList = ref<Menu.Item[]>([]);

const { form, title, isView, common_status } = toRefs(state);

const setVisible = (val: boolean) => {
  visible.value = val;
};

const getRole = async (id: number) => {
  const { data } = await getRoleDetail(id);
  form.value = data;
  Object.assign(form.value, data);
  form.value.permissions = data.permissions;
};

const getAllMenuList = async () => {
  const { data } = await getMenuList();
  menuList.value = handleTree(data);
};

// 接收父组件传过来的参数
const acceptParams = async (params: IState) => {
  Object.assign(state, params);
  await getAllMenuList();
  if (!isEmpty(params.form.id)) {
    await getRole(params.form!.id!);
  }

  setVisible(true);
};
// 提交数据（新增/编辑）
const handleSubmit = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const checkedKeys: number[] = treeSelectRef.value!.getCheckedKeys();
      const halfCheckedKeys: number[] = treeSelectRef.value!.getHalfCheckedKeys();

      const checkedAllKeys = checkedKeys.concat(halfCheckedKeys);
      await state.api!({
        ...form.value,
        permissions: checkedAllKeys
      });
      ElMessage.success({ message: `${title.value}角色成功！` });
      state.getTableList!();
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

<style>
.tree-border {
  width: 100%;
  margin-top: 5px;
  background: #ffffff none;
  border: 1px solid #e5e6e7;
  border-radius: 4px;
}
</style>
