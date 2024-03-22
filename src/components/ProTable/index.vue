<template>
  <!-- 查询表单 -->
  <SearchForm
    v-show="isShowSearch"
    :search="_search"
    :reset="_reset"
    :columns="searchColumns"
    :search-param="searchParam"
    :search-col="searchCol"
  />
  <!-- 表格主体 -->
  <div class="card table-main">
    <!-- 表格头部 操作按钮 -->
    <div class="flex items-center justify-between w-full mb-2">
      <div class="flex items-center gap-6">
        <Title :title="title" />
        <div v-if="toolButton" class="flex items-center">
          <slot name="toolButton">
            <div
              v-if="showToolButton('refresh')"
              @click="getTableList"
              class="flex flex-col items-center justify-center p-1 rounded-full hover:bg-[#F7F9FC] cursor-pointer"
            >
              <el-icon><Refresh /></el-icon>
            </div>

            <el-divider direction="vertical" />
            <div
              v-if="showToolButton('setting') && columns.length"
              @click="openColSetting"
              class="flex flex-col items-center justify-center p-1 rounded-full hover:bg-[#F7F9FC] cursor-pointer"
            >
              <el-icon><Operation /></el-icon>
            </div>
            <el-divider direction="vertical" />
            <div
              v-if="showToolButton('search') && searchColumns?.length"
              @click="isShowSearch = !isShowSearch"
              class="flex flex-col items-center justify-center p-1 rounded-full hover:bg-[#F7F9FC] cursor-pointer"
            >
              <el-icon>
                <Search />
              </el-icon>
            </div>

            <!-- <el-button v-if="showToolButton('refresh')" :icon="Refresh" link @click="getTableList" />
            <el-divider direction="vertical" />
            <el-button v-if="showToolButton('setting') && columns.length" :icon="Operation" link @click="openColSetting" />
            <el-divider direction="vertical" />
            <el-button
              v-if="showToolButton('search') && searchColumns?.length"
              :icon="Search"
              link
              @click="isShowSearch = !isShowSearch"
            /> -->
          </slot>
        </div>
      </div>
      <div class="">
        <slot name="tableHeader" :selected-list="selectedList" :selected-list-ids="selectedListIds" :is-selected="isSelected" />
      </div>
    </div>
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :data="processTableData"
      :border="border"
      :row-key="rowKey"
      show-summary
      :summary-method="(param: any) => getSummaries(param, summaryKey)"
      @selection-change="selectionChange"
    >
      <!-- 默认插槽 -->
      <slot />
      <template v-for="item in tableColumns" :key="item">
        <!-- selection || radio || index || expand || sort -->
        <el-table-column
          v-if="item.type && columnTypes.includes(item.type)"
          v-bind="item"
          :label="item.label ? item.label : void 0"
          :align="item.align ?? 'center'"
          :reserve-selection="item.type == 'selection'"
        >
          <template #default="scope">
            <!-- expand -->
            <template v-if="item.type == 'expand'">
              <component :is="item.render" v-bind="scope" :label="item.label ? item.label : void 0" v-if="item.render" />
              <slot v-else :name="item.type" v-bind="scope" :label="item.label ? item.label : void 0" />
            </template>
            <!-- radio -->
            <el-radio v-if="item.type == 'radio'" v-model="radio" :label="scope.row[rowKey]">
              <i></i>
            </el-radio>
            <!-- sort -->
            <el-tag v-if="item.type == 'sort'" class="move">
              <el-icon>
                <DCaret />
              </el-icon>
            </el-tag>
          </template>
        </el-table-column>
        <!-- other -->
        <TableColumn v-if="!item.type && item.prop && item.isShow" :column="item" :width="getColumnWidth(item)">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumn>
      </template>
      <!-- 插入表格最后一行之后的插槽 -->
      <template #append>
        <slot name="append" />
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
    <div class="flex items-end justify-between mt-5">
      <div class="flex flex-shrink-0 flex-wrap max-w-[350px] gap-2">
        <slot
          name="footerBtn"
          :selected-list="selectedList"
          :selected-list-ids="selectedListIds"
          :is-selected="isSelected"
        ></slot>
      </div>

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
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref, unref, watch } from "vue";
import { ElTable } from "element-plus";
import { useTable } from "@/hooks/useTable";
import { useSelection } from "@/hooks/useSelection";
import { BreakPoint } from "@/components/Grid/interface";
import { ColumnProps, TypeProps } from "@/components/ProTable/interface";
import { Operation, Refresh, Search } from "@element-plus/icons-vue";
import { handleProp } from "@/utils";
import SearchForm from "@/components/SearchForm/index.vue";
import Pagination from "./components/Pagination.vue";
import ColSetting from "./components/ColSetting.vue";
import TableColumn from "./components/TableColumn.vue";
import Sortable from "sortablejs";
import Title from "@/components/Title/index.vue";
import { getSummaries } from '@/utils/data';

export interface ProTableProps {
  columns: ColumnProps[]; // 列配置项  ==> 必传
  summaryKey?: string[]; // 合计key
  data?: any[]; // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi?: (params: any) => Promise<any>; // 请求表格数据的 api ==> 非必传
  requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为true）
  requestError?: (params: any) => void; // 表格 api 请求错误监听 ==> 非必传
  dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  title?: string; // 表格标题 ==> 非必传
  pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
  showFooterBtn?: boolean;
  isShowSearch?: boolean; // 是否显示搜索表单 ==> 非必传（默认为true）
  initParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
  toolButton?: ("refresh" | "setting" | "search")[] | boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  searchCol?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  summaryKey: () => [],
  requestAuto: true,
  pagination: true,
  showFooterBtn: true,
  initParam: {},
  border: true,
  toolButton: true,
  isShowSearch: true,
  rowKey: "id",
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 })
});

// table 实例
const tableRef = ref<InstanceType<typeof ElTable>>();

// column 列类型
const columnTypes: TypeProps[] = ["selection", "radio", "index", "expand", "sort"];

// 是否显示搜索模块
const isShowSearch = ref(props.isShowSearch);

// 控制 ToolButton 显示
const showToolButton = (key: "refresh" | "setting" | "search") => {
  return Array.isArray(props.toolButton) ? props.toolButton.includes(key) : props.toolButton;
};

// 单选值
const radio = ref("");

// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);

// 表格操作 Hooks
const { tableData, pageable, searchParam, searchInitParam, getTableList, search, reset, handleSizeChange, handleCurrentChange } =
  useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback, props.requestError);

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

// 初始化表格数据 && 拖拽排序
onMounted(() => {
  dragSort();
  props.requestAuto && getTableList();
  props.data && (pageable.value.total = props.data.length);
  updateTableWidth();
  window.addEventListener("resize", updateTableWidth);
});

// 处理表格数据
const processTableData = computed(() => {
  if (!props.data) return tableData.value;
  if (!props.pagination) return props.data;
  return props.data.slice(
    (pageable.value.pageNum - 1) * pageable.value.pageSize,
    pageable.value.pageSize * pageable.value.pageNum
  );
});

// 监听页面 initParam 改化，重新获取表格数据
watch(() => props.initParam, getTableList, { deep: true });

// 接收 columns 并设置为响应式
const tableColumns = reactive<ColumnProps[]>(props.columns);

// 扁平化 columns
const flatColumns = computed(() => flatColumnsFunc(tableColumns));

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
const setEnumMap = async ({ prop, enum: enumValue }: ColumnProps) => {
  if (!enumValue) return;

  // 如果当前 enumMap 存在相同的值 return
  if (enumMap.value.has(prop!) && (typeof enumValue === "function" || enumMap.value.get(prop!) === enumValue)) return;

  // 当前 enum 为静态数据，则直接存储到 enumMap
  if (typeof enumValue !== "function") return enumMap.value.set(prop!, unref(enumValue!));

  // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMap.value.set(prop!, []);

  // 当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  const { data } = await enumValue();
  enumMap.value.set(prop!, data);
};

// 注入 enumMap
provide("enumMap", enumMap);

// 扁平化 columns 的方法
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
  columns.forEach(async col => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
    flatArr.push(col);

    // column 添加默认 isShow && isFilterEnum 属性值
    col.isShow = col.isShow ?? true;
    col.isFilterEnum = col.isFilterEnum ?? true;

    // 设置 enumMap
    await setEnumMap(col);
  });
  return flatArr.filter(item => !item._children?.length);
};

// 过滤需要搜索的配置项 && 排序
const searchColumns = computed(() => {
  return flatColumns.value
    ?.filter(item => item.search?.el || item.search?.render)
    .sort((a, b) => a.search!.order! - b.search!.order!);
});

// 设置 搜索表单默认排序 && 搜索表单项的默认值
searchColumns.value?.forEach((column, index) => {
  column.search!.order = column.search?.order ?? index + 2;
  const key = column.search?.key ?? handleProp(column.prop!);
  const defaultValue = column.search?.defaultValue;
  if (defaultValue !== undefined && defaultValue !== null) {
    searchInitParam.value[key] = defaultValue;
    searchParam.value[key] = defaultValue;
  }
});

// 列设置 ==> 需要过滤掉不需要设置的列
const colRef = ref();
const colSetting = tableColumns!.filter(item => {
  const { type, prop, isShow } = item;
  return !columnTypes.includes(type!) && prop !== "operation" && isShow;
});
const openColSetting = () => colRef.value.openColSetting();

// 定义 emit 事件
const emit = defineEmits<{
  search: [];
  reset: [];
  dargSort: [{ newIndex?: number; oldIndex?: number }];
  batchDelete: string[] | number[];
}>();

const _search = () => {
  search();
  emit("search");
};

const _reset = () => {
  reset();
  emit("reset");
};

// 拖拽排序
const dragSort = () => {
  const tbody = document.querySelector(".el-table__body-wrapper tbody") as HTMLElement;
  Sortable.create(tbody, {
    handle: ".move",
    animation: 300,
    onEnd({ newIndex, oldIndex }) {
      const [removedItem] = processTableData.value.splice(oldIndex!, 1);
      processTableData.value.splice(newIndex!, 0, removedItem);
      emit("dargSort", { newIndex, oldIndex });
    }
  });
};

const tableWidth = ref("");

const getColumnWidth = (item: ColumnProps) => {
  const { prop, label, width } = item;

  if (width) return width;

  if (tableColumns.length < 10) return "auto";

  // 获取列中最宽的文字宽度
  const maxWidth = Math.max(
    tableData.value.reduce((max, row) => {
      const cellContent = row[prop!] || "";
      const cellWidth = getTextWidth(cellContent);
      return Math.max(max, cellWidth);
    }, 0),
    getTextWidth(label!)
  );

  // 根据最宽的文字宽度计算列宽度
  return maxWidth + 50 + "px";
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
    // @ts-expect-error
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
// 暴露给父组件的参数和方法 (外部需要什么，都可以从这里暴露出去)
defineExpose({
  element: tableRef,
  tableData: processTableData,
  radio,
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

<style>
.nowrap-cell {
  white-space: nowrap;
}
.table-main {
  .el-divider--vertical {
    height: 12px;
    border-left: 1px #eaeaea solid;
  }
}
</style>
