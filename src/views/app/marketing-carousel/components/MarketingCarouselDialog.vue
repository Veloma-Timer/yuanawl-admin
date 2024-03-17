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
      label-width="90px"
      label-suffix=" :"
      :rules="rules"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="drawerProps.row!.sort" placeholder="排序" clearable />
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
      <el-form-item label="关联页面" prop="pagePath">
        <el-select-v2 v-model="drawerProps.row!.pagePath" :options="props.appPaths" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="图片" prop="picture">
        <div v-if="drawerProps.row.picture" class="relative">
          <el-image
            ref="picture"
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
import { getTextColorFromBackgroundColor } from "@/utils";
import { ElImage, ElMessage, FormInstance } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import useUploader from "@/hooks/useUploader";
import { OSS_PREFIX } from "@/config";
import { App } from "@/typings/app";
// @ts-ignore
import analyze from "rgbaster";

const props = defineProps<{
  appPaths: { label: string; value: number | string; path: string }[];
}>();

const rules = {
  name: [{ required: true, message: "请输入名称" }],
  picture: [{ required: true, message: "请上传图片" }],
  pagePath: [{ required: true, message: "请选择关联页面" }]
};

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<App.IMarketingCarouselInstance>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const picture = ref<InstanceType<typeof ElImage>>();
const uploader = useUploader();
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  ruleFormRef.value?.resetFields();
};

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
  const { data, blobUrl } = await uploader.uploadStream();
  const uri = OSS_PREFIX + data.fileName;

  const result = await analyze(blobUrl);

  const primary = result[0].color;

  drawerProps.value.row.picture = uri;
  drawerProps.value.row.textColor = getTextColorFromBackgroundColor(primary);
  drawerProps.value.row.bgColor = primary;
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
