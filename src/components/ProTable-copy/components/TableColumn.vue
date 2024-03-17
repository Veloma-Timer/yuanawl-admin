<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup lang="tsx" name="TableColumn">
import { inject, ref, useSlots } from "vue";
import { ColumnProps, RenderScope, HeaderRenderScope } from "@/components/ProTable/interface";
import { filterEnum, formatValue, handleProp, handleRowAccordingToProp } from "@/utils";

const props = defineProps<{ column: ColumnProps; columns: ColumnProps[]; customKey: number }>();

const slots = useSlots();

const enumMap = inject("enumMap", ref(new Map()));

// 渲染表格数据
const renderCellData = (scope: RenderScope<any>) => {
  //  && item.isFilterEnum
  if (enumMap.value.get(props.columns[props.customKey].prop)) {
    return filterEnum(
      handleRowAccordingToProp(scope.row, props.columns[props.customKey].prop!, props.columns, props.customKey),
      enumMap.value.get(props.columns[props.customKey].prop)!,
      props.columns[props.customKey].fieldNames
    );
  } else {
    // 这里只是返回字段值
    return formatValue(handleRowAccordingToProp(scope.row, props.columns[props.customKey].prop!, props.columns, props.customKey));
  }
};

// 获取 tag 类型
const getTagType = (item: ColumnProps, scope: RenderScope<any>) => {
  return filterEnum(
    handleRowAccordingToProp(scope.row, item.prop!, props.columns, props.customKey),
    enumMap.value.get(item.prop),
    item.fieldNames,
    "tag"
  );
};

const RenderTableColumn = (item: ColumnProps) => {
  return (
    <>
      {item.isShow && (
        <el-table-column
          {...item}
          align={item.align ?? "center"}
          sortable={item.sortable ? "custom" : false}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
        >
          {{
            default: (scope: RenderScope<any>) => {
              const _item = props.columns[props.customKey];
              if (_item._children) return _item._children.map(child => RenderTableColumn(child));
              if (_item.render) return _item.render(scope);
              if (slots[handleProp(_item.prop!)]) return slots[handleProp(_item.prop!)]!(scope);
              if (_item.tag) return <el-tag type={getTagType(_item, scope)}>{renderCellData(scope)}</el-tag>;
              return renderCellData(scope);
            },
            header: (scope: HeaderRenderScope<any>) => {
              if (item.headerRender) return item.headerRender(scope);
              if (slots[`${handleProp(item.prop!)}Header`]) return slots[`${handleProp(item.prop!)}Header`]!(scope);
              return item.label;
            }
          }}
        </el-table-column>
      )}
    </>
  );
};
</script>
