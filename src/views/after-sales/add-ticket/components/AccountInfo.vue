<template>
  <div class="p-2 account-info">
    <p class="text-sm font-medium mb-2">账号信息</p>
    <el-collapse v-model="defExpand" accordion>
      <el-collapse-item title="回收信息" name="recycle">
        <el-descriptions>
          <el-descriptions-item label="回收门店：">
            {{ extraInfo.recycleBranch }}
          </el-descriptions-item>
          <el-descriptions-item label="回收订单号：">
            {{ accountDetail?.recycleOrder }}
          </el-descriptions-item>
          <el-descriptions-item label="回收人：">
            {{ extraInfo?.recycler }}
          </el-descriptions-item>
          <el-descriptions-item label="回收方式：">
            {{ getLabel(recycle_method, accountDetail?.recycleMethod) }}
          </el-descriptions-item>
          <el-descriptions-item label="回收时间：">
            {{
              accountDetail?.accountRecyclerTime
                ? useDateFormat(accountDetail?.accountRecyclerTime, "YYYY-MM-DD HH:mm:ss").value
                : "--"
            }}
          </el-descriptions-item>
          <el-descriptions-item label="回收价格：">
            {{ getFixed(accountDetail?.accountRecyclerPrice) }}
          </el-descriptions-item>
          <el-descriptions-item label="密保手机：">
            {{ accountDetail?.accountTel }}
          </el-descriptions-item>
          <el-descriptions-item label="分组：">
            {{ getLabel(groups, accountDetail?.groupingId) }}
          </el-descriptions-item>
          <el-descriptions-item label="回收备注：">
            {{ accountDetail?.recycleRemark }}
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
      <el-collapse-item title="发布信息" name="publish">
        <el-descriptions>
          <el-descriptions-item label="发布人：">
            {{ extraInfo?.publisher }}
          </el-descriptions-item>
          <el-descriptions-item label="发布时间：">
            {{
              accountDetail?.accountPublisherTimer
                ? useDateFormat(accountDetail?.accountPublisherTimer, "YYYY-MM-DD HH:mm:ss").value
                : "--"
            }}
          </el-descriptions-item>
          <el-descriptions-item label="发布平台：">
            {{ extraInfo?.publishPlatform }}
          </el-descriptions-item>
          <el-descriptions-item label="首次定价：">
            {{ getFixed(accountDetail?.publishPrice) }}
          </el-descriptions-item>
          <el-descriptions-item label="账号描述：">
            {{ accountDetail?.accountDesc }}
          </el-descriptions-item>
          <el-descriptions-item label="回滚平台：">
            {{ extraInfo?.rollBackPlatform }}
          </el-descriptions-item>
          <el-descriptions-item label="发布备注：">
            {{ accountDetail?.publishRemark }}
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
      <el-collapse-item title="销售信息" name="sales">
        <el-descriptions>
          <el-descriptions-item label="销售订单号：">
            {{ accountDetail?.salesCode }}
          </el-descriptions-item>
          <el-descriptions-item label="出售人：">
            {{ extraInfo.seller }}
          </el-descriptions-item>
          <el-descriptions-item label="出售时间：">
            {{ accountDetail?.saleTime ? useDateFormat(accountDetail?.saleTime, "YYYY-MM-DD HH:mm:ss").value : "--" }}
          </el-descriptions-item>
          <el-descriptions-item label="出售金额：">
            {{ getFixed(accountDetail?.salePrice) }}
          </el-descriptions-item>
          <el-descriptions-item label="出售平台：">
            {{ getLabel(publishPlatform, accountDetail?.salePlatformId) }}
          </el-descriptions-item>
          <el-descriptions-item label="买家手机号：">
            {{ accountDetail?.buyerTel }}
          </el-descriptions-item>
          <el-descriptions-item label="销售备注：">
            {{ accountDetail?.salesRemark }}
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { getAccountDetail } from "@/api/modules/account";
import { getBranchDetail } from "@/api/modules/branch";
import { getUserDetail } from "@/api/modules/user";
import { useDateFormat } from "@vueuse/core";
import { Account } from "@/typings/account";
import { useDict } from "@/hooks/useDict";
import { getLabel } from "@/utils/data";
import { getFixed } from "@/utils";

const props = withDefaults(
  defineProps<{
    accountId: number | string;
  }>(),
  {}
);

const { recycle_method, groups, publishPlatform } = useDict("recycle_method", "groups", "publishPlatform");

const defExpand = ref("recycle");

// 账号信息
const accountDetail = ref<Account.IAccountItem>();

// 额外信息： 需要二次请求获取的
const extraInfo = reactive({
  recycleBranch: "--",
  recycler: "--",
  publisher: "--",
  publishPlatform: "--",
  rollBackPlatform: "--",
  seller: "--"
});

const init = async () => {
  /* 回收信息 */
  // 回收门店
  const { data: recycleBranch } = await getBranchDetail(accountDetail.value?.branchId);
  extraInfo.recycleBranch = recycleBranch?.branchName;

  // 回收人
  const { data: recycler } = await getUserDetail(accountDetail.value?.accountRecyclerId);
  extraInfo.recycler = recycler?.name;

  // 发布人
  const { data: publisher } = await getUserDetail(accountDetail.value?.accountPublisherId);
  extraInfo.publisher = publisher?.name;

  // 发布平台
  extraInfo.publishPlatform = accountDetail.value?.publishPlatform?.map(id => getLabel(publishPlatform.value, id))?.join("、");

  // 回滚平台
  extraInfo.rollBackPlatform = accountDetail.value?.rollBackPlatform?.map(id => getLabel(publishPlatform.value, id))?.join("、");

  // 出售人
  const { data: seller } = await getUserDetail(accountDetail.value?.salePeopleId);
  extraInfo.seller = seller?.name;
};

watch(
  () => props.accountId,
  async accountId => {
    if (!accountId) return;
    const { data } = await getAccountDetail(accountId);
    accountDetail.value = data;
    await init();
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.account-info {
  &:deep(.el-collapse-item__header),
  &:deep(.el-collapse-item__wrap),
  &:deep(.el-collapse) {
    border: none;
  }

  &:deep(.el-collapse) {
    border-radius: 4px;
    overflow: hidden;
  }

  &:deep(.el-collapse-item__header) {
    padding-left: 10px;
    background-color: #f9fafb;
  }

  &:deep(.el-collapse-item__wrap) {
    background-color: #f4f4f5;
    padding: 10px;
  }

  &:deep(.content-box),
  &:deep(.el-descriptions) {
    padding: 0;
    background-color: transparent;
  }

  &:deep(.el-descriptions__body) {
    background-color: transparent;
  }
}
</style>
