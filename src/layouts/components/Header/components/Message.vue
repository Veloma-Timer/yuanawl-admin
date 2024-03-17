<template>
  <div class="message">
    <el-popover placement="bottom" :width="310" trigger="click">
      <template #reference>
        <el-badge :value="messageTtem.length" class="item">
          <img src="/images/notification.png" alt="元阿选号网后台" class="cursor-pointer" width="25" height="25" />
          <!--<i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>-->
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="消息(0)" name="second">
          <div class="message-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`待办工单(${messageTtem.length})`" name="first">
          <div class="message-list">
            <div class="message-item">
              <div class="message-content bg-[#f5f5f5] mb-2" v-for="item in messageTtem" :key="item.id">
                <div class="flex flex-row justify-between items-center p-2">
                  <p><span class="text-[#ef4444]">【待处理】</span>工单[{{ item.orderCode }}]</p>
                  <el-button type="danger" link @click="setRouterLink(item)">
                    立即处理<el-icon class="el-icon--right"><Promotion /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { getHomeWorkOrders } from "@/api/modules/home";
import { useUserStore } from "@/stores/modules/user";
import { Promotion } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeName = ref("first");
const messageTtem = ref([]);
const userStore = useUserStore();

const setRouterLink = (item: any) => {
  router.push({
    path: "/afterSales/orderSummary",
    query: {
      orderCode: item.orderCode
    }
  });
};

const workList = async () => {
  const {
    awaitWorkOrder: { pendingList }
  } = await getHomeWorkOrders({
    branchId: userStore.userInfo.branchId,
    userId: userStore.userInfo.id!
  });

  messageTtem.value = pendingList;

  // const {
  //   data: { list = [] }
  // } = await workOrder(params);
  // messageTtem.value = list;
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
