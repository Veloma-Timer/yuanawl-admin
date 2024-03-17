<template>
  <div class="table-box overflow-y-auto">
    <sale-chart-panel @change-id="changeId" />
    <sale-list-table :select-branch-id="selectBranchId" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SaleChartPanel from "./modules/sale-chart-panel/index.vue";
import SaleListTable from "./modules/sale-list-table/index.vue";

// 当前选择的门店id
const selectBranchId = ref();

const changeId = (id: number) => {
  selectBranchId.value = id;
};
</script>
