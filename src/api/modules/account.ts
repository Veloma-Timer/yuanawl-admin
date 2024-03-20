import http from "@/api";
import { Account } from "@/typings/account";

const baseUrl: string = "/base_account";

// 获取账户汇总列表
export const summaryList = (params: any) => {
  return http.get(`${baseUrl}`, params);
};

// 新增账户
export const addSummary = (params: any) => {
  return http.post(baseUrl, params);
};
// 编辑
export const editSummary = (params: any) => {
  return http.put(`${baseUrl}/${params.id}`, params);
};
// 删除
export const deleteSummary = (params: any) => {
  return http.delete(`${baseUrl}/${params.id}`, params);
};

// 批量删除删除
export const deleteAccountBatch = (ids: number[]) => {
  return http.delete(`${baseUrl}/batch`, { ids });
};

// 彻底删除账号
export const delAccountComplete = (ids: number[]) => {
  return http.delete(`${baseUrl}/complete`, { ids });
};

// 账号模块
export const accountTemplate = () => {
  return http.downloadGet(`/static/template/account.xlsx`);
};
// 回收账户模块
export const recycleTemplate = () => {
  return http.downloadGet(`/static/template/recycle.xlsx`);
};

export const recycleUpload = (file: FormData) => {
  return http.post(`${baseUrl}/upload/recycle`, file);
};
// 账号导入
export const summaryUpload = (file: FormData) => {
  return http.post(`${baseUrl}/upload`, file);
};

// 账号导出
export const accountExport = (params: any) => {
  return http.post(`${baseUrl}/export`, params);
};

// 删除列表导出
export const exportDel = (ids: string[]) => {
  return http.post(`${baseUrl}/export/del`, { ids });
};

// 回收列表导出
export const exportRecycle = (params: any) => {
  return http.post(`${baseUrl}/export/recycle`, params);
};

// 发布列表导出
export const exportPublish = (ids: string[]) => {
  return http.post(`${baseUrl}/export/publish`, { ids });
};

// 销售列表导出
export const exportSales = (ids: string[]) => {
  return http.post(`${baseUrl}/export/sales`, { ids });
};

// 已售列表导出
export const soldOutExport = (ids: string[]) => {
  return http.post(`${baseUrl}/export/sold`, { ids });
};

// 未售列表
export const unsoldExport = (ids: string[]) => {
  return http.post(`${baseUrl}/export/unsold`, { ids });
};

// 获取所有已删除账号
export const getBaseAccountDel = (params: any) => {
  return http.get<{ accountNumber: string; accountCode: string; id: number }[]>(`/base_account/del`, params);
};

// 回收列表
export const addRecycle = (params: any) => {
  return http.post(`${baseUrl}/recycle`, params);
};
export const editRecycle = (params: any) => {
  return http.put(`${baseUrl}/recycle`, params);
};
export const getRecycleList = (params: any): Promise<{ data: { list: any } }> => {
  return http.get(`${baseUrl}/recycle`, params, { noLoading: false });
};
// 销售列表
export const addSales = (params: any) => {
  return http.post(`${baseUrl}/sales`, params);
};
export const editSales = (params: any) => {
  return http.put(`${baseUrl}/sales`, params);
};
export const getSalesList = (params: any) => {
  return http.get(`${baseUrl}/sales`, params);
};
export const salesTemplate = () => {
  return http.downloadGet(`/static/template/sales.xlsx`);
};
export const salesUpload = (file: FormData) => {
  return http.post(`${baseUrl}/upload/sales`, file);
};
// 发布列表
export const addPublish = (params: any) => {
  return http.post(`${baseUrl}/publish`, params);
};
export const editPublish = (params: any) => {
  return http.put(`${baseUrl}/publish`, params);
};
export const getPublishList = (params: any) => {
  return http.get(`${baseUrl}/publish`, params);
};
export const pointBury = (params: any) => {
  return http.post(`/sys_point_bury`, params);
};
export const publishTemplate = () => {
  return http.downloadGet(`/static/template/publish.xlsx`);
};
export const publishUpload = (file: FormData) => {
  return http.post(`${baseUrl}/upload/publish`, file);
};

/** 账户编号验证 **/
export const typeCode = (params: any) => {
  return http.get(`${baseUrl}/monitor`, params, { noLoading: true });
};
//  生成回收编码
export const generateCode = (groupingId: number | string): Promise<{ data: string }> => {
  return http.get(`/sys_code/generate/code`, { groupingId }, { noLoading: true });
};

// 获取账号详情
export const getAccountDetail = (id: number | string) => {
  if (!id) return {};
  return http.get<Account.IAccountItem>(`${baseUrl}/${id}`);
};
