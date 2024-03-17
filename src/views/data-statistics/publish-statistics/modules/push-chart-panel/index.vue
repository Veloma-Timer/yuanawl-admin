<template>
  <div class="flex-col gap-2 wrap">
    <div class="right">
      <div class="flex items-center justify-between w-full">
        <Title title="销售分析" />
        <el-radio-group v-model="branchId" size="large" @change="changeBranch" class="city-radio">
          <el-radio-button v-for="item in branchList" :key="item.id" :label="item.id">{{ item.branchName }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="sale-content">
        <div
          class="flex items-center gap-1 cursor-pointer"
          v-for="({ title, value, icon }, index) of saleData"
          :key="index"
          @click="switchChart({ title }, index)"
        >
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
          <Title title="销售总额" />
          <div class="max-w-[40%]">
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
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { getAllBranch } from "@/api/modules/branch";
import { todayPublishs } from "@/api/modules/ticket";
import { parseTime, shortcuts } from "@/utils";
import Title from "@/components/Title/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";

const emit = defineEmits(["change-id"]);

const dateRange = ref<[string, string]>([parseTime(new Date(), "{y}-{m}-{d}"), parseTime(new Date(), "{y}-{m}-{d}")]);

const changeDaterange = (date: [string, string]) => (dateRange.value = date);

const echartsRef = ref<HTMLElement>();

const xData = ref([]);
const yData = ref([]);
interface SelectSale {
  title: string;
  value?: string | number;
  icon: string;
}

const saleData = ref<SelectSale[]>([]);
const title = ref("转转发布总数");
const selectIndex = ref(0);
const chatData = ref<any>({});

const getTodaySales = async () => {
  const {
    data: { tenTenTotalNumber, webTotalNumber, cycleTotalNumber, totalNumber, chat }
  } = await todayPublishs(branchId.value!, dateRange.value);
  saleData.value = [
    {
      title: `转转发布总数`,
      value: `${tenTenTotalNumber}`,
      icon: "ten-ten-total-number"
    },
    {
      title: `网站发布总数`,
      value: `${webTotalNumber || 0}`,
      icon: "web-total-number"
    },
    {
      title: `循环发布总数`,
      value: cycleTotalNumber,
      icon: "cycle-total-number"
    },
    {
      title: "总发布数",
      value: totalNumber,
      icon: "total-number"
    }
  ];
  chatData.value = chat;
  chatSwitch(selectIndex.value);
  initEcharts(xData.value, yData.value, "数量");
};

// 门店数据获取
type BranchObj = { branchName: string; id: number };
const branchList = ref<BranchObj[]>([]);
const branchId = ref<number>();
const getAllBranchData = async () => {
  const { data } = await getAllBranch();
  branchList.value = data?.map(item => {
    return {
      branchName: item.branchName,
      id: item.id
    };
  });
  branchId.value = branchList.value[0].id;
  await getTodaySales();
  emit("change-id", branchId.value);
};
getAllBranchData();

// 门店切换
const changeBranch = async (id: any) => {
  branchId.value = id;
  await getTodaySales();
  emit("change-id", id);
};

const color = ["#3FC0A0", "#F6B739", "#8C69C9", "#F17B47"];

const initEcharts = (xData: any[], yData: any[], legendName: string) => {
  let myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
  let option: echarts.EChartsOption = {
    title: {
      top: 10,
      textStyle: {
        fontWeight: 500,
        fontSize: 14
      }
    },
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
      data: [legendName],
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
        data: xData,
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
        name: legendName,
        type: "bar",
        emphasis: {
          focus: "series"
        },
        data: yData,
        itemStyle: {
          color: color[selectIndex.value]
        }
      }
    ]
  };
  useEcharts(myChart, option);
  const chartObserver = new ResizeObserver(() => {
    myChart.resize();
  });
  chartObserver.observe(echartsRef.value as HTMLElement);
};

const switchChart = (item: SelectSale, index: number) => {
  title.value = item.title!;
  selectIndex.value = index;
};

const chatSwitch = (value: number) => {
  if (value === 0) {
    xData.value = chatData.value.tenTenTotalNumber.map((item: any) => item.name);
    yData.value = chatData.value.tenTenTotalNumber.map((item: any) => item.value);
  }
  if (value === 1) {
    xData.value = chatData.value.webTotalNumber.map((item: any) => item.name);
    yData.value = chatData.value.webTotalNumber.map((item: any) => item.value);
  }
  if (value === 2) {
    xData.value = chatData.value.cycleTotalNumber.map((item: any) => item.name);
    yData.value = chatData.value.cycleTotalNumber.map((item: any) => item.value);
  }
  if (value === 3) {
    xData.value = chatData.value.totalNumber.map((item: any) => item.name);
    yData.value = chatData.value.totalNumber.map((item: any) => item.value);
  }
};

watch(dateRange, () => getTodaySales());

watch(title, () => {
  chatSwitch(selectIndex.value);
  getTodaySales();
});

onMounted(() => {
  switchChart({ title: `转转发布总数` }, 0);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
