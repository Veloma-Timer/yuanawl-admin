<template>
  <div class="home-content mb-[20px] mt-[20px]" :class="className">
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
import { ref, watch, toRef } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { setValues } from "@/views/home/modules/homeUtils";

interface IProps {
  listArr?: any[];
  className?: string;
  title?: string;
  chartType?: "bar" | "line";
  color?: string;
}

const groupRef = ref<HTMLElement>();
const props = withDefaults(defineProps<IProps>(), {
  listArr: () => [],
  className: "",
  title: "",
  chartType: "bar",
  color: "#F17B47"
});
const myArrayRef = toRef(props, "listArr");

const getFixed = (str: string) => {
  if (str) {
    return parseFloat(str).toFixed(2);
  }
  return "--";
};
const groupGet = (data: number[], name: number[]) => {
  nextTick(() => {
    let myChart: echarts.ECharts = echarts.init(groupRef.value as HTMLElement);
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ["数量"],
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
          axisLabel: {
            formatter: "{value}"
          }
        },
        {
          type: "value",
          name: "",
          axisLabel: {
            formatter: "{value}"
          }
        }
      ],
      series: [
        {
          name: "数量",
          type: props.chartType,
          tooltip: {
            valueFormatter: (value: any) => {
              return getFixed(value);
            }
          },
          data,
          itemStyle: {
            color: props.color
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
  myArrayRef,
  newValue => {
    let data,
      name = [];
    data = setValues(newValue, "amount");
    name = setValues(newValue, "name");
    groupGet(data, name);
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
  //box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
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
