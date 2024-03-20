import { ReqPage, ResPage } from "@/api/interface";
import { Dict } from "@/typings/dict";
import http from "@/api";

const baseUrl = "/sys_dict";

export const getDictTypeList = (params: ReqPage) => {
  return http.get<ResPage<Dict.ITypeItem>>(`${baseUrl}/type/list`, params);
};

export const getDictDataList = (params: Partial<{ type: string; status: string }>) => {
  return http.get<Dict.IDataItem[]>(`${baseUrl}/data/list`, params);
};

export const getPublishPlatform = () => {
  return getDictDataList({ type: "publishPlatform" });
};
export const getGroups = () => {
  return getDictDataList({ type: "groups" });
};

export const getRecycleShop = () => {
  return getDictDataList({ type: "recycleShop" });
};

export const getSystem = () => {
  return getDictDataList({ type: "system" });
};

export const getOrderProblemTypes = () => {
  return getDictDataList({ type: "orderProblemTypes" });
};

export const getHandleTypes = () => {
  return getDictDataList({ type: "handleTypes" });
};

export const getDept = () => {
  return getDictDataList({ type: "dept" });
};

export const createDict = (data: Dict.Detail) => {
  return http.post(`${baseUrl}`, data);
};

export const editDict = (data: Dict.Detail) => {
  return http.put(`${baseUrl}`, data);
};

export const delDictType = (data: DelParams) => {
  return http.delete(`${baseUrl}/type`, data);
};

export const getImportTemplate = () => {
  return http.get(`${baseUrl}/import_template`);
};

export const getBaseUrl = () => {
  return http.get<string>(`/base_url`);
};
