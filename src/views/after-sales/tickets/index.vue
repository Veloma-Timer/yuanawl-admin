<template>
  <div class="table-box">
    <ProTable ref="proTable" title="售后工单汇总" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds, isSelected }">
        <el-button v-auth="'ticket:add'" type="primary" @click="operatorOrder()" :icon="Plus">新增</el-button>
        <el-button
          v-auth="'ticket:delete'"
          :disabled="!isSelected"
          type="danger"
          plain
          @click="delOrder(selectedListIds)"
          :icon="Delete"
        >
          批量删除
        </el-button>
        <el-button v-auth="'ticket:download-template'" @click="batchAdd('下载')" :icon="Download" plain> 下载模板</el-button>
        <el-button v-auth="'ticket:import'" @click="batchAdd('导入')" :icon="Upload" plain>导入Excel</el-button>
        <el-button v-auth="'ticket:export'" @click="batchExport(selectedListIds)" :icon="Download" plain>导出Excel</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" :color="BLUE_COLOR" plain text @click="operatorOrder(row)">查看</el-button>
        <el-button v-auth="'ticket:check'" :color="BLUE_COLOR" plain text @click="openCheck(row)">审核</el-button>
        <el-button
          v-auth="'ticket:handle'"
          :disabled="row.isNeedHandle !== '1'"
          :color="BLUE_COLOR"
          plain
          text
          @click="changeOrder(row)"
        >
          处理工单
        </el-button>
      </template>
    </ProTable>
    <OrderCheck ref="orderCheckRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="TicketsTable">
import {delSalesOrder, getSalesList, orderExport, orderTemplate, orderUpload} from "@/api/modules/ticket";
import {Plus, Delete, Download, Upload} from "@element-plus/icons-vue";
import {ColumnProps, ProTableInstance} from "@/components/ProTable/interface";
import ImportExcel from "@/views/account-admin/components/ImportExcel/index.vue";
import OrderCheck from "@/views/after-sales/modules/order-check/index.vue";
import {getOperationColWidth, visibleOperationCol} from "@/utils";
import ProTable from "@/components/ProTable/index.vue";
import {useHandleData} from "@/hooks/useHandleData";
import {useAuthStore} from "@/stores/modules/auth";
import {useRoute, useRouter} from "vue-router";
import {getAllUser} from "@/api/modules/branch";
import {SalesOrder} from "@/api/interface";
import {useDateFormat} from "@vueuse/core";
import {saveFile} from "@/utils/file";
import {useDict} from "@/hooks/useDict";
import {isExistRoute} from "@/utils/data";
import {BLUE_COLOR} from "@/config";

const proTable = ref<ProTableInstance>();
const initParam = reactive({});
const route = useRoute();
const router = useRouter();
const getTableList = (params: any) => getSalesList(params);

const pageButtons = ["ticket:check", "ticket:handle"];

const { orderProblemTypes, whether, ticket_check_res } = useDict("orderProblemTypes", "whether", "ticket_check_res");

const auth = useAuthStore();

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
    fixed: "left",
    search: { el: "input" }
  },
  {
    prop: "accountCode",
    label: "账号编码",
    search: { el: "input" },
    fixed: "left",
    render: ({ row }) => {
      return (
        <el-button type="primary" link onClick={() => toAccount(row?.account?.accountCode)}>
          {row?.account?.accountCode || "--"}
        </el-button>
      );
    }
  },
  {
    prop: "orderStar",
    label: "工单星级",
    fixed: "left",
    width: 140,
    search: { el: "input" },
    render: ({row}) => {
      return <el-rate v-model={row.orderStar} max={row.orderStar > 3 ? row.orderStar : 3} disabled show-score
                      text-color="#ff9900"
                      score-template="{value} 级"/>;
    }
  },
  {
    prop: "accountBranch",
    label: "账号所属部门"
  },
  {
    prop: "problemTypeId",
    label: "问题类型",
    enum: orderProblemTypes,
    search: { el: "select", props: { filterable: true } }
  },
  {
    prop: "reportPersonId",
    label: "上报人姓名",
    enum: getAllUser,
    fieldNames: { label: "name", value: "id" },
    search: { el: "input" }
  },
  {
    prop: "createdTime",
    label: "上报日期",
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
    prop: "handleTime",
    label: "处理时效",
    tag: true,
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
          width: getOperationColWidth(auth.authButtonList, pageButtons) + 60,
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

const delOrder = async (id: string[] | string) => {
  const ids = Array.isArray(id) ? id : [id];
  await useHandleData(delSalesOrder, ids, `删除工单`);
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
const batchExport = async (ids: string[]) => {
  const data = await orderExport(ids);
  await saveFile(data, "工单报表");
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
