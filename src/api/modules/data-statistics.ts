import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 测试获取列表
 */
export const getManufactureSheet = (params: any) => {
  return http.get(PORT1 + `/produces/api/produces/order`, params);
};
