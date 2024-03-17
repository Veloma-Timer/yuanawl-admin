<template>
  <el-dialog
    v-model="drawerVisible"
    :title="`${drawerProps.title}账号`"
    width="1200px"
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
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="所属门店" prop="branchId">
            <el-select v-model="drawerProps.row!.branchId" disabled placeholder="请选择所属门店" filterable>
              <el-option v-for="item in branchMap" :key="item.id" :label="item.branchName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号编码" prop="accountCode">
            <el-input v-model="drawerProps.row!.accountCode" placeholder="请输入账号编码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号分类" prop="accountType">
            <el-select v-model="drawerProps.row!.accountType" placeholder="请选择" collapse-tags filterable multiple clearable>
              <el-option v-for="item in accountTypeMap" :key="item.id" :label="item.typeName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="分组" prop="groupingId">
            <el-select v-model="drawerProps.row!.groupingId" placeholder="请选择回收组" filterable @change="changeGrouping">
              <el-option v-for="item in drawerProps.groups" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="回收人姓名" prop="accountRecyclerId">
            <el-select v-model="drawerProps.row!.accountRecyclerId" placeholder="请选择" filterable>
              <el-option v-for="item in userMap" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="回收时间" prop="accountRecyclerTime">
            <el-date-picker
              v-model="drawerProps.row!.accountRecyclerTime"
              format="YYYY-MM-DD hh:mm:ss"
              value-format="YYYY-MM-DD hh:mm:ss"
              type="date"
              placeholder="请选择"
              @change="setRecyclerTime"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="回收价格" prop="accountRecyclerPrice">
            <el-input-number
              class="order-input"
              v-model="drawerProps.row!.accountRecyclerPrice"
              placeholder="请输入"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="回收方式" prop="isSave">
            <el-select v-model="drawerProps.row!.recycleMethod" placeholder="请选择" filterable>
              <el-option v-for="item in drawerProps.recycle_method" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="发布人姓名">
            <el-select v-model="drawerProps.row!.accountPublisherId" placeholder="请选择" filterable>
              <el-option v-for="item in userMap" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="drawerProps.row!.accountPublisherTimer"
              format="YYYY-MM-DD hh:mm:ss"
              value-format="YYYY-MM-DD hh:mm:ss"
              :disabled-date="options"
              type="date"
              placeholder="请选择"
              @change="setPublisherTime"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发布平台" prop="publishPlatform">
            <el-select v-model="drawerProps.row!.publishPlatform" placeholder="请选择发布平台" collapse-tags filterable multiple>
              <el-option v-for="item in drawerProps.publishPlatform" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="回收订单号" prop="recycleOrder">
            <el-input
              v-model="drawerProps.row!.recycleOrder"
              placeholder="请输入回收订单号"
              clearable
              :disabled="drawerProps.isView"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="出售人姓名">
            <el-select v-model="drawerProps.row!.salePeopleId" placeholder="请选择" filterable>
              <el-option v-for="item in userMap" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出售时间">
            <el-date-picker
              v-model="drawerProps.row!.saleTime"
              type="date"
              format="YYYY-MM-DD hh:mm:ss"
              value-format="YYYY-MM-DD hh:mm:ss"
              :disabled-date="saleOptions"
              placeholder="请选择"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出售价格">
            <el-input-number
              class="order-input"
              v-model="drawerProps.row!.salePrice"
              placeholder="请输入"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出售平台">
            <el-select v-model="drawerProps.row!.salePlatformId" placeholder="请选择" filterable>
              <el-option v-for="item in drawerProps.publishPlatform" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="销售订单编号" prop="salesCode">
            <el-input v-model="drawerProps.row!.salesCode" placeholder="请输入销售订单编号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户赔付金额">
            <el-input-number
              class="order-input"
              v-model="drawerProps.row!.userCompensationPrice"
              placeholder="请输入用户赔付金额"
              clearable
              :maxlength="11"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="平台赔付金额">
            <el-input-number
              class="order-input"
              v-model="drawerProps.row!.platformCompensationPrice"
              placeholder="请输入平台赔付金额"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="回收订单号" prop="recycleOrder">
            <el-input
              v-model="drawerProps.row!.recycleOrder"
              placeholder="请输入回收订单号"
              clearable
              :disabled="drawerProps.isView"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="账号" prop="account">
            <el-input v-model="drawerProps.row!.account" placeholder="请输入账号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="营地号" prop="campId">
            <el-input v-model="drawerProps.row!.campId" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="密码" prop="accountPassword">
            <el-input
              type="password"
              v-model="drawerProps.row!.accountPassword"
              placeholder="请输入密码"
              show-password
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="密保手机" prop="accountTel">
            <el-input v-model="drawerProps.row!.accountTel" placeholder="请输入手机号" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="有无二次" prop="haveSecondary">
            <el-select v-model="drawerProps.row!.haveSecondary" placeholder="请选择" filterable>
              <el-option v-for="item in drawerProps.have_or_not" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="回收门店" prop="storeId">
            <el-select v-model="drawerProps.row!.storeId" placeholder="请选择" filterable>
              <el-option v-for="item in drawerProps.recycleShop" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资料是否存档" prop="isSave">
            <el-select v-model="drawerProps.row!.isSave" placeholder="请选择" filterable>
              <el-option v-for="item in drawerProps.whether" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="交易猫UID">
            <el-input v-model="drawerProps.row!.transCatUid" placeholder="请输入交易猫UID" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="账号备注">
            <el-input
              v-model="drawerProps.row!.accountRemark"
              :autosize="{ minRows: 3, maxRows: 5 }"
              type="textarea"
              resize="none"
              placeholder="请输入备注"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
        </el-col>
      </el-row>

      <!--<el-form-item label="交易猫是否上架">-->
      <!--  <el-select v-model="drawerProps.row!.transCatUploaded" placeholder="请选择" filterable>-->
      <!--    <el-option v-for="item in drawerProps.is_up" :key="item.id" :label="item.label" :value="item.value"/>-->
      <!--  </el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="账号等级" prop="accountLevel">-->
      <!--  <el-input v-model="drawerProps.row!.accountLevel" placeholder="请输入账号等级" clearable></el-input>-->
      <!--</el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="UserDrawer">
import { Commodity } from "@/api/interface/commodity/commodity";
import { getAllBranch, IBranch } from "@/api/modules/branch";
import { getAllList } from "@/api/modules/accountClass";
import { ElMessage, FormInstance } from "element-plus";
import { checkPhoneNumber } from "@/utils/eleValidate";
import { useUserStore } from "@/stores/modules/user";
import { generateCode, typeCode } from "@/api/modules/account";
import { getUserAll } from "@/api/modules/user";
import { IAccountType } from "@/typings";
import { Dict } from "@/typings/dict";

const validatePass = (rule: any, value: any, callback: any) => {
  const params = {
    type: rule.field,
    value
  };
  if (drawerProps.value.title === "编辑") return callback();
  if (value) {
    typeCode(params).then(res => {
      const { data } = res;
      if (data === "0") {
        return callback(new Error("该编号已存在"));
      } else {
        return callback();
      }
    });
  }
};
const rules = reactive({
  accountCode: [{ required: true, message: "必填项不能为空" }],
  accountType: [{ required: true, message: "必填项不能为空" }],
  account: [{ required: true, message: "必填项不能为空" }],
  storeId: [{ required: true, message: "必填项不能为空" }],
  accountTitle: [{ required: true, message: "必填项不能为空" }],
  accountRecycler: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerTime: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerPrice: [{ required: true, message: "必填项不能为空" }],
  accountPublisherId: [{ required: true, message: "必填项不能为空" }],
  accountPublisherTimer: [{ required: true, message: "必填项不能为空" }],
  salePlatformId: [{ required: true, message: "必填项不能为空" }],
  saleTime: [{ required: true, message: "必填项不能为空" }],
  salePrice: [{ required: true, message: "必填项不能为空" }],
  accountPassword: [{ required: true, message: "必填项不能为空" }],
  accountTel: [
    { required: true, message: "必填项不能为空" },
    { validator: checkPhoneNumber, trigger: "blur" }
  ],
  accountRemark: [{ required: true, message: "必填项不能为空" }],
  campId: [
    { required: true, message: "必填项不能为空" },
    { validator: validatePass, trigger: "blur" }
  ],
  haveSecondary: [{ required: true, message: "必填项不能为空" }],
  isSave: [{ required: true, message: "必填项不能为空" }],
  netUpload: [{ required: true, message: "必填项不能为空" }],
  recycleOrder: [{ required: true, message: "必填项不能为空" }],
  transCatUid: [
    { required: true, message: "必填项不能为空" },
    { validator: validatePass, trigger: "blur" }
  ],
  userCompensationPrice: [{ required: true, message: "必填项不能为空" }],
  branchId: [{ required: true, message: "必填项不能为空" }],
  platformCompensationPrice: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerId: [{ required: true, message: "必填项不能为空" }],
  salePeopleId: [{ required: true, message: "必填项不能为空" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Commodity.Account>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  have_or_not: Dict.IDataItem[];
  whether: Dict.IDataItem[];
  recycle_method: Dict.IDataItem[];
  is_up: Dict.IDataItem[];
  publishPlatform: Dict.IDataItem[];
  recycleShop: Dict.IDataItem[];
  groups: Dict.IDataItem[];
}

const options = (date: any) => {
  const accountRecyclerTime = drawerProps.value.row.accountRecyclerTime;
  const currentDate = new Date(accountRecyclerTime!);
  currentDate.setHours(0, 0, 0, 0);
  return date.getTime() < currentDate.getTime();
};
const saleOptions = (date: any) => {
  const accountPublisherTimer = drawerProps.value.row.accountPublisherTimer;
  const currentDate = new Date(accountPublisherTimer!);
  currentDate.setHours(0, 0, 0, 0);
  return date.getTime() < currentDate.getTime();
};
const drawerVisible = ref(false);

const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
  have_or_not: [],
  whether: [],
  recycle_method: [],
  is_up: [],
  publishPlatform: [],
  recycleShop: [],
  groups: []
});
const setRecyclerTime = () => {
  return (drawerProps.value.row!.accountPublisherTimer = undefined);
};

const changeGrouping = async (value: any) => {
  const { data: code } = await generateCode(value);
  drawerProps.value.row.accountCode = code;
};

const setPublisherTime = () => {
  return (drawerProps.value.row!.saleTime = undefined);
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const res = await drawerProps.value.api!(drawerProps.value.row);
      if (res.success) {
        ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const accountTypeMap = ref<IAccountType[]>([]);
const userMap = ref<{ id: number; name: string }[]>([]);

const branchMap = ref<IBranch[]>([]);

const userStore = useUserStore();

const setAllList = async () => {
  const { data } = await getAllList();
  const reloads = await getUserAll();
  drawerProps.value.row.groupingId = drawerProps.value.groups[0]?.value as string;
  accountTypeMap.value = data;
  userMap.value = reloads.data;
  const { data: branchList } = await getAllBranch();
  branchMap.value = branchList;
  drawerProps.value.row.branchId = userStore.userInfo.branchId!;
};

watch(drawerVisible, dv => dv && setAllList());

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

.order-input {
  width: 220px !important;
}
</style>
