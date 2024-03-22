<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="发布列表"
      :columns="columns"
      :init-param="initParam"
      :tool-button="isShowTableHeaderBtn"
      :request-api="getTableList"
      :isShowSearch="isShowTableHeaderBtn"
      :summary-key="['publishPrice', 'accountRecyclerPrice']"
    >
      <!-- 表格 header 按钮 -->
      <!-- Expand -->
      <template #publishPrice="scope">
        {{ getFixed(scope.row.publishPrice) || "--" }}
      </template>
      <!-- 表格操作 -->
      <template #tableHeader="{ selectedListIds }">
        <el-button
          v-if="isShowTableHeaderBtn"
          v-auth="'publish:download-template'"
          :icon="Download"
          plain
          @click="batchAdd('下载')"
        >
          下载模板
        </el-button>
        <el-button v-if="isShowTableHeaderBtn" v-auth="'publish:import'" :icon="Upload" plain @click="batchAdd('导入')"
          >导入Excel</el-button
        >
        <el-button v-auth="'publish:export'" :icon="Document" plain @click="onExport(selectedListIds)">导出Excel </el-button>
      </template>
      <template #operation="scope">
        <el-button
          v-auth="'publish:publish'"
          v-if="scope.row.isPublish == '0'"
          text
          type="primary"
          @click="openDrawer('新增', scope.row)"
        >
          发布
        </el-button>
        <el-button v-auth="'publish:edit'" :color="BLUE_COLOR" text plain @click="openDrawer('编辑', scope.row)">编辑 </el-button>
        <el-button v-auth="'publish:create-ticket'" :color="BLUE_COLOR" text plain @click="addOrder(scope.row)">
          创建工单
        </el-button>
      </template>
    </ProTable>
    <PublishDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="PublishTable">
import { addPublish, editPublish, exportPublish, getPublishList, publishTemplate, publishUpload } from "@/api/modules/account";
import { getFixed, getOperationColWidth, parseTime, shortcuts, visibleOperationCol } from "@/utils";
import { Document, Download, Upload } from "@element-plus/icons-vue";
import PublishDrawer from "@/views/account-admin/publish/modules/PublishDrawer.vue";
import ImportExcel from "@/views/account-admin/components/ImportExcel/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Commodity } from "@/api/interface/commodity/commodity";
import ProTable from "@/components/ProTable/index.vue";
import { getAccountCodeAndId } from "@/api/modules/branch";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";
import { getUserAll } from "@/api/modules/user";
import { useDict } from "@/hooks/useDict";
import { saveFile } from "@/utils/file";
import { useRouter } from "vue-router";
import { Dict } from "@/typings/dict";
import currency from "currency.js";
import deepcopy from "deepcopy";
import { BLUE_COLOR } from "@/config";

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

const userStore = useUserStore();

const router = useRouter();

const pageButtons = ["publish:create-ticket", "publish:edit", "publish:publish"];

const auth = useAuthStore();

const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// 创建工单
const addOrder = (row: Partial<Commodity.Sales>) => {
  const id = row.id;
  router.push({ name: "add-ticket", query: { accId: id || "" } });
};

const getTableList = (params: any) => {
  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getPublishList(newParams);
};

const { publishPlatform } = useDict("publishPlatform");

const columns: ColumnProps<Commodity.Release>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "accountCode",
    label: "账号编码",
    fixed: "left",
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
    // render会导致不刷新
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
  { prop: "accountDesc", label: "账号描述", search: { el: "input" } },
  { prop: "publishPrice", label: "发布价格", search: { el: "input" } },
  {
    prop: "accountPublisherId",
    label: "发布人",
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "accountPublisherTimer",
    label: "发布时间",
    render: ({ row }) => {
      return parseTime(row!.accountPublisherTimer, "{y}-{m}-{d}");
    }
  },
  {
    prop: "publishPlatform",
    label: "发布平台",
    enum: publishPlatform,
    minWidth: 150,
    search: {
      el: "select",
      props: {
        filterable: true,
        multiple: true
      }
    },
    render: ({ row }) => {
      if (!row.publishPlatform || row.publishPlatform.length < 1) return "--";

      return (
        <div class="flex justify-center gap-1">
          {row.publishPlatform?.map(id => {
            const platform: Dict.IDataItem = publishPlatform.value.find((item: any) => item.value == id)!;
            return <el-tag>{platform?.label}</el-tag>;
          })}
        </div>
      );
    }
  },
  { prop: "publishRemark", label: "发布备注", search: { el: "input" } },
  {
    prop: "account",
    label: "账号",
    sortable: true,
    search: {
      el: "input"
    }
  },
  {
    prop: "accountPassword",
    label: "密码"
  },
  {
    prop: "accountTel",
    label: "密保手机",
    search: { el: "input" }
  },
  { prop: "campId", label: "营地号", search: { el: "input" } },
  {
    prop: "systemId",
    label: "系统",
    search: { el: "select" },
    width: 150,
    enum: [
      { label: "安卓QQ", value: 1 },
      { label: "苹果QQ", value: 2 },
      { label: "安卓微信", value: 3 },
      { label: "苹果微信", value: 4 }
    ]
  },
  {
    prop: "accountRecyclerPrice",
    label: "回收价格",
    render: ({ row }) => currency(row.accountRecyclerPrice).format({ symbol: "¥" })
  },
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
      return parseTime(scope.row?.accountRecyclerTime, "{y}-{m}-{d}");
    }
  },
  { prop: "recycleRemark", label: "回收备注" },
  {
    prop: "isWorkOrder",
    label: "是否存在工单",
    sortable: true,
    enum: [
      { label: "有", value: "1" },
      { label: "没有", value: "0" }
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
  {
    prop: "rollBackTimer",
    label: "回滚时间",
    search: {
      el: "date-picker"
    },
    render: ({ row }) => {
      return parseTime(row!.rollBackTimer, "{y}-{m}-{d} {h}:{i}:{s}");
    }
  },
  {
    prop: "rollBackPlatform",
    label: "回滚平台",
    enum: publishPlatform,
    search: {
      el: "select",
      props: {
        filterable: true,
        multiple: true
      }
    },
    render: ({ row }) => {
      return (
        <div>
          {row.rollBackPlatform && row.rollBackPlatform?.length > 0
            ? row.rollBackPlatform?.map(id => {
                const platform = publishPlatform.value.find(item => {
                  const value = item.value || item.id;
                  return value == id;
                }) as any;
                return <el-tag>{platform?.label}</el-tag>;
              })
            : "--"}
        </div>
      );
    }
  },
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
  const data = await exportPublish(ids);
  await saveFile(data, "发布列表");
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: `${title}发布列表模板`,
    status: title === "下载",
    tempApi: publishTemplate,
    updateApi: publishUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof PublishDrawer> | null>(null);

const date = new Date();
const time = parseTime(date, "{y}-{m}-{d} {h}:{i}:{s}");
const openDrawer = (title: string, row: Partial<Commodity.Release> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: {
      ...row,
      publishPrice: Number(row.publishPrice),
      accountPublisherTimer: time,
      accountPublisherId: row.accountPublisherId ?? userStore.userInfo.id
    },
    publishPlatform: publishPlatform.value,
    api: title === "新增" ? addPublish : title === "编辑" ? editPublish : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params as any);
};
</script>

<style lang="scss">
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
