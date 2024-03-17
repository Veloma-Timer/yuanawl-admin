<template>
  <div class="header flex flex-row items-center">
    <span class="title">{{ props.title }}</span>
  </div>
</template>

<script setup lang="ts">
interface HeaderProps {
  title: string;
}

const props = withDefaults(defineProps<HeaderProps>(), {
  title: ""
});
</script>

<style scoped lang="scss">
.header {
  flex: 1;
  background: linear-gradient(to right, black, rgba(0, 0, 0, 0.4));
  padding: 0 10px;
  border-radius: 4px;
}

.title {
  width: 100%;
  padding: 5px 0;
  font-size: 14px;
  color: white;
}
</style>
