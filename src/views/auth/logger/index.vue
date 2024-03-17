<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :init-param="initParam" title="日志列表">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds, isSelected }">
        <el-button v-auth="'logger:export'" type="primary" :icon="Upload" @click="downloadFile(selectedListIds)">导出</el-button>
        <el-button
          v-auth="'logger:delete'"
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
        <el-button type="primary" :color="BLUE_COLOR" plain text :icon="View" @click="openLogModal('查看', row)">查看</el-button>
      </template>
    </ProTable>
    <LogModal ref="logModalRef" />
  </div>
</template>

<script setup lang="tsx" name="LoggerTable">
import { View, Upload, Delete } from "@element-plus/icons-vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { deleteLog, exportLog, getLogList } from "@/api/modules/logger";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import LogModal from "./components/LogModal.vue";
import { useDownload } from "@/hooks/useDownload";
import { useDateFormat } from "@vueuse/core";
import { ElMessageBox } from "element-plus";
import { useDict } from "@/hooks/useDict";
import { Logger } from "@/typings/logger";
import { reactive, ref } from "vue";
import { BLUE_COLOR } from "@/config";

// ProTable 实例
const proTable = ref<ProTableInstance>();

const logModalRef = ref<InstanceType<typeof LogModal> | null>(null);

const initParam = reactive({});

const { oper_status } = useDict("oper_status");

// 表格配置项
const columns = reactive<ColumnProps<Logger.Item>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "index", label: "序号", width: 70 },
  { prop: "operName", label: "操作人员", width: 150, search: { el: "input" } },
  { prop: "type", label: "日志类型", width: 140 },
  { prop: "operModule", label: "系统模块", width: 160, search: { el: "input" } },
  { prop: "operIp", label: "操作地址", width: 150 },
  { prop: "operLocation", label: "操作地点", width: 150 },
  {
    prop: "status",
    label: "操作状态",
    width: 150,
    tag: true,
    enum: oper_status,
    search: { el: "select" }
  },
  { prop: "operBrowser", label: "浏览器", width: 150 },
  {
    prop: "requestParams",
    label: "请求参数",
    width: 250,
    render: ({ row }) => <span>{JSON.stringify(row.requestParams ?? "")}</span>
  },
  {
    label: "错误信息",
    prop: "errorMsg"
  },
  { prop: "createdTime", label: "操作时间", render: ({ row }) => useDateFormat(row.createdTime, "YYYY-MM-DD hh:mm:ss").value },
  {
    prop: "operation",
    label: "操作",
    width: 120,
    fixed: "right"
  }
]);

const getTableList = (params: any) => getLogList(params);

const batchDelete = async (id: number | number[] | string[] | string) => {
  const ids = Array.isArray(id) ? id : [id];
  await useHandleData(deleteLog, { ids }, `删除`);
  proTable.value?.getTableList();
};

// 导出岗位列表
const downloadFile = async (ids?: number[] | string[]) => {
  ElMessageBox.confirm("确认导出日志数据?", "提示", { type: "warning" }).then(() => useDownload(exportLog, "日志管理", ids));
};

const openLogModal = (title: string, row: Partial<Logger.Item> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    oper_status: oper_status.value,
    form: { ...row }
  };
  logModalRef.value?.acceptParams(params);
};
</script>
