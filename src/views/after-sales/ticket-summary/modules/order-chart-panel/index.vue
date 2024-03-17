<template>
  <div class="flex-col gap-2 wrap">
    <div class="right">
      <div class="flex items-center justify-between w-full">
        <Title title="工单分析" />
        <el-radio-group v-model="branchId" size="large" @change="changeBranch" class="city-radio">
          <el-radio-button v-for="item in newBranchList" :key="item.id" :label="item.id">{{ item.branchName }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="sale-content">
        <div class="flex items-center gap-1 cursor-pointer" v-for="({ title, value, icon }, index) of saleData" :key="index">
          <div class="w-[50px] h-[50px]">
            <SvgIcon :name="icon" :icon-style="{ width: '100%', height: '100%' }" />
          </div>
          <div>
            <div class="title text-[#000000] text-[14px] opacity-40">{{ title }}</div>
            <div class="value text-[#000000] text-[30px]">{{ value }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content card">
      <div class="flex flex-row items-center justify-between p-2 rounded-xl">
        <div class="flex items-center justify-between w-full">
          <Title title="工单处理汇总" />
          <div>
            <el-date-picker
              v-model="dateRange"
              unlink-panels
              type="daterange"
              format="YYYY-MM-DD"
              range-separator="To"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
              start-placeholder="开始时间"
              :shortcuts="shortcuts"
              @change="changeDaterange"
            />
          </div>
        </div>
      </div>
      <div ref="echartsRef" class="min-h-[340px]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { workOrderAllBoard, workOrderAllLine } from "@/api/modules/ticket";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import SvgIcon from "@/components/SvgIcon/index.vue";
import Title from "@/components/Title/index.vue";
import { parseTime, shortcuts } from "@/utils";

const echartsRef = ref<HTMLElement>();

const emit = defineEmits(["change-id", "change-date"]);

type Props = {
  branchList: any;
  selectBranchId: number;
};

const dateRange = ref<[string, string]>([parseTime(new Date(), "{y}-{m}-{d}"), parseTime(new Date(), "{y}-{m}-{d}")]);

const changeDaterange = (date: [string, string]) => (dateRange.value = date);

const tableProps = withDefaults(defineProps<Props>(), {
  branchList: [],
  selectBranchId: 0
});

const date = ref("本日");

const branchId = ref<number>();

const changeBranch = (id: any) => {
  branchId.value = id;
  emit("change-id", id);
};
const changeDate = (val: any) => {
  date.value = val;
  emit("change-date", val);
};

// 获取门店统计数据
const saleData = ref();

async function getBoradData(id: number, date: [string, string]) {
  const {
    data: { totalNumber, incrementNumber, approveNumber, unApproveNumber }
  } = await workOrderAllBoard(id, date);
  saleData.value = [
    {
      title: "工单总数",
      value: totalNumber,
      icon: "ticket-num"
    },
    {
      title: "今日新增",
      value: incrementNumber,
      icon: "ticket-add"
    },
    {
      title: "审核通过单数",
      value: approveNumber,
      icon: "ticket-pass"
    },
    {
      title: "审核未通过单数",
      value: unApproveNumber,
      icon: "ticket-reject"
    }
  ];
}

async function getLineData(id: number, date: [string, string], { legendName1, legendName2 }: any) {
  const {
    data: { current, preCurrent }
  } = await workOrderAllLine(id, date);
  const toDayX = current.map((item: any) => {
    return item.name;
  });
  const toDayY = current.map((item: any) => {
    return item.value;
  });
  const yesterdayY = preCurrent.map((item: any) => {
    return item.value;
  });
  initEcharts(toDayX, toDayY, yesterdayY, { legendName1, legendName2 });
}

// 日期范围选择
const currentTimeValue = ref(0);

function legendObj() {
  let legend1 = "";
  let legend2 = "";
  if (currentTimeValue.value === 0) {
    legend1 = "昨日";
    legend2 = "今日";
  } else if (currentTimeValue.value === 1) {
    legend1 = "本周";
    legend2 = "上周";
  } else if (currentTimeValue.value === 2) {
    legend1 = "本月";
    legend2 = "上月";
  }
  return {
    legend1,
    legend2
  };
}

const initData = () => {
  const { legend1, legend2 } = legendObj();
  if (!saleData.value) {
    getBoradData(branchId.value!, dateRange.value);
  }
  getLineData(branchId.value!, dateRange.value, { legendName1: legend1, legendName2: legend2 });
};

type BranchObj = { branchName: string; id: number };
const newBranchList = ref<BranchObj[]>([]);
watch(
  () => tableProps.branchList,
  value => {
    if (value) {
      newBranchList.value = value;
      branchId.value = value[0]?.id;
      initData();
    }
  },
  { deep: true, immediate: true }
);

// 渲染图表
// x轴一条 y轴两条数据
const initEcharts = (toDayX: any, toDayY: any, yesterdayY: any, { legendName1, legendName2 }: any) => {
  let myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
  let option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985"
        }
      }
    },
    legend: {
      data: [legendName1, legendName2],
      textStyle: {
        color: "#a1a1a1"
      },
      bottom: "1%"
    },
    grid: {
      left: "2%",
      right: "8px",
      bottom: "13%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: toDayX,
        axisLabel: {
          color: "#a1a1a1"
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: "#a1a1a1"
        }
      }
    ],
    series: [
      {
        name: legendName1,
        type: "line",
        lineStyle: {
          color: "#2ED7FF"
        },
        emphasis: {
          focus: "series"
        },
        data: yesterdayY
      },
      {
        name: legendName2,
        type: "line",
        lineStyle: {
          color: "#63ECFF"
        },
        emphasis: {
          focus: "series"
        },
        data: toDayY
      }
    ]
  };
  useEcharts(myChart, option);
  const chartObserver = new ResizeObserver(() => {
    myChart.resize();
  });
  chartObserver.observe(echartsRef.value as HTMLElement);
};

watch(dateRange, () => initData());
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
