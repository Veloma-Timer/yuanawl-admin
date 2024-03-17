<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      title="字典管理"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds, isSelected }">
        <el-button v-auth="'dict:add'" type="primary" :icon="Plus" @click="openDictModal('新增')">新增</el-button>
        <el-button v-auth="'dict:delete'" plain type="danger" :disabled="!isSelected" :icon="Delete" @click="batchDelete(selectedListIds)"
          >批量删除</el-button
        >
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button v-auth="'dict:edit'" :color="BLUE_COLOR" plain text @click="openDictModal('编辑', row)">编辑</el-button>
        <el-button v-auth="'dict:delete'" :color="BLUE_COLOR" plain text @click="batchDelete(row.id)">删除</el-button>
      </template>
    </ProTable>
    <DictModal ref="dictModalRef" />
  </div>
</template>

<script setup lang="tsx" name="DictTable">
import { createDict, delDictType, editDict, getDictTypeList } from "@/api/modules/dict";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { getOperationColWidth, visibleOperationCol } from "@/utils";
import { Plus, Delete } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import DictModal from "./components/DictModal.vue";
import { useAuthStore } from "@/stores/modules/auth";
import { ReqPage, ResPage } from "@/api/interface";
import { useDateFormat } from "@vueuse/core";
import { useDict } from "@/hooks/useDict";
import { Dict } from "@/typings/dict";
import { isArray } from "@/utils/is";
import { BLUE_COLOR } from "@/config";
// ProTable 实例
const proTable = ref<ProTableInstance>();

const dictModalRef = ref<InstanceType<typeof DictModal> | null>(null);

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive<Dict.ITypeItem & ReqPage>({ pageNum: 1, pageSize: 10 } as Dict.ITypeItem & ReqPage);

const { common_status } = useDict("common_status");

const pageButtons = ["dict:edit", "dict:delete"];

const auth = useAuthStore();

// 表格配置项
const columns = reactive<ColumnProps<Dict.ITypeItem>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { prop: "name", label: "字典名称", search: { el: "input" } },
  { prop: "type", label: "字典别名", search: { el: "input" } },
  { prop: "remark", label: "说明" },
  {
    prop: "status",
    label: "状态",
    tag: false,
    enum: common_status,
    search: { el: "select" }
  },
  {
    prop: "createdTime",
    label: "创建时间",
    render: ({ row }) => <span>{useDateFormat(row.createdTime, "YYYY-MM-DD HH:mm:ss").value}</span>
  },
  ...(visibleOperationCol(auth.authButtonList, pageButtons)
    ? [
        {
          prop: "operation",
          label: "操作",
          width: getOperationColWidth(auth.authButtonList, pageButtons),
          fixed: "right"
        }
      ]
    : [])
]);

const dataCallback = (data: ResPage<Dict.ITypeItem>) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: Dict.ITypeItem & ReqPage) => {
  return getDictTypeList(params);
};

const batchDelete = async (id: number | string | string[] | number[]) => {
  const ids = isArray(id) ? id : [id];
  await useHandleData(delDictType, { ids }, "删除所选字典信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

const openDictModal = (title: string, row: Partial<Dict.Detail> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    form: { ...row },
    common_status: common_status.value,
    api: title === "新增" ? createDict : title === "编辑" ? editDict : void 0,
    getTableList: proTable.value?.getTableList
  };
  if (title === "新增") Object.assign(params.form, { status: "1" });
  dictModalRef.value?.acceptParams(params);
};
</script>
