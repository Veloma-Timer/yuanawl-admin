<template>
  <div class="p-4 bg-white rounded-md">
    <div class="home-crud">
      <div class="relative mb-2 text-lg title">{{ title }}</div>
      <div class="crud-list">
        <div v-for="(item, index) in crudListMap" :key="index" class="flex gap-2 crud-list-item">
          <DigitBoard
            v-if="statisticsObj"
            :icon="item.icon"
            :value="item.current"
            :year-value="item.year"
            :title="namesList[index]"
            :chain-value="item.yesterday"
          />
          <DigitBoardSkeleton v-else />
        </div>
      </div>
    </div>

    <div class="relative mt-4 mb-2 text-lg title">数据分析</div>

    <div class="flex flex-col gap-3.5">
      <div class="home-name v-analysis-block">
        <HomeGroup
          v-if="statisticsObj?.recycleRatio"
          :data="statisticsObj?.recycleRatio"
          bar-color="#3FC0A0"
          line-color="#69BCEB"
          class-name="maintain"
          title="账号回收占比"
        />
        <HalfScreenSkeleton v-else />
      </div>
      <div class="home-name flex flex-row gap-3.5">
        <div class="home-name-right v-analysis-block">
          <NameRight
            v-if="statisticsObj?.recycleRanking"
            title="平台回收数量排名"
            :salas-ranking-arr="statisticsObj?.recycleRanking"
            :header="['姓名', '金额', '数量']"
          />
          <HalfScreenSkeleton v-else />
        </div>
        <div class="home-name-left v-analysis-block">
          <NameRight
            title="回收问题账号"
            :salas-ranking-arr="statisticsObj?.recycleRankingByProblem"
            :header="['工单类型', '金额', '数量']"
          />
        </div>
      </div>
      <div class="v-analysis-block">
        <HomeChat
          v-if="statisticsObj?.recycleService"
          :data="statisticsObj?.recycleService"
          class-name="maintain"
          title="游戏区服"
        />
        <HalfScreenSkeleton v-else />
      </div>
      <div class="v-analysis-block">
        <HomeChat
          v-if="statisticsObj?.recycleGameType"
          :data="statisticsObj?.recycleGameType"
          :height="450"
          class-name="maintain"
          title="游戏类型"
        />
        <HalfScreenSkeleton v-else />
      </div>
      <div class="v-analysis-block">
        <HomeGroup :data="statisticsObj?.recycleSetComparison" title="回收组数据对比" />
      </div>
      <div class="v-analysis-block">
        <HomeChain :list-arr="statisticsObj?.recycleChannels" title="回收渠道对比">
          <div>
            <el-select v-model="channelId" class="m-2" clearable placeholder="查看数据" @change="onChangeRecycleChannel">
              <el-option v-for="item in statisticsObj?.channelList" :key="item.id" :label="item.label" :value="item.value!" />
            </el-select>
          </div>
        </HomeChain>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import RecycleSalesAmountIcon from "@/assets/images/second/recycle-sales-amount-icon.png";
import RecycleSalesMoneyIcon from "@/assets/images/second/recycle-sales-money-icon.png";
import RecycleAverageIcon from "@/assets/images/second/recycle-average-icon.png";
import RecycleAmountIcon from "@/assets/images/second/recycle-amount-icon.png";
import UnSalesAmountIcon from "@/assets/images/second/unsales-amount-icon.png";
import UnSalesMoneyIcon from "@/assets/images/second/unsales-money-icon.png";
import RecycleMoneyIcon from "@/assets/images/second/recycle-money-icon.png";
import DigitBoardSkeleton from "../../components/DigitBoardSkeleton.vue";
import HalfScreenSkeleton from "../../components/HalfScreenSkeleton.vue";
import HomeChat from "@/views/home/modules/home-recovery/HomeChat.vue";
import HomeChain from "@/views/home/modules/home-chain/index.vue";
import HomeGroup from "@/views/home/modules/home-group/index.vue";
import NameRight from "@/views/home/modules/name-right/index.vue";
import DigitBoard from "@/views/home/components/DigitBoard.vue";
import type {IDigitBoard} from "@/typings";
import {HomeSet} from "@/api/interface";
import currency from "currency.js";

const emit = defineEmits<{
  (e: 'getRecycleChannels', id: string): void
}>();

const channelId = ref();
const namesList: string[] = ["回收金额", "回收数量", "回收均价", "出售数量", "出售金额", "未售数量", "未售金额"];
// 处理数据
const props = defineProps<{
  statisticsObj?: HomeSet.IRecycleStatistics;
  title: string;
}>()

const crudListMap = ref<IDigitBoard[]>([]);

const onChangeRecycleChannel = (id: string) => {
  emit("getRecycleChannels", id)
};

const setCrud = (obj: HomeSet.IRecycleStatistics) => {
  crudListMap.value = [
    {
      icon: RecycleMoneyIcon,
      current: currency(obj?.recycleMoney).format({ symbol: "¥" }),
      yesterday: obj?.ayerRecycleMoney,
      year: obj?.yoyRecycleMoney
    },

    {
      icon: RecycleAmountIcon,
      current: obj.recycleAmount,
      yesterday: obj.ayerRecycleAmount,
      year: obj.yoyRecycleAmount
    },

    {
      icon: RecycleAverageIcon,
      current: currency(obj.recycleAveMoney).format({ symbol: "¥" }),
      yesterday: obj.ayerRecycleAveMoney,
      year: obj.yoyRecycleAveMoney
    },

    {
      icon: RecycleSalesAmountIcon,
      current: obj.salesAmount,
      yesterday: obj.ayerSalesAmount,
      year: obj.yoySalesAmount
    },

    {
      icon: RecycleSalesMoneyIcon,
      current: currency(obj.salesMoney).format({ symbol: "¥" }),
      yesterday: obj.ayerSalesMoney,
      year: obj.yoySalesMoney
    },

    {
      icon: UnSalesAmountIcon,
      current: obj.unsoldAmount,
      yesterday: obj.ayerUnsoldAmount,
      year: obj.yoyUnsoldAmount
    },

    {
      icon: UnSalesMoneyIcon,
      current: currency(obj.unsoldMoney).format({ symbol: "¥" }),
      yesterday: obj.ayerUnsoldMoney,
      year: obj.yoyUnsoldMoney
    }
  ];
  channelId.value = obj?.channelId;
};
watch(
  () => props.statisticsObj,
  data => {
    crudListMap.value = [];
    if (!data) return;
    setCrud(data);
  },
  { deep: true, immediate: true }
);
</script>
<style scoped lang="scss">
.home-crud {
  width: 100%;

  .title {
    font-weight: 600;
    color: rgba(0, 0, 0, 0.87);
  }

  .crud-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    column-gap: 20px;

    .crud-list-item {
      min-width: 25%;
      max-height: 180px;
      margin-bottom: 20px;

      .recovery-number {
        width: 160px;
        height: 100%;
      }

      .crud-total {
        width: calc(100% - 160px);
        height: 100%;
        padding: 20px 0;
        color: #858585;

        .total-name {
          margin-bottom: 22px;
          font-size: 16px;
          font-weight: normal;
        }

        .total-compare {
          font-size: 8px;
          font-weight: normal;
        }

        .total-proportion {
          position: relative;
          font-size: 12px;
          font-weight: normal;
          color: #1cd1a1;

          img {
            position: absolute;
            right: 0;
            width: 75px;
            height: 31px;
          }
        }
      }
    }
  }

  .home-proportion {
    display: flex;
    margin: 0 0 40px;

    .proportion-item {
      width: calc((100% - 40px) / 2);
      height: 455px;
      padding: 10px 20px;
      margin: 0 40px 0 0;
      background: #ffffff;
      border-radius: 6px;
      box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);

      &:last-child {
        margin: 0;
      }
    }
  }

  .proportion {
    width: 100%;
    height: 455px;
    padding: 10px 20px;
    margin-bottom: 40px;
    background: #ffffff;
    border-radius: 6px;
    box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
  }
}
.home-name {
  display: flex;
  .home-name-left {
    width: 49.5%;
    height: 465px;
    margin-right: 20px;
  }
  .home-name-right {
    width: 49.5%;
    height: 465px;
  }
}
</style>
