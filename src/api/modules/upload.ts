import { Upload } from "@/api/interface";
import http from "@/api";

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(`/sys_assets/upload`, params);
};

// 图片删除
export const deletedImg = (params: number) => {
  return http.delete(`/sys_assets/${params}`);
};


// oss图片上传(base64)
export const uploadBase64ImgOss = (fileBase: string) => {
  return http.post<{ fileName: string }>(`/sys_assets/upload/oss`, { fileBase });
};

// oss图片上传(文件流)
export const uploadStreamImgOss = (file: Blob) => {
  const formData = new FormData();

  formData.append("file", file);

  return http.post<{ fileName: string }>("/sys_assets/upload/oss/stream", formData);
};
