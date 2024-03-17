<template>
  <div class="p-4 bg-white rounded-md">
    <div class="home-crud">
      <div class="relative mb-2 text-lg title">{{ props.title }}</div>
      <div class="flex crud-list">
        <div v-for="(item, index) in crudListMap" :key="index" class="flex crud-list-item">
          <DigitBoard
            v-if="publishObj"
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
      <div class="flex flex-row gap-3.5">
        <div class="flex-1 v-analysis-block">
          <HomeGroup
            v-if="publishObj?.publishRatio"
            :data="publishObj?.publishRatio"
            bar-color="#FF662D"
            line-color="#3878CD"
            class-name="maintain"
            title="账号发布占比"
          />
          <HalfScreenSkeleton v-else />
        </div>
        <div class="flex-1 v-analysis-block">
          <NameRight
            v-if="publishObj?.publishRanking"
            title="平台发布数量排名"
            :salas-ranking-arr="publishObj?.publishRanking"
            :header="['用户', '金额', '数量']"
          />
          <HalfScreenSkeleton v-else />
        </div>
      </div>

      <div class="v-analysis-block relative">

        <HomeGroup :data="publishSetComparison"
                   title="发布组数据对比" bar-color="#8C69C9" line-color="#F17B47">
          <div class="release-button-list">
            <el-select v-model="publishId" placeholder="选择平台" filterable clearable>
              <el-option v-for="item in publishObj?.publishSetComparison" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </div>
        </HomeGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PublishAverageIcon from "@/assets/images/second/publish-average-icon.png";
import PublishAmountIcon from "@/assets/images/second/publish-amount-icon.png";
import PublishMoneyIcon from "@/assets/images/second/publish-money-icon.png";
import DigitBoardSkeleton from "../../components/DigitBoardSkeleton.vue";
import HalfScreenSkeleton from "../../components/HalfScreenSkeleton.vue";
import HomeGroup from "@/views/home/modules/home-group/index.vue";
import NameRight from "@/views/home/modules/name-right/index.vue";
import DigitBoard from "@/views/home/components/DigitBoard.vue";
import {HomeSet} from "@/api/interface";
import {IDigitBoard} from "@/typings";

const namesList: string[] = ["已发布金额", "已发布数量", "已发布均价"];
const publishId = ref();
// 处理数据
const props = withDefaults(
  defineProps<{
    publishObj?: HomeSet.IPublishStatistics;
    title?: string;
  }>(),
  {
    title: ''
  }
);
const crudListMap = ref<IDigitBoard[]>([]);

const publishSetComparison = computed(() => {
  const publishSetComparison = props.publishObj?.publishSetComparison! || [];
  const item = publishSetComparison.find(item => item.id === publishId.value) as any;

  return item?.data || [];
})

const setCrud = (obj: HomeSet.IPublishStatistics) => {
  crudListMap.value = [
    {
      icon: PublishMoneyIcon,
      current: "¥" + obj.publishMoney,
      yesterday: obj.ayerPublishMoney,
      year: obj.yoyPublishMoney
    },
    {
      icon: PublishAmountIcon,
      current: obj.publishAmount,
      yesterday: obj.ayerPublishAmount,
      year: obj.yoyPublishAmount
    },
    {
      icon: PublishAverageIcon,
      current: "¥" + obj.publishAveMoney,
      yesterday: obj.ayerPublishAveMoney,
      year: obj.yoyPublishAveMoney
    }
  ];
};

watch(
  () => props.publishObj,
  data => {
    publishId.value = data?.publishSetComparison?.[0]?.id;
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
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;

    .crud-list-item {
      min-width: 32.5%;
      max-height: 180px;

      .release-number {
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
  margin-top: 20px;

  .home-name-left {
    width: 49%;
    height: 465px;
    margin-right: 20px;
  }
  .home-name-right {
    width: 49%;
    height: 465px;
  }
}
.release-button-list {
  span {
    display: inline-block;
    width: 62px;
    height: 30px;
    line-height: 28px;
    border: 2px solid #dc463a;
    font-size: 12px;
    font-weight: normal;
    text-align: CENTER;
    color: white;
    background: linear-gradient(180deg, #dc463a, #dc463a);
  }
}
</style>
