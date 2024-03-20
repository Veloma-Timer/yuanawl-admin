<template>
  <div class="flex flex-col w-full h-full">
    <div class="bg-white p-4 border-b border-b-[#eee] font-medium drop-shadow-sm">{{ currentCustomer.nick_name }}</div>
    <div
      class="flex-1 p-4 space-y-6 overflow-y-auto text-sm leading-6 shadow-sm content-wrapper bg-white text-slate-900 sm:text-base sm:leading-7"
    >
      <template v-for="item of messageList" :key="item.id">
        <div v-if="item.sendId == receiverId" class="flex flex-row-reverse items-start">
          <img class="w-8 h-8 ml-2 rounded-full" src="@/assets/images/avatar.png"/>
          <!--左边的内容-->
          <div class="flex rounded-b-xl rounded-tl-xl bg-slate-50 py-2 px-4 sm:min-h-0 sm:max-w-md md:max-w-2xl">
            <p v-html="item.content.replace('\n', '<br>')" />
          </div>
      </div>
        <div class="flex items-start" v-else>
          <img
            class="w-8 h-8 mr-2 rounded-full"
            :src="isEmpty(currentCustomer.avatar) ? 'https://dummyimage.com/128x128/354ea1/ffffff&text=G' : formatUrl(currentCustomer.avatar)"/>
          <div class="flex px-4 py-2 rounded-b-xl rounded-tr-xl bg-slate-50 sm:max-w-md md:max-w-2xl">
            <p v-html="item.content.replace('\n', '<br>')" />
        </div>
      </div>
      </template>

    </div>
    <!-- Prompt message input -->

    <div class="relative border-t border-t-[#eee]">
      <textarea
        v-model="content"
        class="block w-full p-4 pr-20 text-sm resize-none outline-none"
        placeholder="请输入..."
        rows="4"
        required
        @keydown="onKeydown"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getMessageList} from '@/api/modules/chat';
import {CHAT_EVENT, WS_BASE_URl} from '@/config';
import useState from '@/hooks/useState';
import {ChatMessage} from '@/typings/chat';
import {ChatContentType, MessageType} from '@/typings/enums';
import {User} from "@/typings/user";
import {formatUrl} from '@/utils';
import {isEmpty} from '@/utils/is';
import deepcopy from 'deepcopy';

import io from "socket.io-client";

interface IProps {
  currentSessionId: number;
  currentCustomer: User.IAppUser;
}

const emit = defineEmits<{
  (e: 'send'): void;
}>()

const receiverId = inject<number>("receiverId");

const socket = computed(() => io(`${WS_BASE_URl}/app_chat_message?sessionId=${currentSessionId.value}&clientId=${receiverId}`));

const props = defineProps<IProps>();

const content = ref("")

const currentSessionId = computed(() => props.currentSessionId);
const currentCustomer = computed(() => props.currentCustomer);

const [messageList, setMessageList] = useState<ChatMessage.IMessageItem[]>([]);

const _getMessageList = async () => {
  if (!currentSessionId.value) return;
  const {data} = await getMessageList(currentSessionId.value);
  setMessageList(data)
  setScroll()
}

const setScroll = () => {
  const ele = document.querySelector(".content-wrapper") as HTMLElement;
  nextTick(() => {
    ele.scrollTo({top: ele.scrollHeight, behavior: "smooth"});
  });
}
watch(socket, () => {
  socket.value.on(CHAT_EVENT, (data: ChatMessage.IMessageItem) => {
    if (data.sessionId !== currentSessionId.value) return;
    const _chatList = deepcopy<ChatMessage.IMessageItem[]>(messageList.value);
    _chatList.push(data);
    if (document.hasFocus()) {
      emit('send');
    }
    setMessageList(_chatList)
    setScroll();
  });
}, {deep: true, immediate: true});

const onSend = () => {
  const chatParams: ChatMessage.IChatParams = {
    content: content.value,
    messageType: MessageType.SYSTEM,
    contentType: ChatContentType.TEXT,
    sessionId: +currentSessionId.value,
    sendId: receiverId!,
    receiverId: currentCustomer.value.id
  }
  socket.value.emit(CHAT_EVENT, chatParams);
  emit('send')
  content.value = '';
};

watch(currentSessionId, _getMessageList, {immediate: true})

const onKeydown = function (event: KeyboardEvent) {
  if (event.isComposing) return;
  if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
    event.preventDefault();
    onSend();
  }
  // 检查按下的是回车键并且同时按下了Ctrl键
  if (event.key === "Enter" && event.ctrlKey && event.shiftKey) {
    // 阻止默认的换行行为
    event.preventDefault();

    // 在当前光标位置插入换行符
    const start = event.target?.selectionStart;
    const end = event.target?.selectionEnd;
    const value = event.target?.value;

    event.target!.value = value.substring(0, start) + "\n" + value.substring(end);

    // 移动光标位置到换行符后面
    event.target!.selectionStart = event.target!.selectionEnd = start + 1;
  }
}


</script>

<style scoped></style>
