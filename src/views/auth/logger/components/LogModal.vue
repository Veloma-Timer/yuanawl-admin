<template>
  <el-dialog
    v-model="visible"
    width="65%"
    :destroy-on-close="true"
    :title="`${title}日志`"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="formRef" label-width="110px" label-suffix=" :" :model="form" :hide-required-asterisk="isView">
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作模块" prop="operModule">
            {{ form.operModule }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求地址" prop="requestUrl">{{ form.requestUrl }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作人员" prop="operName">
            {{ form.operName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求方式" prop="requestMethod">
            {{ form.requestMethod }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="请求参数" prop="requestParams">
            <div class="h-[200px] overflow-auto border rounded-sm p-2">
              {{ form.requestParams }}
            </div>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="浏览器" prop="operBrowser">
            {{ form.operBrowser }}
          </el-form-item>
        </el-col>
        <el-col v-if="form.dataChange">
          <el-form-item label="数据变更" prop="dataChange">
            <div class="h-[200px] overflow-auto border rounded-sm p-2">
              {{ form.dataChange }} {{ "  ==>  " }} {{ form.jsonResult }}
            </div>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="返回参数" prop="jsonResult">
            <div class="h-[200px] overflow-auto border rounded-sm p-2">{{ form.jsonResult }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作结果" prop="status">
            <el-tag :type="form.status == '1' ? 'success' : 'danger'">
              {{ oper_status.find(item => item.value == form.status)?.label }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作时间" prop="createdTime">
            {{ useDateFormat(form.createdTime, "YYYY-MM-DD HH:mm:ss").value }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="setVisible(false)">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="LoggerModal">
import { reactive, ref, toRefs } from "vue";
import { useDateFormat } from "@vueuse/core";
import { FormInstance } from "element-plus";
import { Dict } from "@/typings/dict";
import { Logger } from "@/typings/logger";

interface IState {
  title: string;
  isView: boolean;
  form: Partial<Logger.Item>;
  oper_status: Dict.IDataItem[];
}

const visible = ref(false);

const formRef = ref<FormInstance>();

const state = reactive<IState>({
  isView: false,
  title: "",
  oper_status: [],
  form: {} as Logger.Item
});

const { form, title, isView, oper_status } = toRefs(state);

const setVisible = (val: boolean) => {
  visible.value = val;
};

// 接收父组件传过来的参数
const acceptParams = (params: IState) => {
  Object.assign(state, params);
  setVisible(true);
};
defineExpose({
  acceptParams
});
</script>
