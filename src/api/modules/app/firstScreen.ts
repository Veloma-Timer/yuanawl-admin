import { App } from "@/typings/app";
import http from "@/api";

const baseUrl = "/app_first_screen";

// 查询列表
export const getFirstScreenList = (params: App.IFirstScreenQuery) => {
  return http.get<IListPure<App.IFirstScreenInstance>>(baseUrl, params);
};

// 新增
export const addFirstScreenItem = (params: App.IFirstScreenInstance) => {
  return http.post(baseUrl, params);
};

// 删除
export const delFirstScreenItem = (ids: number[]) => {
  return http.delete(`${baseUrl}`, { ids });
};

// 启用&禁用
export const updateFirstScreenStatus = (id: number, status: "1" | "0") => {
  return http.put(`${baseUrl}/${id}`, { status });
};
