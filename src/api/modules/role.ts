import { ReqPage, ResPage } from "@/api/interface";
import http from "@/api";
import { Role } from "@/typings/role";
import { PORT3 } from "@/api/config/servicePort";

const baseUrl = PORT3 + "/sys_role";

export const getRoleList = (params?: Partial<ReqPage & Role.Item>) => {
  return http.get<ResPage<Role.Item>>(`${baseUrl}/list`, params);
};

export const getAllRole = (params?: Partial<ReqPage & Role.Item>) => {
  return http.get<Role.Item[]>(`${baseUrl}/all`, params);
};

export const getRoleDetail = (roleId: number) => {
  return http.get<Role.Item>(`${baseUrl}/${roleId}`);
};

export const createRole = (data: Role.Item) => {
  return http.post(`${baseUrl}`, data);
};

export const editRole = (data: Role.Item) => {
  return http.put(`${baseUrl}`, data);
};

export const deleteRole = (data: { ids: number[] }) => {
  return http.delete(`${baseUrl}`, data);
};

// 获取角色&人员
export const getRoleStaffList = () => {
  return http.get<Role.RoleAndStaff[]>(`${baseUrl}/list/staff`);
};
