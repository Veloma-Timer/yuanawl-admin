<template>
  <div class="table-box">
    <ProTable ref="proTable" title="功能维护" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds }">
        <el-button v-auth="'func-maintenance:add'" type="primary" :icon="Plus" @click="openDrawer('新增')">新增 </el-button>
        <el-button
          v-auth="'func-maintenance:delete'"
          type="danger"
          plain
          :icon="Delete"
          @click="deleteFuncMaintenance(selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-auth="'func-maintenance:edit'" link :icon="Edit" @click="openDrawer('修改', scope.row)">修改</el-button>
      </template>
    </ProTable>
    <FuncMaintenanceDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="FuncMaintenanceTable">
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import FuncMaintenanceDialog from "./components/FuncMaintenanceDialog.vue";
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useDateFormat } from "@vueuse/core";
import { useDict } from "@/hooks/useDict";
import { App } from "@/typings/app";
import { Status } from "@/typings";
import deepcopy from "deepcopy";

import {
  addFuncMaintenanceItem,
  delFuncMaintenanceItem,
  editFuncMaintenanceItem,
  getFuncMaintenanceList,
  updateFuncMaintenanceStatus
} from "@/api/modules/app/funcMaintenance";

const initParam = reactive({});

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: App.IFuncMaintenanceInstance) => {
  return getFuncMaintenanceList(deepcopy(params));
};

// 删除首屏轮播
const deleteFuncMaintenance = async (ids: (number | string)[]) => {
  await useHandleData(delFuncMaintenanceItem, ids, `批量删除`);
  proTable.value?.getTableList();
};

const { app_paths } = useDict("app_paths");

// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns = computed<ColumnProps<App.IFuncMaintenanceInstance>[]>(() => {
  return [
    { type: "selection", fixed: "left", width: 80 },
    {
      prop: "name",
      label: "名称",
      search: {
        el: "input"
      }
    },
    {
      prop: "flag",
      label: "边缘标记"
    },
    {
      prop: "picture",
      label: "图片",
      width: 150,
      render: ({ row }) => {
        return (
          <el-image
            style="width: 100px; height: 100px;"
            src={row.picture}
            previewSrcList={[row.picture]}
            initialIndex={1}
            fit="cover"
          />
        );
      }
    },
    {
      prop: "pagePath",
      label: "关联页面",
      enum: app_paths,
      search: {
        el: "select-v2",
        props: {
          filterable: true
        }
      },
      render: ({ row }) => {
        const path = app_paths.value.find(path => path.value == row.pagePath);

        return path ? (
          <div>
            【{path?.label}】-{">"} {path?.value}
          </div>
        ) : (
          "--"
        );
      }
    },
    {
      prop: "sort",
      label: "排序"
    },
    {
      prop: "desc",
      label: "备注",
      search: {
        el: "input"
      }
    },
    {
      prop: "createdTime",
      label: "创建时间",
      width: 180,
      search: {
        el: "date-picker",
        span: 1,
        props: { type: "daterange", valueFormat: "YYYY-MM-DD", format: "YYYY-MM-DD" }
      },
      render: ({ row }) => {
        return <span>{useDateFormat(row.createdTime, "YYYY-MM-DD HH:mm:ss").value || "--"}</span>;
      }
    },
    {
      prop: "status",
      label: "状态",
      render: scope => {
        return (
          <>
            <el-switch
              model-value={scope.row.status}
              active-value={"1"}
              inactive-value={"0"}
              onChange={(status: Status) => changeStatus(scope.row, status)}
            />
          </>
        );
      }
    }
  ];
});
// 按钮状态
// 打开 drawer(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof FuncMaintenanceDialog> | null>(null);
const openDrawer = (title: string, row: Partial<App.IFuncMaintenanceInstance> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    app_paths: app_paths.value,
    api: title === "新增" ? addFuncMaintenanceItem : editFuncMaintenanceItem,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};
// 修改状态
const changeStatus = async (row: App.IFuncMaintenanceInstance, status: Status) => {
  if (!row.id) return;
  await updateFuncMaintenanceStatus(row.id, status);
  proTable.value?.getTableList();
};
</script>

<style>
.auto-wrap {
  --num: 4;
  --lineHeight: 1.2em;
  max-height: calc(var(--lineHeight) * var(--num));
  line-height: var(--lineHeight);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--num);
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
