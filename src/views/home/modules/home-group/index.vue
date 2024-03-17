<template>
  <div class="home-content mb-[20px]" :class="className">
    <div class="home-head flx-justify-between">
      <div class="title">
        {{ props.title }}
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
    <div v-if="data && data.length > 0" class="home-group" ref="groupRef"></div>
    <el-empty v-else></el-empty>
  </div>
</template>

<script setup lang="ts">
import { setValues } from "@/views/home/modules/homeUtils";
import { useEcharts } from "@/hooks/useEcharts";
import * as echarts from "echarts";
import { getFixed } from "@/utils";

const props = withDefaults(
  defineProps<{
    data?: any[];
    className?: string;
    title?: string;
    barColor?: string;
    lineColor?: string;
  }>(),
  {
    data: () => [],
    className: "",
    title: "",
    barColor: "#0F77D2",
    lineColor: "#3FC0A0"
  }
);

const groupRef = ref<HTMLElement>();

const groupGet = (data: any[]) => {
  nextTick(() => {
    const myChart: echarts.ECharts = echarts.init(groupRef.value!);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999"
          }
        }
      },
      legend: {
        data: ["金额", "数量"],
        top: 0
      },
      xAxis: [
        {
          type: "category",
          data: setValues(data, "name").map(item => (item === "--" || !item ? "其他" : item)),
          axisPointer: {
            type: "shadow"
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "金额",
          alignTicks: true
        },
        {
          type: "value",
          name: "数量",
          alignTicks: true
        }
      ],
      series: [
        {
          name: "金额",
          type: "bar",
          tooltip: {
            valueFormatter: (value: any) => getFixed(value)
          },
          data: setValues(data, "money"),
          itemStyle: {
            color: props.barColor
          }
        },
        {
          name: "数量",
          type: "line",
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: (value: any) => getFixed(value, false)
          },
          data: setValues(data, "amount"),
          itemStyle: {
            color: props.lineColor
          }
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
  () => props.data,
  data => {
    if (!data || data.length < 1) return;
    groupGet(data);
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
.home-content {
  width: 100%;
  height: 465px;
  padding: 20px;
  margin-top: 20px;
  background: #ffffff;
  border-radius: 4px;
}

.home-head {
  width: 100%;
  height: 30px;

  .title {
    font-size: 15px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
  }
}

.home-group {
  height: 400px;
}

.maintain {
  margin: 0 !important;
}
</style>
