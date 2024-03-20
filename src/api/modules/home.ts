import { HomeSet } from "@/api/interface";
import http from "@/api";

const baseUrl: string = "/sys_analysis";

export interface IStatistics {
  branchId?: number;
  date?: [string, string];
  userId?: number;
  channelId?: string | number;
  grouping?: number | string;
}

// 获取首页数据
export const getHomeStatistics = (params: IStatistics) => {
  return http.get(`${baseUrl}/statistics`, params);
};

// 获取首页工单消息数据
export const getHomeWorkOrders = (params: { branchId: number; userId: number | string }): any => {
  return http.get(`${baseUrl}/after_sale`, params);
};

// 个人首页数据
export const getUserProfile = (params: IStatistics) => {
  return http.get(`${baseUrl}/statistics/profile`, params);
};

// 获取首页销售组&售后组数据对比
export const homeSalesAndAfter = (params: any) => {
  return http.get<HomeSet.ISalesAndAfter>(`${baseUrl}/home/sales_and_after`, params, { noLoading: true });
};
// 获取销售渠道
export const homeSalesChannel = (params: any) => {
  return http.get<HomeSet.ISalesAndAfter>(`${baseUrl}/home/sales_channel`, params, { noLoading: true });
};
// 获取回收渠道对比
export const getRecycleChannels = (params: any) => {
  return http.get<HomeSet.ISalesAndAfter>(`${baseUrl}/home/recycle`, params, { noLoading: true });
};
