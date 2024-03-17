<template>
  <div class="table-box overflow-y-auto">
    <sale-chart-panel @change-id="changeId" />
    <sale-list-table :select-branch-id="selectBranchId" />
  </div>
</template>

<script setup lang="ts">
import SaleChartPanel from "./modules/push-chart-panel/index.vue";
import SaleListTable from "./modules/push-list-table/index.vue";

// 当前选择的门店id
const selectBranchId = ref();

function changeId(id: number) {
  selectBranchId.value = id;
}
</script>

<style scoped lang="scss"></style>
