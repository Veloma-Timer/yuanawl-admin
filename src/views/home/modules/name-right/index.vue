<template>
  <div class="home-right overflow-hidden">
    <span class="cell">{{ title }}</span>
    <div v-if="salasRankingArr && salasRankingArr?.length > 0" class="home-table mt20">
      <div class="home-table-header flex">
        <div class="header-item">名次</div>
        <div class="header-item" v-for="(item, index) in header" :key="index">
          {{ item }}
        </div>
      </div>
      <div class="home-table-row overflow-y-auto">
        <div
          v-for="(item, index) in salasRankingArr"
          :key="Number(item.amount) + index"
          class="table-row-cell flex flex-row items-center py-2"
        >
          <div class="cell-item flex-1">
            <img
              v-if="index === 0"
              class="flex-shrink-0 m-auto"
              style="width: 17px; height: 20px"
              :src="OneIcon"
              :alt="String(index)"
            />
            <img
              v-if="index === 1"
              class="flex-shrink-0 m-auto"
              style="width: 17px; height: 20px"
              :src="TwoIcon"
              :alt="String(index)"
            />
            <img
              v-if="index === 2"
              class="flex-shrink-0 m-auto"
              style="width: 17px; height: 20px"
              :src="ThreeIcon"
              :alt="String(index)"
            />
            <span v-if="index > 2" class="index-item">{{ index + 1 }}</span>
          </div>

          <div class="cell-item flex-1 h-full text-center">{{ item.name }}</div>
          <div class="cell-value flex-1 h-full text-center">{{ getFixed(item.money) }}</div>
          <div class="cell-value flex-1 h-full text-center">{{ item.amount }}</div>
        </div>
      </div>
    </div>
    <el-empty v-else></el-empty>
  </div>
</template>

<script setup lang="ts">
import ThreeIcon from "@/assets/images/second/three-icon.png";
import OneIcon from "@/assets/images/second/one-icon.png";
import TwoIcon from "@/assets/images/second/two-icon.png";
import {HomeSet} from "@/api/interface";
import {getFixed} from "@/utils";

withDefaults(
  defineProps<{
    salasRankingArr?: HomeSet.INameAndAmountAndMonty[];
    title: string;
    header: string[];
  }>(),
  {
    title: "平台销售额排名",
    header: () => [],
    salasRankingArr: () => []
  }
);
</script>

<style scoped lang="scss">
.home-right {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #ffffff;
  border-radius: 4px;

  .index-item {
    width: 18px;
    height: 18px;
    background: #f0f0f0;
    border-radius: 18px;
  }

  .cell {
    font-size: 15px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
  }

  .home-table {
    width: 100%;

    .home-table-header {
      width: 100%;
      height: 37px;
      line-height: 37px;
      background: #f5f5f5;
      border-radius: 6px;

      .header-item {
        width: 33%;
        height: 100%;
        text-align: center;
        font-size: 13px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.5);
      }
    }

    .home-table-row {
      width: 100%;
      height: 335px;

      .table-row-cell {
        width: 100%;
        text-align: center;
        background: #ffffff;

        .cell-item {
          font-size: 13px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.87);
        }

        .cell-value {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.87);
          font-weight: 900;
        }
      }
    }
  }
}
</style>
