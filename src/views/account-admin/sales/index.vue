<template>
  <div class="v-sales table-box">
    <div class="flex flex-col h-full p-4 bg-white rounded-md">
      <el-tabs v-model="initParam.branchId" type="card" class="bg-white">
        <el-tab-pane v-for="branch in branchList" :key="branch.id" :label="branch.branchName" :name="branch.id"></el-tab-pane>
      </el-tabs>
      <ProTable
        ref="proTable"
        title="销售列表"
        :columns="columns"
        :toolButton="isShowTableHeaderBtn"
        :isShowSearch="isShowTableHeaderBtn"
        :init-param="initParam"
        :request-api="getTableList"
        :summary-key="['salePrice', 'accountRecyclerPrice']"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader="{ selectedListIds }">
          <el-button
            v-if="isShowTableHeaderBtn"
            v-auth="'sales:download-template'"
            :icon="Download"
            plain
            @click="batchAdd('下载')"
          >
            下载销售模板
          </el-button>
          <el-button v-if="isShowTableHeaderBtn" v-auth="'sales:import'" plain @click="batchAdd('导入')">导入Excel</el-button>
          <el-button v-auth="'sales:export'" :icon="Document" plain @click="onExport(selectedListIds)">导出Excel </el-button>
        </template>
        <!-- Expand -->
        <template #salePrice="scope">
          {{ getFixed(scope.row.salePrice) || "--" }}
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button
            v-auth="'sales:sales'"
            v-if="scope.row.isSales === '0'"
            :color="BLUE_COLOR"
            text
            plain
            @click="openDrawer('新增', scope.row)"
          >
            销售
          </el-button>
          <!-- 只有已售出并且是管理员的用户才可以修改 -->
          <el-button
            v-auth="'sales:edit'"
            v-if="scope.row.isSales == '1'"
            :color="BLUE_COLOR"
            text
            type="primary"
            plain
            @click="openDrawer('编辑', scope.row)"
            >编辑
          </el-button>
          <el-button v-auth="'sales:create-ticket'" :color="BLUE_COLOR" text plain @click="addOrder(scope.row)"
            >创建工单</el-button
          >
        </template>
      </ProTable>
    </div>
    <SaleDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="SalesTable">
import {addSales, editSales, exportSales, getSalesList, salesTemplate, salesUpload} from "@/api/modules/account";
import {getFixed, getOperationColWidth, parseTime, shortcuts, visibleOperationCol} from "@/utils";
import {Document, Download} from "@element-plus/icons-vue";
import {getAccountCodeAndId, getAllBranch, type IBranch} from "@/api/modules/branch";
import ImportExcel from "@/views/account-admin/components/ImportExcel/index.vue";
import {ColumnProps, ProTableInstance} from "@/components/ProTable/interface";
import SaleDrawer from "@/views/account-admin/sales/modules/SaleDrawer.vue";
import {Commodity} from "@/api/interface/commodity/commodity";
import ProTable from "@/components/ProTable/index.vue";
import {getAllList} from "@/api/modules/accountClass";
import {useAuthStore} from "@/stores/modules/auth";
import {useUserStore} from "@/stores/modules/user";
import {getUserAll} from "@/api/modules/user";
import {useDict} from "@/hooks/useDict";
import {IAccountType} from "@/typings";
import {saveFile} from "@/utils/file";
import {useRouter} from "vue-router";
import deepcopy from "deepcopy";
import {BLUE_COLOR} from "@/config";
// 数据统计引用的本页面 需要隐藏部分
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    isShowTableHeaderBtn?: boolean;
  }>(),
  {
    disabled: false,
    isShowTableHeaderBtn: true
  }
);

const router = useRouter();

const { publishPlatform: platform } = useDict("publishPlatform");

const pageButtons = ["sales:create-ticket", "sales:edit"];

const auth = useAuthStore();

const proTable = ref<ProTableInstance>();

const initParam: {
  branchId?: number;
} = reactive({ branchId: undefined });
const userStore = useUserStore();

const getTableList = async (params: any) => {
  if (!params.branchId) return {};

  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return await getSalesList(newParams);
};
const batchAdd = (title: string) => {
  const params = {
    title: `销售模板`,
    status: title === "下载",
    tempApi: salesTemplate,
    updateApi: salesUpload,
    getTableList: proTable.value!.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

let typeList = ref<IAccountType[]>([]);

const getTypeList = async () => {
  const { data } = await getAllList();
  typeList.value = data;
};
getTypeList();

const getTypeListName = (ids: number[]) => {
  const idsNum = ids?.map(item => Number(item));
  const list = typeList.value;
  return idsNum?.map(item => {
    const obj = list.find(items => items.id === item);
    return obj?.typeName;
  });
};

const branchList = ref<IBranch[]>([]);

const columns: ColumnProps<Commodity.Sales>[] = [
  { type: "selection", width: 55, fixed: true },
  {
    prop: "accountCode",
    label: "账号编码",
    fixed: true,
    enum: getAccountCodeAndId,
    search: {
      el: "select-v2",
      props: {
        filterable: true,
        "allow-create": true
      }
      // slotName: true
    },
    fieldNames: { label: "accountCode", value: "accountCode" },
    render: ({ row }) => {
      const status = row.isWorkOrder === "1";
      return (
        <div class="cursor-pointer">
          <div class="cursor-pointer">
            {status ? (
              <router-link to={{ name: "add-ticket", query: { id: row?.orderId || "" } }}>
                <span class="red">{row.accountCode}</span>
              </router-link>
            ) : (
              <span>{row.accountCode}</span>
            )}
          </div>
        </div>
      );
    }
  },
  {
    prop: "isSales",
    label: "销售状态",
    search: { el: "select" },
    enum: [
      { label: "未售", value: "0" },
      { label: "已售", value: "1" }
    ],
    render: ({ row }) => {
      const status = row.isSales === "0";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "未售" : "已售"}</span>
        </div>
      );
    }
  },
  { prop: "salesCode", label: "销售订单号", search: { el: "input" } },
  {
    prop: "salePeopleId",
    label: "出售人",
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "saleTime",
    label: "出售时间",
    render: scope => {
      return parseTime(scope.row?.saleTime, "{y}-{m}-{d} {h}:{i}:{s}");
    }
  },
  {
    prop: "salePlatformId",
    tag: true,
    label: "出售平台",
    enum: platform,
    search: { el: "select" }
  },
  { prop: "salePrice", label: "出售金额", search: { el: "input" } },
  { prop: "salesRemark", label: "销售备注" },
  {
    prop: "account",
    label: "账号",
    sortable: true,
    search: {
      el: "input"
    }
  },
  {
    prop: "branchId",
    label: "所属门店",
    sortable: true,
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
    prop: "noSaleResidenceTime",
    label: "滞留时间",
    render: scope => (scope.row!.noSaleResidenceTime || 0) + "天"
  },

  {
    prop: "accountRecyclerPrice",
    label: "回收金额",
    search: { el: "input" },
    render: ({ row }) => <span>{getFixed(row.accountRecyclerPrice) || "--"}</span>
  },
  {
    prop: "accountType",
    label: "游戏分类",
    sortable: true,
    enum: getAllList,
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    fieldNames: { label: "typeName", value: "id" },
    render: ({ row }) => {
      return (
        <div class="flex flex-row gap-1">
          {getTypeListName(row.accountType!).map(type => {
            return <el-tag key={type}>{type}</el-tag>;
          })}
        </div>
      );
    }
  },
  {
    prop: "accountPassword",
    sortable: true,
    label: "密码"
  },
  {
    prop: "accountTel",
    label: "密保手机",
    search: { el: "input" }
  },
  {
    prop: "haveSecondary",
    label: "有无二次",
    sortable: true,
    enum: [
      { label: "有", value: "1" },
      { label: "无", value: "0" }
    ],
    search: {
      el: "select",
      props: {
        filterable: true
      }
    }
  },
  { prop: "campId", label: "营地号", search: { el: "input" } },
  { prop: "recycleOrder", label: "回收订单号", search: { el: "input" } },
  {
    prop: "accountRecyclerId",
    label: "回收人",
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "accountRecyclerTime",
    label: "回收日期",
    render: scope => {
      return parseTime(scope.row?.accountRecyclerTime, "{y}-{m}-{d} {h}:{i}");
    }
  },
  // { prop: "recycleRemark", label: "回收备注" },
  {
    prop: "isWorkOrder",
    label: "有无工单",
    sortable: true,
    enum: [
      { label: "有", value: "1" },
      { label: "无", value: "0" }
    ],
    search: { el: "select" },
    render: ({ row }) => {
      const status = row.isWorkOrder === "0";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-green" : "v-red"}></span>
          <span>{status ? "无" : "有"}</span>
        </div>
      );
    }
  },
  {
    prop: "accountPublisherId",
    label: "发布人",
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "isPublish",
    label: "发布状态",
    search: { el: "select" },
    enum: [
      { label: "未发布", value: "0" },
      { label: "已发布", value: "1" }
    ],
    render: ({ row }) => {
      const status = row.isPublish === "0";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "未发布" : "已发布"}</span>
        </div>
      );
    }
  },
  { prop: "buyerTel", label: "买家手机号", search: { el: "input" } },
  {
    prop: "timeSection",
    sortable: true,
    isShow: false,
    label: "时间区间",
    search: {
      el: "date-picker",
      props: { type: "daterange", unlinkPanels: true, shortcuts: shortcuts, valueFormat: "YYYY-MM-DD" }
    }
  },
  ...(visibleOperationCol(auth.authButtonList, pageButtons) && !props.disabled
    ? [
        {
          prop: "operation",
          label: "操作",
          width: getOperationColWidth(auth.authButtonList, pageButtons),
          fixed: "right"
        }
      ]
    : [])
];

const onExport = async (ids: string[]) => {
  const data = await exportSales(ids);
  await saveFile(data, "销售列表");
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);

const date = new Date();
const time = parseTime(date, "{y}-{m}-{d} {h}:{i}:{s}");
// 打开 drawer(新增、编辑、编辑)
const drawerRef = ref<InstanceType<typeof SaleDrawer> | null>(null);
// 创建工单
const addOrder = (row: Partial<Commodity.Sales>) => {
  const id = row.id;
  router.push({ name: "add-ticket", query: { accId: id || "" } });
};
const openDrawer = (title: string, row: Partial<Commodity.Sales> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: {
      ...row,
      salePrice: Number(row.salePrice),
      accountCode: row.accountCode,
      saleTime: time,
      salePeopleId: userStore.userInfo.id
      // salePlatformId: title === "编辑" ? userStore.userInfo.id : null
    },
    platform: platform.value,
    api: title === "新增" ? addSales : title === "编辑" ? editSales : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params as any);
};

watchEffect(async () => {
  const {data} = await getAllBranch();

  branchList.value = data;
  initParam.branchId = data?.[0]?.id;
});
</script>

<style lang="scss">
.v-sales {
  .el-tabs__header {
    border-bottom: none !important;
    margin: 0 !important;
  }

  .card {
    box-shadow: none;
    border-radius: 0;
  }
}

.circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
}

.v-red {
  @extend .circle;
  background-color: var(--el-color-error);
}

.v-green {
  @extend .circle;
  background-color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

.green {
  color: var(--el-color-success);
}
</style>
