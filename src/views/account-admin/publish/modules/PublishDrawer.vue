<template>
  <el-dialog
    v-model="drawerVisible"
    :title="`${drawerProps.title}发布订单`"
    width="660px"
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
        <el-select v-model="drawerProps.row!.accountCode" placeholder="请输入账号编码" class="w-full" filterable disabled>
          <el-option v-for="item in customerMap" :key="item.id" :label="item.accountCode" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布人" prop="accountPublisherId">
        <el-select v-model="drawerProps.row!.accountPublisherId" placeholder="请选择发布人" class="w-full" filterable disabled>
          <el-option v-for="item in transCatUploadedMap" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间" prop="accountPublisherTimer">
        <el-date-picker
          v-model="drawerProps.row!.accountPublisherTimer"
          disabled
          class="w-full"
          type="datetime"
          placeholder="请选择发布时间"
          format="YYYY-MM-DD hh:mm:ss"
          value-format="YYYY-MM-DD hh:mm:ss"
        />
      </el-form-item>
      <el-form-item label="发布平台" prop="publishPlatform">
        <el-select
          v-model="drawerProps.row!.publishPlatform"
          placeholder="请选择发布平台"
          class="w-full"
          collapse-tags
          filterable
          multiple
        >
          <el-option v-for="item in drawerProps.publishPlatform" :key="item.id" :label="item.label" :value="item.value!" />
        </el-select>
      </el-form-item>
      <el-form-item label="首次定价" prop="publishPrice">
        <div>
          <el-input v-model="drawerProps.row!.publishPrice" placeholder="请输入商品首次定价">
            <template #prepend>¥</template>
          </el-input>
          <p class="text-xs text-gray-300 mt-1">
            回收价格：{{ currency(drawerProps?.row?.accountRecyclerPrice!).format({ symbol: "¥" }) }}
          </p>
        </div>
      </el-form-item>
      <el-form-item label="发布备注" prop="publishRemark">
        <el-input v-model="drawerProps.row!.publishRemark" placeholder="请输入发布备注" clearable></el-input>
      </el-form-item>
      <el-form-item label="账号描述" prop="accountDesc">
        <el-input
          v-model="drawerProps.row!.accountDesc"
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          placeholder="请输入账号描述"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item v-if="drawerProps.row.isPublish === '1'" label="回滚平台" prop="rollBackPlatform">
        <el-select v-model="drawerProps.row!.rollBackPlatform" placeholder="请选择回滚平台" collapse-tags filterable multiple>
          <el-option v-for="item in drawerProps.publishPlatform" :key="item.id" :label="item.label" :value="item.id!" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="PublishDrawer">
import { Commodity } from "@/api/interface/commodity/commodity";
import { getRecycleList } from "@/api/modules/account";
import { ElMessage, FormInstance } from "element-plus";
import { getUserAll } from "@/api/modules/user";
import { User } from "@/api/interface";
import { Dict } from "@/typings/dict";
import currency from "currency.js";

const rules = reactive({
  accountCode: [{ required: true, message: "请输入账号编码" }],
  accountPublisherId: [{ required: true, message: "请选择发布人" }],
  accountPublisherTimer: [{ required: true, message: "请选择发布时间", trigger: "blur" }],
  publishPlatform: [{ required: true, message: "请选择发布平台", trigger: "blur" }],
  accountDesc: [{ required: true, message: "请输入账号描述", trigger: "blur" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  getTableList?: () => void;
  row: Partial<Commodity.Release>;
  publishPlatform: Dict.IDataItem[];
  api?: (params: any) => Promise<any>;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  publishPlatform: []
});
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = {
    ...params,
    row: {
      ...params.row,
      rollBackPlatform: params.row.rollBackPlatform ? params.row.rollBackPlatform.map(id => Number(id)) : []
    }
  };

  drawerVisible.value = true;
};
// 发布人
const transCatUploadedMap = ref<User.ResUser[]>([]);
// 回收账户列表
const customerMap = ref<Commodity.Account[]>([]);

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}发布订单成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
const setAllList = async () => {
  const { data = [] } = await getUserAll();
  const {
    data: { list = [] }
  } = await getRecycleList({});
  transCatUploadedMap.value = data as any;
  customerMap.value = list;
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

.el-input-number {
  width: 190px !important;
}
</style>
