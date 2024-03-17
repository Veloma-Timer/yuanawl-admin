import { PORT3 } from "@/api/config/servicePort";
import { App } from "@/typings/app";
import http from "@/api";

const baseUrl = PORT3 + "/app_product_carousel";

// 查询列表
export const getProductCarouselList = (params: App.IProductCarouselInstance) => {
  return http.get<IListPure<App.IProductCarouselInstance>>(baseUrl, params);
};

// 新增
export const addProductCarouselItem = (params: App.IProductCarouselInstance) => {
  return http.post(baseUrl, params);
};

// 删除
export const delProductCarouselItem = (ids: string[]) => {
  return http.delete(`${baseUrl}`, { ids });
};

// 启用&禁用
export const updateProductCarouselStatus = (id: number, status: "1" | "0") => {
  return http.put(`${baseUrl}/${id}`, { status });
};

// 修改
export const editProductCarouselItem = (params: App.IProductCarouselInstance) => {
  return http.put(`${baseUrl}/${params.id}`, params);
};
