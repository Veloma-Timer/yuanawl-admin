<template>
  <div class="table-box">
    <ProTable
      :key="compKey"
      :indent="20"
      :columns="columns"
      :request-api="getTableList"
      :request-auto="true"
      :pagination="false"
      :data-callback="dataCallback"
      :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
      :default-expand-all="isExpandAll"
      title="菜单管理"
      ref="proTable"
      row-key="id"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" @click="toggleExpandAll">全部展开/折叠</el-button>
        <el-button v-auth="'menus:add'" type="primary" @click="openMenuModal('新增')">新增菜单</el-button>
      </template>
      <template #icon="{ row }">
        <el-icon :size="18">
          <component :is="row.icon"></component>
        </el-icon>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button
          v-auth="'menus:add'"
          type="primary"
          text
          plain
          :icon="Plus"
          @click="openMenuModal('新增', { parentId: row.id })"
          >新增
        </el-button>
        <el-button
          v-auth="'menus:edit'"
          type="primary"
          text
          :color="BLUE_COLOR"
          plain
          :icon="Edit"
          @click="openMenuModal('修改', row)"
          >修改</el-button
        >
        <el-button v-auth="'menus:delete'" type="danger" :icon="Delete" text plain @click="delMenu(row.id)">删除</el-button>
      </template>
    </ProTable>
    <MenuModal ref="deptModalRef" />
  </div>
</template>

<script setup lang="tsx" name="MenusTable">
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import { createMenu, deleteMenu, editMenu, getMenuList } from "@/api/modules/menu";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { getOperationColWidth, handleTree, visibleOperationCol } from "@/utils";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import MenuModal from "./components/MenuModal.vue";
import { useAuthStore } from "@/stores/modules/auth";
import { isArray, isEmpty } from "@/utils/is";
import { useDateFormat } from "@vueuse/core";
import { useDict } from "@/hooks/useDict";
import { Menu } from "@/typings/menu";
import { BLUE_COLOR } from "@/config";
// ProTable 实例
const proTable = ref<ProTableInstance>();

const deptModalRef = ref<InstanceType<typeof MenuModal> | null>(null);

const isExpandAll = ref(false);

const refreshTable = ref(true);

const compKey = ref(0);

const { common_status } = useDict("common_status");

const pageButtons = ["menus:edit", "menus:add", "menus:delete"];

const auth = useAuthStore();

// 表格配置项
const columns = reactive<ColumnProps<Menu.Item>[]>([
  { prop: "title", label: "菜单名称", search: { el: "input", props: { placeholder: "请输入菜单名称" } } },
  { prop: "icon", label: "图标" },
  { prop: "sort", label: "排序", width: 80 },
  { prop: "perms", label: "权限标识", width: 200 },
  {
    prop: "status",
    label: "菜单状态",
    tag: false,
    enum: common_status,
    search: { el: "select" }
  },
  {
    prop: "createdTime",
    label: "创建时间",
    width: 200,
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

const toggleExpandAll = () => {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  compKey.value++;
};

const getTableList = (params: any) => {
  return getMenuList(params);
};

const dataCallback = (data: any) => {
  return handleTree(data);
};

// 删除用户信息
const delMenu = async (id: number | number[]) => {
  const ids = isArray(id) ? id : [id];
  await useHandleData(deleteMenu, { ids }, `删除所选菜单`);
  proTable.value?.getTableList();
};

const openMenuModal = (title: string, row: Partial<Menu.Item> = {}) => {
  const params = {
    title,
    form: { ...row },
    isView: title === "查看",
    common_status: common_status.value,
    api: isEmpty(row.id) ? createMenu : editMenu,
    getTableList: proTable.value?.getTableList
  };
  if (title === "新增") {
    Object.assign(params.form, {
      type: "M",
      isLink: false,
      isKeepAlive: false,
      isHide: false,
      status: common_status.value[1]?.value
    });
  }
  deptModalRef.value?.acceptParams(params);
};
</script>
