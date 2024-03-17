<template>
  <div class="table-box">
    <ProTable ref="proTable" title="账号分类" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ isSelected, selectedListIds }">
        <el-button v-auth="'account-class:add'" type="primary" :icon="Plus" @click="openDrawer('新增')">新增 </el-button>
        <el-button
          v-auth="'account-class:delete'"
          plain
          type="danger"
          :disabled="!isSelected"
          :icon="Delete"
          @click="deleteAccount(selectedListIds)"
          >批量删除
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-auth="'account-class:edit'" :color="BLUE_COLOR" text plain @click="openDrawer('编辑', scope.row)">
          编辑
        </el-button>
        <el-button v-auth="'account-class:delete'" :color="BLUE_COLOR" text plain @click="deleteAccount(scope.row.id)">
          删除
        </el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="AccountClassProTable">
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "@/views/account-admin/account-class/modules/UserDrawer.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Plus, Delete } from "@element-plus/icons-vue";
import { addAccout, deleteAccout, getAccoutList, setAccout } from "@/api/modules/accountClass";
import { Commodity } from "@/api/interface/commodity/commodity";
import deepcopy from "deepcopy";
import { getOperationColWidth, visibleOperationCol } from "@/utils";
import { useAuthStore } from "@/stores/modules/auth";
import { BLUE_COLOR } from "@/config";


// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

const pageButtons = ["account-class:edit", "account-class:delete"];

const auth = useAuthStore();

const getTableList = (params: any) => {
  let newParams = deepcopy(params);
  return getAccoutList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<Commodity.accountClass>[] = [
  { type: "selection", width: 80 },
  { prop: "id", label: "排序编号" },
  { prop: "typeName", label: "分类名称", search: { el: "input" } },
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

// 删除用户信息
const deleteAccount = async (id: string[] | string) => {
  const ids = Array.isArray(id) ? id : [id];
  await useHandleData(deleteAccout, ids, `删除分类`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addAccout : setAccout,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
