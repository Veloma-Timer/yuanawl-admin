import { Website } from "@/typings/website";
import http from "@/api";

const baseUrl = "/website_notice";

// 查询列表
export const getList = (params: Website.Notice) => {
  return http.get<IListPure<Website.Notice>>(baseUrl + "/list", params);
};

// 查询详情
export const getDetail = (id: string | number) => {
  return http.get<IListPure<Website.Notice>>(baseUrl + `/${id}`);
};

// 新增
export const create = (params: Website.Notice) => {
  return http.post(baseUrl, params);
};

// 修改
export const edit = (params: Website.Notice) => {
  return http.put(`${baseUrl}`, params);
};

// 删除
export const del = (ids: number[]) => {
  return http.delete(`${baseUrl}`, { ids });
};
