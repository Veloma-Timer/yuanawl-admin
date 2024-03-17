<template>
  <div class="table-box">
    <div class="bg-white flex-1 py-4 rounded-md">
      <el-form ref="ruleFormRef" class="demo-ruleForm" :model="ruleForm" :rules="rules" label-width="120px" label-suffix=" :">
        <el-form-item label="游戏账号" prop="accountId">
          <el-input v-model="ruleForm.accountId" placeholder="请输入" clearable class="order-input"></el-input>
        </el-form-item>
        <el-form-item label="短信模板" prop="message">
          <el-input v-model="ruleForm.message" placeholder="请输入" clearable class="order-input"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="signature">
          <div class="cell">
            <div class="cell-phone"></div>
            <span>一行一个号码，注意不要超过20万行，当前已输入<span>0</span>个</span>
          </div>
        </el-form-item>
        <el-form-item label="发送时间" prop="sendingTime">
          <el-radio-group v-model="ruleForm.sendingTime">
            <el-radio :label="1">立即发送</el-radio>
            <el-radio :label="2">定时发送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="ruleForm.sendingTime === 2" label="" prop="openAccountName">
          <el-date-picker
            v-model="ruleForm.openAccountName"
            format="YYYY-MM-DD hh:mm:ss"
            value-format="YYYY-MM-DD hh:mm:ss"
            type="date"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="号码去重" prop="reduction">
          <el-radio-group v-model="ruleForm.reduction">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { Message } from "@/api/interface";
const ruleForm: Partial<Message.Sending> = reactive({
  accountId: "",
  message: "",
  reduction: true,
  openAccountTime: "",
  sendingTime: 1
});
const rules = reactive({
  accountId: [{ required: true, message: "必填项不能为空" }],
  message: [{ required: true, message: "必填项不能为空" }],
  openAccountName: [{ required: true, message: "必填项不能为空" }],
  reduction: [{ required: true, message: "必填项不能为空" }],
  sendingTime: [{ required: true, message: "必填项不能为空" }]
});
const onSubmit = () => {
  console.log("submit!");
};
</script>
<style scoped lang="scss">
.table-box {
  .demo-ruleForm {
    width: 40%;
  }
  .cell {
    width: 100%;
    .cell-phone {
      width: 100%;
      height: 216px;
      border: 1px solid #dadada;
    }
  }
}
</style>
