<template>
  <div class="table-box">
    <ProTable ref="proTable" title="删除列表" :columns="columns" :init-param="initParam" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds, isSelected }">
        <el-button v-auth="'delete:export'" :icon="Document" plain @click="onExport(selectedListIds)">导出Excel </el-button>
        <el-button v-auth="'delete:delete'" type="danger" plain :disabled="!isSelected" :icon="Delete" @click="deleteAccount(selectedListIds)">
          彻底删除
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
    </ProTable>
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="DeleteTable">
import { delAccountComplete, exportDel, getBaseAccountDel, pointBury } from "@/api/modules/account";
import { getPublishUsers, getRecycleUsers, getSalesUsers } from "@/api/modules/user";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import ImportExcel from "@/views/account-admin/components/ImportExcel/index.vue";
import { getFixed, getPhone, parseTime, setPhone, shortcuts } from "@/utils";
import { getAllBaseAccountDel, getAllBranch } from "@/api/modules/branch";
import { getGroups, getPublishPlatform } from "@/api/modules/dict";
import { Delete, Document, Hide, View } from "@element-plus/icons-vue";
import { Commodity } from "@/api/interface/commodity/commodity";
import { getAllList } from "@/api/modules/accountClass";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { saveFile } from "@/utils/file";
import deepcopy from "deepcopy";
import { Dict } from "@/typings/dict";

const route = useRoute();
const proTable = ref<ProTableInstance>();

const initParam = reactive({});
const typeList = ref<any[]>([]);

const getTableList = (params: any) => {
  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getBaseAccountDel(newParams);
};

const getTypeList = async () => {
  const { data } = await getAllList();
  typeList.value = data;
};
getTypeList();

const getTypeListName = (ids: number[]) => {
  const idsNum = ids?.map(item => Number(item));
  const list = typeList.value;
  const names = idsNum?.map(item => {
    const obj = list.find(items => items.id === item);
    return obj?.typeName;
  });
  return names?.join();
};

const _publishPlatform = ref<Dict.IDataItem[]>([]);

const columns: ColumnProps<Commodity.Account>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "accountCode",
    label: "账号编码",
    fixed: "left",
    sortable: true,
    enum: getAllBaseAccountDel,
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
    prop: "account",
    label: "账号",
    sortable: true,
    width: 160,
    search: {
      el: "input"
    }
  },
  {
    prop: "isWorkOrder",
    label: "是否存在工单",
    width: 160,
    sortable: true,
    enum: [
      { label: "有", value: "1" },
      { label: "没有", value: "0" }
    ],
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
    prop: "isSales",
    label: "账户发布状态",
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    sortable: true,
    width: 160,
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
    sortable: true,
    label: "分组",
    width: 160,
    enum: async () => {
      const { data: groups } = await getGroups();
      return { data: groups };
    },
    fieldNames: { label: "label", value: "id" },
    search: {
      el: "select",
      props: {
        filterable: true
      }
    }
  },
  {
    prop: "accountType",
    label: "游戏分类",
    sortable: true,
    width: 160,
    enum: getAllList,
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    fieldNames: { label: "typeName", value: "id" },
    render: ({ row }) => {
      return getTypeListName(row.accountType);
    }
  },
  {
    prop: "salePeopleId",
    label: "出售人",
    sortable: true,
    width: 160,
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
    width: 160,
    label: "出售渠道",
    enum: async () => {
      const { data: publishPlatform } = await getPublishPlatform();
      return { data: publishPlatform };
    },
    search: { el: "select" }
  },
  {
    prop: "saleTime",
    sortable: true,
    label: "出售时间",
    width: 160,
    render: scope => {
      return parseTime(scope.row!.saleTime, "{y}-{m}-{d} {h}:{i}");
    }
  },
  {
    prop: "noSaleResidenceTime",
    label: "滞留时间",
    sortable: true,
    width: 160,
    render: scope => {
      return (scope.row?.noSaleResidenceTime || 0) + "天";
    }
  },
  {
    prop: "salePrice",
    label: "出售金额",
    sortable: true,
    width: 160,
    search: { el: "input" },
    render: scope => {
      return <span>{getFixed(scope.row.salePrice) || "--"}</span>;
    }
  },
  {
    prop: "accountRecyclerPrice",
    label: "实际回收金额",
    width: 160,
    sortable: true,
    search: { el: "input" },
    render: scope => {
      return <span>{getFixed(scope.row.accountRecyclerPrice) || "--"}</span>;
    }
  },
  {
    prop: "branchId",
    label: "所属门店",
    sortable: true,
    width: 160,
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
    sortable: true,
    label: "密码",
    width: 160
  },
  {
    prop: "accountTel",
    sortable: true,
    label: "手机号",
    width: 160,
    search: { el: "input" }
  },
  {
    prop: "accountRemark",
    sortable: true,
    label: "备注",
    width: 160,
    search: { el: "input" }
  },
  {
    prop: "accountRecyclerId",
    label: "回收人",
    width: 160,
    enum: getRecycleUsers,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
  },
  { prop: "recycleRemark", label: "回收备注", width: 160 },
  {
    prop: "accountPublisherId",
    label: "发布人",
    enum: getPublishUsers,
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "publishPlatform",
    label: "发布渠道",
    minWidth: 150,
    enum: async () => {
      const { data: publishPlatform } = await getPublishPlatform();
      _publishPlatform.value = publishPlatform;
      return { data: publishPlatform };
    },
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
          const platform = _publishPlatform.value.find((item: any) => {
            const value = item.value || item.id;
            return value == id;
          }) as any;
          return platform?.label || "--";
        })
        .join(" ");
    }
  },
  {
    prop: "accountPublisherTimer",
    label: "发布时间",
    minWidth: 150,
    render: ({ row }) => {
      return parseTime(row!.accountPublisherTimer, "{y}-{m}-{d} {h}:{i}:{s}");
    }
  },
  { prop: "publishRemark", label: "发布备注", width: 160 },
  { prop: "salesRemark", label: "销售备注", width: 160 },
  {
    prop: "haveSecondary",
    label: "有无二次",
    sortable: true,
    width: 160,
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
  {
    prop: "isSave",
    label: "资料是否存档",
    sortable: true,
    width: 160,
    enum: [
      { label: "是", value: "1" },
      { label: "否", value: "0" }
    ],
    search: {
      el: "select",
      props: {
        filterable: true
      }
    }
  },
  { prop: "accountDesc", sortable: true, label: "账号描述", width: 160, search: { el: "input" } },
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

// 删除用户信息
const deleteAccount = async (ids: number[] | string[]) => {
  await useHandleData(delAccountComplete, ids, `彻底删除选中的账号`);
  proTable.value?.getTableList();
};

const onExport = async (ids: string[]) => {
  const data = await exportDel(ids);
  await saveFile(data, "删除列表");
};

onMounted(() => {
  setTimeout(() => {
    // 携带参数page跳转
    const { accountCode, accountType } = route.query;
    const type = accountType ? Number(accountType) : null;
    if (proTable.value) {
      proTable.value.searchParam.accountCode = accountCode;
      proTable.value.searchParam.accountType = type;
      proTable.value?.search();
    }
  }, 300);
});
const onSetPhone = (row: any) => {
  const params = {
    accountId: row.id,
    tel: row.accountTel
  };
  pointBury(params)
    .then(() => {})
    .finally(() => {
      row.status = !row.status;
    });
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
