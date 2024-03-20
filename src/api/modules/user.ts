import { User } from "@/typings/user";
import http from "@/api";

const baseUrl = "/sys_user";

// 新增用户
export const addUser = (params: Partial<User.IUserItem>) => {
  return http.post(baseUrl, params);
};


// 编辑用户
export const editUser = (params: Partial<User.IUserItem>) => {
  return http.put(`${baseUrl}/${params.id}`, params);
};

// 删除用户
export const deleteUser = (ids: string[]) => {
  return http.delete(baseUrl, { ids });
};


export const getUserListMap = (params: any) => {
  return http.get(baseUrl, params);
};
export const getUserTree = () => {
  return http.get<Partial<User.IUserItem>>(`${baseUrl}/tree`);
};

// 获取所有用户
export const getUserAll = (): Promise<{ data: Partial<User.IUserItem>[] }> => {
  return http.get(`${baseUrl}/all`, {}, { noLoading: true });
};
// 获取不同部门的用户
export const getDeptUsers = (deptId: number) => {
  return http.get(`${baseUrl}/dept`, { deptId }, { noLoading: true });
};

// 获取回收用户
export const getRecycleUsers = () => getDeptUsers(1);

// 获取发布用户
export const getPublishUsers = () => getDeptUsers(3);

// 获取销售用户
export const getSalesUsers = () => getDeptUsers(0);

// 下载用户模板
export const getUserTemptable = () => {
  return http.downloadGet(`/static/template/user.xlsx`);
};
export const getUserUpload = (file: FormData) => {
  return http.post(`${baseUrl}/upload`, file);
};

export const getUserExport = (params: any) => {
  return http.post(`${baseUrl}/export`, params);
};

// 获取用户详情
export const getUserDetail = (id: number) => {
  if (!id) return {};
  return http.get<User.IUserItem>(baseUrl + `/${id}`);
};
