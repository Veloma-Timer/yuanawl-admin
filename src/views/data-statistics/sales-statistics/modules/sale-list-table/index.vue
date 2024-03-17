<template>
  <div class="-mx-2">
    <SalesList :isShowTableHeaderBtn="false" :disabled="true" />
  </div>
</template>

<script setup lang="tsx">
// 已售列表搬过来 ==> 销售数据
import SalesList from "@/views/account-admin/sales/index.vue";
</script>
