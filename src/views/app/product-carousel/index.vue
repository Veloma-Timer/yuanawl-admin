<template>
  <div class="table-box">
    <ProTable ref="proTable" title="商品轮播" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ selectedListIds }">
        <el-button v-auth="'product-carousel:add'" type="primary" :icon="Plus" @click="openDrawer('新增')">新增 </el-button>
        <el-button v-auth="'product-carousel:delete'" type="danger" :icon="Delete" plain @click="deleteProductCarousel(selectedListIds)">
          批量删除
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button v-auth="'product-carousel:edit'" link :icon="Edit" @click="openDrawer('修改', scope.row)">修改</el-button>
      </template>
    </ProTable>
    <ProductCarouselDialog :gameTypes="gameTypes" ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="productCarousel">
import { getGameTypes, getProductsByType } from "@/api/modules/app/yuanawlAdmin";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import ProductCarouselDialog from "./components/ProductCarouselDialog.vue";
import {Delete, Edit, Plus} from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { App } from "@/typings/app";
import deepcopy from "deepcopy";
import { useDateFormat } from "@vueuse/core";
import {
  addProductCarouselItem,
  delProductCarouselItem,
  editProductCarouselItem,
  getProductCarouselList,
  updateProductCarouselStatus
} from "@/api/modules/app/productCarousel";
import { YuanawlAdmin } from "@/typings/yuanawlAdmin";
import { formatUrl } from "@/utils";
import { Status } from "@/typings";

const initParam = reactive({});

const proTable = ref<ProTableInstance>();

const getTableList = (params: App.IProductCarouselInstance) => {
  return getProductCarouselList(deepcopy(params));
};

// 删除商品轮播
const deleteProductCarousel = async (ids: string[]) => {
  await useHandleData(delProductCarouselItem, ids, `批量删除`);
  proTable.value?.getTableList();
};

const columns = computed<ColumnProps<App.IProductCarouselInstance>[]>(() => {
  return [
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
            style="width: 100px; height: 100px;"
            src={row.picture}
            preview-teleported={true}
            previewSrcList={[row.picture]}
            initialIndex={1}
            fit="cover"
          />
        );
      }
    },
    {
      prop: "productId",
      label: "关联商品",
      enum: async () => {
        // 获取所有商品
        const { data: products } = await getProductsByType("", 1, 6000);

        return { data: products.map(item => ({ label: `【${item.number}】${item.name}`, value: item.id })) };
      },
      search: {
        el: "select-v2",
        props: {
          filterable: true
        }
      },
      width: 300,
      align: "left",
      render: ({ row }) => {
        if (!row.product) return "--";

        const src = formatUrl(row!.product!.content[0]);

        return (
          <div class="flex justify-between items-start gap-1">
            <el-image
              class="flex-shrink-0"
              preview-teleported={true}
              style="width: 100px; height: 100px"
              fit="cover"
              src={src}
              preview-src-list={[src]}
            />
            <div>
              <p>【{row.product.number}】</p>
              <p
                class="auto-wrap"
                style={{
                  width: "180px",
                  "word-wrap": "break-word",
                  "white-space": "normal"
                }}
              >
                {row.product.title}
              </p>
            </div>
          </div>
        );
      }
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
      width: 180,
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
const dialogRef = ref<InstanceType<typeof ProductCarouselDialog> | null>(null);
const openDrawer = (title: string, row: Partial<App.IProductCarouselInstance> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addProductCarouselItem : editProductCarouselItem,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};
// 修改状态
const changeStatus = async (row: App.IProductCarouselInstance, status: Status) => {
  if (!row.id) return;

  await updateProductCarouselStatus(row.id, status);
  proTable.value?.getTableList();
};

// 游戏类型
const gameTypes = ref<YuanawlAdmin.IType[]>([]);

onMounted(async () => {
  // 获取商品分类
  const { data } = await getGameTypes();
  gameTypes.value = data;
});
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
