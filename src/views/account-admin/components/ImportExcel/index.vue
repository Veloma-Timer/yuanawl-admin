<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`${parameter.title}`"
    :destroy-on-close="true"
    width="580px"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form class="drawer-multiColumn-form" label-width="100px">
      <el-form-item  label="模板下载 :">
        <el-button type="primary" :icon="Download" @click="downloadTemp">点击下载</el-button>
      </el-form-item>
      <el-form-item  label="文件上传 :">
        <!--<el-button type="primary" @click="openSelectFileDialog">点击上传</el-button>-->
        <el-upload
          action="#"
          class="upload"
          :drag="true"
          :multiple="true"
          :show-file-list="true"

          :accept="parameter.fileType!.join(',')"
        >
          <!--:limit="excelLimit"-->
          <!--:http-request="uploadExcel"-->
          <!--:before-upload="beforeExcelUpload"-->
          <!--:on-exceed="handleExceed"-->
          <!--:on-success="excelUploadSuccess"-->
          <!--:on-error="excelUploadError"-->
          <slot name="empty">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </slot>
          <template #tip>
            <slot name="tip">
              <div class="el-upload__tip">请上传 .xls , .xlsx 标准格式文件，文件最大为 {{ parameter.fileSize }}M</div>
            </slot>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts" name="ImportExcel">
import { ref } from "vue";
import { useDownload } from "@/hooks/useDownload";
import { Download } from "@element-plus/icons-vue";
// import { ElNotification, UploadRequestOptions, UploadRawFile } from "element-plus";
// import { fs, dialog } from "@tauri-apps/api";

export interface ExcelParameterProps {
  title: string; // 标题
  fileSize?: number; // 上传文件的大小
  status?: false; // 动态切换 下载/上传
  fileType?: File.ExcelMimeType[]; // 上传文件的类型
  tempApi?: (params: any) => Promise<any>; // 下载模板的Api
  updateApi?: (params: any) => Promise<any>; // 批量导入的Api
  getTableList?: () => void; // 获取表格数据的Api
}

// 是否覆盖数据
const isCover = ref(false);
// dialog状态
const dialogVisible = ref(false);
// 父组件传过来的参数
const parameter = ref<ExcelParameterProps>({
  title: "",
  fileSize: 40,
  fileType: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
});

// 接收父组件参数
const acceptParams = (params: ExcelParameterProps & any) => {
  parameter.value = { ...parameter.value, ...params };
  dialogVisible.value = true;
};

// Excel 导入模板下载
const downloadTemp = async () => {
  if (!parameter.value.tempApi) return;
  await useDownload(parameter.value.tempApi, `${parameter.value.title}`);
  dialogVisible.value = false;
};

const openSelectFileDialog = async () => {
  // const filepath = await dialog.open({
  //   multiple: false,
  //   title: "选择文件"
  // });

  const formData = new FormData();
  // const fileBytes = await fs.readBinaryFile(filepath as string);
  // formData.append(
  //   "file",
  //   new Blob([fileBytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
  //   filepath as string
  // );

  await parameter.value.updateApi!(formData);
  parameter.value.getTableList && parameter.value.getTableList();
  dialogVisible.value = false;
};

// 文件上传
// const uploadExcel = async (param: UploadRequestOptions) => {
//   const excelFormData = new FormData();
//   excelFormData.append("file", param.file);
//   excelFormData.append("isCover", isCover.value as unknown as Blob);
//   await parameter.value.updateApi!(excelFormData);
//   parameter.value.getTableList && parameter.value.getTableList();
//   dialogVisible.value = false;
// };

/**
 * @description 文件上传之前判断
 * @param file 上传的文件
 * */
// const beforeExcelUpload = (file: UploadRawFile) => {
//   const isExcel = parameter.value.fileType!.includes(file.type as File.ExcelMimeType);
//   const fileSize = file.size / 1024 / 1024 < parameter.value.fileSize!;
//   if (!isExcel)
//     ElNotification({
//       title: "温馨提示",
//       message: "上传文件只能是 xls / xlsx 格式！",
//       type: "warning"
//     });
//   if (!fileSize)
//     setTimeout(() => {
//       ElNotification({
//         title: "温馨提示",
//         message: `上传文件大小不能超过 ${parameter.value.fileSize}MB！`,
//         type: "warning"
//       });
//     }, 0);
//   return isExcel && fileSize;
// };

// 文件数超出提示
// const handleExceed = () => {
//   ElNotification({
//     title: "温馨提示",
//     message: "最多只能上传一个文件！",
//     type: "warning"
//   });
// };

// 上传错误提示
// const excelUploadError = () => {
//   ElNotification({
//     title: "温馨提示",
//     message: `批量添加${parameter.value.title}失败，请您重新上传！`,
//     type: "error"
//   });
// };

// 上传成功提示
// const excelUploadSuccess = () => {
//   ElNotification({
//     title: "温馨提示",
//     message: `批量添加${parameter.value.title}成功！`,
//     type: "success"
//   });
// };

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
