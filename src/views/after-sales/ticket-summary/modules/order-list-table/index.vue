<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="工单处理报表"
      :columns="columns"
      :request-api="getTableList"
      :is-show-search="isShowTableHeaderBtn"
      :tool-button="isShowTableHeaderBtn"
      :init-param="initParam"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <div class="table-header">
          <el-radio-group v-model="currentTimeSelect" @change="changeSelectDate" class="date-radio">
            <el-radio-button v-for="(item, index) in tabDateList" :key="index" :label="item.title" />
          </el-radio-group>
          <el-button type="primary" :icon="Document" @click="exportData">导出Excel</el-button>
        </div>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="operatorOrder(scope.row)" size="small" :icon="View"> 查看 </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="OrderListTable">
import { getSalesList, getSalesListToday, orderExport } from "@/api/modules/ticket";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Document, View } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { SalesOrder } from "@/api/interface";
import { useDateFormat } from "@vueuse/core";
import { saveFile } from "@/utils/file";
import { useRouter } from "vue-router";
import deepcopy from "deepcopy";
import { useDict } from "@/hooks/useDict";
import { isExistRoute } from "@/utils/data";

const proTable = ref<ProTableInstance>();
const initParam = reactive({});
const router = useRouter();

interface Props {
  isShowTableHeaderBtn: boolean;
  selectBranchId: number;
}
const tableProps = withDefaults(defineProps<Props>(), {
  selectBranchId: undefined,
  isShowTableHeaderBtn: true
});

const { ticket_check_res, ticket_status } = useDict("ticket_check_res", "ticket_status");

const toAccount = (code: string) => {
  if (!isExistRoute("account")) return;
  router.push({ name: "account", query: { accountCode: code } });
};

// 表格配置项
const columns: ColumnProps<SalesOrder.ResSalesList>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "operation", label: "操作", fixed: "right", width: 100 },
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
    fixed: "left",
    render: ({ row }) => {
      return (
        <el-button type="primary" link onClick={() => toAccount(row?.accountCode)}>
          {row?.accountCode || "--"}
        </el-button>
      );
    }
  },
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
  { prop: "orderChecker", label: "审核人" },
  {
    prop: "checkerResult",
    label: "审核结果",
    search: { el: "select", props: { filterable: true } },
    enum: ticket_check_res
  },
  { prop: "reason", label: "未通过原因" }
];
const currentTimeSelect = ref("今日工单");
const tabDateList = ref([
  {
    title: "今日工单"
  },
  {
    title: "历史工单"
  }
]);

function changeSelectDate(e: string | number | boolean) {
  currentTimeSelect.value = e as string;
}

const operatorOrder = (row: Partial<SalesOrder.ResSalesList> = {}) => {
  const id = row.id;
  if (id) {
    router.push({ name: "add-ticket", query: { id } });
  } else {
    router.push({ name: "add-ticket" });
  }
};

// 获取表格数据
const getTableList = async (params: any) => {
  let newParams = deepcopy(params);
  newParams.branchId = tableProps.selectBranchId;
  if (!newParams.branchId) {
    return false;
  }
  if (currentTimeSelect.value === "今日工单") {
    return await getSalesListToday(newParams);
  } else {
    return await getSalesList(newParams);
  }
};

// 监听 selectBranchId
watch(
  () => tableProps.selectBranchId,
  () => {
    proTable.value?.getTableList();
  }
);

// 监听 currentTimeSelect.value
watch(
  () => currentTimeSelect.value,
  () => {
    proTable.value?.getTableList();
  }
);

const exportData = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await orderExport(obj);
  await saveFile(data, "工单报表");
};
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  align-items: center;
  .date-radio {
    margin-right: 60px;
    transform: translateY(-7px);
  }
  .el-button {
    height: 31px;
  }
}
</style>
