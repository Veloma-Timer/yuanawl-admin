<template>
  <div class="p-4 bg-white rounded-md">
    <div class="relative mb-2 text-lg title">{{ title }}</div>
    <div class="home-crud">
      <div class="flex crud-list">
        <div v-for="(item, index) in crudListMap" :key="index" class="flex crud-list-item">
          <DigitBoard
            v-if="salesObj"
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

    <div class="home-name v-analysis-block mb-3.5">
      <HomeGroup v-if="salesObj?.salesRatio" :data="salesObj?.salesRatio" class-name="maintain" title="账号销售占比" />
      <HalfScreenSkeleton v-else />
    </div>
    <div class="home-name">
      <div class="home-name-left v-analysis-block">
        <NameRight
          v-if="salesObj?.salesRankingByAmount"
          title="数量榜单"
          :header="['姓名', '销售额', '销售数量']"
          :salas-ranking-arr="salesObj?.salesRankingByAmount"
        />
        <HalfScreenSkeleton v-else />
      </div>
      <div class="home-name-right v-analysis-block">
        <NameRight
          v-if="salesObj?.salesRanking"
          title="金额榜单"
          :header="['姓名', '销售额', '销售数量']"
          :salas-ranking-arr="salesObj?.salesRanking"
        />
        <HalfScreenSkeleton v-else />
      </div>
    </div>
    <div class="v-analysis-block mt-3.5 mb-3.5">
      <HomeGroup :data="salesObj?.salesSetComparison" title="销售数据对比" />
    </div>

    <div class="v-analysis-block mb-3.5">
      <HomeChain
        :list-arr="salesObj?.resChannel"
        title="销售渠道对比"
      >
        <div>
          <el-select v-model="channelId" class="m-2" clearable placeholder="查看数据" @change="setTypes">
            <el-option v-for="item in salesObj?.channelList" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
      </HomeChain>
    </div>

    <!-- <HomeChain :list-arr="salesObj?.sales" :branch-name="branchNames" title="销售组对比" /> -->
    <div class="v-analysis-block mb-3.5">
      <HomeGroup :data="salesObj?.salesChannelStatistics" title="渠道销售订单统计" />
    </div>
  </div>
</template>

<script setup lang="ts">
import IncreaseRateIcon from "@/assets/images/second/increase-rate-icon.png";
import SalesAmountIcon from "@/assets/images/second/sales-amount-icon.png";
import DigitBoardSkeleton from "../../components/DigitBoardSkeleton.vue";
import HalfScreenSkeleton from "../../components/HalfScreenSkeleton.vue";
import SalesMoneyIcon from "@/assets/images/second/sales-money-icon.png";
import HomeChain from "@/views/home/modules/home-chain/index.vue";
import HomeGroup from "@/views/home/modules/home-group/index.vue";
import NameRight from "@/views/home/modules/name-right/index.vue";
import DigitBoard from "@/views/home/components/DigitBoard.vue";
import {HomeSet} from "@/api/interface";
import {IDigitBoard} from "@/typings";
import currency from "currency.js";

const namesList: string[] = ["销售金额", "销售数量", "销售加价率"];

// 2、定义发射给父组件的方法
const emits = defineEmits(["getSalesList"]);

// 处理数据
const props = defineProps<{
  salesObj?: HomeSet.ISalesStatistics;
  title: string;
}>();

const setTypes = (id: any) => emits("getSalesList", id);
// 处理数据
const crudListMap = ref<IDigitBoard[]>([]);
const channelId = ref();

const setCrud = (obj: HomeSet.ISalesStatistics) => {
  crudListMap.value = [
    {
      icon: SalesMoneyIcon,
      current: currency(obj?.salesMoney).format({ symbol: "¥" }),
      yesterday: obj?.salesYesterdayMoney,
      year: obj?.salesYearMoney
    },
    {
      icon: SalesAmountIcon,
      current: obj?.salesAmount,
      yesterday: obj?.salesYesterdayAmount,
      year: obj?.salesYearAmount
    },
    {
      icon: IncreaseRateIcon,
      current: obj?.markupPercentage,
      yesterday: obj?.markupPercentageYesterday,
      year: obj?.markupPercentageYear // 同比加价率
    }
  ];
  channelId.value = obj?.channelId;
};
watch(
  () => props.salesObj,
  sales => {
    crudListMap.value = [];
    setCrud(sales! || {});
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
.title {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}
.home-crud {
  width: 100%;

  .title {
    font-size: 24px;
    font-weight: normal;
    color: #343434;
  }

  .crud-list {
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;

    .crud-list-item {
      min-width: 32.5%;
      max-height: 180px;
      margin-bottom: 10px;

      .crud-number {
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

      &:nth-child(4n) {
        margin: 0;
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
  justify-content: space-between;
  .home-name-left {
    width: 49.5%;
    height: 465px;
  }
  .home-name-right {
    width: 49.5%;
    height: 465px;
  }
}
</style>
