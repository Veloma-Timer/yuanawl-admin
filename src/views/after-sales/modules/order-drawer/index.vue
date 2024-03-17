<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="1000px" :title="`${drawerProps.title}`" :show-close="false">
    <template #header>
      <div class="edit-btn">
        <span>{{ drawerProps.title }}</span>
        <template v-if="BUTTONS.edit">
          <el-button type="primary" @click="edit" v-if="drawerProps.title === '查看'">
            <div>编辑</div>
          </el-button>
        </template>
      </div>
    </template>
    <div class="first-header">
      <Header title="基本信息" class="header"></Header>
    </div>
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="工单编号" prop="orderCode">
        <el-input v-model="drawerProps.row!.orderCode" placeholder="请输入" clearable class="order-input"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="accountId">
        <el-select v-model="drawerProps.row!.accountId" placeholder="请选择" class="order-input" filterable>
          <template v-for="item in accountList" :key="item.id">
            <el-option :label="item.accountNumber" :value="item.id">
              <span style="float: left">{{ item.accountCode }}</span>
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{ item.accountNumber }}</span>
            </el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="上报人姓名" prop="reportPersonId">
        <el-select v-model="drawerProps.row!.reportPersonId" placeholder="请选择" class="order-input" filterable>
          <template v-for="item in userList" :key="item.id">
            <el-option :label="item.name" :value="item.id" />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="是否投保" prop="insure">
        <el-select v-model="drawerProps.row!.insure" placeholder="请选择" filterable class="order-input">
          <el-option v-for="item in insureList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="工单星级" prop="orderStar">
        <el-input-number
          v-model="drawerProps.row!.orderStar"
          :min="1"
          :max="3"
          placeholder="请输入"
          class="order-input"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="处理时效" prop="handleTime">
        <el-input-number
          v-model="drawerProps.row!.handleTime"
          :min="1"
          :max="5"
          placeholder="请输入"
          class="order-input"
        ></el-input-number>
      </el-form-item>
      <el-button type="primary" @click="addProcess">添加处理</el-button>
      <div v-if="!drawerProps.row.detail || drawerProps.row.detail.length <= 0" class="not-data">暂无处理数据</div>
      <!-- 第几次处理 -->
      <template v-for="(item, i) in drawerProps.row?.detail" :key="i">
        <Header :title="`第${i + 1}次处理`" class="header"></Header>
        <el-row :gutter="10" style="margin-top: 24px">
          <el-col :span="8">
            <el-form-item
              label="处理客服姓名"
              :prop="'detail.' + i + '.customerServiceId'"
              :rules="rules.customerServiceId"
              label-width="120px"
            >
              <el-select v-model="item.customerServiceId" placeholder="请选择" class="small-input" filterable>
                <template v-for="item2 in userList" :key="item2.id">
                  <el-option :label="item2.name" :value="item2.id" />
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="处理时间" :prop="'detail.' + i + '.handleTime'" :rules="rules.handleTime" label-width="100px">
              <el-date-picker v-model="item.handleTime" type="date" placeholder="请选择" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="处理结果"
              :prop="'detail.' + i + '.handleResult'"
              :rules="rules.handleResult"
              label-width="100px"
            >
              <el-input v-model="item.handleResult" placeholder="请输入" clearable class="small-input" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="" :prop="'detail.' + i + '.assets'" :rules="rules.assets">
          <UploadFiles v-model:file-list="item.assets" height="140px" width="140px"></UploadFiles>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { SalesOrder } from "@/api/interface";
import UploadFiles from "@/components/Upload/Files.vue";
import Header from "@/components/Header/index.vue";
import { detailSalesList } from "@/api/modules/ticket";
import { getAllBranch, getAllBaseAccount } from "@/api/modules/branch";
import { getAllUser } from "@/api/modules/branch";
import { findFileType } from "@/utils";
import { useAuthButtons } from "@/hooks/useAuthButtons";

const { BUTTONS } = useAuthButtons();

const rules = reactive({
  orderCode: [{ required: true, message: "必填项不能为空" }],
  customerService: [{ required: true, message: "必填项不能为空" }],
  submitTime: [{ required: true, message: "必填项不能为空" }],
  handleTime: [{ required: true, message: "必填项不能为空" }],
  customerServiceId: [{ required: true, message: "必填项不能为空" }],
  handleResult: [{ required: true, message: "必填项不能为空" }],
  submitOrderTime: [{ required: true, message: "必填项不能为空" }],
  assets: [{ required: true, message: "必填项不能为空" }],
  name: [{ required: true, message: "必填项不能为空" }],
  reportPersonId: [{ required: true, message: "必填项不能为空" }],
  accountId: [{ required: true, message: "必填项不能为空" }],
  newHandleResult: [{ required: true, message: "必填项不能为空" }],
  handleTimes: [{ required: true, message: "必填项不能为空" }],
  insure: [{ required: true, message: "必填项不能为空" }],
  newHandleId: [{ required: true, message: "必填项不能为空" }],
  recycleBranchId: [{ required: true, message: "必填项不能为空" }],
  orderStar: [{ required: true, message: "必填项不能为空" }],
  newHandleTime: [{ required: true, message: "必填项不能为空" }]
});

interface DrawerProps {
  submitOrderTime?: Date | null;
  title: string;
  isView: boolean;
  row: Partial<SalesOrder.ResSalesList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  submitOrderTime: null,
  isView: false,
  title: "",
  row: {}
});

// 返显数据处理
const getDetailInfo = async (id: any) => {
  if (!id) {
    return false;
  }
  const { data } = await detailSalesList(id);
  if (data) {
    drawerProps.value.row = {
      ...data
    };
    drawerProps.value.row.detail = data?.detail?.map(item => {
      return {
        ...item,
        assets: item.assets.map((imgItem: any) => {
          return {
            path: imgItem.path,
            url: imgItem.path,
            id: imgItem.id,
            type: findFileType(imgItem.path)
          };
        })
      };
    });
  }
};

type UserObj = { name: string; id: number };
const userList = ref<UserObj[]>([]);
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerProps.value.row.handleTime = 5;
  getDetailInfo(params.row.id);
  const { data } = await getAllUser({});
  userList.value = data;
  drawerVisible.value = true;
};

// 账号状态
const insureList = [
  { label: "否", value: "0" },
  { label: "是", value: "1" }
];

// 门店列表
type BranchObj = { branchName: string; id: number };
const branchList = ref<BranchObj[]>([]);
const getBranchList = async () => {
  const { data } = await getAllBranch();
  branchList.value = data;
};
getBranchList();

// 账号列表
type AccountObj = { accountNumber: string; accountCode: string; id: number };
const accountList = ref<AccountObj[]>([]);
const getAllAccountList = async () => {
  const { data } = await getAllBaseAccount({});
  accountList.value = data;
};
getAllAccountList();

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const {
        id,
        orderCode,
        accountId,
        accountPrice,
        userCompensationPrice,
        platformCompensationPrice,
        reportPersonId,
        insure,
        recycleBranchId,
        handleTime,
        orderStar,
        branchId,
        detail
      } = drawerProps.value.row;
      const newDetail = detail?.map(item => {
        return {
          customerServiceId: item.customerServiceId,
          handleTime: item.handleTime,
          handleResult: item.handleResult,
          assets: item.assets.map((imgItem: any) => {
            return {
              path: imgItem?.response?.path || imgItem.url || imgItem.path,
              id: imgItem.id || imgItem.uid
            };
          })
        };
      });
      await drawerProps.value.api!({
        id,
        orderCode,
        accountId,
        accountPrice,
        userCompensationPrice,
        platformCompensationPrice,
        reportPersonId,
        insure,
        recycleBranchId,
        handleTime,
        orderStar,
        branchId,
        detail: newDetail
      });
      ElMessage.success({ message: `操作成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const edit = () => {
  drawerProps.value.isView = false;
};

const addProcess = () => {
  try {
    if (!drawerProps.value.row.detail) {
      drawerProps.value.row.detail = [];
    }
    drawerProps.value.row.detail.push({
      customerServiceId: "",
      handleTime: "",
      handleResult: "",
      assets: []
    });
  } catch (error) {
    console.log("添加处理", error);
  }
};

defineExpose({
  acceptParams
});
</script>

<style lang="scss" scoped>
.el-drawer__header {
  position: relative;

  button {
    position: absolute;
    right: 20px;
  }
}

.first-header {
  transform: translateY(-20px);
}

.edit-btn {
  div {
    color: var(--el-color-white) !important;
  }
}

.order-input,
.el-input {
  width: 400px !important;
}

.order-time {
  :deep(.el-input__wrapper) {
    width: 400px;
  }
}

.not-data {
  margin-top: 10px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}
</style>
