import { Login } from "@/api/interface";
import { Menu } from "@/typings/menu";
import { User } from "@/typings/user";
import { UnwrapRef } from "vue";
import http from "@/api";

const baseUrl: string = "/sys_user";

const authUrl = "/auth";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: {
  password: UnwrapRef<Login.ReqLoginForm["password"]>;
  code: UnwrapRef<Login.ReqLoginForm["code"]>;
}) => {
  return http.post<{
    access_token: string;
    user: User.IUserItem;
  }>(authUrl + "/login", params, { noLoading: true }); // 正常 post json 请求  ==>  application/json
};

// 获取菜单列表
export const getAuthMenuListApi = async () => {
  // return authMenuList;
  return http.get<{
    routes: Menu.MenuRoute[];
    buttons: string[];
  }>(`/sys_role/auth`, { appCode: "admin" }, { loading: false });
};

// 用户退出登录
export const logoutApi = () => {
  return http.post(baseUrl + "/logout");
};
