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
    <div class="home-group" ref="groupRef"></div>
  </div>
</template>
<script setup lang="ts">
import {setValues} from "@/views/home/modules/homeUtils";
import {useEcharts} from "@/hooks/useEcharts";
import * as echarts from "echarts";
import {getFixed} from "@/utils";

interface IProps {
  listArr?: any[];
  className?: string;
  title?: string;
  barColor?: string;
  lineColor?: string;
}

const groupRef = ref<HTMLElement>();

const props = withDefaults(defineProps<IProps>(), {
  listArr: () => [],
  className: "",
  title: "",
  barColor: "#0F77D2",
  lineColor: "#6C81AA"
});

const myArrayRef = toRef(props, "listArr");

const groupGet = (
  params: {
    money: number[],
    name: string[],
    amount: number[],
    ringMoney: number[],
    yoyMoney: number[],
    ringAmount: number[],
    yoyAmount: number[]
  }
) => {

  const {
    money,
    name,
    amount,
    ringMoney,
    yoyMoney,
    ringAmount,
    yoyAmount
  } = params

  nextTick(() => {
    const myChart: echarts.ECharts = echarts.init(groupRef.value as HTMLElement);
    const nameValue = `当前数量`;
    const nameValue2 = `当前金额`;
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: [nameValue, nameValue2, "环比数量", "环比金额", "同比数量", "同比金额"],
        bottom: 0
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
          alignTicks: true,
          axisLabel: {
            formatter: "{value}"
          }
        },
        {
          type: "value",
          name: "",
          alignTicks: true,
          axisLabel: {
            formatter: "{value}"
          }
        }
      ],
      series: [
        {
          name: nameValue,
          type: "line",
          tooltip: {
            valueFormatter: (value: string) => value
          },
          data: amount,
          itemStyle: {
            color: props.lineColor
          }
        },
        {
          name: nameValue2,
          type: "bar",
          tooltip: {
            valueFormatter: (value: string) => getFixed(value)
          },
          data: money,
          itemStyle: {
            color: props.barColor
          }
        },
        {
          name: "环比数量",
          type: "line",
          tooltip: {
            valueFormatter: (value: string) => value
          },
          data: ringAmount
        },
        {
          name: "环比金额",
          type: "bar",
          tooltip: {
            valueFormatter: (value: string) => getFixed(value)
          },
          data: ringMoney
        },

        {
          name: "同比数量",
          type: "line",
          tooltip: {
            valueFormatter: (value: string) => value
          },
          data: yoyAmount
        },
        {
          name: "同比金额",
          type: "bar",
          tooltip: {
            valueFormatter: (value: string) => getFixed(value)
          },
          data: yoyMoney
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
      ringMoney,
      yoyMoney,
      yoyAmount,
      money = [];
    name = setValues(newValue, "name"); // x轴
    amount = setValues(newValue, "amount"); // 当前数量
    money = setValues(newValue, "money"); // 当前时间金额
    ringAmount = setValues(newValue, "ringAmount"); // 环比数量
    ringMoney = setValues(newValue, "ringMoney"); // 环比数量
    yoyMoney = setValues(newValue, "yoyMoney"); // 同比金额
    yoyAmount = setValues(newValue, "yoyAmount"); // 同比金额
    groupGet({
      money, name, amount, ringAmount, yoyMoney, ringMoney, yoyAmount
    });
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
    font-size: 15px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
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
