<template>
  <el-select v-bind="attr" v-load-more="{ load, className: className }" style="width: 100%" class="v-load-more">
    <el-option
      v-for="item in list"
      :class="className"
      :key="item[fieldOptions.value]"
      :value="item[fieldOptions.value]"
      :label="item[fieldOptions.label]"
    ></el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { useAttrs } from "vue";

const { immediate, load } = withDefaults(
  defineProps<{
    list?: any[];
    load?: () => void;
    className?: string;
    immediate?: boolean;
    fieldOptions?: { value: string; label: string };
  }>(),
  {
    list: () => [],
    load: () => {},
    immediate: true,
    className: "v-load-more__item",
    fieldOptions: () => ({ value: "value", label: "label" })
  }
);

const attr = useAttrs();

if (immediate) {
  load();
}
</script>

<style scoped></style>
