import { Upload } from "@/api/interface";
import { PORT1, PORT3 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT3 + `/sys_assets/upload`, params);
};

// 图片删除
export const deletedImg = (params: number) => {
  return http.delete(PORT3 + `/sys_assets/${params}`);
};

// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT1 + `/file/upload/video`, params);
};

// oss图片上传(base64)
export const uploadBase64ImgOss = (fileBase: string) => {
  return http.post<{ fileName: string }>(PORT3 + `/sys_assets/upload/oss`, { fileBase });
};

// oss图片上传(文件流)
export const uploadStreamImgOss = (file: Blob) => {
  const formData = new FormData();

  formData.append("file", file);

  return http.post<{ fileName: string }>(PORT3 + "/sys_assets/upload/oss/stream", formData);
};
