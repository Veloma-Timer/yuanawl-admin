<template>
  <el-dialog
    :title="`${drawerProps.title}销售订单`"
    v-model="drawerVisible"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="账号编码" prop="accountCode">
        <div class="font-semibold">{{ drawerProps.row!.accountCode }}</div>
      </el-form-item>
      <el-form-item label="出售人" prop="salePeopleId">
        <el-select v-model="drawerProps.row!.salePeopleId" class="w-full" placeholder="请选择出售人" filterable disabled>
          <el-option v-for="item in transCatUploadedMap" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="出售时间" prop="saleTime">
        <el-date-picker
          v-model="drawerProps.row!.saleTime"
          format="YYYY-MM-DD hh:mm:ss"
          class="w-full"
          disabled
          value-format="YYYY-MM-DD hh:mm:ss"
          type="datetime"
          placeholder="请选择出售时间"
        />
      </el-form-item>
      <el-form-item label="出售金额" prop="salePrice">
        <div class="w-full">
          <el-input v-model="drawerProps.row!.salePrice" placeholder="请输入出售金额" clearable>
            <template #prepend>¥</template>
          </el-input>
          <p class="text-xs text-gray-300 mt-1">
            回收价格：{{ currency(drawerProps?.row?.accountRecyclerPrice!).format({ symbol: "¥" }) }}
          </p>
        </div>
      </el-form-item>
      <el-form-item label="出售平台" prop="salePlatformId">
        <el-select v-model="drawerProps.row!.salePlatformId" placeholder="请选择" class="w-full" filterable>
          <el-option v-for="item in drawerProps.platform" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="买家手机号" prop="buyerTel">
        <el-input v-model="drawerProps.row!.buyerTel" :maxlength="11" placeholder="请输入买家手机号" clearable />
      </el-form-item>
      <el-form-item label="销售订单编号" prop="salesCode">
        <el-input v-model="drawerProps.row!.salesCode" placeholder="请输入销售订单编号" clearable />
      </el-form-item>
      <el-form-item label="销售备注" prop="salesRemark">
        <el-input
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          v-model="drawerProps.row!.salesRemark"
          placeholder="请输入销售备注"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="SaleDrawer">
import { Commodity } from "@/api/interface/commodity/commodity";
import { ElMessage, FormInstance } from "element-plus";
import { checkPhoneNumber } from "@/utils/eleValidate";
import { getUserAll } from "@/api/modules/user";
import { Dict } from "@/typings/dict";
import currency from "currency.js";

const rules = reactive({
  // accountCode: [{required: true, message: "必填项不能为空"}],
  salePeopleId: [{ required: true, message: "必填项不能为空" }],
  salePlatformId: [{ required: true, message: "必填项不能为空" }],
  id: [{ required: true, message: "必填项不能为空" }],
  // salesRemark: [{ required: true, message: "必填项不能为空" }],
  salePrice: [{ required: true, message: "必填项不能为空" }],
  salePlatform: [{ required: true, message: "必填项不能为空" }],
  saleTime: [{ required: true, message: "必填项不能为空" }],
  salesCode: [{ required: true, message: "必填项不能为空" }],
  buyerTel: [
    { required: true, message: "必填项不能为空" },
    { required: true, validator: checkPhoneNumber, trigger: "blur" }
  ]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Commodity.Sales>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  platform: Dict.IDataItem[];
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  platform: []
});
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
// 上架
const transCatUploadedMap = ref<any[]>([]);

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}销售订单成功！` });
      drawerProps.value.getTableList?.();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const setAllList = async () => {
  const { data = [] } = await getUserAll();
  transCatUploadedMap.value = data;
};
setAllList();
defineExpose({
  acceptParams
});
</script>
<style scoped lang="scss">
.edit-btn {
  div {
    color: var(--el-color-white) !important;
  }
}
</style>
