<template>
  <el-dialog
    v-model="drawerVisible"
    :title="`${drawerProps.title}用户`"
    width="800px"
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
        <el-input v-model="drawerProps.row!.accountCode" :disabled="drawerProps.isView" placeholder="请输入订单编号" clearable />
      </el-form-item>
      <el-form-item label="游戏分类" prop="accountType">
        <el-select v-model="drawerProps.row!.accountType" placeholder="请选择" filterable multiple clearable>
          <el-option v-for="item in accountTypeMap" :key="item.id" :label="item.typeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="回收人姓名" prop="accountRecyclerId">
            <el-select v-model="drawerProps.row!.accountRecyclerId" placeholder="请选择" filterable>
              <el-option v-for="item in userMap" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="回收时间" prop="accountRecyclerTime">
            <el-date-picker
              v-model="drawerProps.row!.accountRecyclerTime"
              format="YYYY-MM-DD hh:mm:ss"
              value-format="YYYY-MM-DD hh:mm:ss"
              type="date"
              placeholder="请选择"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="回收价格" prop="accountRecyclerPrice">
            <el-input v-model="drawerProps.row!.accountRecyclerPrice" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发布人姓名" prop="accountPublisherId">
            <el-select v-model="drawerProps.row!.accountPublisherId" placeholder="请选择" filterable>
              <el-option v-for="item in userMap" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发布时间" prop="accountPublisherTimer">
            <el-date-picker
              v-model="drawerProps.row!.accountPublisherTimer"
              format="YYYY-MM-DD hh:mm:ss"
              value-format="YYYY-MM-DD hh:mm:ss"
              type="date"
              placeholder="请选择"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
      <el-form-item label="游戏账号" prop="accountNumber">
        <el-input v-model="drawerProps.row!.accountNumber" placeholder="请输入账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="营地号" prop="campId">
        <el-input v-model="drawerProps.row!.campId" placeholder="请输入账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="accountPassword">
        <el-input
          type="password"
          v-model="drawerProps.row!.accountPassword"
          placeholder="请输入密码"
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <!--<el-form-item label="账号实付金额" prop="accountPrice">-->
      <!--  <el-input v-model="drawerProps.row!.accountPrice" placeholder="请输入账号实付金额" clearable :maxlength="11"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="用户赔付金额" prop="userCompensationPrice">
        <el-input
          v-model="drawerProps.row!.userCompensationPrice"
          placeholder="请输入用户赔付金额"
          clearable
          :maxlength="11"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台赔付金额" prop="platformCompensationPrice">
        <el-input
          v-model="drawerProps.row!.platformCompensationPrice"
          placeholder="请输入平台赔付金额"
          clearable
          :maxlength="11"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="accountTel">
        <el-input v-model="drawerProps.row!.accountTel" placeholder="请输入手机号/邮箱密保" clearable :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="账号备注" prop="accountRemark">
        <el-input
          v-model="drawerProps.row!.accountRemark"
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          placeholder="请输入备注"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="有无二次" prop="haveSecondary">
        <el-select v-model="drawerProps.row!.haveSecondary" placeholder="请选择" filterable>
          <el-option v-for="item in haveSecondaryMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属门店" prop="branchId">
        <el-select v-model="drawerProps.row!.branchId" placeholder="请选择" filterable>
          <el-option v-for="item in branchMap" :key="item.id" :label="item.branchName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="资料是否存档" prop="isSave">
        <el-select v-model="drawerProps.row!.isSave" placeholder="请选择" filterable>
          <el-option v-for="item in isSaveMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
      <el-form-item label="网站上传" prop="netUpload">
        <el-select v-model="drawerProps.row!.netUpload" placeholder="请选择" filterable>
          <el-option v-for="item in netUploadMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="交易猫上架" prop="transCatUploaded">-->
      <!--  <el-select v-model="drawerProps.row!.transCatUploaded" placeholder="请选择" filterable>-->
      <!--    <el-option v-for="item in transCatUploadedMap" :key="item.value" :label="item.label" :value="item.value" />-->
      <!--  </el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="交易猫UID" prop="transCatUid">
        <el-input v-model="drawerProps.row!.transCatUid" placeholder="请输入交易猫UID" clearable></el-input>
      </el-form-item>
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

<script setup lang="ts" name="UnsoldDrawer">
import { Commodity } from "@/api/interface/commodity/commodity";
import { IBranch, getAllBranch } from "@/api/modules/branch";
import { getAllList } from "@/api/modules/accountClass";
import { checkPhoneNumber } from "@/utils/eleValidate";
import { ElMessage, FormInstance } from "element-plus";
import { typeCode } from "@/api/modules/account";
import { getUserAll } from "@/api/modules/user";
import { IAccountType } from "@/typings";
import { User } from "@/api/interface";

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
  accountCode: [
    { required: true, message: "必填项不能为空" },
    { validator: validatePass, trigger: "blur" }
  ],
  accountType: [{ required: true, message: "必填项不能为空" }],
  accountTitle: [{ required: true, message: "必填项不能为空" }],
  accountRecycler: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerTime: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerPrice: [{ required: true, message: "必填项不能为空" }],
  accountPublisherId: [{ required: true, message: "必填项不能为空" }],
  accountPublisherTimer: [{ required: true, message: "必填项不能为空" }],
  salePlatform: [{ required: true, message: "必填项不能为空" }],
  saleTime: [{ required: true, message: "必填项不能为空" }],
  salePrice: [{ required: true, message: "必填项不能为空" }],
  accountNumber: [{ required: true, message: "必填项不能为空" }],
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
  accountDesc: [{ required: true, message: "必填项不能为空" }],
  // accountStatus: [{ required: true, message: "必填项不能为空" }],
  netUpload: [{ required: true, message: "必填项不能为空" }],
  // transCatUploaded: [{ required: true, message: "必填项不能为空" }],
  transCatUid: [
    { required: true, message: "必填项不能为空" },
    { validator: validatePass, trigger: "blur" }
  ],
  // accountLevel: [{ required: true, message: "必填项不能为空" }],
  // accountPrice: [{ required: true, message: "必填项不能为空" }],
  userCompensationPrice: [{ required: true, message: "必填项不能为空" }],
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
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
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
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

// 二次
const haveSecondaryMap = [
  { label: "有", value: "1" },
  { label: "无", value: "0" }
];
// 上传
const netUploadMap = [
  { label: "已上传", value: "1" },
  { label: "未上传", value: "0" }
];
// 上架
const transCatUploadedMap = [
  { label: "已上架", value: "1" },
  { label: "未上架", value: "0" }
];
// 存档
const isSaveMap = [
  { label: "已存", value: "1" },
  { label: "未存", value: "0" }
];
const accountTypeMap = ref<IAccountType[]>([]);
const userMap = ref<User.ResUser[]>([]);
const branchMap = ref<IBranch[]>([]);
const setAllList = async () => {
  const res = await getAllList();
  const reloads = await getUserAll();
  const { data } = await getAllBranch();
  accountTypeMap.value = res.data;
  userMap.value = reloads.data as User.ResUser[];
  branchMap.value = data;
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
