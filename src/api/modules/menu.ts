import { ReqPage } from "@/api/interface";
import http from "@/api";
import { Menu } from "@/typings/menu";
import { PORT3 } from "@/api/config/servicePort";

const baseUrl = PORT3 + "/sys_menu";

export const getMenuList = (params?: ReqPage) => {
  return http.get<Menu.Item[]>(`${baseUrl}/all`, params);
};

export const getMenuDetail = (menuId: number) => {
  return http.get<Menu.Item>(`${baseUrl}/${menuId}`);
};

export const createMenu = (data: Menu.Item) => {
  return http.post(`${baseUrl}`, data);
};

export const editMenu = (data: Menu.Item) => {
  return http.put(`${baseUrl}`, data);
};

export const deleteMenu = (data: { ids: number[] }) => {
  return http.delete(`${baseUrl}`, data);
};
