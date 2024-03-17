<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="已完结工单"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds }">
        <el-button v-auth="'completed-ticket:export'" @click="batchExport(selectedListIds)" :icon="Document" plain>
          导出Excel
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button :color="BLUE_COLOR" plain text @click="operatorOrder(row)">查看</el-button>
      </template>
    </ProTable>
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="CompletedTicket">
import ImportExcel from "@/views/account-admin/components/ImportExcel/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { getSalesListFinished, orderExport } from "@/api/modules/ticket";
import { Document, View } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { useRoute, useRouter } from "vue-router";
import { useDateFormat } from "@vueuse/core";
import { SalesOrder } from "@/api/interface";
import { saveFile } from "@/utils/file";
import { useDict } from "@/hooks/useDict";
import { isExistRoute } from "@/utils/data";
import { BLUE_COLOR } from "@/config";
const proTable = ref<ProTableInstance>();
const initParam = reactive({});
const route = useRoute();
const router = useRouter();
const getTableList = (params: any) => getSalesListFinished(params);

const { orderProblemTypes, whether, ticket_check_res } = useDict("orderProblemTypes", "whether", "ticket_check_res");

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
    fixed: "left",
    search: { el: "input" },
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
    search: { el: "select", props: { filterable: true } },
    width: 180
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
    width: 180,
    search: { el: "select", props: { filterable: true } },
    enum: ticket_check_res
  },
  {
    prop: "reason",
    label: "未通过原因",
    width: 180
  },
  { prop: "operation", label: "操作", fixed: "right", width: 80 }
];

const operatorOrder = (row: Partial<SalesOrder.ResSalesList> = {}) => {
  const id = row?.id;
  if (id) {
    router.push({ name: "add-ticket", query: { id } });
  } else {
    router.push({ name: "add-ticket" });
  }
};

// 批量导出工单信息
const batchExport = async (ids: string[]) => {
  const data = await orderExport(ids);
  saveFile(data, "工单报表");
};
onMounted(() => {
  setTimeout(() => {
    // 携带参数page跳转
    const orderCode = route.query.orderCode;
    if (proTable.value) {
      proTable.value.searchParam.orderCode = orderCode;
      proTable.value?.search();
    }
  }, 300);
});
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
