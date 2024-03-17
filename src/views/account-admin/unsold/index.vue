<template>
  <div class="table-box">
    <ProTable ref="proTable" title="未售列表" :columns="columns" :init-param="initParam" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-auth="'unsold:export'" :icon="Document" plain @click="onExport(scope.selectedListIds)">导出Excel </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="UnsoldTable">
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { getPublishUsers, getRecycleUsers } from "@/api/modules/user";
import { getAccountCodeAndId, getAllBranch } from "@/api/modules/branch";
import { summaryList, unsoldExport } from "@/api/modules/account";
import { Commodity } from "@/api/interface/commodity/commodity";
import { getAllList } from "@/api/modules/accountClass";
import ProTable from "@/components/ProTable/index.vue";
import { getPublishPlatform } from "@/api/modules/dict";
import { Document } from "@element-plus/icons-vue";
import { getFixed, shortcuts } from "@/utils";
import { saveFile } from "@/utils/file";
import deepcopy from "deepcopy";
import { Dict } from "@/typings/dict";

const proTable = ref<ProTableInstance>();

const initParam = reactive({ isSales: "0" });

const getTableList = (params: any) => {
  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return summaryList(newParams);
};

const _publishPlatform = ref<Dict.IDataItem[]>([]);

// 表格配置项
const columns: ColumnProps<Commodity.Account>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "accountCode",
    label: "账号编码",
    enum: getAccountCodeAndId,
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
    },
    search: {
      el: "select-v2",
      props: {
        filterable: true,
        "allow-create": true
      }
      // slotName: true
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
  { prop: "publishPrice", label: "发布价格", search: { el: "input" } },
  {
    prop: "publishPlatform",
    label: "发布平台",
    enum: async () => {
      const { data: publishPlatform } = await getPublishPlatform();
      _publishPlatform.value = publishPlatform;
      return { data: publishPlatform };
    },
    minWidth: 180,
    search: {
      el: "select",
      props: {
        filterable: true,
        multiple: true
      }
    },
    render: ({ row }) => {
      if (!row.publishPlatform) return "--";

      return (
        <div class="flex justify-center gap-1">
          {row.publishPlatform?.map(id => {
            const platform = _publishPlatform.value.find((item: any) => {
              const value = item.value || item.id;
              return value == id;
            }) as any;
            return <el-tag>{platform?.label}</el-tag>;
          })}
        </div>
      );
    }
  },
  { prop: "publishRemark", label: "发布备注", search: { el: "input" } },
  {
    prop: "accountRecyclerId",
    label: "回收人",
    enum: getRecycleUsers,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "accountPublisherId",
    label: "发布人",
    enum: getPublishUsers,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
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
    prop: "accountRecyclerPrice",
    label: "实际回收金额",
    render: scope => {
      return getFixed(scope.row!.accountRecyclerPrice!);
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
  {
    prop: "noSaleResidenceTime",
    label: "滞留时间",
    render: ({ row }) => {
      return (row?.noSaleResidenceTime || 0) + "天";
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
  const data = await unsoldExport(ids);
  await saveFile(data, "未售列表");
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
