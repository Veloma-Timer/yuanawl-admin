<template>
  <div class="-mx-2">
    <ReleaseList :isShowTableHeaderBtn="false" :disabled="true" />
  </div>
</template>

<script setup lang="tsx">
// 发布列表搬过来 ==> 发布数据
import ReleaseList from "@/views/account-admin/publish/index.vue";
</script>
