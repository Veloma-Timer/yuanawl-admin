<template>
  <div class="-mx-2">
    <RecoveryList :isShowTableHeaderBtn="false" :disabled="true" />
  </div>
</template>

<script setup lang="tsx">
// 回收列表搬过来 ==> 回收数据
import RecoveryList from "@/views/account-admin/recycle/index.vue";
</script>
