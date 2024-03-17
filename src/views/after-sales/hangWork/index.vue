<template>
  <div class="table-box">
    <ProTable ref="proTable" title="杭州工单" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" @click="operatorOrder()" v-if="BUTTONS.add" :icon="Plus">新增</el-button>
        <el-button type="primary" @click="batchAdd('下载')" :icon="Download" plain>下载导入模板</el-button>
        <el-button type="primary" @click="batchAdd('导入')" v-if="BUTTONS.import" :icon="Upload" plain>导入Excel</el-button>
        <el-button type="primary" @click="batchExport()" v-if="BUTTONS.export" :icon="Download" plain>导出</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="operatorOrder(row)" v-if="BUTTONS.view" :icon="View">查看</el-button>
        <el-button type="primary" link @click="openCheck(row)" v-if="BUTTONS.check" :icon="EditPen">审核</el-button>
        <el-button type="primary" link @click="delOrder(row.id, row.orderCode)" v-if="BUTTONS.del" :icon="Delete">删除</el-button>
      </template>
    </ProTable>
    <OrderCheck ref="orderCheckRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="HangWork">
import { getSalesList, delSalesOrder, orderTemplate, orderUpload, orderExport } from "@/api/modules/ticket";
import { Plus, Delete, EditPen, Download, Upload, View } from "@element-plus/icons-vue";
import ImportExcel from "@/views/account-admin/components/ImportExcel/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import OrderCheck from "@/views/after-sales/modules/order-check/index.vue";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useDateFormat } from "@vueuse/core";
import { SalesOrder } from "@/api/interface";
import { saveFile } from "@/utils/file";
import { useRouter } from "vue-router";
import { useDict } from "@/hooks/useDict";
import { isExistRoute } from "@/utils/data";

const proTable = ref<ProTableInstance>();
const { BUTTONS } = useAuthButtons();

const router = useRouter();

// 固定
const initParam = reactive({ branchId: 1 });

const getTableList = (params: any) => getSalesList(params);

const { orderProblemTypes, whether, ticket_check_res, ticket_status } = useDict(
  "orderProblemTypes",
  "whether",
  "ticket_check_res",
  "ticket_status"
);

const toAccount = (code: string) => {
  if (!isExistRoute("account")) return;
  router.push({ name: "account", query: { accountCode: code } });
};

// 表格配置项
const columns: ColumnProps<SalesOrder.ResSalesList>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "operation", label: "操作", fixed: "right", width: 220 },
  {
    prop: "orderCode",
    label: "工单编号",
    search: { el: "input" }
  },
  {
    prop: "accountCode",
    label: "账号编码",
    search: { el: "input" },
    width: 180,
    render: ({ row }) => {
      return (
        <el-button type="primary" link onClick={() => toAccount(row?.account?.accountCode)}>
          {row?.account?.accountCode || "--"}
        </el-button>
      );
    }
  },
  { prop: "userCompensationPrice", label: "用户赔付金额" },
  { prop: "platformCompensationPrice", label: "平台赔付金额" },
  { prop: "reportPerson", label: "上报人姓名" },
  { prop: "newHandle", label: "最新处理客服姓名" },
  { prop: "newHandleResult", label: "最新处理结果" },
  { prop: "handleTimes", label: "处理次数" },
  {
    prop: "insure",
    label: "是否投保",
    enum: whether
  },
  { prop: "recycleBranch", label: "回收门店" },
  {
    prop: "submitOrderTime",
    label: "提交工单时间",
    width: 180,
    render: scope => {
      const time = scope.row?.submitOrderTime;
      return <span>{useDateFormat(time, "YYYY-MM-DD HH:mm:ss").value || "--"}</span>;
    }
  },
  {
    prop: "newHandleTime",
    label: "最新处理时间",
    width: 180,
    render: scope => {
      const time = scope.row?.newHandleTime;
      return <span>{useDateFormat(time, "YYYY-MM-DD HH:mm:ss").value || "--"}</span>;
    }
  },
  { prop: "handleTime", label: "处理时效" },
  {
    prop: "orderStar",
    label: "工单星级",
    width: 180,
    render: scope => {
      return <el-rate v-model={scope.row.orderStar} max={3} disabled />;
    }
  },
  {
    prop: "orderStatus",
    label: "状态",
    enum: ticket_status,
    search: { el: "select", props: { filterable: true } }
  },
  {
    prop: "orderChecker",
    label: "审核人"
  },
  {
    prop: "checkerResult",
    label: "审核结果",
    search: { el: "select", props: { filterable: true } },
    enum: ticket_check_res
  }
];

const operatorOrder = (row: Partial<SalesOrder.ResSalesList> = {}) => {
  const id = row.id;
  if (id) {
    router.push({ name: "add-ticket", query: { id } });
  } else {
    router.push({ name: "add-ticket" });
  }
};

const orderCheckRef = ref<any>(null);
const openCheck = (row: any) => {
  orderCheckRef.value?.openDialog({ row, getTableList: proTable.value?.getTableList });
};

const delOrder = async (id: number, orderCode: string) => {
  await useHandleData(delSalesOrder, id, `删除工单编号【${orderCode}】这条数据`);
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: title === "下载" ? `${title}工单批量导入模板` : "工单批量导入",
    status: title === "下载",
    tempApi: orderTemplate,
    updateApi: orderUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 批量导出工单信息
const batchExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await orderExport(obj);
  saveFile(data, "工单报表");
};
</script>
