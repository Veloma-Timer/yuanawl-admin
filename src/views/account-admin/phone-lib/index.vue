<template>
  <div class="table-box">
    <ProTable ref="proTable" title="手机号码库" :columns="columns" :init-param="initParam" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds }">
        <el-button v-auth="'phone-lib:add'" type="primary" :icon="Plus" @click="openDrawer('新增')">新增</el-button>
        <el-button v-auth="'phone-lib:delete'" plain type="danger" :icon="Delete" @click="deleteAccount(selectedListIds)"
        >批量删除
        </el-button>
        <el-button v-auth="'phone-lib:download-template'" :icon="Download" plain @click="batchAdd('下载')"> 下载模板 </el-button>
        <el-button v-auth="'phone-lib:import'" :icon="Document" plain @click="batchAdd('导入')">导入Excel </el-button>
        <el-button v-auth="'phone-lib:export'" :icon="Upload" plain @click="onExport(selectedListIds)">导出Excel </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-auth="'phone-lib:edit'" :color="BLUE_COLOR" text plain @click="openDrawer('编辑', scope.row)">
          编辑
        </el-button>
        <el-button v-auth="'phone-lib:delete'" :color="BLUE_COLOR" text plain @click="deleteAccount(scope.row.id)">
          删除
        </el-button>
      </template>
    </ProTable>
    <PhoneDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="PhoneLibTable">
import {Plus, Delete, Document, Download, Upload} from "@element-plus/icons-vue";
import PhoneDrawer from "@/views/account-admin/phone-lib/modules/PhoneDrawer.vue";
import {ColumnProps, ProTableInstance} from "@/components/ProTable/interface";
import ImportExcel from "@/views/account-admin/components/ImportExcel/index.vue";
import {Commodity} from "@/api/interface/commodity/commodity";
import ProTable from "@/components/ProTable/index.vue";
import {useHandleData} from "@/hooks/useHandleData";
import {saveFile} from "@/utils/file";
import deepcopy from "deepcopy";
import {addPhone, deletePhone, getPhoneList, phoneExport, phoneTemplate, phoneUpload, setPhone} from "@/api/modules/phoneLibrary";
import {getOperationColWidth, visibleOperationCol} from "@/utils";
import {useAuthStore} from "@/stores/modules/auth";
import {BLUE_COLOR} from "@/config";

const proTable = ref<ProTableInstance>();

const initParam = reactive({ type: 1 });

const pageButtons = ["phone-lib:edit", "phone-lib:delete"];

const auth = useAuthStore();

const getTableList = (params: any) => getPhoneList(deepcopy(params));

const columns: ColumnProps<Commodity.phoneLibrary>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "openAccountName", label: "开户人姓名", search: { el: "input" } },
  {
    prop: "openAccountNumber",
    label: "开户主号码",
    search: { el: "input" }
  },
  {
    prop: "VNO",
    label: "运营商",
    search: { el: "input" }
  },
  {
    prop: "bindingQQTimes",
    label: "绑定QQ数量",
    search: { el: "input" }
  },
  {
    prop: "isBindingYuanshen",
    label: "是否绑定元神",
    enum: [
      { label: "是", value: "1" },
      { label: "否", value: "0" }
    ],
    search: { el: "select" }
  },
  {
    prop: "isBindingEmail",
    label: "是否绑定邮箱",
    enum: [
      { label: "是", value: "1" },
      { label: "否", value: "0" }
    ],
    search: { el: "select" }
  },
  {
    prop: "isBindingWechat",
    label: "是否绑定微信",
    enum: [
      { label: "是", value: "1" },
      { label: "否", value: "0" }
    ],
    search: { el: "select" }
  },
  {
    prop: "remark",
    label: "备注"
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
const deleteAccount = async (id: string[] | string) => {
  const ids = Array.isArray(id) ? id : [id];
  await useHandleData(deletePhone, ids, `删除手机号`);

  proTable.value?.getTableList();
};

const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: `${title}手机号码库模板`,
    status: title === "下载",
    tempApi: phoneTemplate,
    updateApi: phoneUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};
const onExport = async (ids: string[]) => {
  const data = await phoneExport(ids);
  await saveFile(data, "手机号码库");
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof PhoneDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Commodity.phoneLibrary> = {}) => {
  const params = {
    title,
    isView: false,
    row: { ...row },
    api: title === "新增" ? addPhone : title === "编辑" ? setPhone : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
