import { Data, ResPage, SalesOrder } from "@/api/interface";
import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
import { formatParams } from "@/utils";

/**
 * @name 售后模块
 */
// 售后工单汇总表格
export const getSalesList = (params: any) => {
  return http.get<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order`, params);
};

// 售后工单-未完成工单
export const getSalesListUnfinished = (params: any) => {
  return http.get<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order/unfinished`, params);
};

// 售后工单-已完成工单
export const getSalesListFinished = (params: any) => {
  return http.get<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order/finished`, params);
};

// 售后工单汇总表格
export const getSalesListToday = (params: any) => {
  return http.get<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order/today`, params);
};

// 售后工单新增工单
export const addSalesList = (params: any) => {
  return http.post<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order`, params);
};

// 售后工单修改工单
export const editSalesList = (params: any) => {
  return http.put<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order/${params.id}`, params);
};

// 售后工单详情
export const detailSalesList = (params: any) => {
  return http.get<SalesOrder.ResSalesList>(`${PORT3}/base_work_order/${params}`);
};

// 售后工单审核
export const checkSalesOrder = (id: number, params: any) => {
  return http.put<SalesOrder.ResSalesList>(`${PORT3}/base_work_order/check/${id}`, params);
};

// 售后工单审核
export const delSalesOrder = (ids: string[]) => {
  return http.delete(`${PORT3}/base_work_order`, { ids });
};

// 售后工单处理报表-数据统计
export const sysAnalysisWork = (id: number, date: number) => {
  return http.get<SalesOrder.WorkReport>(`${PORT3}/sys_analysis/work?branchId=${id}&date=${date}`);
};

// 工单处理汇总-右侧看板
export const workOrderAllBoard = (id: number, date: [string, string]) => {
  return http.get<SalesOrder.WorkReport>(`${PORT3}/sys_statistics/order/board?branchId=${id}&date=${date}`);
};

// 工单处理汇总-折线图
export const workOrderAllLine = (id: number, date: [string, string]) => {
  return http.get<SalesOrder.WorOrderkLine>(`${PORT3}/sys_statistics/order/finished?branchId=${id}&date=${date}`);
};

// 数据统计-销售数据-上边图表的
export const todaySales = (branchId: number, date: [string, string]) => {
  // return http.get<Data.TodaySales>(`${PORT3}/sys_analysis/today_sales?branchId=${branchId}&date=${date}`);
  return http.get<Data.TodaySales>(`${PORT3}/sys_statistics/sales?branchId=${branchId}&date=${date}`);
};

// 数据统计-回收数据-上边图表的
export const todayRecycles = (params: any) => {
  const newParams = formatParams(params);
  // return http.get<Data.TodayRecycle>(`${PORT3}/sys_analysis/today_recycle?branchId=${branchId}&date=${date}`);
  return http.get<Data.TodayRecycles>(`${PORT3}/sys_statistics/recycle${newParams}`);
};

// 数据统计-发布数据-下边表格的
export const todayPublishs = (branchId: number, date: [string, string]) => {
  // return http.get<ResultData<Data.TodaySales>>(`${PORT3}/base_account/today_sales?branchId=${branchId}`, params);
  return http.get<Data.TodayPublish>(`${PORT3}/sys_statistics/publish?branchId=${branchId}&date=${date}`);
};

// 工单模板
export const orderTemplate = () => {
  return http.downloadGet(`${PORT3}/static/template/work_order.xlsx`);
};

// 工单导入
export const orderUpload = (file: FormData) => {
  return http.post(`${PORT3}/base_work_order/upload`, file);
};

// 工单导出
export const orderExport = (ids?: string[]) => {
  return http.post(`${PORT3}/base_work_order/export`, { ids });
};

// 新增工单售后信息
export const addAfterInfo = (params: any) => {
  return http.post(`${PORT3}/base_work_order/after-sales`, params);
};

// 修改工单售后信息
export const editfterInfo = (params: any) => {
  return http.put(`${PORT3}/base_work_order/after-sales`, params);
};

// 新增工单销售信息
export const addSalesInfo = (params: any) => {
  return http.post(`${PORT3}/base_work_order/sales`, params);
};

// 修改工单销售信息
export const editSalesInfo = (params: any) => {
  return http.put(`${PORT3}/base_work_order/sales`, params);
};

// 新增工单发布信息
export const addPublishInfo = (params: any) => {
  return http.post(`${PORT3}/base_work_order/publish`, params);
};

// 新增工单发布信息
export const addRecycleInfo = (params: any) => {
  return http.post(`${PORT3}/base_work_order/recycle`, params);
};

// 修改工单回收信息
export const editRecycleInfo = (params: any) => {
  return http.put(`${PORT3}/base_work_order/recycle`, params);
};

// 修改工单发布信息
export const editPublishInfo = (params: any) => {
  return http.put(`${PORT3}/base_work_order/publish`, params);
};

// 获取当前工单应该处理的部门
export const getProcessingDept = (id: number) => {
  return http.get<{ afterSales: boolean; sales: false; publish: boolean }>(`${PORT3}/base_work_order/processing/dept/${id}`);
};

// 自动生成工单编码
// export const generateCode = () => {
//   return http.get<string>(`${PORT3}/base_work_order/generate/code`);
// };
