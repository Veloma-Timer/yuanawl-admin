<template>
  <div class="theme-setting">
    <img src="/images/theme.png" alt="元阿选号网后台" class="cursor-pointer" width="25" height="25" @click="openDrawer" />
    <!--<i :class="'iconfont icon-zhuti'" class="toolBar-icon" @click="openDrawer"></i>-->
  </div>
</template>

<script setup lang="ts">
import mittBus from "@/utils/mittBus";
const openDrawer = () => {
  mittBus.emit("openThemeDrawer");
};
</script>
