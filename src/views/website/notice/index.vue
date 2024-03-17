<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds, isSelected }">
        <el-button v-auth="'notice:add'" type="primary" :icon="Plus" @click="openQualityOfVoiceModal('新增')">新增</el-button>
        <el-button v-auth="'notice:delete'" type="danger" plain :icon="Delete" :disabled="!isSelected"
                   @click="batchDelete(selectedListIds)">
          批量删除
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button v-auth="'notice:edit'" type="primary" link @click="openQualityOfVoiceModal('编辑', row)"> 编辑 </el-button>
      </template>
    </ProTable>
    <NoticeModal ref="noticeModalRef" />
  </div>
</template>

<script setup lang="tsx" name="WebsiteNoticeTable">
import {create, del, edit, getList} from "@/api/modules/website/notice";
import {ColumnProps, ProTableInstance} from "@/components/ProTable/interface";
import {Delete, Plus} from "@element-plus/icons-vue";
import NoticeModal from "./components/NoticeModal.vue";
import ProTable from "@/components/ProTable/index.vue";
import {useHandleData} from "@/hooks/useHandleData";
import {isArray, isEmpty} from "@/utils/is";
import {Website} from "@/typings/website";
import {useDict} from "@/hooks/useDict";
import {computed, reactive, ref} from "vue";
import {getOperationColWidth, visibleOperationCol} from "@/utils";
import {useDateFormat} from "@vueuse/core";
import {useAuthStore} from "@/stores/modules/auth";

// ProTable 实例
const proTable = ref<ProTableInstance>();

const pageButtons = ["notice:edit"];

const auth = useAuthStore();

const noticeModalRef = ref<InstanceType<typeof NoticeModal> | null>(null);

const initParam = reactive({});

const { common_status, notice_type, common_yes_no } = useDict("common_status", "notice_type", "common_yes_no");

watch(
  notice_type,
  (value: any) => {
    console.log(value, "--- watch ---");
  },
  { immediate: true, deep: true }
);

const columns = computed<ColumnProps<Website.Notice>[]>(() => [
  { type: "selection", fixed: "left", width: 70 },
  { type: "index", label: "序号", width: 70 },
  { prop: "title", label: "标题", width: 120, search: { el: "input" } },
  {
    prop: "cover",
    label: "封面",
    render: ({ row }) => {
      return (
        <el-image
          src={row.cover}
          style={{ width: "100px", height: "100px" }}
          preview-src-list={[row.cover]}
          hide-on-click-modal
          preview-teleported
          fit="fit"
        />
      );
    }
  },
  { prop: "type", label: "类型", enum: notice_type, search: { el: "select" } },
  { prop: "isAffixTop", label: "是否置顶", tag: false, enum: common_yes_no },
  {
    prop: "status",
    label: "状态",
    width: 120,
    tag: true,
    enum: common_status,
    search: { el: "select" }
  },
  {
    prop: "createdTime",
    label: "创建时间",
    width: 180,
    render: ({ row }) => <span>{useDateFormat(row.createdTime, "YYYY-MM-DD HH:mm:ss").value}</span>
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
]);

const getTableList = (params: any) => getList(params);

const batchDelete = async (id: number | number[] | string[]) => {
  const ids = isArray(id) ? id : [id];
  await useHandleData(del, { ids }, "删除");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

const openQualityOfVoiceModal = (title: string, row: Website.Notice = {} as Website.Notice) => {
  const isAdd = isEmpty(row.id);
  const params = {
    title,
    isView: title === "查看",
    form: { ...row },
    notice_type: notice_type.value,
    common_yes_no: common_yes_no.value,
    common_status: common_status.value,
    api: title === "新增" ? create : title === "编辑" ? edit : void 0,
    getTableList: proTable.value?.getTableList
  };
  if (isAdd) {
    Object.assign(params.form, { status: common_status.value[1]?.value, isAffixTop: false });
  }
  noticeModalRef.value?.acceptParams(params);
};
</script>
