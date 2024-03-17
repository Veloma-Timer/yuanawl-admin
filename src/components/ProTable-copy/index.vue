<!-- 📚📚📚 Pro-Table 文档: https://juejin.cn/post/7166068828202336263 -->

<template>
  <!-- 查询表单 card -->
  <SearchForm
    :search="search"
    :reset="reset"
    :columns="searchColumns"
    :search-param="searchParam"
    :search-col="searchCol"
    v-show="isShowSearch"
  />

  <!-- 表格内容 card -->
  <div class="card table-main">
    <!-- 表格头部 操作按钮 -->
    <div class="table-header">
      <div class="header-button-lf">
        <slot name="tableHeader" :selectedListIds="selectedListIds" :selectedList="selectedList" :isSelected="isSelected" />
      </div>
      <div class="header-button-ri" v-if="toolButton">
        <slot name="toolButton">
          <el-button :icon="Refresh" circle @click="getTableList" />
          <el-button :icon="Printer" circle v-if="columns.length" @click="print" />
          <el-button :icon="Operation" circle v-if="columns.length" @click="openColSetting" />
          <el-button
            :icon="Search"
            circle
            v-if="showToolButton('search') && searchColumns?.length"
            @click="isShowSearch = !isShowSearch"
          />
        </slot>
      </div>
    </div>
    <!-- 表格主体 -->

    <div id="table-fullscreen" class="flex flex-col justify-between items-center">
      <el-table
        class="flex-1"
        v-loading="loading"
        v-if="dropCol"
        v-bind="$attrs"
        ref="tableRef"
        :data="data ?? tableData"
        :border="border"
        :row-key="rowKey"
        :tree-props="{ children: 'children', hasChildren: childrenStr }"
        @selection-change="selectionChange"
        @sort-change="onSortChange"
      >
        <!-- 默认插槽 -->
        <slot></slot>
        <template v-for="(item, index) in tableColumns" :key="item.prop">
          <!-- selection || index || expand -->
          <el-table-column
            v-if="item.type && ['selection', 'index', 'expand'].includes(item.type)"
            v-bind="item"
            :align="item.align ?? 'center'"
            :reserve-selection="item.type == 'selection'"
          >
            <template #default="scope" v-if="item.type == 'expand'">
              <component :is="item.render" v-bind="scope" v-if="item.render"></component>
              <slot :name="item.type" v-bind="scope" v-else></slot>
            </template>
          </el-table-column>
          <!-- other -->
          <TableColumn
            v-if="!item.type && item.prop && item.isShow && (item.prop === 'operation' ? !store.isFull : true)"
            :key="index"
            :columns="dropCol"
            :custom-key="index"
            :width="getColumnWidth(item)"
            :column="getDropCol(item.prop)"
          >
            <template v-for="slot in Object.keys($slots)" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </TableColumn>
        </template>
        <!-- 插入表格最后一行之后的插槽 -->
        <template #append>
          <slot name="append"></slot>
        </template>
        <!-- 无数据 -->
        <template #empty>
          <div class="table-empty">
            <slot name="empty">
              <img src="@/assets/images/notData.png" alt="notData" />
              <div>暂无数据</div>
            </slot>
          </div>
        </template>
      </el-table>

      <!-- 分页组件 -->
      <slot name="pagination">
        <Pagination
          v-if="pagination"
          :pageable="pageable"
          :handle-size-change="handleSizeChange"
          :handle-current-change="handleCurrentChange"
        />
      </slot>
    </div>
  </div>
  <!-- 列设置 -->
  <ColSetting v-if="toolButton" ref="colRef" v-model:col-setting="colSetting" />
</template>

<script setup lang="ts" name="ProTable">
import { computed, nextTick, onMounted, provide, ref, watch } from "vue";
import { ElTable } from "element-plus";
import { useTable } from "@/hooks/useTable";
import { useSelection } from "@/hooks/useSelection";
import { BreakPoint } from "@/components/Grid/interface";
import { ColumnProps } from "@/components/ProTable/interface";
import { Operation, Printer, Refresh, Search } from "@element-plus/icons-vue";
import { filterEnum, formatValue, handleProp, handleRowAccordingToProp, localGet, localSet } from "@/utils";
import SearchForm from "@/components/SearchForm/index.vue";
import Pagination from "./components/Pagination.vue";
import ColSetting from "./components/ColSetting.vue";
import TableColumn from "./components/TableColumn.vue";
import printJS from "print-js";
import { userProTableStore } from "@/stores/modules/proTable";
import { useAuthStore } from "@/stores/modules/auth";
import { ProTableColoum } from "@/stores/interface";
import colDrag from "./drag";
// import { appWindow } from "@tauri-apps/api/window";
import { useRoute } from "vue-router";
import { useGlobalStore } from "@/stores/modules/global";

export interface ProTableProps {
  columns: ColumnProps[]; // 列配置项  ==> 必传
  data?: any[]; // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi?: (params: any) => Promise<any>; // 请求表格数据的 api ==> 非必传
  requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为true）
  requestError?: (params: any) => void; // 表格 api 请求错误监听 ==> 非必传
  dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  title?: string; // 表格标题，目前只在打印的时候用到 ==> 非必传
  pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
  toolButton?: boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
  hasChildren?: boolean; // 树类型的数据的显示
  childrenStr?: string;
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  searchCol?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}

const proTableStore = userProTableStore();
const authStore = useAuthStore();
const route = useRoute();
const store = useGlobalStore();

const key = route.fullPath + "_drop";

const tcsKey = key + "_tsc";

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  requestAuto: true,
  pagination: true,
  initParam: {},
  border: true,
  hasChildren: true,
  childrenStr: "",
  toolButton: true,
  rowKey: "id",
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 })
});
// 是否显示搜索模块
const isShowSearch = ref(true);

// 表格 DOM 元素
const tableRef = ref<InstanceType<typeof ElTable>>();

// 控制 ToolButton 显示
const showToolButton = (key: "refresh" | "setting" | "search") => {
  return Array.isArray(props.toolButton) ? props.toolButton.includes(key) : props.toolButton;
};

// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);

// 表格操作 Hooks
const {
  tableData,
  pageable,
  searchParam,
  searchInitParam,
  onSortChange,
  getTableList,
  search,
  reset,
  loading,
  handleSizeChange,
  handleCurrentChange
} = useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback, props.requestError);

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

// 监听页面 initParam 改化，重新获取表格数据
watch(() => props.initParam, getTableList, { deep: true });

// 接收 columns 并设置为响应式
const currentColoumIndex = proTableStore.list.findIndex((item: any) => item.key === authStore.routeName);
let cachecColumns = [];
// 当前路由key已存在localStorage
if (currentColoumIndex > -1) {
  // 无操作项的普通列
  let fileteColumns = props.columns.filter((item: any) => {
    return !["selection", "index", "expand"].includes(item.type) && item.prop !== "operation";
  });
  // 操作项的数据列
  let operationColumns = props.columns.filter((item: any) => {
    return ["selection", "index", "expand"].includes(item.type) || item.prop === "operation";
  });

  // 合并列设置的isShow和sortable字段
  cachecColumns = fileteColumns.map((item: any, index: number) => {
    let obj = proTableStore.list[currentColoumIndex].value[index] || {};
    return { ...item, isShow: item.isShow ?? obj.isShow, sortable: obj.sortable };
  });
  // 合并上面两个不同类型的列(注意要排序,不然固定列和操作列是乱的)
  cachecColumns = cachecColumns.concat(operationColumns);
  let index = cachecColumns.findIndex((item: any) => item.type === "selection");
  let last = cachecColumns.findIndex((item: any) => item.prop === "operation");
  if (index > -1) {
    let firstObj = cachecColumns.splice(index, 1)[0];
    cachecColumns.unshift(firstObj);
  }
  if (last > -1) {
    let lastObj = cachecColumns.splice(last, 1)[0];
    cachecColumns.push(lastObj);
  }
} else {
  // eslint-disable-next-line vue/no-setup-props-destructure
  cachecColumns = props.columns;
}

const mergeCols = (cache: null | ColumnProps[], cols: ColumnProps[]): ColumnProps[] => {
  // 如果没有缓存直接返回
  if (!cache) return cols;
  // 如果有缓存则替换同类项
  return cache.map(item => {
    const col = cols.find(child => child.prop === item.prop);
    return { ...col, ...item };
  });
};

const tableColumns = ref<ColumnProps[]>(mergeCols(localGet(tcsKey), cachecColumns));

const dropCol = ref<ColumnProps[]>(tableColumns.value);

// 放大表格
const fullScreen = async () => {
  const el = document.body.querySelector("#table-fullscreen")!;
  if (!el) return;

  if (el.classList.contains("v-fullscreen")) {
    // await appWindow.setFullscreen(false);
    el.classList.remove("v-fullscreen");
    store.setIsFull(false);
  } else {
    store.setIsFull(true);
    // await appWindow.setFullscreen(true);
    el.classList.add("v-fullscreen");
  }
};

// 初始化请求
onMounted(() => {
  nextTick(() => {
    dropCol.value = colDrag(dropCol.value)!;

    // 当tableColumns变化时缓存住
    watch(tableColumns, tcs => localSet(tcsKey, tcs), { deep: true });
  });
  props.requestAuto && getTableList();
  document.body.addEventListener("dblclick", fullScreen);
});

const getDropCol = (prop: string) => {
  const index = dropCol.value?.findIndex(item => item.prop == prop)!;
  return dropCol.value![index];
};

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
provide("enumMap", enumMap);
const setEnumMap = async (col: ColumnProps) => {
  if (!col.enum) return;
  // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  if (typeof col.enum !== "function") return enumMap.value.set(col.prop!, col.enum!);
  const { data } = await col.enum();
  enumMap.value.set(col.prop!, data);
};

// 扁平化 columns
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
  columns.forEach(col => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
    flatArr.push(col);
    // 给每一项 column 添加 isShow && isFilterEnum 默认属性
    col.isShow = col.isShow ?? true;
    col.isFilterEnum = col.isFilterEnum ?? true;

    // 设置 enumMap
    setEnumMap(col);
  });
  return flatArr.filter(item => !item._children?.length);
};

// flatColumns
const flatColumns = ref<ColumnProps[]>();
flatColumns.value = flatColumnsFunc(tableColumns.value);

// 过滤需要搜索的配置项
const searchColumns = flatColumns.value.filter(item => item.search?.el || item.search?.render);

// 设置搜索表单排序默认值 && 设置搜索表单项的默认值
searchColumns.forEach((column, index) => {
  column.search!.order = column.search!.order ?? index + 2;
  if (column.search?.defaultValue !== undefined && column.search?.defaultValue !== null) {
    searchInitParam.value[column.search.key ?? handleProp(column.prop!)] = column.search?.defaultValue;
    searchParam.value[column.search.key ?? handleProp(column.prop!)] = column.search?.defaultValue;
  }
});

// 排序搜索表单项
searchColumns.sort((a, b) => a.search!.order! - b.search!.order!);

// 列设置 ==> 过滤掉不需要设置的列
const colRef = ref();
const colSetting = tableColumns.value!.filter(
  // (item: any) => !["selection", "index", "expand"].includes(item.type!) && item.prop !== "operation" && item.isShow
  // 对比上一行去掉这个isShow 是为了在列设置可以显示关闭的列
  (item: any) => !["selection", "index", "expand"].includes(item.type!) && item.prop !== "operation"
);

proTableStore.setProTableState(authStore.routeName, colSetting as ProTableColoum[]);

const openColSetting = () => colRef.value.openColSetting();

// 🙅‍♀️ 不需要打印可以把以下方法删除，打印功能目前存在很多 bug
// 处理打印数据（把后台返回的值根据 enum 做转换）
const printData = computed(() => {
  const handleData = props.data ?? tableData.value;
  const printDataList = JSON.parse(JSON.stringify(selectedList.value.length ? selectedList.value : handleData));
  // 找出需要转换数据的列（有 enum || 多级 prop && 需要根据 enum 格式化）
  const needTransformCol = flatColumns.value!.filter(
    item => (item.enum || (item.prop && item.prop.split(".").length > 1)) && item.isFilterEnum
  );
  needTransformCol.forEach(colItem => {
    printDataList.forEach((tableItem: { [key: string]: any }, index: number) => {
      tableItem[handleProp(colItem.prop!)] =
        colItem.prop!.split(".").length > 1 && !colItem.enum
          ? formatValue(handleRowAccordingToProp(tableItem, colItem.prop!, dropCol.value!, index))
          : filterEnum(
              handleRowAccordingToProp(tableItem, colItem.prop!, dropCol.value!, index),
              enumMap.value.get(colItem.prop!),
              colItem.fieldNames
            );
      for (const key in tableItem) {
        if (tableItem[key] === null) tableItem[key] = formatValue(tableItem[key]);
      }
    });
  });
  return printDataList;
});

// 打印表格数据（💥 多级表头数据打印时，只能扁平化成一维数组，printJs 不支持多级表头打印）
const print = () => {
  const header = `<div style="text-align: center"><h2>${props.title}</h2></div>`;
  const gridHeaderStyle = "border: 1px solid #ebeef5;height: 45px;color: #232425;text-align: center;background-color: #fafafa;";
  const gridStyle = "border: 1px solid #ebeef5;height: 40px;color: #494b4e;text-align: center";
  printJS({
    printable: printData.value,
    header: props.title && header,
    properties: flatColumns
      .value!.filter(item => !["selection", "index", "expand"].includes(item.type!) && item.isShow && item.prop !== "operation")
      .map((item: ColumnProps) => ({ field: handleProp(item.prop!), displayName: item.label })),
    type: "json",
    gridHeaderStyle,
    gridStyle
  });
};

const tableWidth = ref("");

const getColumnWidth = (item: ColumnProps) => {
  const { prop, label, width, sortable, minWidth = 0 } = item;

  if (width) return width;

  if (tableColumns.value.length < 12) return "auto";

  // 获取列中最宽的文字宽度
  const maxWidth = Math.max(
    tableData.value.reduce((max, row) => {
      const cellContent = row[prop!] || "";
      const cellWidth = getTextWidth(cellContent);
      return Math.max(max, cellWidth);
    }, 0),
    getTextWidth(label!),
    Number(minWidth)
  );

  // 根据最宽的文字宽度计算列宽度
  return maxWidth + 24 + (sortable ? 24 : 0) + "px";
};

const getTextWidth = (text: string) => {
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  span.style.whiteSpace = "nowrap";
  span.style.fontWeight = "bold";
  span.style.position = "absolute";
  span.style.width = "auto";
  span.style.fontSize = "16px";
  span.innerText = text;
  document.body.appendChild(span);

  const width = span.offsetWidth;

  document.body.removeChild(span);

  return width;
};

const updateTableWidth = () => {
  const table = document.querySelector(".el-table");
  if (table) {
    // @ts-ignore
    tableWidth.value = table?.offsetWidth + "px";
  }
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateTableWidth);
});

watch(
  () => tableData.value,
  () => {
    updateTableWidth();
  }
);

// 暴露给父组件的参数和方法(外部需要什么，都可以从这里暴露出去)
defineExpose({
  element: tableRef,
  tableData,
  pageable,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange,
  clearSelection,
  enumMap,
  isSelected,
  selectedList,
  selectedListIds
});
</script>
