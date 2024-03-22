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
import { todaySales } from "@/api/modules/ticket";
import { shortcuts, parseTime } from "@/utils";
import Title from "@/components/Title/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import {useDateFormat} from "@vueuse/core";
const emit = defineEmits(["change-id"]);
const echartsRef = ref<HTMLElement>();

const dateRange = ref<[string, string]>(shortcuts[2].value().map(date => useDateFormat(date, 'YYYY-MM-DD').value) as [string, string]);


const changeDaterange = (date: [string, string]) => (dateRange.value = date);

const xData = ref<(string | number)[]>([]);
const yData = ref<(string | number)[]>([]);
interface SelectSale {
  title?: string;
  value?: string | number;
  icon: string;
}
const saleData = ref<SelectSale[]>([]);

const title = ref("销售总额");

const selectIndex = ref(0);
const chatData = ref<{
  salesTotalMoney: any[];
  salesTotalNumber: any[];
  markupPercentage: any[];
  platformNumber: any[];
}>({ salesTotalMoney: [], salesTotalNumber: [], markupPercentage: [], platformNumber: [] });

const getTodaySales = async () => {
  const {
    data: { salesTotalMoney, salesTotalNumber, markupPercentage, platformNumber, chat }
  } = await todaySales(branchId.value!, dateRange.value);
  saleData.value = [
    {
      title: `销售总额`,
      value: `￥${salesTotalMoney}`,
      icon: "sale-total"
    },
    {
      title: `订单总量`,
      value: `${salesTotalNumber || 0}`,
      icon: "order-total"
    },
    {
      title: `商品加价率`,
      value: markupPercentage + "%",
      icon: "goods-add-price"
    },
    {
      title: "出售渠道个数",
      value: platformNumber,
      icon: "sale-channel"
    }
  ];
  chatData.value = chat;
  chatSwitch(selectIndex.value);
  initEcharts(xData.value, yData.value, legendName.value);
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
const changeBranch = (id: any) => {
  branchId.value = id;
  getTodaySales();
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
        tooltip: {
          valueFormatter: (value: any) => {
            if (title.value?.indexOf("商品加价率") > -1) {
              return value + "%";
            } else {
              return value;
            }
          }
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
    xData.value = chatData.value.salesTotalMoney.map((item: any) => item.name);
    yData.value = chatData.value.salesTotalMoney.map((item: any) => item.value);
  }
  if (value === 1) {
    xData.value = chatData.value.salesTotalNumber.map((item: any) => item.name);
    yData.value = chatData.value.salesTotalNumber.map((item: any) => item.value);
  }
  if (value === 2) {
    xData.value = chatData.value.markupPercentage.map((item: any) => item.name);
    yData.value = chatData.value.markupPercentage.map((item: any) => item.value);
  }
  if (value === 3) {
    xData.value = chatData.value.platformNumber.map((item: any) => item.name);
    yData.value = chatData.value.platformNumber.map((item: any) => item.value);
  }
};

const legendName = computed(() => {
  if (["销售总额"].includes(title.value)) {
    return "金额";
  } else if (["订单总量"].includes(title.value)) {
    return "数量";
  } else if (["出售渠道个数"].includes(title.value)) {
    return "数量";
  } else if (["商品加价率"].includes(title.value)) {
    return "加价率";
  } else {
    return "";
  }
});

watch(dateRange, () => getTodaySales());

watch(title, () => {
  chatSwitch(selectIndex.value);
  getTodaySales();
});

onMounted(() => {
  switchChart({ title: `销售总额` }, 0);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
