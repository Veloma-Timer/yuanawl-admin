import { IAccountType } from "@/typings";
import http from "@/api";

const baseUrl: string = "/base_account_type";
// 新增分类
export const addAccout = (params: any) => {
  return http.post(`${baseUrl}`, params);
};
// 修改分类
export const setAccout = (params: any) => {
  return http.put(`${baseUrl}/${params.id}`, params);
};
// 获取分类列表
export const getAccoutList = (params: any) => {
  return http.get(baseUrl, params);
};

// 删除分类
export const deleteAccout = (ids: string[]) => {
  return http.delete(`${baseUrl}`, { ids });
};
// 获取所有
export const getAllList = (): Promise<{ data: IAccountType[] }> => {
  return http.get(`${baseUrl}/all`, {}, { noLoading: true });
};
