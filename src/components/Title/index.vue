<script setup lang="ts" name="CardHeader">
interface IProps {
  title?: string;
}

defineProps<IProps>();
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="text-[17px] text-[#000000] font-semibold">{{ title }}</div>
  </div>
</template>
