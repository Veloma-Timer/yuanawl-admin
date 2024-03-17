<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="短信模版列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="Plus" @click="openDrawer('新增')">新增模版</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button :color="BLUE_COLOR" plain text @click="openDrawer('编辑', scope.row)">编辑</el-button>
      </template>
    </ProTable>
    <Dialog ref="drawerRef" />
  </div>
</template>
<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { Message } from "@/api/interface";
import Dialog from "@/views/message/template/modules/Dialog/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { addUser, editUser, getUserListMap } from "@/api/modules/user";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import deepcopy from "deepcopy";
import { BLUE_COLOR } from "@/config";

const { BUTTONS } = useAuthButtons();
// 表格配置项
const columns: ColumnProps<Message.Template>[] = [
  { prop: "content", label: "模板内容", search: { el: "input" } },
  { prop: "status", label: "审核状态", search: { el: "input" } },
  { prop: "time", label: "提交时间" },
  { prop: "operation", label: "操作", width: 200 }
];
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Dialog> | null>(null);
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: Number(data.pageNum),
    pageSize: Number(data.pageSize)
  };
};
const getTableList = (params: any) => {
  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getUserListMap(newParams);
};
const openDrawer = (title: string, row: Partial<Message.Template> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
