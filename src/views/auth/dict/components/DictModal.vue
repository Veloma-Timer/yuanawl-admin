<template>
  <el-dialog
    v-model="visible"
    width="65%"
    :destroy-on-close="true"
    :title="`${title}字典`"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="formRef" label-width="110px" label-suffix=" :" :rules="rules" :model="form" :hide-required-asterisk="isView">
      <el-row>
        <el-col :span="20">
          <el-col :span="12">
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="form.name" placeholder="请填写字典名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典别名" prop="type">
              <el-input v-model="form.type" placeholder="请填写字典别名" clearable />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="字典值" prop="dictData">
              <div class="table-box">
                <ProTable
                  ref="proTable"
                  :columns="columns"
                  max-height="300"
                  :data="form.dictData"
                  :pagination="false"
                  :tool-button="false"
                >
                  <!-- 表格操作 -->
                  <template #operation="{ $index }">
                    <el-button type="danger" link @click="batchDelete($index)">删除</el-button>
                  </template>
                  <template #footerBtn>
                    <el-button type="primary" :icon="Plus" @click="handleAddRow"> 追加</el-button>
                    <el-button type="primary" @click="importData"> 导入</el-button>
                  </template>
                </ProTable>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="说明" prop="remark">
              <el-input v-model="form.remark" placeholder="请填写字典说明" clearable />
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
  <ImportModal ref="importModelRef" @import-success="importSuccess" />
</template>

<script setup lang="tsx" name="DictDrawer">
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { ElMessage, FormInstance } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { Plus } from "@element-plus/icons-vue";
import { reactive, ref, toRefs } from "vue";
import { Dict } from "@/typings/dict";
import useDictStore from "@/stores/modules/dict";
import { getDictDataList, getImportTemplate } from "@/api/modules/dict";
import ImportModal from "./ImportModal.vue";

interface IState {
  title: string;
  isView: boolean;
  form: Partial<Dict.Detail>;
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

const proTable = ref<ProTableInstance>();

const importModelRef = ref<InstanceType<typeof ImportModal>>();

const visible = ref(false);

const formRef = ref<FormInstance>();

const state = reactive<IState>({
  isView: false,
  title: "",
  common_status: [],
  form: {}
});

const { form, title, isView, common_status } = toRefs(state);

// 表格配置项
const columns = reactive<ColumnProps<Dict.IDataItem>[]>([
  {
    prop: "label",
    label: "键名",
    render: ({ row, $index }) => {
      return (
        <el-form-item style={{ padding: "15px 0" }} prop={`dictData[${$index}].label`} rules={rules.label}>
          <el-input v-model={row.label} placeholder={"请输入键名"} />
        </el-form-item>
      );
    }
  },
  {
    prop: "value",
    label: "键值",
    render: ({ row, $index }) => {
      return (
        <el-form-item style={{ padding: "15px 0" }} prop={`dictData[${$index}].value`} rules={rules.value}>
          <el-input v-model={row.value} placeholder={"请输入键值"} />
        </el-form-item>
      );
    }
  },
  // {
  //   prop: "dictType",
  //   label: "字典标签类型"
  //   // enum:
  // },
  {
    prop: "status",
    label: "状态",
    enum: common_status,
    fieldNames: { label: "userLabel", value: "userStatus" },
    render: scope => {
      return <el-switch v-model={scope.row.status} active-value={"1"} inactive-value={"0"} />;
    }
  },
  { prop: "operation", label: "操作", width: 100, fixed: "right" }
]);

const setVisible = (val: boolean) => {
  visible.value = val;
};
// 接收父组件传过来的参数
const acceptParams = (params: IState) => {
  Object.assign(state, params);
  setVisible(true);
};

const importSuccess = (data: Dict.IDataItem[]) => {
  const _data = form.value.dictData || [];
  form.value.dictData = [..._data, ...data];
};

const handleAddRow = () => {
  const dictData = form.value.dictData || [];
  dictData.push({ status: "1" } as Dict.IDataItem);
  form.value.dictData = dictData;
};

const importData = () => {
  const params = {
    title: "字典",
    tempApi: getImportTemplate,
    getTableList: proTable.value?.getTableList
  };
  importModelRef.value?.acceptParams(params);
};

const batchDelete = (index: number) => {
  console.log(index);
  form.value.dictData = form.value.dictData!.filter((v, i) => i !== index);
};

// 提交数据（新增/编辑）
const handleSubmit = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await state.api!(form.value);
      ElMessage.success({ message: `${title.value}字典成功！` });
      const { data } = await getDictDataList({ type: form.value.type, status: "1" });
      useDictStore().setDict(form.value.type!, data);
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
