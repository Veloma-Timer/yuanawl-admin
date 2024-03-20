import { App } from "@/typings/app";
import http from "@/api";

const baseUrl = "/app_product_carousel";

// 查询列表
export const getProductCarouselList = (params: App.IProductCarouselInstance) => {
  return http.get<App.IProductCarouselInstance[]>(baseUrl, params);
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


// 商品树形搜索
export const getProductTree = (params: App.TreeParams) => {
  return http.get(`/common/index/searchTree`, params);
}
