import {PORT3} from "@/api/config/servicePort";
import http from "@/api";

const baseUrl: string = PORT3 + "/base_tel";
// 新增分类
export const addPhone = (params: any) => {
  return http.post(`${baseUrl}`, params);
};
// 修改分类
export const setPhone = (params: any) => {
  return http.put(`${baseUrl}/${params.id}`, params);
};
// 获取分类列表
export const getPhoneList = (params: any) => {
  return http.get(baseUrl, params);
};

// 删除分类
export const deletePhone = (ids: string[]) => {
  return http.delete(`${baseUrl}`, {ids});
};
// 手机号模块
export const phoneTemplate = () => {
  return http.downloadGet(`${PORT3}/static/template/tel.xlsx`)
};

// 手机号导入
export const phoneUpload = (file: FormData) => {
  return http.post(`${baseUrl}/upload`, file);
};

// 手机号导出
export const phoneExport = (ids: string[]) => {
  return http.post(`${PORT3}/base_tel/export`, {ids});
};
