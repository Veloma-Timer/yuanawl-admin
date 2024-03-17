import { PORT3 } from "@/api/config/servicePort";
import { App } from "@/typings/app";
import http from "@/api";

const baseUrl = PORT3 + "/app_marketing_carousel";

// 查询列表
export const getMarketingCarouselList = (params: App.IMarketingCarouselInstance) => {
  return http.get<IListPure<App.IMarketingCarouselInstance>>(baseUrl, params);
};

// 新增
export const addMarketingCarouselItem = (params: App.IMarketingCarouselInstance) => {
  return http.post(baseUrl, params);
};

// 删除
export const delMarketingCarouselItem = (ids: string[]) => {
  return http.delete(`${baseUrl}`, { ids });
};

// 启用&禁用
export const updateMarketingCarouselStatus = (id: number, status: "1" | "0") => {
  return http.put(`${baseUrl}/${id}`, { status });
};

// 修改
export const editMarketingCarouselItem = (params: App.IMarketingCarouselInstance) => {
  return http.put(`${baseUrl}/${params.id}`, params);
};
