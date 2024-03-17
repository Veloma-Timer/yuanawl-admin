<template>
  <el-dialog
    v-model="drawerVisible"
    :title="`${drawerProps.title}`"
    width="35%"
    top="12vh"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="ruleFormRef"
      label-width="60px"
      label-suffix=" :"
      :rules="rules"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          v-model="drawerProps.row!.desc"
          placeholder="备注"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="picture">
        <div v-if="drawerProps.row.picture" class="relative">
          <el-image
            style="width: 100px; height: 100px"
            :src="drawerProps.row.picture"
            :preview-src-list="[drawerProps.row.picture]"
          >
          </el-image>
          <el-popconfirm title="确认删除吗?" @confirm="onDelPicture">
            <template #reference>
              <div
                class="backdrop-blur-xl absolute top-0 right-0 bg-white/30 hover:bg-black/10 shadow-lg rounded-full w-[20px] h-[20px] flex justify-center items-center cursor-pointer"
              >
                <el-icon><Close /></el-icon>
              </div>
            </template>
          </el-popconfirm>
        </div>

        <el-button v-else @click="onUpload">点击上传</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import useUploader from "@/hooks/useUploader";
import { OSS_PREFIX } from "@/config/index";
import { App } from "@/typings/app";

const rules = reactive({
  name: [{ required: true, message: "请输入名称" }],
  picture: [{ required: true, message: "请上传图片" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<App.IFirstScreenInstance>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const uploader = useUploader();

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
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const onUpload = async () => {
  const { data } = await uploader.uploadStream();
  drawerProps.value.row.picture = OSS_PREFIX + data.fileName;
};

const onDelPicture = () => {
  drawerProps.value.row.picture = "";
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
