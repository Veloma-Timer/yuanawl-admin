<template>
  <div class="home-name">
    <div class="home-name-left">
      <div class="name-left-bottom">
        <div>
          <div class="left-progress mb30 flex">
            <el-progress class="mr30" type="circle" :percentage="awaitWorkOrder?.untreatedAmount" :width="160">
              <template #default="{ percentage }">
                <span class="percentage-label">未处理（{{ percentage }}）</span>
              </template>
            </el-progress>
            <el-progress class="mr30" type="circle" :percentage="awaitWorkOrder?.finishedAmount" :width="160">
              <template #default="{ percentage }">
                <span class="percentage-label">今日完成（{{ percentage }}）</span>
              </template>
            </el-progress>
          </div>
          <div class="left-table">
            <div class="table-item flx-align-center" v-for="item in awaitWorkOrder?.pendingList" :key="item.id">
              <div class="operate">【待处理】</div>
              <div class="content">
                <span class="sle">订单[{{ item.orderCode }}]</span>
                {{ parseTime(item.createdTime, "{y}-{m}-{d} {h}:{i}:{s}") }}
              </div>
              <div class="bottom" @click="setRouterLink(item)">
                立即处理
                <el-icon class="el-icon--right"><Promotion /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useRouter} from "vue-router";
import {parseTime} from "@/utils";
import {Promotion} from "@element-plus/icons-vue";

const router = useRouter();
const getNameList = async () => {};
const setRouterLink = item => {
  router.push({ name: "add-ticket", query: { id: item.id } });
};
// 处理数据
defineProps({
  platformSalas: {
    type: Array,
    default: () => []
  },
  awaitWorkOrder: {
    type: Object,
    default: () => {
      return {
        untreatedAmount: 0,
        finishedAmount: 0,
        pendingList: []
      };
    }
  },
  salasRanking: {
    type: Array,
    default: () => []
  }
});


getNameList();
</script>
<style scoped lang="scss">
.home-name {
  display: flex;
  flex-wrap: wrap;
  .home-name-left {
    justify-content: space-between;
    width: 100%;
    .name-left-bottom {
      width: 100%;
      //width: 780px;
      //height: 300px;
      padding: 20px 46px 32px 26px;
      .left-title {
        font-size: 18px;
        color: #333333;
      }
      .left-progress {
        width: 100%;
        justify-content: space-around;
      }
      .left-table {
        .table-item {
          width: calc((100% - 28px) / 2);
          height: 41px;
          float: left;
          padding: 0 16px;
          margin-bottom: 7px;
          background: #ffffff;
          border: 2px solid #f0f0f0;
          border-radius: 21px;
          white-space: nowrap;
          .operate {
            width: 80px;
            font-size: 16px;
            font-weight: normal;
            color: #f85d5d;
          }
          .content {
            width: calc(100% - 170px);
            padding: 0 10px;
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            color: #333333;
            span {
              display: inline-block;
              width: 50%;
            }
          }
          .bottom {
            width: 90px;
            height: 28px;
            font-size: 12px;
            font-weight: normal;
            line-height: 28px;
            color: #ffffff;
            text-align: center;
            cursor: pointer;
            background: #f85d5d;
            border-radius: 14px;
          }
          &:nth-child(1n) {
            margin: 6px;
          }
        }
      }
    }
  }
}
@media (width <= 1366px) {
  .home-name-left {
    display: block !important; /* 在此处添加你的样式 */
    .name-left-top {
      width: 100% !important;
    }
    .name-left-bottom {
      width: 100% !important;
    }
  }
}
</style>
