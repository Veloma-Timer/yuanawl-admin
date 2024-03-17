import { PORT3 } from "@/api/config/servicePort";
import { ResultData } from "@/api/interface";
import http from "@/api";
import { Branch } from "@/typings/branch";

export interface IBranch {
  id: number;
  branchName: string;
  branchCode: string;
  branchContactId: number;
  branchAddress: string;
  branchTel: string;
}

const baseUrl = PORT3 + "/sys_branch";

// 获取所有门店
export const getAllBranch = (): Promise<ResultData<IBranch[]>> => {
  return http.get<IBranch[]>(baseUrl + `/all`);
};

// 获取所有用户
export const getAllUser = (params: any) => {
  return http.get<{ name: string; id: number }[]>(PORT3 + `/sys_user/all`, params, { noLoading: true });
};

// 获取所有用户选项
export const getUserOptions = () => {
  return http.get<{ name: string; id: number }[]>(PORT3 + `/sys_user/options`, {}, { noLoading: true });
};

// 获取所有账号
export const getAllBaseAccount = (params: any) => {
  return http.get<{ accountNumber: string; accountCode: string; id: number }[]>(PORT3 + `/base_account/all`, params, {
    noLoading: true
  });
};

// 获取所有账号的code和id
export const getAccountCodeAndId = () => {
  return http.get<{ accountNumber: string; accountCode: string; id: number }[]>(
    PORT3 + `/base_account/all/code`,
    {},
    {
      noLoading: true
    }
  );
};

// 获取所有已删除账号
export const getAllBaseAccountDel = (params: any) => {
  return http.get<{ accountNumber: string; accountCode: string; id: number }[]>(PORT3 + `/base_account/all/del`, params, {
    noLoading: true
  });
};

// 分页查询门店
export const getAllBranchPage = (params: any) => {
  return http.get(baseUrl, params);
};

// 添加门店
export const addBranch = (params: any) => {
  return http.post(baseUrl, params);
};

// 修改门店
export const editBranch = (params: any) => {
  return http.put(baseUrl + `/${params.id}`, params);
};

// 删除门店
export const delBranch = (ids: string[]) => {
  return http.delete(baseUrl, { ids });
};

// 获取门店详情
export const getBranchDetail = (id: number) => {
  if (!id) return {};
  return http.get<Branch.IBranchItem>(baseUrl + `/${id}`);
};
