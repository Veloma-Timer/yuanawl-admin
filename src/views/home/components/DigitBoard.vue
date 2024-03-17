<template>
  <div class="flex flex-row gap-2 cursor-default digit-board">
    <img :src="icon" :alt="title" width="68" height="68" class="flex-shrink-0" style="width: 68px; height: 68px" />
    <div class="flex flex-col flex-1" style="height: 68px">
      <p class="text-xs label">{{ title }}</p>

      <!--主要内容-->
      <el-tooltip :content="String(value)" placement="top">
        <p class="text-2xl">{{ value }}</p>
      </el-tooltip>

      <div class="flex flex-row">
        <el-tooltip :content="getAyerMsg(isTop(chainValue), chainValue)" placement="top">
          <div class="flex flex-row items-center w-1/2 text-xs">
            <span class="flex-shrink-0 label">环比上期</span>
            <p class="flex items-center ml-2">
              <el-icon :color="getColor(isTop(chainValue))">
                <Top v-if="isTop(chainValue) == '1'" />
                <Bottom v-else />
              </el-icon>
              <span class="inline-block truncate" :style="{ width: '50px', color: getColor(isTop(chainValue)) }">
                {{ formatNumber(chainValue) }}
              </span>
            </p>
          </div>
        </el-tooltip>
        <el-tooltip :content="getYoyMsg(isTop(yearValue), yearValue)" placement="top">
          <div class="flex flex-row items-center w-1/2 text-xs">
            <span class="flex-shrink-0 label">同比上期</span>
            <p class="flex items-center ml-2">
              <el-icon :color="getColor(isTop(yearValue))">
                <Top v-if="isTop(yearValue) == '1'" />
                <Bottom v-else />
              </el-icon>
              <span class="truncate" :style="{ width: '50px', color: getColor(isTop(yearValue)) }">
                {{ formatNumber(yearValue) }}
              </span>
            </p>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Bottom, Top} from "@element-plus/icons-vue";

withDefaults(
  defineProps<{
    icon: any;
    title: string;
    value?: string | number;
    chainValue?: string | number; // 环比
    yearValue?: string | number; // 同比
  }>(),
  {
    value: 0,
    chainValue: 0 + "%",
    yearValue: 0 + "%"
  }
);

const isTop = (number: number | string) => {
  const pureValue = parseFloat(number as string);

  if (pureValue == 0) {
    return "-1";
  }

  return pureValue > 0 ? "1" : "0";
};

// 环比信息
const getAyerMsg = (isTop: "-1" | "1" | "0", value: string | number) => {
  const topMap = {
    "-1": "持平",
    "1": "增加",
    "0": "减少"
  };
  const _value = Math.abs(value as number);
  return `环比上期 ${topMap[isTop]} ${isNaN(_value) ? 0 : _value}`;
};

// 同比信息
const getYoyMsg = (isTop: "-1" | "1" | "0", value: string | number) => {
  const topMap = {
    "-1": "持平",
    "1": "增加",
    "0": "减少"
  };
  const _value = Math.abs(value as number);
  return `同比上期 ${topMap[isTop]} ${isNaN(_value) ? 0 : _value}`;
};

const getColor = (code: "-1" | "0" | "1"): string => {
  const colorMap = {
    "-1": "#5f6e82",
    "0": "#2dca93",
    "1": "#fc6772"
  };
  return colorMap[code];
};

const formatNumber = (value: string | number) => {
  if (typeof value === "string") {
    return value;
  }
  return Math.abs(value as number);
};
</script>

<style scoped lang="scss">
.digit-board {
  color: rgba(0, 0, 0, 0.87);
  width: 100%;

  .label {
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }
}
</style>
