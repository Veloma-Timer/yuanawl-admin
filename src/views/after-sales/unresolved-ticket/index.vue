<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="未完结工单列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ isSelected, selectedListIds }">
        <el-button v-auth="'unresolved-ticket:export'" @click="batchExport(selectedListIds)" :icon="Document" plain
          >导出Excel
        </el-button>
        <el-button
          v-auth="'unresolved-ticket:delete'"
          :disabled="!isSelected"
          :icon="Delete"
          type="danger"
          plain
          @click="delOrder(selectedListIds)"
          >批量删除
        </el-button>
      </template>
      <!--表格操作-->
      <template #operation="{ row }">
        <el-button :color="BLUE_COLOR" plain text @click="operatorOrder(row)">查看</el-button>
        <el-button
          v-auth="'unresolved-ticket:handle'"
          :disabled="row.isNeedHandle != '1'"
          :color="BLUE_COLOR"
          plain
          text
          @click="changeOrder(row)"
          >处理
        </el-button>
        <el-button v-auth="'unresolved-ticket:check'" :color="BLUE_COLOR" plain text @click="openCheck(row)">审核</el-button>
      </template>
    </ProTable>
    <OrderCheck ref="orderCheckRef" />
  </div>
</template>

<script setup lang="tsx" name="UnresolvedTicketProTable">
import { delSalesOrder, getSalesListUnfinished, orderExport } from "@/api/modules/ticket";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, Document } from "@element-plus/icons-vue";
import OrderCheck from "@/views/after-sales/modules/order-check/index.vue";
import { getOperationColWidth, visibleOperationCol } from "@/utils";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthStore } from "@/stores/modules/auth";
import { SalesOrder } from "@/api/interface";
import { useDateFormat } from "@vueuse/core";
import { saveFile } from "@/utils/file";
import { useRouter } from "vue-router";
import { useDict } from "@/hooks/useDict";
import { isExistRoute } from "@/utils/data";
import { BLUE_COLOR } from "@/config";

const proTable = ref<ProTableInstance>();
const initParam = reactive({});
const router = useRouter();

const pageButtons = ["unresolved-ticket:check", "unresolved-ticket:handle"];

const auth = useAuthStore();

const getTableList = async (params: any) => await getSalesListUnfinished(params);

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
  {
    prop: "orderCode",
    label: "工单编号",
    search: { el: "input" }
  },
  {
    prop: "accountCode",
    label: "账号编码",
    width: 180,
    search: { el: "input" },
    fixed: "left",
    render: ({ row }) => {
      return (
        <el-button type="primary" link onClick={() => toAccount(row?.accountCode)}>
          {row?.account?.accountCode || "--"}
        </el-button>
      );
    }
  },
  {
    prop: "problemTypeId",
    label: "问题类型",
    enum: orderProblemTypes,
    search: { el: "select", props: { filterable: true } }
  },
  {
    prop: "orderCode",
    label: "账号",
    search: { el: "input" },
    width: 180,
    render: scope => {
      return <span>{scope.row?.account?.account || "-"}</span>;
    }
  },
  {
    prop: "reportPersonId",
    label: "上报人姓名",
    search: { el: "input" }
  },
  {
    prop: "createdTime",
    label: "上报日期",
    width: 180,
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "datetime", valueFormat: "YYYY-MM-DD", format: "YYYY-MM-DD" }
    },
    render: scope => {
      const time = scope.row?.createdTime;
      return <span>{useDateFormat(time, "YYYY-MM-DD HH:mm:ss").value || "--"}</span>;
    }
  },
  {
    prop: "insure",
    label: "是否投保",
    search: { el: "select", props: { filterable: true } },
    enum: whether
  },
  {
    prop: "orderStar",
    label: "工单星级",
    search: { el: "input" },
    width: 180,
    render: scope => {
      return <el-rate v-model={scope.row.orderStar} max={3} disabled />;
    }
  },
  {
    prop: "handleTime",
    label: "处理时效",
    search: { el: "input" }
  },
  {
    prop: "remark",
    label: "留言"
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
  },
  {
    prop: "reason",
    label: "未通过原因"
  },
  ...(visibleOperationCol(auth.authButtonList, pageButtons)
    ? [
        {
          prop: "operation",
          label: "操作",
          width: getOperationColWidth(auth.authButtonList, pageButtons) + 70,
          fixed: "right"
        }
      ]
    : [])
];

const operatorOrder = (row: Partial<SalesOrder.ResSalesList> = {}) => {
  const id = row?.id;
  if (id) {
    router.push({ name: "add-ticket", query: { id, isView: "true" } });
  } else {
    router.push({ name: "add-ticket" });
  }
};

const changeOrder = (row: Partial<SalesOrder.ResSalesList> = {}) => {
  const id = row?.id;
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

const delOrder = async (ids: string[]) => {
  await useHandleData(delSalesOrder, ids, `删除工单`);
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 批量导出工单信息
const batchExport = async (ids?: string[]) => {
  const data = await orderExport(ids);
  await saveFile(data, "工单报表");
};
</script>

<style scoped lang="scss">
:deep(.el-upload) {
  display: inline-block;
}

.up-btn {
  display: inline-block;
  margin: 0 10px;
}
</style>
