<template>
  <div class="table-box">
    <ProTable
ref="proTable" title="账号汇总" :columns="columns" :init-param="initParam"
              :summaryKey="['salePrice', 'accountRecyclerPrice']" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds, isSelected }">
        <!--<el-button v-auth="'account:download-template'" :icon="Download" plain @click="batchAdd('下载')">下载模板 </el-button>-->
        <el-button v-auth="'account:import'" :icon="Upload" plain @click="batchAdd('导入')">导入Excel</el-button>
        <el-button v-auth="'account:export'" :icon="Document" plain @click="onExport">导出Excel</el-button>
        <el-button
          v-auth="'account:delete'"
          :disabled="!isSelected"
          :icon="Delete"
          plain
          type="danger"
          @click="deleteAccount(selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
      <template #accountTel="{ row }">
        <div class="flx-justify-between">
          <span>{{ row.status ? getPhone(row.accountTel) : setPhone(row.accountTel) }}</span>
          <span class="cursor-pointer" @click="onSetPhone(row)">
            <el-icon v-show="row.status"><View /></el-icon>
            <el-icon v-show="!row.status"><Hide /></el-icon>
          </span>
        </div>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-auth="'account:edit'" :color="BLUE_COLOR" text plain @click="openDrawer('编辑', scope.row)">编辑 </el-button>
        <el-button v-auth="'account:create-ticket'" :color="BLUE_COLOR" text plain @click="addOrder(scope.row)">
          创建工单
        </el-button>
      </template>
    </ProTable>
    <AccountDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="AccountTable">
import {getFixed, getOperationColWidth, getPhone, parseTime, setPhone, shortcuts, visibleOperationCol} from "@/utils";
import {Delete, Document, Hide, Upload, View} from "@element-plus/icons-vue";
import ImportExcel from "@/views/account-admin/components/ImportExcel/index.vue";
import {ColumnProps, ProTableInstance} from "@/components/ProTable/interface";
import {getAccountCodeAndId, getAllBranch} from "@/api/modules/branch";
import {Commodity} from "@/api/interface/commodity/commodity";
import {getSalesUsers, getUserAll} from "@/api/modules/user";
import AccountDrawer from "./modules/AccountDrawer.vue";
import ProTable from "@/components/ProTable/index.vue";
import {getAllList} from "@/api/modules/accountClass";
import {useHandleData} from "@/hooks/useHandleData";
import {useAuthStore} from "@/stores/modules/auth";
import {useRoute, useRouter} from "vue-router";
import {getGroups} from "@/api/modules/dict";
import {useDict} from "@/hooks/useDict";
import {saveFile} from "@/utils/file";
import deepcopy from "deepcopy";
import {
  accountExport,
  accountTemplate,
  addSummary,
  deleteAccountBatch,
  deleteSummary,
  editSummary,
  pointBury,
  summaryList,
  summaryUpload
} from "@/api/modules/account";
import {BLUE_COLOR} from "@/config";

const route = useRoute();
const router = useRouter();

const proTable = ref<ProTableInstance>();

const initParam = reactive({});
const typeList = ref<any[]>([]);

const pageButtons = ["account:create-ticket", "account:delete"];

const { whether, have_or_not, recycle_method, is_up, publishPlatform, recycleShop, groups } = useDict(
  "whether",
  "have_or_not",
  "recycle_method",
  "is_up",
  "publishPlatform",
  "recycleShop",
  "groups"
);

const auth = useAuthStore();

// 创建工单
const addOrder = (row: Partial<Commodity.Sales>) => router.push({ name: "add-ticket", query: { accId: row.id || "" } });

const getTableList = (params: any) => {
  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return summaryList(newParams);
};

const columns: ColumnProps<Commodity.Account>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "accountCode",
    label: "账号编码",
    fixed: "left",
    sortable: true,
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
          {status ? (
            <router-link to={{ name: "add-ticket", query: { id: row?.orderId || "" } }}>
              <span class="red">{row.accountCode}</span>
            </router-link>
          ) : (
            <span>{row.accountCode}</span>
          )}
        </div>
      );
    }
  },
  {
    prop: "recycleOrder",
    label: "回收订单号",
    search: {
      el: "input"
    }
  },
  {
    prop: "accountRecyclerId",
    label: "回收人",
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "account",
    label: "账号",
    search: {
      el: "input"
    }
  },
  {
    prop: "isWorkOrder",
    label: "有无工单",
    sortable: true,
    enum: have_or_not,
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
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
    prop: "isPublish",
    label: "是否发布",
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    sortable: true,
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
  {
    prop: "groupingId",
    label: "回收组",
    enum: async () => {
      const { data: groups } = await getGroups();
      return { data: groups };
    },
    width: 120,
    fieldNames: { label: "label", value: "value" },
    search: {
      el: "select",
      props: {
        filterable: true
      }
    }
  },
  {
    prop: "accountType",
    label: "账号分类",
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
    prop: "salePeopleId",
    label: "出售人",
    enum: getSalesUsers,
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "salePlatformId",
    label: "出售渠道",
    enum: publishPlatform,
    search: { el: "select" }
  },
  {
    prop: "saleTime",
    sortable: true,
    label: "出售时间",
    render: scope => {
      return parseTime(scope.row!.saleTime, "{y}-{m}-{d} {h}:{i}");
    }
  },
  {
    prop: "noSaleResidenceTime",
    label: "滞留时间",
    sortable: true,
    render: scope => {
      return (scope.row?.noSaleResidenceTime || 0) + "天";
    }
  },
  {
    prop: "salePrice",
    label: "出售金额",
    sortable: true,
    search: { el: "input" },
    render: scope => {
      return <span>{getFixed(scope.row.salePrice) || "--"}</span>;
    }
  },
  {
    prop: "accountRecyclerPrice",
    label: "实际回收金额",
    sortable: true,
    search: { el: "input" },
    render: scope => {
      return <span>{getFixed(scope.row.accountRecyclerPrice) || "--"}</span>;
    }
  },
  {
    prop: "branchId",
    label: "所属门店",
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
    prop: "accountPassword",
    label: "密码"
  },
  {
    prop: "accountTel",
    label: "手机号",
    search: { el: "input" }
  },
  {
    prop: "accountRemark",
    sortable: true,
    label: "备注",
    search: { el: "input" }
  },
  { prop: "recycleRemark", label: "回收备注" },
  {
    prop: "accountPublisherId",
    label: "发布人",
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "publishPlatform",
    label: "发布平台",
    enum: publishPlatform,
    search: {
      el: "select",
      props: {
        filterable: true,
        multiple: true
      }
    },
    render: ({ row }) => {
      return row.publishPlatform
        ?.map(id => {
          const platform = publishPlatform.value.find(item => {
            return item.value == id;
          }) as any;
          return platform?.label || "--";
        })
        .join(" ");
    }
  },
  {
    prop: "accountPublisherTimer",
    label: "发布时间",
    render: ({ row }) => {
      return parseTime(row!.accountPublisherTimer, "{y}-{m}-{d}");
    }
  },
  { prop: "recycleRemark", label: "发布备注" },
  { prop: "salesRemark", label: "销售备注" },
  {
    prop: "haveSecondary",
    label: "有无二次",
    tag: true,
    sortable: true,
    enum: have_or_not
  },
  {
    prop: "isSave",
    label: "资料是否存档",
    tag: true,
    sortable: true,
    enum: whether,
    search: {
      el: "select",
      props: {
        filterable: true
      }
    }
  },
  { prop: "accountDesc", sortable: true, label: "账号描述", search: { el: "input" } },
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
  ...(visibleOperationCol(auth.authButtonList, pageButtons)
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

// 删除用户信息
const deleteAccount = async (params: Commodity.Account | number[] | string[]) => {
  if (Array.isArray(params)) {
    await useHandleData(deleteAccountBatch, params, `批量删除账号`);
  } else {
    await useHandleData(deleteSummary, { id: [params.id] }, `删除编号为【${params.accountCode}】的账号`);
  }

  proTable.value?.getTableList();
};

const onExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await accountExport(obj);
  await saveFile(data, "账号汇总");
};

const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: `账号汇总模板`,
    status: title === "下载",
    tempApi: accountTemplate,
    updateApi: summaryUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof AccountDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Commodity.Account> = {}) => {
  let accountType: number[] = [];
  if (title === "编辑") {
    accountType = row.accountType?.map(item => {
      return parseFloat(item as unknown as string);
    })!;
  }
  const params = {
    title,
    isView: title === "查看",
    row: {
      ...row,
      accountType: accountType,
      salePrice: Number(row.salePrice),
      // accountPrice: Number(row.accountPrice),
      userCompensationPrice: Number(row.userCompensationPrice),
      platformCompensationPrice: Number(row.platformCompensationPrice),
      accountRecyclerPrice: Number(row.accountRecyclerPrice)
    },
    have_or_not: have_or_not.value,
    whether: whether.value,
    is_up: is_up.value,
    publishPlatform: publishPlatform.value,
    recycle_method: recycle_method.value,
    recycleShop: recycleShop.value,
    groups: groups.value,
    api: title === "新增" ? addSummary : title === "编辑" ? editSummary : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params as any);
};

const onSetPhone = (row: any) => {
  const params = {
    accountId: row.id,
    accountCode: row.accountCode,
    tel: row.accountTel
  };
  pointBury(params)
    .then(() => {})
    .finally(() => {
      row.status = !row.status;
    });
};
// 游戏类型
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

onMounted(() => {
  setTimeout(() => {
    // 携带参数page跳转
    const {accountCode, accountType} = route.query;
    const type = accountType ? Number(accountType) : null;
    if (proTable.value) {
      proTable.value.searchParam.accountCode = accountCode;
      proTable.value.searchParam.accountType = type;
      proTable.value?.search();
    }
  }, 300);
});

</script>

<style lang="scss">
.circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
}

.red {
  color: var(--el-color-error);
}

.v-red {
  @extend .circle;
  background-color: var(--el-color-error);
}

.v-green {
  @extend .circle;
  background-color: var(--el-color-success);
}
</style>
