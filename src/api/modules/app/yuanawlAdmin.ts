import { YuanawlAdmin } from "@/typings/yuanawlAdmin";
import http from "@/api";

const baseUrl = "/yuanawl_admin";

// 获取游戏分类
export const getGameTypes = () => {
  return http.get<YuanawlAdmin.IType[]>(baseUrl + "/types");
};

// 获取游戏列表: 根据分类
export const getProductsByType = (typeId?: number | string, pageNum = 1, pageSize = 10) => {
  return http.get<YuanawlAdmin.IProduct[]>(baseUrl + "/type/products", { typeId, pageNum, pageSize }, { noLoading: true });
};

// 获取app所有页面
export const getAppPaths = () => {
  return http.get<YuanawlAdmin.IPath[]>(baseUrl + "/paths");
};
