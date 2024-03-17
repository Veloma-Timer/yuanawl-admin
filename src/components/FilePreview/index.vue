<template>
  <div class="icon-box">
    <el-dialog
      v-model="dialogVisible"
      title="音视频预览"
      top="50px"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template v-if="dialogProps.type === 'audio'">
        <!-- http://47.93.191.89:3000${dialogProps.url} -->
        <audio controls :src="dialogProps.url" style="margin: 42px auto"></audio>
      </template>
      <template v-if="dialogProps.type === 'video'">
        <video controls :src="dialogProps.url" style="width: 100%"></video>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
const dialogVisible = ref(false);
const dialogProps = ref<{ url: string; type: string }>({
  url: "",
  type: ""
});

const openDialog = async (row: any) => {
  dialogProps.value.url = row.url;
  dialogProps.value.type = row.type;
  dialogVisible.value = true;
};

defineExpose({
  openDialog
});
</script>

<style lang="scss" scoped>
.check-select,
.order-input {
  width: 100%;
}
:deep(.el-dialog__body) {
  display: flex;
  justify-content: center;
  padding: 0;
}
</style>
