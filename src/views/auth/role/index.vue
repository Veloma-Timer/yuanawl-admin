<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      title="角色管理列表"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds, isSelected }">
        <el-button v-auth="'role:add'" type="primary" :icon="Plus" @click="openRoleModal('新增')">新增</el-button>
        <el-button
          v-auth="'role:delete'"
          type="danger"
          plain
          :icon="Delete"
          :disabled="!isSelected"
          @click="batchDelete(selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button v-auth="'role:edit'" :color="BLUE_COLOR" plain text @click="openRoleModal('编辑', row)">编辑</el-button>
        <el-button v-auth="'role:delete'" :color="BLUE_COLOR" plain text @click="batchDelete(row.id)">删除</el-button>
      </template>
    </ProTable>
    <RoleModal ref="roleModalRef" />
  </div>
</template>

<script setup lang="tsx" name="RoleTable">
import { createRole, deleteRole, editRole, getRoleList } from "@/api/modules/role";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { getOperationColWidth, visibleOperationCol } from "@/utils";
import { Plus, Delete } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthStore } from "@/stores/modules/auth";
import RoleModal from "./components/RoleModal.vue";
import { getMenuList } from "@/api/modules/menu";
import { isArray, isEmpty } from "@/utils/is";
import { useDateFormat } from "@vueuse/core";
import { useDict } from "@/hooks/useDict";
import { Role } from "@/typings/role";
import { Menu } from "@/typings/menu";
import { BLUE_COLOR } from "@/config";

const { common_status } = useDict("common_status");

const pageButtons = ["role:edit", "role:delete"];

const auth = useAuthStore();

const roleModalRef = ref<InstanceType<typeof RoleModal> | null>();

const proTable = ref<ProTableInstance>();

const initParam = reactive({ type: 1 });

const menuList = ref<Menu.Item[]>([]);

const columns = reactive<ColumnProps<Role.Item>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "index", label: "序号", width: 70 },
  { prop: "name", label: "角色名称", width: 120, search: { el: "input" } },
  {
    prop: "permissions",
    label: "权限",
    render: ({ row }) => {
      return (
        <>
          {row.permissions!.map(p => {
            const permission = menuList.value!.find(item => item.id === p && !item.parentId);
            if (permission) {
              return (
                <el-tag type="success" style={{ marginRight: "10px" }}>
                  {permission.title}
                </el-tag>
              );
            }
          })}
        </>
      );
    }
  },
  { prop: "remark", label: "备注" },
  {
    prop: "status",
    label: "状态",
    width: 120,
    tag: false,
    enum: common_status,
    search: { el: "select" }
  },
  {
    prop: "createdTime",
    label: "创建时间",
    width: 180,
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

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: any) => {
  return getRoleList(params);
};

const getAllMenuList = async () => {
  const { data } = await getMenuList();
  menuList.value = data;
};

// 批量删除用户信息
const batchDelete = async (id: number[] | string[] | number | string) => {
  const ids = isArray(id) ? id : [id];
  await useHandleData(deleteRole, { ids }, "删除所选信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

const openRoleModal = (title: string, row: Partial<Role.Item> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    form: { ...row },
    common_status: common_status.value,
    api: title === "新增" ? createRole : title === "编辑" ? editRole : undefined,
    getTableList: proTable.value?.getTableList
  };
  if (isEmpty(row.id)) {
    Object.assign(params.form, { status: common_status.value[1]?.value, permissions: [] });
  }
  roleModalRef.value?.acceptParams(params);
};

onMounted(async () => {
  await getAllMenuList();
});
</script>
