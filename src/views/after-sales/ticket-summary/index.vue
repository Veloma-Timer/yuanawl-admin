<template>
  <div class="card table-box">
    <order-chart-panel @change-id="changeId" :branchList="branchList" />
    <order-list-table :select-branch-id="selectBranchId" :isShowTableHeaderBtn="false" :branchList="branchList" />
  </div>
</template>

<script setup lang="ts">
import OrderChartPanel from "./modules/order-chart-panel/index.vue";
import OrderListTable from "./modules/order-list-table/index.vue";
import { getAllBranch } from "@/api/modules/branch";

// 当前选择的门店id
const selectBranchId = ref();

function changeId(id: number) {
  selectBranchId.value = id;
}

// 门店数据获取
type BranchObj = { branchName: string; id: number };
const branchList = ref<BranchObj[]>([]);
const currentCitySelect = ref("");
const getAllBranchData = async () => {
  const { data } = await getAllBranch();
  branchList.value = data?.map(item => {
    return {
      branchName: item.branchName,
      id: item.id
    };
  });
  currentCitySelect.value = branchList.value[0].branchName;
  let selectObj = branchList.value.find(item => item.branchName === currentCitySelect.value);
  selectBranchId.value = selectObj!.id;
};
getAllBranchData();
</script>

<style scoped lang="scss"></style>
