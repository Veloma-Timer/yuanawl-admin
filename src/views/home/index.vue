<template>
  <div ref="scrollNum" class="home hide-scroll">
    <el-affix :offset="50">
      <div class="flex px-4 pt-4 bg-white shadow-md home-tab">
        <el-form :inline="true">
          <el-form-item label="部门">
            <el-select v-model="dept" placeholder="请选择部门" class="w-[180px]">
              <el-option
                v-for="({ name, id, disabled }, index) in deptList"
                :key="index"
                :label="name"
                :value="id!"
                :disabled="disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="门店">
            <el-select v-model="params.branchId" placeholder="请选择门店" class="w-[180px]">
              <el-option v-for="item in branchList" :key="item.id" :label="item.branchName" :value="item.id!"/>
            </el-select>
          </el-form-item>

          <el-form-item label="时间段">
            <el-date-picker
              v-model="params.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :clearable="false"
              unlink-panels
              :shortcuts="shortcuts"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-affix>
    <div class="flex flex-col gap-3 p-3">
      <HomeSale
        v-if="visiblePane('home:sales', '0')"
        title="销售数据汇总"
        :sales-obj="salesObj!"
        @get-sales-list="getSalesList"
      />
      <HomeRecovery
        v-if="visiblePane('home:recycle', '1')"
        :statistics-obj="statisticsObj!"
        title="回收数据汇总"
        @get-recycle-channels="_getRecycleChannels"
      />
      <HomeRelease
        v-if="visiblePane('home:publish', '3')"
        :publish-obj="publishObj!"
        title="发布数据汇总"
      />
      <HomeNeed
        v-if="visiblePane('home:after-sale', '2')"
        :work-order-obj="workOrderObj!"
        title="售后数据汇总"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="Home">
import {getHomeStatistics, getRecycleChannels, homeSalesAndAfter, homeSalesChannel, IStatistics} from "@/api/modules/home";
import HomeRecovery from "@/views/home/modules/home-recovery/index.vue";
import HomeRelease from "@/views/home/modules/home-release/index.vue";
import HomeSale from "@/views/home/modules/home-sale/index.vue";
import HomeNeed from "@/views/home/modules/home-need/index.vue";
import {useUserStore} from "@/stores/modules/user";
import {useAuthStore} from "@/stores/modules/auth";
import {getAllBranch} from "@/api/modules/branch";
import {onBeforeRouteLeave} from "vue-router";
import {useDateFormat} from "@vueuse/core";
import {HomeSet} from "@/api/interface";
import {useDict} from "@/hooks/useDict";
import {shortcuts} from "@/utils";

const userStore = useUserStore();
const authStore = useAuthStore();

const { dept: deptDict, publishPlatform, groups } = useDict("dept", 'publishPlatform', 'groups');

const deptList = computed(() => {
  const data = [
    {name: "全部", id: '9', disabled: false},
    ...deptDict?.value?.map(item => {
      return { name: item.label, id: item.value, disabled: Number(item.value) > 3 };
    })
  ]

  if (userStore.userInfo.isAdmin == '1') {
    return data;
  } else {
    return data.filter(item => item.id == userStore.userInfo.deptId)
  }
});

const params = ref<IStatistics>({
  date: shortcuts[2].value().map(date => useDateFormat(date, 'YYYY-MM-DD').value) as [string, string],
  branchId: userStore.userInfo.branchId // 默认为用户绑定的门店
});
const branchList = ref<{ branchName: string; id: number }[]>([]);

const dept = ref<string>(userStore.userInfo.isAdmin == "1" ? '9' : userStore.userInfo.deptId);

const scrollNum = ref<number>();

const scroll = ref<string>("0");

const visiblePane = computed(() => {
  return (auth: string, currentDept: string) => {
    // 有当前这个权限， 并且选中 dept才会显示
    if (!authStore.authButtonList.includes(auth)) return false;
    if (dept.value === '9') return true;
    return dept.value == currentDept;
  };
});

const salesObj = ref<HomeSet.ISalesStatistics>(); // 销售组
const statisticsObj = ref<HomeSet.IRecycleStatistics>(); // 回收组
const publishObj = ref<HomeSet.IPublishStatistics>(); // 发布组
const workOrderObj = ref<HomeSet.IAfterSalesStatistics>(); // 售后

const reset = () => {
  salesObj.value = undefined;
  statisticsObj.value = undefined;
  publishObj.value = undefined;
  workOrderObj.value = undefined;
};

// 获取数据
const setHomeCardList = async () => {
  reset();

  const {
    data: { sales, recycle, publish, workOrder }
  } = (await getHomeStatistics(params.value!)) as any;

  const {data} = await homeSalesAndAfter(params.value);
  const resChannel = await homeSalesChannel(params.value);
  const {data: recycleChannels} = await getRecycleChannels(params.value);

  // 销售
  if (sales) {
    salesObj.value = {
      ...sales,
      sales: data.sales,
      resChannel: resChannel.data,
      channelList: publishPlatform.value,
      channelId: publishPlatform.value[0]?.value
    };
  }
  // 回收
  if (recycle) {
    statisticsObj.value = {
      ...recycle,
      recycleChannels,
      channelList: groups.value,
      channelId: groups.value[0]?.value
    };
  }
  if (workOrder) {
    workOrderObj.value = {
      ...workOrder,
      afterSales: data.afterSales
    };
  }
  params.value.channelId = Number(publishPlatform.value[0]?.value);
  // @ts-ignore
  params.value.grouping = groups.value[0]?.value;
  publishObj.value = publish as any;
};

const getSalesList = async (id: any) => {
  params.value.channelId = id;
  const resChannel = await homeSalesChannel(params.value);
  // @ts-ignore
  salesObj.value = {
    ...salesObj.value,
    // @ts-ignore
    resChannel: resChannel.data,
    channelId: id
  };
};

const _getRecycleChannels = async (id: any) => {
  // 分组改变之后, 会触发全局重新查询
  const { data: recycleChannels } = await getRecycleChannels({
    ...params.value,
    grouping: id
  });

  // @ts-ignore
  statisticsObj.value.recycleChannels = recycleChannels;
  // @ts-ignore
  statisticsObj.value.channelId = id;
};

// 获取门店
const getBranch = async () => {
  // 判断当前用户是不是管理员, 如果是管理员才可以选择门店, 如果不是管理员则只可以看自己所在的门店
  const { data } = await getAllBranch();
  if (userStore.userInfo.isAdmin == '1') {
    branchList.value = data;
  } else {
    branchList.value = data.filter(item => item.id == userStore.userInfo.branchId);
  }
  getScroll();
};

watch(params, setHomeCardList, {deep: true, immediate: true});

// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  // 将当前位置进行一个保存
  // @ts-ignore
  scroll.value = scrollNum.value?.scrollTop;
  sessionStorage.setItem("scrollTop", scroll.value);
  next();
});
const getScroll = () => {
  const scrollValue = sessionStorage.getItem("scrollTop");
  nextTick(() => {
    if (scrollValue) {
      // @ts-ignore
      scrollNum.value!.scrollTop = Number(scrollValue);
    } else {
      // @ts-ignore
      scrollNum.value!.scrollTop = 0;
    }
  });
};

watchEffect(async () => {
  await getBranch()
})
</script>

<style>
.v-analysis-block {
  border-radius: 6px;
  border: 1px solid #eeeeee;
}
</style>

<style scoped lang="scss">
@import "./index.scss";
.group {
  margin-bottom: 0;
}
</style>
