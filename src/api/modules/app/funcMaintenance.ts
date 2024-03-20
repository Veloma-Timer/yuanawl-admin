import { App } from "@/typings/app";
import http from "@/api";

const baseUrl = "/app_func_maintenance";

// 查询列表
export const getFuncMaintenanceList = (params: App.IFuncMaintenanceInstance) => {
  return http.get<IListPure<App.IFuncMaintenanceInstance>>(baseUrl, params);
};

// 新增
export const addFuncMaintenanceItem = (params: App.IFuncMaintenanceInstance) => {
  return http.post(baseUrl, params);
};

// 删除
export const delFuncMaintenanceItem = (ids: number[]) => {
  return http.delete(`${baseUrl}`, { ids });
};

// 启用&禁用
export const updateFuncMaintenanceStatus = (id: number, status: "1" | "0") => {
  return http.put(`${baseUrl}/${id}`, { status });
};

// 修改
export const editFuncMaintenanceItem = (params: App.IFuncMaintenanceInstance) => {
  return http.put(`${baseUrl}/${params.id}`, params);
};
