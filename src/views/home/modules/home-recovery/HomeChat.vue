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
    <div v-if="data && data.length > 0" class="w-full" :style="{ height: height + 'px' }" ref="chatRef"></div>
    <el-empty v-else></el-empty>
  </div>
</template>

<script setup lang="ts">
import {useEcharts} from "@/hooks/useEcharts";
import {getDiv, getSum} from "@/utils";
import * as echarts from "echarts";
import currency from "currency.js";

const chatRef = ref<HTMLElement>();

const props = withDefaults(
  defineProps<{
    data?: any[];
    height?: number;
    className?: string;
    title?: string;
  }>(),
  {
    className: "",
    title: "",
    height: 400,
    data: () => []
  }
);

const groupGet = (data: any[]) => {
  if (!data || data.length < 1) return;
  const total = data.reduce((prev, curr) => {
    return prev + Number(curr.value);
  }, 0);

  nextTick(() => {
    const myChart: echarts.ECharts = echarts.init(chatRef.value!);
    const sum = getSum(data, "value");
    const option = {
      legend: { top: "top" },
      tooltip: { trigger: "item" },
      title: {
        text: `{a|${total}}`,
        x: "center",
        y: "center",
        textStyle: {
          rich: {
            a: {
              fontSize: 30,
              color: "#000"
            }
          }
        }
      },
      series: [
        {
          type: "pie",
          radius: [50, 120],
          roseType: "area",
          center: ["50%", "50%"],
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
            borderRadius: 8
          },
          label: {
            alignTo: "edge",
            formatter: (params: any) => {
              const percent = currency(getDiv(params.data.value, sum)).multiply(100).value;
              return `${params.data.name}(${percent}%)\n{time|${params.data.value}}`;
            },
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            rich: {
              time: {
                fontSize: 10,
                color: "#999"
              }
            }
          },
          labelLine: {
            length: 15,
            length2: 0,
            maxSurfaceAngle: 80
          },
          labelLayout: (params: any) => {
            const isLeft = params.labelRect.x < myChart.getWidth() / 2;
            const points = params.labelLinePoints;
            // Update the end point.
            points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;
            return {
              labelLinePoints: points
            };
          },
          data: data
        }
      ]
    };

    useEcharts(myChart, option);
    const chartObserver = new ResizeObserver(() => {
      myChart.resize();
    });
    chartObserver.observe(chatRef.value as HTMLElement);
  });
};

watch(
  () => props.data,
  value => {
    const list = value?.map((item: any) => {
      return {
        name: item.name === "--" ? "其他" : item.name,
        value: item.amount
      };
    });

    groupGet(list);
  },
  { deep: true, immediate: true }
);
</script>

<style scoped lang="scss">
.home-content {
  width: 100%;
  padding: 20px;
  margin: 32px 0 36px;
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

.maintain {
  margin: 0 !important;
}
</style>
