<template>
  <div class="table-box">
    <ProTable ref="proTable" title="首屏维护" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds, isSelected }">
        <el-button v-auth="'first-screen:add'" type="primary" :icon="Plus" @click="openDrawer('新增')"> 新增 </el-button>
        <el-button v-auth="'first-screen:delete'" :disabled="!isSelected" type="danger" :icon="Delete"
                   plain @click="deleteAccount(selectedListIds)">
          批量删除
        </el-button>
      </template>
    </ProTable>

    <FirstScreenDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="FistScreen">
import {Delete, Plus} from "@element-plus/icons-vue";
import {
  addFirstScreenItem,
  delFirstScreenItem,
  getFirstScreenList,
  updateFirstScreenStatus
} from "@/api/modules/app/firstScreen";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import FirstScreenDialog from "./components/FirstScreenDialog.vue";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useDateFormat } from "@vueuse/core";
import { App } from "@/typings/app";
import { Status } from "@/typings";
import deepcopy from "deepcopy";

const initParam = reactive({});

const proTable = ref<ProTableInstance>();

const getTableList = (params: App.IFirstScreenQuery) => getFirstScreenList(deepcopy(params));

// 删除首屏轮播
const deleteAccount = async (ids: (number | string)[]) => {
  await useHandleData(delFirstScreenItem, ids, `批量删除`);
  proTable.value?.getTableList();
};

const columns = computed<ColumnProps<App.IFirstScreenInstance>[]>(() => [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "name",
    label: "名称",
    search: {
      el: "input"
    }
  },
  {
    prop: "picture",
    label: "图片",
    width: 150,
    render: ({ row }) => {
      return (
        <el-image
          preview-teleported={true}
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
        <el-switch
          model-value={scope.row.status}
          active-value={"1"}
          inactive-value={"0"}
          onChange={(status: Status) => changeStatus(scope.row, status)}
        />
      );
    }
  }
]);

// 按钮状态
// 打开 drawer(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof FirstScreenDialog> | null>(null);
const openDrawer = (title: string, row: Partial<App.IFirstScreenInstance> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: addFirstScreenItem,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};
// 修改状态
const changeStatus = async (row: App.IFirstScreenInstance, status: Status) => {
  if (!row || !row?.id) return;
  await updateFirstScreenStatus(row.id, status);
  proTable.value?.getTableList();
};
</script>
