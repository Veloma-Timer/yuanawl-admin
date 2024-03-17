<template>
  <div class="home-content" :class="className">
    <div class="home-head flx-justify-between">
      <div class="title">
        {{ props.title }}
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
    <div class="home-group" ref="groupRef"></div>
  </div>
</template>
<script setup lang="ts">
import {ref, toRef, watch} from "vue";
import * as echarts from "echarts";
import {useEcharts} from "@/hooks/useEcharts";
import {setValues} from "@/views/home/modules/homeUtils";

const groupRef = ref<HTMLElement>();
const props = withDefaults(defineProps<{
  listArr?: any[],
  className?: string,
  title?: string
}>(), {
  listArr: () => [],
  className: '',
  title: ''
});
const myArrayRef = toRef(props, "listArr");

const groupGet = (amount: number[], name: string[], ringAmount: number[], yoyAmount: number[]) => {
  nextTick(() => {
    const myChart: echarts.ECharts = echarts.init(groupRef.value as HTMLElement);
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ["完成数量", '数量', "往年同期"],
        bottom: 0
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "6%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: name,
          axisPointer: {
            type: "shadow"
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "",
          min: 0,
          interval: 50,
          axisLabel: {
            formatter: "{value}"
          }
        },
        {
          type: "value",
          name: "",
          min: 0,
          interval: 5,
          axisLabel: {
            formatter: "{value}"
          }
        }
      ],
      series: [
        {
          name: "完成数量",
          type: "line",
          tooltip: {
            valueFormatter: (value: any) => {
              return value;
            }
          },
          data: ringAmount
        },
        {
          name: '数量',
          type: "line",
          tooltip: {
            valueFormatter: (value: any) => {
              return value;
            }
          },
          data: amount
        },
        {
          name: "往年同期",
          type: "line",
          tooltip: {
            valueFormatter: (value: any) => {
              return value;
            }
          },
          data: yoyAmount
        }
      ]
    };
    useEcharts(myChart, option);
    const chartObserver = new ResizeObserver(() => {
      myChart.resize();
    });
    chartObserver.observe(groupRef.value as HTMLElement);
  });
};
watch(
  myArrayRef,
  newValue => {
    let amount,
      name,
      ringAmount,
      yoyAmount = [];
    name = setValues(newValue, "name"); // x轴
    amount = setValues(newValue, "amount"); // 当前数量
    ringAmount = setValues(newValue, "ringAmount"); // 环比数量
    yoyAmount = setValues(newValue, "yoyAmount"); // 环比数量
    groupGet(amount, name, ringAmount, yoyAmount);
  },
  { deep: true, immediate: true }
);
</script>
<style scoped lang="scss">
.home-content {
  width: 100%;
  height: 465px;
  padding: 20px;
  background: #ffffff;
  border-radius: 4px;
}

.home-head {
  width: 100%;
  height: 30px;

  .title {
    font-size: 16px;
    color: #555555;
    font-weight: normal;
  }
}

.home-group {
  width: 100%;
  height: calc(100% - 30px);
}

.maintain {
  margin: 0 !important;
}
</style>
