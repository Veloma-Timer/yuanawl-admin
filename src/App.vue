<template>
  <el-config-provider :locale="zh" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import {useGlobalStore} from "@/stores/modules/global";
import {useChatStore} from "@/stores/modules/chat";
import zh from "element-plus/es/locale/lang/zh-cn";
import {ElConfigProvider} from "element-plus";
import {useTheme} from "@/hooks/useTheme";
import {useRouter} from 'vue-router';

const globalStore = useGlobalStore();
const router = useRouter();

const chatStore = useChatStore();

// init theme
const {initTheme} = useTheme();
initTheme();

// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize);

// element button config
const buttonConfig = reactive({autoInsertSpace: false});

chatStore.loop();

watch(() => chatStore.getPendingList, (newValue, oldValue) => {
  const {map, list} = newValue;
  const {map: oldMap} = oldValue || {};

  if (JSON.stringify(map) === JSON.stringify(oldMap)) return;

  list.forEach(item => {
    window.osApi.sendNotification({
      title: '来自买家的新消息！',
      body: `【${item.user.nick_name}】： ${item.content}`,
      type: 'message',
      hasReply: true,
      timeoutType: 'never',
      extras: JSON.stringify(item)
    });
  });
}, {deep: true, immediate: true});


onMounted(() => {
  window.osApi?.ready();

  // 接收用户点击的操作, 跳转对应的页面
  window.osApi?.watchNotification((params) => {
    // 默认第一个
    let sessionId = chatStore.chatList[0].session_id;
    try {
      const extras = JSON.parse(params.extras);
      sessionId = extras.session_id;
    } catch (e) {
    }
    if (!sessionId) return;
    router.push({name: 'chat', query: {sessionId: sessionId}});
  });

  window.osApi?.watchMacAddress((params: { macAddress: string, platform: Platform }) => {
    globalStore.setPlatform(params.platform);
    globalStore.setMacAddress(params.macAddress);
  });
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
