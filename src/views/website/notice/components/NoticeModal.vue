<template>
  <Dialog v-model="visible" width="65%" :destroy-on-close="true" :title="title">
    <el-form
      ref="formRef"
      class="h-full"
      label-width="110px"
      label-suffix=" :"
      :rules="rules"
      :model="form"
      :hide-required-asterisk="isView"
    >
      <div class="flex flex-col h-full">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请填写标题" clearable />
        </el-form-item>
        <el-form-item label="公告类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择公告类型" class="w-full">
            <el-option v-for="{ label, value } of notice_type" :key="value" :label="label" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <UploadImg v-model:image-url="form.cover" width="135px" height="135px" :file-size="3">
            <template #empty>
              <el-icon>
                <Plus />
              </el-icon>
              <span>请上传封面</span>
            </template>
          </UploadImg>
        </el-form-item>
        <el-form-item class="flex-1" label="内容" prop="content">
          <WangEditor v-model:value="form.content" height="200px" />
        </el-form-item>
        <el-form-item label="状态" prop="address">
          <el-radio-group v-model="form.status">
            <el-radio v-for="({ label, value }, index) of common_status" :key="index" :label="value">{{ label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="置顶" prop="isAffixTop">
          <el-radio-group v-model="form.isAffixTop">
            <el-radio v-for="({ label, value }, index) of common_yes_no" :key="index" :label="value">{{ label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button v-show="!isView" @click="setVisible(false)">取消</el-button>
      <el-button v-show="!isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts" name="NoticeModal">
import WangEditor from "@/components/WangEditor/index.vue";
import { ElMessage, FormInstance } from "element-plus";
import Dialog from "@/components/Dialog/index.vue";
import UploadImg from "@/components/Upload/Img.vue";
import { reactive, ref, toRefs } from "vue";
import { Website } from "@/typings/website";
import { Dict } from "@/typings/dict";

interface IState {
  title: string;
  isView: boolean;
  form: Website.Notice;
  common_status: Dict.IDataItem[];
  common_yes_no: Dict.IDataItem[];
  notice_type: Dict.IDataItem[];
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const rules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
  cover: [{ required: true, message: "请上传封面", trigger: "change" }],
  type: [{ required: true, message: "请选择公告类型", trigger: "change" }]
};

const visible = ref(false);

const formRef = ref<FormInstance>();

const state = reactive<IState>({
  isView: false,
  title: "",
  common_status: [],
  common_yes_no: [],
  notice_type: [],
  form: {} as Website.Notice
});

const { form, title, isView, common_status, common_yes_no, notice_type } = toRefs(state);

const setVisible = (val: boolean) => {
  visible.value = val;
};

// 接收父组件传过来的参数
const acceptParams = (params: IState) => {
  Object.assign(state, params);
  setVisible(true);
};

// 提交数据（新增/编辑）
const handleSubmit = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await state.api!(form.value);
      ElMessage.success({ message: `${title.value}成功！` });
      state.getTableList!();
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
