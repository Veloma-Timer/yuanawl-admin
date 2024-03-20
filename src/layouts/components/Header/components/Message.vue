<template>
  <div class="message">
    <el-popover placement="bottom" :width="310" trigger="click">
      <template #reference>
        <el-badge :value="(tickets.length || 0) + (Number(chatStore.getPendingList.total) || 0)" class="item">
          <img src="/images/notification.png" alt="元阿选号网后台" class="cursor-pointer" width="25" height="25" />
          <!--<i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>-->
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`消息(${chatStore.getPendingList.total})`" name="message">
          <div v-if="chatStore.getPendingList.total > 0" class="message-list">
            <div class="message-item">
              <div
                v-for="({ user, message_time, content, session_id }) in chatStore.getPendingList.list" :key="session_id"
                class="message-content bg-[#f5f5f5] mb-2 p-2 cursor-pointer flex flex-row items-center gap-3 overflow-x-hidden"
                @click="toChat(session_id)"
              >
                <div class="rounded overflow-hidden">
                  <img
                    :src="isEmpty(user.avatar) ? `https://dummyimage.com/128x128/354ea1/ffffff&text=${user.nick_name.slice(0, 1)}` : formatUrl(user.avatar)"
                    :alt="user.nick_name" width="40" height="40">
                </div>

                <div class="flex-1">
                  <div class="flex flex-row justify-between items-center w-full gap-1">
                    <p class="text-sm font-medium capitalize text-slate-700">{{ user?.nick_name ?? "未知" }}</p>
                    <p class="text-xs text-gray-400">{{ getTime(message_time) }}</p>
                  </div>
                  <div class="flex flex-row justify-between items-center w-full gap-1">
                    <p class="text-sm capitalize text-gray-400">{{ content }}</p>
                    <el-button type="danger" size="small" link>
                      点击回复
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="message-empty">
            <el-empty :image-size="100" description="暂无消息"/>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`待办工单(${tickets?.length || 0})`" name="ticket">
          <div v-if="tickets?.length > 0" class="message-list">
            <div class="message-item">
              <div class="message-content bg-[#f5f5f5] mb-2" v-for="item in tickets" :key="item.id">
                <div class="flex flex-row justify-between items-center p-2">
                  <p><span class="text-[#ef4444]">【待处理】</span>工单[{{ item?.orderCode }}]</p>
                  <el-button type="danger" size="small" link @click="setRouterLink(item)">
                    立即处理
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="message-empty">
            <el-empty :image-size="100" description="暂无消息"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import {getHomeWorkOrders} from "@/api/modules/home";
import {useUserStore} from "@/stores/modules/user";
import {useChatStore} from "@/stores/modules/chat";
import {formatUrl, getTime} from "@/utils";
import {useRouter} from "vue-router";
import {isEmpty} from "@/utils/is";

const chatStore = useChatStore()
const router = useRouter();
const activeName = ref('message');
const tickets = ref<any[]>([]);
const userStore = useUserStore();

const setRouterLink = (item: any) => {
  router.push({
    path: "/afterSales/orderSummary",
    query: {
      orderCode: item.orderCode
    }
  });
};

const toChat = (sessionId: number) => {
  router.push({name: 'chat', query: {sessionId: sessionId}});
}

const workList = async () => {
  const {
    awaitWorkOrder: { pendingList }
  } = await getHomeWorkOrders({
    branchId: userStore.userInfo.branchId,
    userId: userStore.userInfo.id!
  });
  if (chatStore.getPendingList.total < 1 && pendingList.length > 0) {
    activeName.value = 'ticket';
  }
  tickets.value = pendingList;
};
workList();
</script>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}

.message-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;

  .message-item {
    border-bottom: 1px solid var(--el-border-color-light);
    width: 100%;

    &:last-child {
      border: none;
    }

    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }

    .message-content {
      display: flex;
      flex-direction: column;
      border-radius: 4px;

      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
