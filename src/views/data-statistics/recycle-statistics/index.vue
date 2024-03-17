<template>
  <div class="table-box overflow-y-auto">
    <recovery-chart-panel @change-id="changeId" />
    <recovery-list-table :select-branch-id="selectBranchId" />
  </div>
</template>

<script setup lang="ts">
import RecoveryChartPanel from "./modules/recovery-chart-panel/index.vue";
import RecoveryListTable from "./modules/recovery-list-table/index.vue";

// 当前选择的门店id
const selectBranchId = ref();

const changeId = (id: number) => (selectBranchId.value = id);
</script>
