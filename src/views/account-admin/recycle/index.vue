<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="回收列表"
      :columns="columns"
      :init-param="initParam"
      :tool-button="isShowTableHeaderBtn"
      :request-api="getTableList"
      :isShowSearch="isShowTableHeaderBtn"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds, isSelected }">
        <el-button
          v-if="isShowTableHeaderBtn"
          v-auth="'recycle:add'"
          type="primary"
          :icon="Plus"
          @click="openDrawer('新增')"
          >新增</el-button
        >
        <el-button
          v-if="isShowTableHeaderBtn"
          v-auth="'recycle:delete'"
          plain
          :disabled="!isSelected"
          type="danger"
          :icon="Delete"
          @click="deleteAccount(selectedListIds)"
        >
          批量删除
        </el-button>
        <el-button
          v-if="isShowTableHeaderBtn"
          v-auth="'recycle:download-template'"
          :icon="Download"
          plain
          @click="batchAdd('下载')"
        >
          下载模板
        </el-button>
        <el-button v-if="isShowTableHeaderBtn" v-auth="'recycle:import'" :icon="Upload" plain @click="batchAdd('导入')"
          >导入Excel</el-button
        >
        <el-button v-auth="'recycle:export'" :icon="Document" plain @click="onExport">导出Excel</el-button>
      </template>
      <template #accountRecyclerPrice="scope">
        {{ getFixed(scope.row.accountRecyclerPrice) || "--" }}
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
        <el-button v-auth="'recycle:edit'" :color="BLUE_COLOR" text plain @click="openDrawer('编辑', scope.row)">编辑 </el-button>
        <el-button v-auth="'recycle:create-ticket'" :color="BLUE_COLOR" text plain @click="addOrder(scope.row)">
          创建工单
        </el-button>
      </template>
    </ProTable>
    <recoverDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="RecycleTable">
import { Plus, Delete, Document, Download, Hide, Upload, View } from "@element-plus/icons-vue";
import { getFixed, getOperationColWidth, getPhone, setPhone, shortcuts, visibleOperationCol } from "@/utils";
import recoverDrawer from "@/views/account-admin/recycle/modules/recoverDrawer.vue";
import ImportExcel from "@/views/account-admin/components/ImportExcel/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { getAccountCodeAndId, getAllBranch } from "@/api/modules/branch";
import { Commodity } from "@/api/interface/commodity/commodity";
import ProTable from "@/components/ProTable/index.vue";
import { getAllList } from "@/api/modules/accountClass";
import { useHandleData } from "@/hooks/useHandleData";
import { useUserStore } from "@/stores/modules/user";
import { useAuthStore } from "@/stores/modules/auth";
import { getUserAll } from "@/api/modules/user";
import { useDict } from "@/hooks/useDict";
import { saveFile } from "@/utils/file";
import { parseTime } from "@/utils/is";
import { useRouter } from "vue-router";
import deepcopy from "deepcopy";
import {
  addRecycle,
  deleteAccountBatch,
  deleteSummary,
  editRecycle,
  exportRecycle,
  getRecycleList,
  pointBury,
  recycleTemplate,
  recycleUpload
} from "@/api/modules/account";
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

const router = useRouter();
const userStore = useUserStore();

const pageButtons = ["recycle:create-ticket", "recycle:edit"];

const typeList = ref<any[]>([]);

const auth = useAuthStore();

const { recycleShop, recycle_method, whether, system, have_or_not, groups } = useDict(
  "recycleShop",
  "recycle_method",
  "whether",
  "system",
  "have_or_not",
  "groups"
);

const proTable = ref<ProTableInstance>();

// 创建工单
const addOrder = (row: Partial<Commodity.Sales>) => router.push({ name: "add-ticket", query: { accId: row.id || "" } });

const initParam = reactive({});

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: Number(data.pageNum),
    pageSize: Number(data.pageSize)
  };
};

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

const getTableList = async (params: any) => {
  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return await getRecycleList(newParams);
};

const columns: ColumnProps<Commodity.Recovery>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "accountCode",
    label: "账号编码",
    fixed: "left",
    width: 160,
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
  { prop: "recycleOrder", label: "回收订单号", width: 200, search: { el: "input" } },
  {
    prop: "storeId",
    label: "回收门店",
    width: 120,
    search: { el: "select" },
    enum: recycleShop
  },
  {
    prop: "recycleMethod",
    label: "回收方式",
    enum: recycle_method
  },
  {
    prop: "accountRecyclerPrice",
    label: "回收价格",
    width: 160
  },
  {
    prop: "accountRecyclerId",
    label: "回收人",
    width: 160,
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
  { prop: "recycleRemark", label: "回收备注", width: 160, search: { el: "input" } },
  {
    prop: "groupingId",
    label: "分组",
    width: 120,
    search: { el: "select" },
    enum: groups
  },
  {
    prop: "account",
    label: "账号",
    sortable: true,
    width: 160,
    search: {
      el: "input"
    }
  },
  {
    prop: "branchId",
    label: "所属门店",
    width: 160,
    enum: getAllBranch,
    search: { el: "select" },
    fieldNames: { label: "branchName", value: "id" }
  },
  {
    prop: "accountType",
    label: "账号分类",
    width: 160,
    enum: getAllList,
    search: { el: "select" },
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
  { prop: "accountPassword", label: "密码", width: 160 },
  {
    prop: "accountTel",
    label: "密保手机",
    width: 180,
    search: { el: "input" }
  },
  {
    prop: "isSave",
    label: "是否存档",
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
  { prop: "campId", label: "营地号", width: 160, search: { el: "input" } },
  { prop: "phoneRemark", label: "手机卡备注" },
  {
    prop: "email",
    label: "邮箱",
    width: 160,
    search: { el: "input" }
  },
  { prop: "emailSecret", label: "邮箱密保", width: 160 },
  {
    prop: "systemId",
    label: "系统",
    tag: true,
    search: { el: "select" },
    enum: system
  },
  {
    prop: "haveSecondary",
    label: "实名情况",
    tag: true,
    enum: have_or_not
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

// 删除用户信息
const deleteAccount = async (params: Commodity.Account | number[] | string[]) => {
  if (Array.isArray(params)) {
    await useHandleData(deleteAccountBatch, params, `批量删除账号`);
  } else {
    await useHandleData(deleteSummary, { id: [params.id] }, `确认是否删除该【${params.accountCode}】账号吗`);
  }
  proTable.value?.getTableList();
};

const onExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await exportRecycle(obj);
  saveFile(data, "回收列表");
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: `${title}回收列表模板`,
    status: title === "下载",
    tempApi: recycleTemplate,
    updateApi: recycleUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof recoverDrawer> | null>(null);
const openDrawer = async (title: string, row: Partial<Commodity.Recovery> = {}) => {
  const _row = deepcopy(row);
  // 当前时间
  const date = new Date();
  let time = "";
  if (title === "编辑") {
    _row.accountType = row.accountType?.map(item => Number(item));
    _row.accountCode = row.accountCode;
    _row.accountRecyclerTime = parseTime(row.accountRecyclerTime, "{y}-{m}-{d} {h}:{i}:{s}");
    _row.accountRecyclerId = Number(_row.accountRecyclerId);
    _row.branchId = Number(_row.branchId);
  } else {
    time = parseTime(date, "{y}-{m}-{d} {h}:{i}:{s}");
    _row.accountRecyclerTime = time;
    _row.accountRecyclerId = userStore.userInfo.id!;
    _row.branchId = userStore.userInfo.branchId;
  }

  const params = {
    title,
    isView: title === "查看",
    status: title === "查看",
    row: _row,
    api: title === "新增" ? addRecycle : title === "编辑" ? editRecycle : undefined,
    getTableList: proTable.value?.getTableList,
    recycleShop: recycleShop.value,
    recycle_method: recycle_method.value,
    whether: whether.value,
    system: system.value,
    have_or_not: have_or_not.value,
    groups: groups.value
  };
  drawerRef.value?.acceptParams(params);
};
const onSetPhone = (row: any) => {
  const params = {
    accountId: row.id,
    tel: row.accountTel
  };
  pointBury(params).finally(() => {
    row.status = !row.status;
  });
};
</script>
<style lang="scss">
.red {
  color: var(--el-color-error);
}

.green {
  color: var(--el-color-success);
}
</style>
