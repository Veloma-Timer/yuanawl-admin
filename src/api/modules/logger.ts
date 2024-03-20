import { ReqPage, ResPage } from "@/api/interface";
import { Logger } from "@/typings/logger";
import http from "@/api";

const baseUrl = "/sys_logger";

// 列表
export const getLogList = (params?: ReqPage) => {
  return http.get<ResPage<Logger.Item>>(`${baseUrl}/list`, params);
};

// 详情
export const getLogDetail = (id: number) => {
  return http.get<Logger.Item>(`${baseUrl}/${id}`);
};

// 删除
export const deleteLog = (data: { ids: number[] }) => {
  return http.delete(`${baseUrl}`, data);
};

// 导出
export const exportLog = (ids?: number[]) => {
  return http.post(`${baseUrl}/export`, { ids });
};
