<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="已售列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :tool-button="isShowTableHeaderBtn"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds }">
        <div v-if="isShowTableHeaderBtn">
          <el-button v-auth="'sold-out:export'" :icon="Document" plain @click="onExport(selectedListIds)"> 导出Excel </el-button>
        </div>
      </template>
    </ProTable>
    <UnsoldDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="SoldOutTable">
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import UnsoldDrawer from "@/views/account-admin/unsold/modules/UnsoldDrawer.vue";
import ImportExcel from "@/views/account-admin/components/ImportExcel/index.vue";
import { getAccountCodeAndId, getAllBranch } from "@/api/modules/branch";
import { soldOutExport, summaryList } from "@/api/modules/account";
import { Commodity } from "@/api/interface/commodity/commodity";
import { getFixed, parseTime, shortcuts } from "@/utils";
import { getAllList } from "@/api/modules/accountClass";
import ProTable from "@/components/ProTable/index.vue";
import { Document } from "@element-plus/icons-vue";
import { getUserAll } from "@/api/modules/user";
import { saveFile } from "@/utils/file";
import deepcopy from "deepcopy";
import { useDict } from "@/hooks/useDict";

// 数据统计引用的本页面 需要隐藏部分
withDefaults(
  defineProps<{
    isShowTableHeaderBtn?: boolean;
  }>(),
  {
    isShowTableHeaderBtn: true
  }
);

const proTable = ref<ProTableInstance>();

const initParam = reactive({ isSales: "1" });

const getTableList = (params: any) => {
  let newParams = deepcopy(params);
  return summaryList(newParams);
};

const { publishPlatform: platform } = useDict("publishPlatform");

const columns: ColumnProps<Commodity.Account>[] = [
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
    prop: "account",
    label: "账号",
    sortable: true,
    search: {
      el: "input"
    }
  },
  {
    prop: "salePlatformId",
    tag: true,
    label: "出售平台",
    enum: platform,
    search: { el: "select" }
  },
  {
    prop: "accountType",
    label: "游戏分类",
    enum: getAllList,
    search: { el: "select" },
    fieldNames: { label: "typeName", value: "id" },
    render: ({ row }) => row.accountTypeNames
  },
  {
    prop: "accountRecyclerId",
    label: "回收人",
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "accountPublisherId",
    label: "发布人",
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
  },
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
      return parseTime(scope.row?.saleTime, "{y}-{m}-{d} {h}:{i}");
    }
  },
  {
    prop: "salePrice",
    label: "出售金额",
    render: scope => {
      return <span>{getFixed(scope.row?.salePrice) || "--"}</span>;
    }
  },
  {
    prop: "accountRecyclerPrice",
    label: "实际回收金额",
    render: scope => {
      return getFixed(scope.row?.accountRecyclerPrice!);
    }
  },
  {
    prop: "branchId",
    label: "所属问店",
    enum: getAllBranch,
    search: { el: "select" },
    fieldNames: { label: "branchName", value: "id" }
  },
  { prop: "accountPassword", label: "密码" },
  { prop: "accountTel", label: "手机号" },
  { prop: "salesRemark", label: "销售备注" },
  {
    prop: "noSaleResidenceTime",
    label: "滞留时间",
    render: scope => {
      return (scope.row?.noSaleResidenceTime || 0) + "天";
    }
  },
  {
    prop: "haveSecondary",
    label: "有无二次",
    enum: [
      { label: "有", value: "1" },
      { label: "无", value: "0" }
    ],
    search: { el: "select" }
  },
  {
    prop: "isSave",
    label: "资料是否存档",
    enum: [
      { label: "有", value: "0" },
      { label: "无", value: "1" }
    ],
    search: { el: "select" }
  },
  { prop: "accountDesc", label: "账号描述" },
  {
    prop: "timeSection",
    sortable: true,
    isShow: false,
    label: "时间区间",
    search: {
      el: "date-picker",
      props: { type: "daterange", unlinkPanels: true, shortcuts: shortcuts, valueFormat: "YYYY-MM-DD" }
    }
  }
];

// 批量删除用户信息
const onExport = async (ids: string[]) => {
  const data = await soldOutExport(ids);
  await saveFile(data, "已售列表");
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UnsoldDrawer> | null>(null);
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
