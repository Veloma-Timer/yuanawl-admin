<template>
  <el-dialog
    v-model="drawerVisible"
    :title="`${drawerProps.title}回收账号`"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <div class="grid grid-cols-3">
        <el-form-item label="所属门店" prop="branchId">
          <el-select v-model="drawerProps.row!.branchId" disabled placeholder="请选择所属门店" style="width: 100%" filterable>
            <el-option v-for="item in branchMap" :key="item.id" :label="item.branchName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分组" prop="groupingId">
          <el-select
            v-model="drawerProps.row!.groupingId"
            style="width: 100%"
            placeholder="请选择分组"
            filterable
            @change="changeGrouping"
          >
            <el-option v-for="item in drawerProps.groups" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号编码" prop="accountCode">
          <el-input v-model="drawerProps.row!.accountCode" placeholder="请输入账号编码" clearable />
        </el-form-item>
        <el-form-item label="账号分类" prop="accountType">
          <el-select
            v-model="drawerProps.row!.accountType"
            :disabled="drawerProps.isView"
            placeholder="请选择账号分类"
            style="width: 100%"
            filterable
            multiple
            clearable
          >
            <el-option v-for="item in accountTypeMap" :key="item.id" :label="item.typeName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="drawerProps.row!.account" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="accountPassword">
          <el-input
            v-model="drawerProps.row!.accountPassword"
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
            :disabled="drawerProps.isView"
          ></el-input>
        </el-form-item>
        <el-form-item label="密保手机" prop="accountTel">
          <el-input
            v-model="drawerProps.row!.accountTel"
            placeholder="请输入密保手机"
            :disabled="drawerProps.isView"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="手机卡备注" prop="phoneRemark">
          <el-input
            v-model="drawerProps.row!.phoneRemark"
            placeholder="请输入手机卡备注"
            :disabled="drawerProps.isView"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="drawerProps.row!.email" placeholder="请输入邮箱" :disabled="drawerProps.isView" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱密保" prop="emailSecret">
          <el-input
            v-model="drawerProps.row!.emailSecret"
            placeholder="请输入邮箱密保"
            :disabled="drawerProps.isView"
            clearable
            :maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="系统" prop="systemId">
          <el-select
            v-model="drawerProps.row!.systemId"
            :disabled="drawerProps.isView"
            class="w-full"
            placeholder="请选择"
            filterable
          >
            <el-option v-for="item in drawerProps.system" :key="item.id" :label="item.label" :value="item.value!" />
          </el-select>
        </el-form-item>
        <el-form-item label="营地号" prop="campId">
          <el-input
            v-model="drawerProps.row!.campId"
            placeholder="请输入营地号"
            clearable
            :disabled="drawerProps.isView"
          ></el-input>
        </el-form-item>
        <el-form-item label="实名情况" prop="haveSecondary">
          <el-select
            v-model="drawerProps.row!.haveSecondary"
            style="width: 100%"
            :disabled="drawerProps.isView"
            placeholder="请选择"
            filterable
          >
            <el-option v-for="item in drawerProps.have_or_not" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="回收方式" prop="isSave">
          <el-select v-model="drawerProps.row!.recycleMethod" style="width: 100%" placeholder="请选择" filterable>
            <el-option v-for="item in drawerProps.recycle_method" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="资料是否存档" prop="isSave">
          <el-select v-model="drawerProps.row!.isSave" style="width: 100%" placeholder="请选择" filterable>
            <el-option v-for="item in drawerProps.whether" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="回收订单号" prop="recycleOrder">
          <el-input
            v-model="drawerProps.row!.recycleOrder"
            placeholder="请输入回收订单号"
            clearable
            :disabled="drawerProps.isView"
          ></el-input>
        </el-form-item>
        <el-form-item label="回收价格" prop="accountRecyclerPrice">
          <el-input
            v-model="drawerProps.row!.accountRecyclerPrice"
            placeholder="请输入回收价格"
            clearable
            :disabled="drawerProps.isView"
          ></el-input>
        </el-form-item>
        <el-form-item label="回收人" prop="accountRecyclerId">
          <el-select
            v-model="drawerProps.row!.accountRecyclerId"
            style="width: 100%"
            disabled
            placeholder="请选择回收人"
            filterable
          >
            <el-option v-for="item in transCatUploadedMap" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="回收门店" prop="storeId">
          <el-select v-model="drawerProps.row!.storeId" style="width: 100%" placeholder="请选择回收门店" filterable>
            <el-option v-for="item in drawerProps.recycleShop" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="回收时间" prop="accountRecyclerTime">
          <el-date-picker
            disabled
            style="width: 100%"
            v-model="drawerProps.row!.accountRecyclerTime"
            format="YYYY-MM-DD hh:mm:ss"
            value-format="YYYY-MM-DD hh:mm:ss"
            type="datetime"
            placeholder="请选择回收时间"
          />
        </el-form-item>
        <el-form-item label="回收备注" prop="recycleRemark">
          <el-input
            v-model="drawerProps.row!.recycleRemark"
            clearable
            resize="none"
            placeholder="请输入回收备注"
            :disabled="drawerProps.isView"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { generateCode, typeCode } from "@/api/modules/account";
import { Commodity } from "@/api/interface/commodity/commodity";
import { getAllList } from "@/api/modules/accountClass";
import { ElMessage, FormInstance } from "element-plus";
import { checkPhoneNumber } from "@/utils/eleValidate";
import { getAllBranch } from "@/api/modules/branch";
import { getUserAll } from "@/api/modules/user";
import { IAccountType } from "@/typings";
import { User } from "@/api/interface";
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
        return callback(new Error("该值已存在, 不能重复"));
      } else {
        return callback();
      }
    });
  }
};

const rules = reactive({
  accountTitle: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  branchId: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  accountCode: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  accountType: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  groupingId: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  account: [
    { required: true, message: "必填项不能为空" },
    { validator: validatePass, trigger: "blur" }
  ],
  accountPassword: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  systemId: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  // accountDesc: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  haveSecondary: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  accountRecyclerPrice: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  recycleOrder: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  storeId: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  accountTel: [
    { required: true, message: "必填项不能为空" },
    { required: true, validator: checkPhoneNumber, trigger: "blur" }
  ],
  accountRecyclerTime: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  accountRecyclerId: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  status: boolean;
  row: Partial<Commodity.Recovery>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  recycleShop: Dict.IDataItem[];
  recycle_method: Dict.IDataItem[];
  whether: Dict.IDataItem[];
  system: Dict.IDataItem[];
  have_or_not: Dict.IDataItem[];
  groups: Dict.IDataItem[];
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  status: true,
  title: "",
  row: {},
  recycleShop: [],
  recycle_method: [],
  whether: [],
  system: [],
  have_or_not: [],
  groups: []
});

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}账户成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

// 回收人
const transCatUploadedMap = ref<User.ResUser[]>([]);
// 账号分类
const accountTypeMap = ref<IAccountType[]>([]);
// 门店
const branchMap = ref<{ branchName: string; id: number }[]>([]);

// 分组变化
const changeGrouping = async (value: any) => {
  const { data: code } = await generateCode(value);
  drawerProps.value.row.accountCode = code;
};

const setAllList = async () => {
  const res = await getAllList();

  const reloads = await getUserAll();
  const { data } = await getAllBranch();
  transCatUploadedMap.value = reloads.data;
  accountTypeMap.value = res.data;
  branchMap.value = data;
};

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;

  if (accountTypeMap.value.length < 1) {
    await setAllList();
  }
};

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
