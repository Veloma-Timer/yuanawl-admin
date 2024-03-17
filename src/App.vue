<template>
  <el-config-provider :locale="zh" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import {useGlobalStore} from "@/stores/modules/global";
import zh from "element-plus/es/locale/lang/zh-cn";
import {ElConfigProvider} from "element-plus";
import {useTheme} from "@/hooks/useTheme";

const globalStore = useGlobalStore();

// init theme
const {initTheme} = useTheme();
initTheme();

// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize);

// element button config
const buttonConfig = reactive({autoInsertSpace: false});


onMounted(() => {
  window.osApi?.ready();

  window.osApi?.watchNotification((params) => {
    console.log('接收到了', params);
  });

  window.osApi?.watchMacAddress((address: string) => globalStore.setMacAddress(address));
});

</script>

<style>
.table-box {
  padding: 10px;
  background-color: var(--el-bg-color-page);
}

.red {
  border: 1px solid red;
}
</style>
