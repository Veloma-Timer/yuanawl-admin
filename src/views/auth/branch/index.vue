<template>
  <div class="table-box">
    <ProTable ref="proTable" title="门店管理" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ isSelected, selectedListIds }">
        <el-button v-auth="'branch:add'" type="primary" :icon="Plus" @click="openDrawer('新增')">新增门店</el-button>
        <el-button
          v-auth="'branch:delete'"
          :disabled="!isSelected"
          :icon="Delete"
          plain
          type="danger"
          @click="deleteAccount(selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-auth="'branch:edit'" :color="BLUE_COLOR" plain text @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button v-auth="'branch:delete'" :color="BLUE_COLOR" plain text @click="deleteAccount(scope.row.id)"> 删除 </el-button>
      </template>
    </ProTable>
    <BranchDrawer ref="branchDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="BranchTable">
import { addBranch, delBranch, editBranch, getAllBranchPage } from "@/api/modules/branch";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Plus, Delete } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import BranchDrawer from "./modules/BranchDrawer.vue";
import { Set } from "@/api/interface";
import { BLUE_COLOR } from "@/config";
import { getOperationColWidth, visibleOperationCol } from "@/utils";
import { useAuthStore } from "@/stores/modules/auth";

const proTable = ref<ProTableInstance>();
const initParam = reactive({});

const auth = useAuthStore();

const pageButtons = ["branch:edit", "branch:delete"];

const getTableList = (params: any) => {
  return getAllBranchPage(params);
};

// 表格配置项
const columns: ColumnProps<Set.ResAddStore>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "branchCode",
    label: "门店编码",
    search: { el: "input" },
    render: scope => {
      return <span>{scope.row.branchCode || "--"}</span>;
    }
  },
  {
    prop: "branchName",
    label: "门店名称",
    search: { el: "input" },
    render: scope => {
      return <span>{scope.row.branchName || "--"}</span>;
    }
  },
  {
    prop: "branchAddress",
    label: "门店负责人",
    render: ({ row }) => row.branchContact?.name
  },
  {
    prop: "branchAddress",
    label: "门店地址"
  },
  {
    prop: "branchTel",
    label: "联系电话"
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
];

// 打开 drawer(新增、查看、编辑)
const branchDrawerRef = ref<InstanceType<typeof BranchDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Set.ResAddStore> = {}) => {
  const params = {
    title,
    row: { ...row },
    isView: title === "查看",
    getTableList: proTable.value?.getTableList,
    api: title === "新增" ? addBranch : title === "编辑" ? editBranch : undefined
  };
  branchDrawerRef.value?.acceptParams(params);
};

const deleteAccount = async (id: string[]) => {
  const ids = Array.isArray(id) ? id : [id];
  await useHandleData(delBranch, ids, `删除门店`);
  proTable.value?.getTableList();
};
</script>
