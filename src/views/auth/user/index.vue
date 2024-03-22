<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="用户列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ isSelected, selectedListIds }">
        <el-button v-auth="'user:add'" type="primary" :icon="Plus" @click="openDrawer('新增')">新增</el-button>
        <el-button
          v-auth="'user:delete'"
          type="danger"
          plain
          :icon="Delete"
          :disabled="!isSelected"
          @click="_deleteUser(selectedListIds)"
          >批量删除
        </el-button>
        <el-button v-auth="'user:download-template'" type="default" :icon="Download" plain @click="batchAdd('下载')">
          下载模板
        </el-button>
        <el-button v-auth="'user:import'" type="default" :icon="Upload" plain @click="batchAdd('导入')">导入Excel</el-button>
        <el-button v-auth="'user:export'" type="default" :icon="Document" plain @click="onExport">导出Excel</el-button>
      </template>
      <template #account="scope">
        <div class="cursor-pointer" @click="setRouter(scope.row)">{{ scope.row?.account }}</div>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-auth="'user:edit'" :color="BLUE_COLOR" plain text @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button v-auth="'user:delete'" :color="BLUE_COLOR" plain text @click="_deleteUser(scope.row.id)">删除</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="UseProTable">
import {
  addUser,
  deleteUser,
  editUser,
  getUserExport,
  getUserListMap,
  getUserTemptable,
  getUserUpload
} from "@/api/modules/user";
import { Plus, Delete, Document, Download, Upload } from "@element-plus/icons-vue";
import ImportExcel from "@/views/account-admin/components/ImportExcel/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import UserDrawer from "@/views/auth/user/modules/user-dialog/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { getAllRole } from "@/api/modules/role";
import { getAllBranch } from "@/api/modules/branch";
import { saveFile } from "@/utils/file";
import { useRouter } from "vue-router";
import { User } from "@/typings/user";
import { Role } from "@/typings/role";
import deepcopy from "deepcopy";
import { getOperationColWidth, visibleOperationCol } from "@/utils";
import { useAuthStore } from "@/stores/modules/auth";
import { BLUE_COLOR } from "@/config";
import {useDict} from "@/hooks/useDict";

// 跳转详情页
const router = useRouter();
const setRouter = (data: any) => {
  router.push({
    path: "/homeStandby/index",
    query: {
      id: data.id
    }
  });
};
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

const pageButtons = ["user:edit", "user:delete"];

const auth = useAuthStore();

const { dept } = useDict('dept');

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ roleId: undefined });

const onExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await getUserExport(obj);
  await saveFile(data, "用户导出");
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = async (params: any) => {
  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  const data = await getUserListMap(newParams);
  return data;
};

const roleList = ref<Role.Item[]>([]);

const columns = computed<ColumnProps<User.IUserItem>[]>(() => [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "code", label: "工号", search: { el: "input" } },
  { prop: "name", label: "姓名", search: { el: "input" } },
  { prop: "tel", label: "手机号码", search: { el: "input" } },
  {
    prop: "branchId",
    label: "所属门店",
    sortable: true,
    width: 160,
    enum: getAllBranch,
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    fieldNames: { label: "branchName", value: "id" }
  },
  {
    prop: "deptId",
    label: "所在部门",
    sortable: true,
    width: 160,
    enum: dept,
    search: {
      el: "select",
      props: {
        filterable: true
      }
    }
  },
  {
    prop: "roleId",
    label: "角色",
    search: { el: "select" },
    enum: roleList,
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "jobStatus",
    label: "在职状态",
    enum: [
      { label: "在职", value: "在职" },
      { label: "离职", value: "离职" }
    ],
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    render: ({ row }) => {
      const status = row.jobStatus === "离职";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "离职" : "在职"}</span>
        </div>
      );
    }
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

const _deleteUser = async (id: string[] | number[]) => {
  const ids = Array.isArray(id) ? id : [id];
  await useHandleData(deleteUser, ids, `删除用户`);
  proTable.value?.getTableList();
};

const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: title === "下载" ? `${title}用户模板` : "用户导入",
    status: title === "下载",
    tempApi: getUserTemptable,
    updateApi: getUserUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.IUserItem> = {}) => {
  let jobName: string | undefined = "在职";
  if (title === "编辑") {
    jobName = row.jobStatus;
  }
  const params = {
    title,
    roleList: roleList.value,
    isView: title === "查看",
    row: { ...row, jobStatus: jobName },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

onMounted(async () => {
  const { data } = await getAllRole();
  roleList.value = data;
});
</script>

<style lang="scss">
.circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
}

.red {
  color: var(--el-color-error);
}

.v-red {
  @extend .circle;
  background-color: var(--el-color-error);
}

.v-green {
  @extend .circle;
  background-color: var(--el-color-success);
}
</style>
