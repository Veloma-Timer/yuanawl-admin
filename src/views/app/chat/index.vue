<template>
  <div class="table-box">
    <div class="flex flex-row rounded-lg overflow-hidden flex-1">
      <Sidebar ref="sidebarRef" :chat-list="chatStore.chatList" v-model:current-session-id="currentSessionId"/>
      <Container
        :chat-list="chatStore.chatList" :current-session-id="currentSessionId" :current-customer="currentCustomer"
        @send="onSend"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {handleChat, signMessageRead} from "@/api/modules/chat";
import {useUserStore} from "@/stores/modules/user";
import {useChatStore} from "@/stores/modules/chat";
import Container from "./components/Container.vue";
import Sidebar from "./components/Sidebar.vue";
import {User} from "@/typings/user";
import {useRoute} from "vue-router";
import {isEmpty} from "@/utils/is";
// import { getChatList } from "@/api/modules/chat";
// import { useUserStore } from "@/stores/modules/user";
// import { ChatMessage } from "@/typings/chat";
// import useState from "@/hooks/useState";
// import { useIntervalFn } from "@vueuse/core";


const route = useRoute();

const chatStore = useChatStore();

const receiverId = 0;

const currentSessionId = ref<number>(0);

const sidebarRef = ref<InstanceType<typeof Sidebar>>();

watch(() => route.query, (query) => {
  if (query.sessionId) {
    currentSessionId.value = Number(query.sessionId);
  }
}, {immediate: true, deep: true});

// const [chatList, setChatList] = useState<ChatMessage.IChatItem[]>([])

const currentCustomer = computed(() => {
  if (isEmpty(currentSessionId.value)) return {} as User.IAppUser;
  return chatStore.chatList.find((item) => item.session_id === currentSessionId.value)?.user || {} as User.IAppUser;
});

const userStore = useUserStore();

// const userInfo = computed(() => userStore.userInfo)

// const _getChatList = async () => {
//   const { data } = await getChatList({receiverId, handleCustomerServiceId: userInfo.value.id}, )
//   setChatList(data)
// };

watch(currentSessionId, async (sessionId) => {
  await handleChat({sessionId, handleCustomerServiceId: userStore.userInfo.id});
  await onSend();
})

const onSend = async () => {
  await signMessageRead({sessionId: currentSessionId.value, receiverId: 0});
}

provide("receiverId", receiverId);

// useIntervalFn(
//   _getChatList,
//   5000,
//   {
//     immediate: true,
//     immediateCallback: true
//   }
// );

</script>

<style scoped></style>
