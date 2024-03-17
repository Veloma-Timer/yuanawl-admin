<template>
  <div class="table-box card">
    <div class="content-box">
      <div class="back-btn mb-2">
        <el-button type="primary" @click="goBack" :icon="ArrowLeft" link> 返回</el-button>
      </div>
      <el-form
        ref="ruleFormRef"
        label-width="100px"
        label-suffix=" :"
        class="rule-form"
        :rules="rules"
        :model="form.row"
        :disabled="form.isView"
        :hide-required-asterisk="form.isView"
      >
        <div class="mb-2 flex flex-row w-full gap-1">
          <Header title="基本信息" class="header" />
          <el-button v-if="!form.isView && id" type="warning" @click="edit">编辑</el-button>
        </div>
        <el-row class="row-line" :gutter="10">
          <el-col :span="6">
            <el-form-item label="工单编号" prop="basicOrderCode">
              <el-input v-model="form.row!.basicOrderCode" placeholder="请选择" class="order-input" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账号编码" prop="basicAccountId">
              <el-select-v2
                v-model="form.row!.basicAccountId"
                :disabled="form.basicEdit || !!accId"
                placeholder="请选择"
                class="order-input"
                filterable
                :options="accountList.map(item => ({ label: item.accountCode, value: item.id }))"
                @change="onChangeAccount"
              >
              </el-select-v2>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="问题类型" prop="basicQuestionType">
              <el-select
                v-model="form.row!.basicQuestionType"
                placeholder="请选择"
                filterable
                class="order-input"
                :disabled="form.basicEdit"
              >
                <el-option v-for="item in orderProblemTypes" :key="item.id" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.row.account" placeholder="请输入账号" :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="是否在保" prop="basicInsure">
              <el-select
                v-model="form.row!.basicInsure"
                placeholder="请选择"
                filterable
                class="order-input"
                :disabled="form.basicEdit"
              >
                <el-option v-for="item in whether" :key="item.id" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="处理时效" prop="basicHandleTime">
              <el-input-number
                :disabled="form.basicEdit"
                v-model="form.row!.basicHandleTime"
                :min="1"
                :max="isZZ ? 4 : 7"
                placeholder="请输入"
                class="order-input"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 不是管理员不可编辑工单星级 -->
            <el-form-item label="工单星级" prop="basicOrderStar">
              <el-input-number
                :disabled="!isAdmin"
                v-model="form.row!.basicOrderStar"
                :min="1"
                :max="3"
                placeholder="请输入"
                class="order-input"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <AccountInfo :account-id="form.row!.basicAccountId" />

        <el-row class="basic-info">
          <el-col :span="24">
            <el-form-item label="备注" prop="basicMessage" label-width="60px">
              <el-input
                :disabled="form.basicEdit || !form.row!.basicAccountId"
                v-model="form.row!.basicMessage"
                placeholder="请输入"
                clearable
                class="small-input"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 6 }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="baiscAnnex" label-width="60px">
              <UploadFiles
                v-model:file-list="form.row!.baiscAnnex"
                height="140px"
                width="140px"
                :disabled="form.basicEdit  || !form.row!.basicAccountId"
              ></UploadFiles>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 现在: deptId === 2 售后才显示,管理员只能新增基础信息 -->
        <div class="add-process" v-if="!isShowAddProcess && deptId == 2">
          <el-button type="primary" @click="addProcess" class="btn">添加处理</el-button>
        </div>
        <template v-if="isShowAddProcess">
          <div class="flex flex-row w-full">
            <Header title="工单处理详情" class="header"></Header>
          </div>
          <template v-if="showDeptObj.afterSales">
            <p class="text-sm font-medium mt-3">售后部门：</p>
            <el-row :gutter="10" style="margin-top: 24px">
              <el-col :span="6">
                <el-form-item label="处理客服" prop="afterCustomerServiceId" label-width="120px">
                  <el-select
                    v-model="form!.row!.afterCustomerServiceId"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                    disabled
                  >
                    <template v-for="item2 in users" :key="item2.id">
                      <el-option :label="item2.name" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理时间" prop="afterHandleTime" label-width="120px">
                  <el-date-picker
                    disabled
                    v-model="form.row!.afterHandleTime"
                    type="date"
                    placeholder="请选择"
                    class="order-time"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理结果" prop="afterHandleResult" label-width="120px">
                  <el-select
                    v-model="form.row!.afterHandleResult"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                    :disabled="form.idEdit2"
                  >
                    <template v-for="item2 in handleTypeList" :key="item2.id">
                      <el-option :label="item2.label" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通知其他部门" prop="afterSalesInformDeptId" label-width="120px">
                  <el-select
                    v-model="form.row!.afterSalesInformDeptId"
                    placeholder="请选择"
                    class="order-input"
                    filterable
                    :disabled="form.idEdit2"
                  >
                    <template v-for="item in setTypeList" :key="item.id">
                      <el-option :label="item.label" :value="item.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="6">
                <el-form-item label="赔付金额" prop="afterSalesCompensationMoney" label-width="120px">
                  <el-input-number
                    :disabled="form.idEdit2"
                    v-model="form.row!.afterSalesCompensationMoney"
                    placeholder="请输入"
                    class="order-input"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="新密保手机" prop="afterNewSecurityPhone" label-width="120px">
                  <el-input
                    v-model="form.row!.afterNewSecurityPhone"
                    placeholder="请输入"
                    class="order-input"
                    :disabled="form.idEdit2"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="新密码" prop="afterNewSecurityPassword" label-width="120px">
                  <el-input
                    v-model="form.row!.afterNewSecurityPassword"
                    placeholder="请输入"
                    class="order-input"
                    :disabled="form.idEdit2"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通知他人" prop="afterSalesAssignUsers" label-width="120px">
                  <el-select
                    v-model="form!.row!.afterSalesAssignUsers"
                    multiple
                    filterable
                    class="small-input"
                    placeholder="请选择"
                    :disabled="form.idEdit2"
                  >
                    <el-option v-for="item2 in users" :key="item2.id" :label="item2.name" :value="String(item2.id)" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="basic-info">
              <el-col :span="24">
                <el-form-item label="售后备注" prop="afterSalesRemark" label-width="120px">
                  <el-input
                    :disabled="form.idEdit2"
                    v-model="form.row!.afterSalesRemark"
                    placeholder="请输入"
                    clearable
                    class="small-input"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 6 }"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="row-line">
              <el-col :span="6">
                <el-form-item label="附件" prop="afterAnnex" :label-width="120">
                  <div class="up-box">
                    <UploadFiles
                      v-model:file-list="form.row!.afterAnnex"
                      height="140px"
                      width="140px"
                      :disabled="form.idEdit2"
                    ></UploadFiles>
                    <div class="tip">可添加图片、视频</div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-if="showDeptObj.recycle">
            <p class="text-sm font-medium mt-3">回收部门：</p>
            <el-row :gutter="10" style="margin-top: 24px">
              <el-col :span="6">
                <el-form-item label="处理客服" prop="recycleHandleCustomerServiceId" label-width="120px">
                  <el-select
                    disabled
                    v-model="form.row!.recycleHandleCustomerServiceId"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                  >
                    <template v-for="item2 in users" :key="item2.id">
                      <el-option :label="item2.name" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理时间" prop="recycleHandleTime" label-width="120px">
                  <el-date-picker
                    disabled
                    v-model="form.row!.recycleHandleTime"
                    type="date"
                    placeholder="请选择"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理结果" prop="recycleHandleResult" label-width="120px">
                  <el-select
                    v-model="form.row!.recycleHandleResult"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                    :disabled="form.idEdit1"
                  >
                    <template v-for="item2 in handleTypeList" :key="item2.id">
                      <el-option :label="item2.label" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通知其他部门" prop="recycleInformDeptId" label-width="120px">
                  <el-select
                    v-model="form.row!.recycleInformDeptId"
                    placeholder="请选择"
                    class="order-input"
                    filterable
                    :disabled="form.idEdit1"
                  >
                    <template v-for="item in setTypeList" :key="item.id">
                      <el-option :label="item.label" :value="item.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通知他人" prop="recycleAssignUsers" label-width="120px">
                  <el-select
                    v-model="form!.row!.recycleAssignUsers"
                    multiple
                    filterable
                    class="small-input"
                    placeholder="请选择"
                    :disabled="form.idEdit1"
                  >
                    <el-option v-for="item2 in users" :key="item2.id" :label="item2.name" :value="String(item2.id)" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="row-line">
              <el-col :span="24">
                <el-form-item label="回收备注" prop="recycleRemark" label-width="120px">
                  <el-input
                    :disabled="form.idEdit1"
                    v-model="form.row!.recycleRemark"
                    placeholder="请输入"
                    clearable
                    class="small-input"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 6 }"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="附件" prop="recycleAnnex" :label-width="120">
                  <div class="up-box">
                    <UploadFiles
                      v-model:file-list="form.row!.recycleAnnex"
                      height="140px"
                      width="140px"
                      :disabled="form.idEdit1"
                    ></UploadFiles>
                    <div class="tip">可添加图片、视频</div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-if="showDeptObj.publish">
            <p class="text-sm font-medium mt-3">发布部门：</p>
            <el-row :gutter="10" style="margin-top: 24px">
              <el-col :span="6">
                <el-form-item label="处理客服" prop="publishHandleCustomerServiceId" label-width="120px">
                  <el-select
                    disabled
                    v-model="form.row!.publishHandleCustomerServiceId"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                  >
                    <template v-for="item2 in users" :key="item2.id">
                      <el-option :label="item2.name" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理时间" prop="publishHandleTime" label-width="120px">
                  <el-date-picker
                    disabled
                    v-model="form.row!.publishHandleTime"
                    type="date"
                    placeholder="请选择"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理结果" prop="publishHandleResult" label-width="120px">
                  <el-select
                    v-model="form.row!.publishHandleResult"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                    :disabled="form.idEdit3"
                  >
                    <template v-for="item2 in handleTypeList" :key="item2.id">
                      <el-option :label="item2.label" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通知其他部门" prop="publishInformDeptId" label-width="120px">
                  <el-select
                    v-model="form.row!.publishInformDeptId"
                    placeholder="请选择"
                    class="order-input"
                    filterable
                    :disabled="form.idEdit3"
                  >
                    <template v-for="item in setTypeList" :key="item.id">
                      <el-option :label="item.label" :value="item.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通知他人" prop="publishAssignUsers" label-width="120px">
                  <el-select
                    v-model="form!.row!.publishAssignUsers"
                    placeholder="请选择"
                    class="small-input"
                    multiple
                    filterable
                    :disabled="form.idEdit3"
                  >
                    <el-option v-for="item2 in users" :key="item2.id" :label="item2.name" :value="String(item2.id)" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="row-line">
              <el-col :span="24">
                <el-form-item label="发布备注" prop="publishRemark" label-width="120px">
                  <el-input
                    :disabled="form.idEdit3"
                    v-model="form.row!.publishRemark"
                    placeholder="请输入"
                    clearable
                    class="small-input"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 6 }"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="附件" prop="publishAnnex" :label-width="120">
                  <div class="up-box">
                    <UploadFiles
                      v-model:file-list="form.row!.publishAnnex"
                      height="140px"
                      width="140px"
                      :disabled="form.idEdit3"
                    ></UploadFiles>
                    <div class="tip">可添加图片、视频</div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-if="showDeptObj.sales">
            <p class="text-sm font-medium mt-3">销售部门：</p>
            <el-row :gutter="10" style="margin-top: 24px">
              <el-col :span="6">
                <el-form-item label="处理客服" prop="saleHandleCustomerService" label-width="120px">
                  <el-select
                    v-model="form.row!.saleHandleCustomerService"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                    disabled
                  >
                    <template v-for="item2 in users" :key="item2.id">
                      <el-option :label="item2.name" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理时间" prop="saleHandleTime" label-width="120px">
                  <el-date-picker
                    v-model="form.row!.saleHandleTime"
                    type="date"
                    placeholder="请选择"
                    style="width: 100%"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理结果" prop="saleHandleResult" label-width="120px">
                  <el-select
                    v-model="form.row!.saleHandleResult"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                    :disabled="form.idEdit0"
                  >
                    <template v-for="item2 in handleTypeList" :key="item2.id">
                      <el-option :label="item2.label" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通知其他部门" prop="salesInformDeptId" label-width="120px">
                  <el-select
                    v-model="form.row!.salesInformDeptId"
                    placeholder="请选择"
                    class="order-input"
                    filterable
                    :disabled="form.idEdit0"
                  >
                    <template v-for="item in setTypeList" :key="item.id">
                      <el-option :label="item.label" :value="item.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="6">
                <el-form-item label="赔付用户金额" prop="saleCompensationUserAmount" label-width="120px">
                  <el-input-number
                    :disabled="form.idEdit0"
                    v-model="form.row!.saleCompensationUserAmount"
                    placeholder="请输入"
                    class="order-input"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="给用户换号" prop="saleChangeUserNumber" label-width="120px">
                  <el-select
                    :disabled="form.idEdit0"
                    v-model="form.row!.saleChangeUserNumber"
                    placeholder="请选择"
                    class="order-input"
                    filterable
                  >
                    <!-- @change="onChangeAccount" -->
                    <template v-for="item in accountList" :key="item.id">
                      <el-option :label="item.accountNumber" :value="item.id">
                        <span style="float: left">{{ item.accountCode }}</span>
                        <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{
                          item.accountNumber
                        }}</span>
                      </el-option>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通知他人" prop="salesAssignUsers" label-width="120px">
                  <el-select
                    v-model="form!.row!.salesAssignUsers"
                    placeholder="请选择"
                    class="small-input"
                    multiple
                    filterable
                    :disabled="form.idEdit0"
                  >
                    <el-option v-for="item2 in users" :key="item2.id" :label="item2.name" :value="String(item2.id)" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="销售备注" prop="salesRemark" label-width="120px">
                  <el-input
                    :disabled="form.idEdit0"
                    v-model="form.row!.salesRemark"
                    placeholder="请输入"
                    clearable
                    class="small-input"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 6 }"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="附件" prop="saleannex" :label-width="120">
                  <div class="up-box">
                    <UploadFiles
                      v-model:file-list="form.row!.saleannex"
                      height="140px"
                      width="140px"
                      :disabled="form.idEdit0"
                    ></UploadFiles>
                    <div class="tip">可添加图片、视频</div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </template>
      </el-form>
    </div>
    <div class="foot-btn">
      <el-button @click="goBack" class="cancel">取消</el-button>
      <el-button type="primary" v-show="!form.isView" @click="handleSubmit" class="ok">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="AddTicket">
import { getBaseUrl, getDept, getHandleTypes, getOrderProblemTypes, getPublishPlatform } from "@/api/modules/dict";
import { getAllBaseAccount, getAllBranch, getUserOptions } from "@/api/modules/branch";
import UploadFiles from "@/components/Upload/Files.vue";
import AccountInfo from "./components/AccountInfo.vue";
import { ElMessage, FormInstance } from "element-plus";
import { generateCode } from "@/api/modules/account";
import { useUserStore } from "@/stores/modules/user";
import { ArrowLeft } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { useDateFormat } from "@vueuse/core";
import { SalesOrder } from "@/api/interface";
import { Account } from "@/typings/account";
import { useDict } from "@/hooks/useDict";
import { findFileType } from "@/utils";
import { Dict } from "@/typings/dict";
import {
  addAfterInfo,
  addPublishInfo,
  addRecycleInfo,
  addSalesInfo,
  addSalesList,
  detailSalesList,
  editfterInfo,
  editPublishInfo,
  editRecycleInfo,
  editSalesInfo,
  editSalesList,
  getProcessingDept
} from "@/api/modules/ticket";

const route = useRoute();
const router = useRouter();

const { whether, orderProblemTypes } = useDict("whether", "orderProblemTypes");

const userStore = useUserStore();

const id = computed(() => Number(route?.query?.id));
const accId = computed(() => Number(route?.query?.accId));
const isView = computed(() => !!route?.query?.isView);
const baseUrl = ref<string>();

// 普通账号
const deptId = computed(() => userStore.userInfo.deptId);

// 管理员
const isAdmin = computed(() => userStore.userInfo.isAdmin == "1");

const userId = computed(() => userStore.userInfo.id);

const basicRule = !id.value
  ? {
      basicOrderCode: [{ required: true, message: "必填项不能为空" }],
      basicOrderStar: [{ required: true, message: "必填项不能为空" }],
      basicAccountId: [{ required: true, message: "必填项不能为空" }],
      basicQuestionType: [{ required: true, message: "必填项不能为空" }],
      basicInsure: [{ required: true, message: "必填项不能为空" }],
      basicHandleTime: [{ required: true, message: "必填项不能为空" }]
    }
  : {};

const recycleRule =
  deptId.value == 1 && !isAdmin.value
    ? {
        recycleHandleCustomerServiceId: [{ required: true, message: "必填项不能为空" }],
        recycleHandleTime: [{ required: true, message: "必填项不能为空" }],
        recycleHandleResult: [{ required: true, message: "必填项不能为空" }],
        recycleAnnex: [{ required: true, message: "必填项不能为空" }],
        recycleResultRemark: [{ required: true, message: "必填项不能为空" }],
        recycleRemark: [{ required: true, message: "必填项不能为空" }]
      }
    : {};

const afterRule =
  deptId.value == 2 && !isAdmin.value
    ? {
        afterSpecHandleResult: [{ required: true, message: "必填项不能为空" }],
        afterSalesRemark: [{ required: true, message: "必填项不能为空" }],
        afterCustomerServiceId: [{ required: true, message: "必填项不能为空" }],
        afterHandleTime: [{ required: true, message: "必填项不能为空" }],
        afterHandleResult: [{ required: true, message: "必填项不能为空" }],
        afterAnnex: [{ required: true, message: "必填项不能为空" }]
      }
    : {};

const publishRule =
  deptId.value == 3 && !isAdmin.value
    ? {
        publishHandleCustomerServiceId: [{ required: true, message: "必填项不能为空" }],
        publishHandleTime: [{ required: true, message: "必填项不能为空" }],
        publishHandleResult: [{ required: true, message: "必填项不能为空" }],
        publishAnnex: [{ required: true, message: "必填项不能为空" }],
        publishResultRemark: [{ required: true, message: "必填项不能为空" }],
        publishRemark: [{ required: true, message: "必填项不能为空" }]
      }
    : {};

const saleRule =
  deptId.value == 0 && !isAdmin.value
    ? {
        saleHandleCustomerService: [{ required: true, message: "必填项不能为空" }],
        saleHandleTime: [{ required: true, message: "必填项不能为空" }],
        saleHandleResult: [{ required: true, message: "必填项不能为空" }],
        sallerName: [{ required: true, message: "必填项不能为空" }],
        sallerTime: [{ required: true, message: "必填项不能为空" }],
        sallerChannel: [{ required: true, message: "必填项不能为空" }],
        saleannex: [{ required: true, message: "必填项不能为空" }],
        salesResultRemark: [{ required: true, message: "必填项不能为空" }],
        salesRemark: [{ required: true, message: "必填项不能为空" }]
      }
    : {};

const rules = reactive({
  ...basicRule,
  ...afterRule,
  ...recycleRule,
  ...publishRule,
  ...saleRule
});

interface IAddOrder {
  isView: boolean; // 点击查看工单进来的, 没有编辑按钮
  basicEdit: boolean; // 基本信息只有新增能改
  idEdit0: boolean; // 销售组
  idEdit1: boolean; // 回收组
  idEdit2: boolean; // 售后组
  idEdit3: boolean; // 发布组
  row: Partial<SalesOrder.AddWorkOrder> & Partial<Account.IAccountItem>;
}

// 调用函数获取当前时间
const currentDateString = useDateFormat(new Date(), "YYYY-MM-DD HH:mm:ss");
const form = ref<IAddOrder>({
  // 编辑: 默认禁用
  isView: isView.value,
  basicEdit: !!id.value,
  idEdit0: !!id.value,
  idEdit1: !!id.value,
  idEdit2: !!id.value,
  idEdit3: !!id.value,
  row: {
    account: "",
    afterCustomerServiceId: userId.value,
    afterHandleTime: currentDateString.value,
    recycleHandleCustomerServiceId: userId.value,
    recycleHandleTime: currentDateString.value,
    publishHandleCustomerServiceId: userId.value,
    publishHandleTime: currentDateString.value,
    saleHandleCustomerService: userId.value,
    saleHandleTime: currentDateString.value
  }
});

const account = ref<Account.IAccountItem>();
// 是否转转
const isZZ = ref(false);

function onChangeAccount(e: any) {
  account.value = accountList.value.find(item => item.id == e);

  form.value.row.account = account.value?.account;

  if (account.value?.salePlatformId) {
    const _isZZ = account.value.salePlatformId >= 16 || account.value.salePlatformId <= 22;
    // 是转转
    isZZ.value = _isZZ;
    form.value.row.basicHandleTime = _isZZ ? 4 : 7;
  } else {
    // 没有出售默认是4天
    form.value.row.basicHandleTime = 4;
  }
}

// 返显数据处理
let afterInfo: any = {};
let saleInfo: any = {};
let publishInfo: any = {};
let recycleInfo: any = {};
const getDetailInfo = async (id: any) => {
  if (!id) {
    return false;
  }
  const { data } = await detailSalesList(id);
  if (data) {
    afterInfo = data.detail.find(item => item.handleDept == 1);
    saleInfo = data.detail.find(item => item.handleDept == 2);
    publishInfo = data.detail.find(item => item.handleDept == 3);
    recycleInfo = data.detail.find(item => item.handleDept == 4);
    // 基本
    const basicObj = {
      basicOrderCode: data?.orderCode,
      basicAccountId: data?.accountId,
      basicQuestionType: data?.problemTypeId,
      basicInsure: data?.insure,
      basicOrderStar: data?.orderStar,
      basicHandleTime: data?.handleTime,
      basicMessage: data?.remark,
      baiscAnnex: (data?.assets || []).map((imgItem: any) => {
        return {
          path: baseUrl.value + imgItem.path,
          url: baseUrl.value + imgItem.path,
          id: imgItem.id,
          type: findFileType(imgItem.path)
        };
      })
    };
    // 售后
    let afterObj = {};

    if (afterInfo) {
      afterObj = {
        afterCustomerServiceId: afterInfo?.afterSaleServiceId || userId.value,
        afterHandleTime: afterInfo?.afterSaleHandleTime || currentDateString.value,
        afterHandleResult: afterInfo?.afterSaleResultId,
        afterSpecHandleResult: afterInfo?.afterSalesResultRemark,
        afterSalesCompensationMoney: afterInfo?.afterSalesCompensationMoney,
        afterNewSecurityPhone: afterInfo?.newSecretCellPhone,
        afterNewSecurityPassword: afterInfo?.newPassword,
        afterSalesAssignUsers: afterInfo?.afterSalesAssignUsers,
        afterSalesRemark: afterInfo?.afterSalesRemark,
        afterSalesInformDeptId: afterInfo?.afterSalesInformDeptId,
        afterAnnex: (afterInfo?.afterSaleAssets || [])?.map((imgItem: any) => {
          return {
            path: baseUrl.value + imgItem.path,
            url: baseUrl.value + imgItem.path,
            id: imgItem.id,
            type: findFileType(imgItem.path)
          };
        })
      };
    } else {
      afterObj = {
        afterCustomerServiceId: userId.value,
        afterHandleTime: currentDateString.value
      };
    }

    // 回收
    let recycleObj = {};
    if (recycleInfo) {
      recycleObj = {
        recycleHandleCustomerServiceId: recycleInfo?.recycleServiceId || userId.value,
        recycleHandleTime: recycleInfo?.recycleHandleTime || currentDateString.value,
        recycleHandleResult: recycleInfo?.recycleResultId,
        recycleResultRemark: recycleInfo?.recycleResultRemark,
        recycleRemark: recycleInfo?.recycleRemark,
        recycleInformDeptId: recycleInfo?.recycleInformDeptId,
        recycleAssignUsers: recycleInfo?.recycleAssignUsers,
        recycleAnnex: (recycleInfo?.recycleAssets || [])?.map((imgItem: any) => {
          return {
            path: baseUrl.value + imgItem.path,
            url: baseUrl.value + imgItem.path,
            id: baseUrl.value + imgItem.id,
            type: findFileType(imgItem.path)
          };
        })
      };
    } else {
      recycleObj = {
        recycleHandleCustomerServiceId: userId.value,
        recycleHandleTime: currentDateString.value
      };
    }
    // 发布
    let publishObj = {};
    if (publishInfo) {
      publishObj = {
        publishHandleCustomerServiceId: publishInfo.publishServiceId || userId.value,
        publishHandleTime: publishInfo.publishHandleTime || currentDateString.value,
        publishHandleResult: publishInfo?.publishResultId,
        publishResultRemark: publishInfo?.publishResultRemark,
        publishRemark: publishInfo?.publishRemark,
        publishInformDeptId: publishInfo?.publishInformDeptId,
        publishAssignUsers: publishInfo?.publishAssignUsers,
        publishAnnex: (publishInfo?.publishAssets || [])?.map((imgItem: any) => {
          return {
            path: baseUrl.value + imgItem.path,
            url: baseUrl.value + imgItem.path,
            id: baseUrl.value + imgItem.id,
            type: findFileType(imgItem.path)
          };
        })
      };
    } else {
      publishObj = {
        publishHandleCustomerServiceId: userId.value,
        publishHandleTime: currentDateString.value
      };
    }
    // 销售
    let saleObj = {};
    if (saleInfo) {
      saleObj = {
        saleHandleCustomerService: saleInfo?.salesServiceId || userId.value,
        saleHandleTime: saleInfo?.salesHandleTime || currentDateString.value,
        saleHandleResult: saleInfo?.salesResultId,
        saleCompensationUserMoney: saleInfo?.salesCompensationMoney,
        saleChangeUserNumber: saleInfo?.newAccountId,
        salesResultRemark: saleInfo?.salesResultRemark,
        salesRemark: saleInfo?.salesRemark,
        salesInformDeptId: saleInfo?.salesInformDeptId,
        salesAssignUsers: saleInfo?.salesAssignUsers,
        saleannex: (saleInfo?.salesAssets || [])?.map((imgItem: any) => {
          return {
            path: baseUrl.value + imgItem.path,
            url: baseUrl.value + imgItem.path,
            id: baseUrl.value + imgItem.id,
            type: findFileType(imgItem.path)
          };
        })
      };
    } else {
      saleObj = {
        saleHandleCustomerService: userId.value,
        saleHandleTime: currentDateString.value
      };
    }
    form.value.row = {
      ...basicObj,
      ...afterObj,
      ...publishObj,
      ...recycleObj,
      ...saleObj
    } as unknown as SalesOrder.AddWorkOrder;

    // 账号销售数据信息默认
    onChangeAccount(data.accountId);
  }
};

// 账号管理-创建工单点过来
const getAccountInfo = () => {
  if (!accId.value) {
    return;
  }
  form.value.row!.basicAccountId = accId.value;
  onChangeAccount(accId.value);
};

// 获取编号
const getBasicOrderCode = async () => {
  // 新增-没id
  if (!id.value) {
    const { data: code } = await generateCode("TS");
    form.value.row!.basicOrderCode = code;
  }
};

// 门店列表
type BranchObj = { branchName: string; id: number };
const branchList = ref<BranchObj[]>([]);
const getBranchList = async () => {
  const { data } = await getAllBranch();
  branchList.value = data;
};

// 账号列表
type AccountObj = { accountNumber: string; accountCode: string; id: number };
const accountList = ref<AccountObj[]>([]);
const getAllAccountList = async () => {
  const { data } = await getAllBaseAccount({});
  accountList.value = data;
};

// 数据字典-处理结果
const handleTypeList = ref<Dict.IDataItem[]>([]);
const getHandleTypesFun = async () => {
  const { data } = await getHandleTypes();
  handleTypeList.value = data;
};

// 数据字典-部门列表
const setTypeList = ref<Dict.IDataItem[]>([]);
const getSetTypeFun = async () => {
  const { data } = await getDept();
  setTypeList.value = data;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const {
        basicOrderCode,
        basicAccountId,
        basicQuestionType,
        basicInsure,
        basicHandleTime,
        basicMessage,
        baiscAnnex,
        basicOrderStar,
        afterHandleResult,
        afterSalesCompensationMoney,
        afterNewSecurityPhone,
        afterNewSecurityPassword,
        afterSalesAssignUsers,
        afterSalesRemark,
        afterAnnex,
        recycleHandleResult,
        recycleRemark,
        recycleAnnex,
        recycleInformDeptId,
        recycleAssignUsers,
        publishHandleResult,
        publishRemark,
        publishAnnex,
        saleHandleResult,
        saleChangeUserNumber,
        saleannex,
        salesRemark,
        afterSalesInformDeptId,
        salesInformDeptId,
        salesAssignUsers,
        publishInformDeptId,
        publishAssignUsers,
        saleCompensationUserMoney
      } = form.value.row;
      // 工单的记录id
      let idObj = {};
      if (id.value) {
        idObj = { id };
      }
      const baseData = {
        ...idObj,
        orderCode: basicOrderCode,
        accountId: basicAccountId,
        problemTypeId: basicQuestionType,
        insure: basicInsure,
        orderStar: basicOrderStar,
        handleTime: basicHandleTime,
        remark: basicMessage,
        assets: baiscAnnex?.map(item => {
          return {
            path: item?.response?.path || item.url || item.path,
            id: item.id || item.uid
          };
        })
      };
      const baseApi = id.value ? editSalesList : addSalesList;
      const afterApi = afterInfo?.id ? editfterInfo : addAfterInfo;
      const salesApi = saleInfo?.id ? editSalesInfo : addSalesInfo;
      const recycleApi = recycleInfo?.id ? editRecycleInfo : addRecycleInfo;
      const publishApi = publishInfo?.id ? editPublishInfo : addPublishInfo;
      // 基本信息
      // 只能新增,不能修改 id为空才能调用
      const { data }: any = !id.value && (await baseApi!(baseData));

      // 以下只能改当前账号的
      // 回收信息
      (deptId.value == 1 || isAdmin.value) &&
        recycleHandleResult &&
        (await recycleApi({
          id: recycleInfo?.id || -1,
          orderId: recycleInfo?.id || data?.id || id.value, // 工单id
          recycleResultId: recycleHandleResult, // 回收处理结果
          // recycleResultRemark: recycleResultRemark, // 销售处理结果备注
          recycleRemark: recycleRemark, // 发布备注
          recycleInformDeptId: recycleInformDeptId,
          recycleAssignUsers: recycleAssignUsers,
          recycleAssets: recycleAnnex?.map(item => {
            return {
              path: item?.response?.path || item.url || item.path,
              id: item.id || item.uid
            };
          }) // 发布提交资源
        }));

      // 售后信息
      (deptId.value == 2 || isAdmin.value) &&
        afterHandleResult &&
        (await afterApi({
          id: afterInfo?.id || -1,
          orderId: afterInfo?.id || data?.id || id.value,
          afterSaleResultId: afterHandleResult, // 售后处理结果
          // afterSalesResultRemark: afterSpecHandleResult, // 售后处理结果备注(这个只有当处理结果类型为其他的时候才有)
          afterSalesCompensationMoney, // 售后赔付金额
          newSecretCellPhone: afterNewSecurityPhone, // 新密保手机
          newPassword: afterNewSecurityPassword, // 新密码
          afterSalesAssignUsers,
          afterSalesRemark, // 售后备注
          afterSalesInformDeptId,
          afterSaleAssets: afterAnnex?.map(item => {
            return {
              path: item?.response?.path || item.url || item.path,
              id: item.id || item.uid
            };
          }) // 售后提交资源
        }));

      // 发布信息
      (deptId.value == 3 || isAdmin.value) &&
        publishHandleResult &&
        (await publishApi({
          id: publishInfo?.id || -1,
          orderId: publishInfo?.id || data?.id || id.value, // 工单id
          publishResultId: publishHandleResult, // 发布处理结果
          // publishResultRemark: publishResultRemark, // 销售处理结果备注
          publishRemark: publishRemark, // 发布备注
          publishInformDeptId: publishInformDeptId,
          publishAssignUsers: publishAssignUsers,
          publishAssets: publishAnnex?.map(item => {
            return {
              path: item?.response?.path || item.url || item.path,
              id: item.id || item.uid
            };
          }) // 发布提交资源
        }));

      // 销售信息
      (deptId.value == 0 || isAdmin.value) &&
        saleHandleResult &&
        (await salesApi({
          id: saleInfo?.id || -1,
          orderId: saleInfo?.id || data?.id || id.value, // 工单id
          salesResultId: saleHandleResult, // 销售处理结果
          salesCompensationMoney: saleCompensationUserMoney, // 赔付用户金额
          newAccountId: saleChangeUserNumber, // 给用户换号: 新账号id
          // salesResultRemark: salesResultRemark, // 销售处理结果备注
          salesRemark: salesRemark, // 销售备注
          salesInformDeptId: salesInformDeptId,
          salesAssignUsers: salesAssignUsers,
          salesAssets: saleannex?.map(item => {
            return {
              path: item?.response?.path || item.url || item.path,
              id: item.id || item.uid
            };
          }) // 销售提交资源
        }));

      ElMessage.success({ message: `操作成功！` });
      goBack();
    } catch (error) {
      console.log(error);
    }
  });
};

const goBack = () => router.go(-1);

const edit = () => {
  if (isAdmin.value) {
    // 管理员能改全部
    form.value.basicEdit = false;
    form.value.idEdit0 = false;
    form.value.idEdit1 = false;
    form.value.idEdit2 = false;
    form.value.idEdit3 = false;
  } else {
    // 普通用户自能改自己所在组
    form.value[`idEdit${deptId.value}`] = false;
  }
};

const addProcess = () => {
  isShowAddProcess.value = true;
  if (isAdmin.value) return;
  // 新增 按照 当前登录的人判断
  showDeptObj.value = {
    sales: deptId.value == 0,
    recycle: deptId.value == 1,
    afterSales: deptId.value == 2,
    publish: deptId.value == 3
  };
};

const users = ref<any[]>([]);

// 回显用户下拉和订单数据
const initOrderData = async () => {
  const { data: url } = await getBaseUrl();
  baseUrl.value = url;

  // 默认时效4
  // form.value.row.basicHandleTime = 4;
  // 不是管理员不可编辑工单星级 就默认星级4 管理员可以无限加
  form.value.row.basicOrderStar = 1;
  const { data } = await getUserOptions();
  await getDetailInfo(id.value);
  getAccountInfo();
  await getBasicOrderCode();
  users.value = data.map(item => ({ ...item, id: Number(item.id) }));
};

const chanelMap = ref();

async function getChanelMap() {
  const { data }: any = await getPublishPlatform();
  chanelMap.value = (data?.publishPlatform || []).reduce(
    (acc: { [x: string]: any }, curr: { value: string | number; label: any }) => {
      acc[curr.value] = curr.label;
      return acc;
    },
    {}
  );
}

const isShowAddProcess = ref(false);

const showDeptObj = ref({ afterSales: true, sales: true, publish: true });

async function getProcessingDeptFun() {
  if (id.value) {
    const { afterSales, sales, publish, recycle }: any = await getProcessingDept(id.value);
    showDeptObj.value = { afterSales, sales, publish, recycle };
    // 编辑 根据后台接口显示
    if (afterSales || sales || publish || recycle) {
      isShowAddProcess.value = true;
    }
  } else {
    if (isAdmin.value) {
      isShowAddProcess.value = false;
    } else {
      // 新增 当前登录的用户不在那三个中 添加处理按钮不显示(普通用户)
      if (!id.value && [0, 2, 3].includes(deptId.value)) {
        isShowAddProcess.value = false;
      }
    }
  }
}

// 这里不要该用onMounted， 会有问题
watch(
  route,
  async _route => {
    if (!_route) return;
    await getBranchList();
    await getAllAccountList();
    await getHandleTypesFun();
    await getSetTypeFun();
    await getChanelMap();
    await getProcessingDeptFun();
    await initOrderData();
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.el-drawer__header {
  position: relative;

  button {
    position: absolute;
    right: 20px;
  }
}

.rule-form-full {
  height: 100%;
}

.rule-form {
  :deep(.el-form-item__label) {
    justify-content: center;
  }

  .row-line {
    border-bottom: 1px solid #ebebeb;
  }

  .basic-info {
    margin: 10px 0;
    font-size: 14px;
    color: #7f7f7f;
  }

  .add-process {
    display: flex;
    justify-content: center;
    width: 100%;

    .btn {
      width: 182px;
      height: 40px;
    }
  }

  .up-box {
    display: flex;
    flex-direction: column;
    color: #dfdfdf;

    .tip {
      margin-top: -10px;
    }
  }
}

.back-btn {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.content-box {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding: 20px;
  background-color: white;
  border-radius: 6px;

  .hide-scroll::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.card {
  background-color: var(--el-bg-color-page);
  padding: 10px 0 0 10px;
}

.rule-form {
  width: 100%;
}

.foot-btn {
  z-index: 999;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  border-top: 1px solid #ebebeb;
  background-color: white;
  padding: 10px 20px 10px 0;
  overflow: hidden;

  .cancel {
    width: 112px;
    height: 38px;
  }

  .ok {
    width: 112px;
    height: 38px;
  }
}

.order-input,
.el-input {
  width: 100% !important;
}

.el-select {
  width: 100% !important;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

.not-data {
  margin-top: 10px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}
</style>
