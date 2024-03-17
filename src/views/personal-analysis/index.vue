<template>
  <div class="home table-box">
    <div class="home-tab flex ml-5">
      <div class="tab-list flex">
        <el-form :inline="true">
          <!-- <el-form-item label="时间段">
            <el-select v-model="monthName" placeholder="请选择时间段" @change="setValue">
              <el-option v-for="item in monthList" :key="item.id" :label="item.branchName" :value="item.id" />
            </el-select>
          </el-form-item> -->

          <el-form-item label="时间段">
            <el-date-picker
              v-model="monthName"
              type="daterange"
              unlink-panels
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :shortcuts="shortcuts"
              @change="setValue"
            />
            <!-- <el-select v-model="monthName" placeholder="请选择时间段" @change="setValue">
            <el-option v-for="item in monthList" :key="item.id" :label="item.branchName" :value="item.id" />
          </el-select> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="mb-2 mt-3 title-box" v-if="userInfoObj">
      <div class="mb-3 title relative">基本信息</div>
      <div class="flex">
        <div class="w-1/3">
          <p class="mb-3">
            <span class="title-label mr-3">员工姓名:</span>
            <span class="title-name">{{ userInfoObj.name }}</span>
          </p>
          <p class="mb-3">
            <span class="title-label mr-3">所属门店:</span>
            <span class="title-name">{{ userInfoObj.branch }}</span>
          </p>
        </div>
        <div class="w-1/3">
          <p class="mb-3">
            <span class="title-label mr-3">工号:</span>
            <span class="title-name">{{ userInfoObj.code }}</span>
          </p>
          <p class="mb-3">
            <span class="title-label mr-3">所属组:</span>
            <span class="title-name">{{ userInfoObj.role }}</span>
          </p>
        </div>
        <div class="w-1/3">
          <p>
            <span class="title-label mr-3">手机号:</span>
            <span class="title-name">{{ userInfoObj.tel }}</span>
          </p>
        </div>
      </div>
    </div>
    <homeSale
      v-if="salesObj"
      title="销售数据汇总"
      :sales-obj="salesObj"
      :branch-names="branchNames"
      :branch-name="branchName"
      @get-sales-list="getSalesList"
    />
    <homeRecovery
      v-if="statisticsObj"
      title="回收数据汇总"
      :statistics-obj="statisticsObj"
      :branch-names="branchNames"
      :branch-name="branchName"
      @get-reuse-list="getReuseList"
    />
    <homeRelease v-if="publishObj" :publish-obj="publishObj" :branch-name="branchName" title="发布数据汇总" />
    <homeNeed
      v-if="workOrderObj"
      :work-order-obj="workOrderObj"
      :branch-names="branchNames"
      :branch-name="branchName"
      title="待办工单"
    />
  </div>
</template>
<script setup lang="ts" name="home">
import { getUserProfile, homeSalesAndAfter, homeSalesChannel, getRecycleChannels, IStatistics } from "@/api/modules/home";
import homeRecovery from "@/views/home/modules/home-recovery/index.vue";
import { getGroups, getPublishPlatform } from "@/api/modules/dict";
import homeRelease from "@/views/home/modules/home-release/index.vue";
import homeSale from "@/views/home/modules/home-sale/index.vue";
import homeNeed from "@/views/home/modules/home-need/index.vue";
import { shortcuts, parseTime } from "@/utils";
import { HomeSet } from "@/api/interface";
import { useRoute } from "vue-router";

const route = useRoute();
interface userObj {
  branch: string;
  branchId: number;
  code: string;
  name: string;
  role: string;
  set: string;
  tel: string;
}

const monthName = ref<[string, string]>([parseTime(new Date(), "{y}-{m}-{d}"), parseTime(new Date(), "{y}-{m}-{d}")]);
const branchName = ref();
const branchNames = ref();
const params = ref<IStatistics>();
const paramsHome = ref();
const userInfoObj = ref<userObj>();
const setValue = function (date: [string, string]) {
  branchName.value = `${date[0]} 至 ${date[1]}`;
  branchNames.value = `${date[0]} 至 ${date[1]}`;

  params.value = {
    ...params.value,
    date
  };
  setHomeCardList();
};
const salesObj = ref<HomeSet.ISalesStatistics>(); // 销售组
const statisticsObj = ref<HomeSet.IRecycleStatistics>(); // 回收组
const publishObj = ref<HomeSet.IPublishStatistics>(); // 回收组
const workOrderObj = ref<HomeSet.IAfterSalesStatistics>(); // 售后
// let behindObj = null; // 后面的数据
const setHomeCardList = async () => {
  const {
    data: { publishPlatform = [] }
  } = await getPublishPlatform();
  const {
    data: { grouping = [] }
  } = await getGroups();
  let {
    data: { sales, recycle, publish, workOrder, userInfo }
  } = (await getUserProfile(params.value!)) as any;
  userInfoObj.value = userInfo as any;
  paramsHome.value = {
    ...paramsHome.value,
    branchId: userInfoObj.value?.branchId,
    date: monthName.value
  };
  const { data } = await homeSalesAndAfter(paramsHome.value);
  const resChannel = await homeSalesChannel(paramsHome.value);
  const recycleChannels = await getRecycleChannels(paramsHome.value);
  if (sales) {
    salesObj.value = {
      ...sales,
      sales: data.sales,
      resChannel: resChannel.data,
      channelList: publishPlatform,
      channelId: publishPlatform[0].value
    };
  }
  if (recycle) {
    statisticsObj.value = {
      ...recycle,
      recycleChannels: recycleChannels.data,
      channelList: grouping,
      channelId: grouping[0].id
    };
  }
  if (workOrder) {
    workOrderObj.value = {
      ...workOrder,
      afterSales: data.afterSales
    };
  }
  publishObj.value = publish as any;
};
const getSalesList = async (id: any) => {
  paramsHome.value = {
    ...paramsHome.value,
    channelId: id
  };
  const resChannel = await homeSalesChannel(paramsHome.value);
  salesObj.value = {
    ...salesObj.value,
    // @ts-ignore
    resChannel: resChannel.data,
    channelId: id
  };
};
const getReuseList = async (id: any) => {
  paramsHome.value = {
    ...paramsHome.value,
    grouping: id
  };
  const resRecycle = await getRecycleChannels(paramsHome.value);
  statisticsObj.value = {
    ...statisticsObj.value,
    // @ts-ignore
    resRecycle: resRecycle.data,
    channelId: id
  };
};
// 获取门店
const branchAllList = async (id: number) => {
  params.value = {
    ...params.value,
    userId: id,
    date: monthName.value
  };
  await setHomeCardList();
};
// 获取首页统计
onMounted(() => {
  setTimeout(() => {
    // 携带参数page跳转
    const { id } = route.query;
    const userId: number = Number(id);
    branchAllList(userId);
  }, 300);
});
</script>

<style scoped lang="scss">
@import "@/views/home/index";
.group {
  margin-bottom: 0;
}
.title-box {
  width: 100%;
  padding: 20px;
  background: #ffffff;
  border: 2px solid #f0f0f0;
  border-radius: 6px;
  .title {
    font-size: 16px;
    color: #303133;
    font-weight: bold;
    padding: 0 16px;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      width: 4px;
      height: 100%;
      background-color: var(--el-color-primary);
    }
    .title-label {
      color: #303133;
      font-size: 14px;
      min-width: 68px;
    }
    .title-name {
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>
