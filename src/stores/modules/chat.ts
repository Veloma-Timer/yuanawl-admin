import {Chat} from "@/stores/interface";
import {defineStore} from "pinia";
import {useIntervalFn} from "@vueuse/core";
import {getChatList} from "@/api/modules/chat";
import {useUserStore} from "@/stores/modules/user";

export const useChatStore = defineStore({
  id: "chat",
  state: (): Chat => ({
    chatList: []
  }),
  getters: {
    // 获取待处理列表
    getPendingList: (state) => {
      const list = state.chatList.filter(item => Number(item.is_not_read_count) > 0);

      let total = 0;

      const map = list.reduce((map, item) => {
        const count = Number(item.is_not_read_count);
        total += count;
        return {
          ...map,
          [item.session_id]: count
        }
      }, {} as any);

      return {list, map, total}
    }
  },
  actions: {
    async loop() {
      const user = useUserStore();
      const _getChatList = async () => {
        if (!user.token) return;
        const {data} = await getChatList({receiverId: 0, handleCustomerServiceId: user.userInfo.id},)
        this.chatList = data;
      };

      useIntervalFn(
        _getChatList,
        5000,
        {
          immediate: true,
          immediateCallback: true
        }
      );
    }
  }
});
