import { Status } from "@/typings/index";

export namespace Logger {
  export interface Item {
    id: number;
    type: string; // 区分登录还是功能操作{1: '登录',2: "操作 - 查看",3: "操作 - 新增",4: "操作 - 修改", 5: "操作 - 删除",}
    requestMethod: string; // 请求方式
    requestUrl: string; // 请求地址
    requestParams: string; // 请求参数
    jsonResult?: string; // 返回结果
    operName: string; // 操作人员
    operIp: string; // 操作ip
    operLocation: string; // 操作地点
    operModule: string; // 操作模块
    operBrowser: string; // 操作浏览器
    status: Status; // 操作状态 0 失败 1 成功
    dataChange?: string; // 数据变更  变更前数据 => 变更后数据
    errorMsg?: any;
    createdTime: string;
  }
}
