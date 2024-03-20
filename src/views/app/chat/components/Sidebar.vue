<template>
  <!-- Sidebar -->
  <aside class="flex h-full overflow-hidden">
    <div class="flex flex-col overflow-y-auto w-60 bg-slate-50 sm:w-64">
      <p class="px-5 py-4 font-medium text-slate-800 border-b border-b-[#eee]">
        消息列表
      </p>

      <!-- Previous chats container -->

      <ul class="overflow-y-auto">
        <li
          v-for="({session_id, user, message_time, content, is_not_read_count}) of chatList"
          :key="session_id"
          :class="[currentSessionId == session_id ? 'bg-slate-200' : '', 'customer-item', 'cursor-pointer']"
          @click="handleClickChat(session_id)"
        >
          <div class="flex flex-row items-center gap-3">
            <el-badge
              :hidden="Number(is_not_read_count) < 1"
              :max="99"
              :value="chatStore.getPendingList.total"
            >
              <div class="rounded overflow-hidden">
                <img
                  :src="isEmpty(user.avatar) ? 'https://dummyimage.com/128x128/354ea1/ffffff&text=G' : formatUrl(user.avatar)"
                  :alt="user.nick_name" width="35" height="35">
              </div>
            </el-badge>


            <div class="flex-1">
              <div class="flex flex-row justify-between items-center w-full">
                <p class="text-sm font-medium capitalize text-slate-700">{{ user?.nick_name ?? "未知" }}</p>
                <p class="text-xs text-gray-400">{{ getTime(message_time) }}</p>
              </div>

              <p class="text-sm capitalize text-gray-400">{{ content }}</p>
            </div>
          </div>
        </li>


      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">

import {ChatMessage} from '@/typings/chat';
import {useDateFormat} from "@vueuse/core";
import {useChatStore} from "@/stores/modules/chat";
import {formatUrl} from "@/utils";
import {isEmpty} from "@/utils/is";

interface IProps {
  chatList: ChatMessage.IChatItem[]
  currentSessionId: number
}

interface IEmits {
  (e: "update:currentSessionId", sessionId: number): void
}

const getTime = (date: string) => {
  const currentDate = new Date();

  if (useDateFormat(date, 'YYYY-MM-DD').value === useDateFormat(currentDate, 'YYYY-MM-DD').value) {
    return useDateFormat(date, 'hh:mm').value
  }
  return useDateFormat(date, 'YYYY/MM/DD').value
}

const chatStore = useChatStore()

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()
const chatList = computed(() => props.chatList)
const currentSessionId = computed(() => props.currentSessionId)
const handleClickChat = async (sessionId: number) => {
  emits("update:currentSessionId", sessionId);
}

</script>

<style scoped lang="scss">
.customer-item {
  @apply flex flex-col w-full px-3 py-2 text-left transition-colors duration-200 gap-y-2 hover:bg-slate-200 focus:outline-none;

}

</style>
