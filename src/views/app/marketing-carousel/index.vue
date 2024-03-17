<template>
  <div class="table-box">
    <ProTable ref="proTable" title="营销轮播" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds }">
        <el-button v-auth="'marketing-carousel:add'" type="primary" :icon="Plus" @click="openDrawer('新增')"
          >新增</el-button
        >
        <el-button
          v-auth="'marketing-carousel:delete'"
          type="danger"
          plain
          :icon="Delete"
          @click="deleteMarketingCarousel(selectedListIds)"
        >
          批量删除
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-auth="'marketing-carousel:edit'" link :icon="Edit" @click="openDrawer('修改', scope.row)">修改</el-button>
      </template>
    </ProTable>
    <MarketingCarouselDialog :appPaths="appPaths" ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="MarketingCarouselTable">
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import MarketingCarouselDialog from "./components/MarketingCarouselDialog.vue";
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import { getAppPaths } from "@/api/modules/app/yuanawlAdmin";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useDateFormat } from "@vueuse/core";
import { App } from "@/typings/app";
import { Status } from "@/typings";
import deepcopy from "deepcopy";

import {
  getMarketingCarouselList,
  addMarketingCarouselItem,
  delMarketingCarouselItem,
  editMarketingCarouselItem,
  updateMarketingCarouselStatus
} from "@/api/modules/app/marketingCarousel";

const initParam = reactive({});

const proTable = ref<ProTableInstance>();

const getTableList = (params: App.IMarketingCarouselInstance) => {
  return getMarketingCarouselList(deepcopy(params));
};

// 删除用户信息
const deleteMarketingCarousel = async (ids: string[]) => {
  await useHandleData(delMarketingCarouselItem, ids, `批量删除`);
  proTable.value?.getTableList();
};

const appPaths = ref<
  {
    label: string;
    value: number | string;
    path: string;
  }[]
>([]);

const columns = computed<ColumnProps<App.IMarketingCarouselInstance>[]>(() => {
  return [
    { type: "selection", fixed: "left", width: 80 },
    {
      prop: "name",
      label: "名称",
      search: {
        el: "input"
      }
    },
    {
      prop: "picture",
      label: "图片",
      width: 150,
      render: ({ row }) => {
        return (
          <el-image
            preview-teleported={true}
            style="width: 100px; height: 100px;"
            src={row.picture}
            previewSrcList={[row.picture]}
            initialIndex={1}
            fit="cover"
          />
        );
      }
    },
    {
      prop: "pagePath",
      label: "关联页面",
      enum: async () => {
        const { data } = await getAppPaths();
        appPaths.value = data.map(item => ({ ...item, label: item.name, value: item.path }));
        return {
          data: appPaths.value
        };
      },
      search: {
        el: "select-v2",
        props: {
          filterable: true
        }
      },
      render: ({ row }) => {
        const path = appPaths.value.find(path => path.path == row.pagePath);

        return path ? (
          <div>
            【{path?.label}】-{">"} {path?.path}
          </div>
        ) : (
          "--"
        );
      }
    },
    {
      prop: "textColor",
      label: "文字颜色"
    },
    {
      prop: "bgColor",
      label: "背景主色"
    },
    {
      prop: "sort",
      label: "排序"
    },
    {
      prop: "desc",
      label: "备注",
      search: {
        el: "input"
      }
    },
    {
      prop: "createdTime",
      label: "创建时间",
      search: {
        el: "date-picker",
        span: 1,
        props: { type: "daterange", valueFormat: "YYYY-MM-DD", format: "YYYY-MM-DD" }
      },
      render: ({ row }) => {
        return <span>{useDateFormat(row.createdTime, "YYYY-MM-DD HH:mm:ss").value || "--"}</span>;
      }
    },
    {
      prop: "status",
      label: "状态",
      render: scope => {
        return (
          <>
            <el-switch
              model-value={scope.row.status}
              active-value={"1"}
              inactive-value={"0"}
              onChange={(status: Status) => changeStatus(scope.row, status)}
            />
          </>
        );
      }
    }
  ];
});
// 按钮状态
// 打开 drawer(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof MarketingCarouselDialog> | null>(null);
const openDrawer = (title: string, row: Partial<App.IMarketingCarouselInstance> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addMarketingCarouselItem : editMarketingCarouselItem,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};
// 修改状态
const changeStatus = async (row: App.IMarketingCarouselInstance, status: Status) => {
  if (!row || !row?.id) return;
  await updateMarketingCarouselStatus(row.id, status);
  proTable.value?.getTableList();
};
</script>

<style>
.auto-wrap {
  --num: 4;
  --lineHeight: 1.2em;
  max-height: calc(var(--lineHeight) * var(--num));
  line-height: var(--lineHeight);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--num);
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
