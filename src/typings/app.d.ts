import { IDBBase, Paging, Status } from "./index";

export namespace App {
  export interface Item {
    id: number;
    code: string; // 岗位编码
    name: string; // 岗位名称
    url: string;
    logo: string;
    remark?: string;
    createdTime: string;
    status: string; // 系统字典 common_status '0' -> 停用 '1' -> 正常
  }
  export interface IFirstScreenQuery extends Paging {
    name: string;
  }

  // 首屏实例
  export interface IFirstScreenInstance extends IDBBase {
    name: string; // 名称
    picture: string; // 图片
    desc: string; // 备注
    status: Status; // 状态
  }
  // 功能实例
  export interface IFuncMaintenanceInstance extends IDBBase {
    name: string; // 名称
    picture: string; // 图标
    desc: string; // 备注
    sort: number; // 排序
    flag: string; // 当前状态（包赔）
    pagePath: string; // 关联页面
    status: Status; // 状态
  }

  // 业务轮播实例
  export interface IMarketingCarouselInstance extends IDBBase {
    name: string; // 名称
    picture: string; // 图片
    desc: string; // 备注
    status: Status; // 状态
    sort: number; // 排序
    pagePath: string; // 关联页面路径
    textColor: string; // 文字颜色
    bgColor: string; // 背景主色
  }

  // 商品实例
  export interface IProductInstance {
    content: string[];
    count: number;
    id: number;
    number: string;
    rises_num: string;
    rises_twice_num: string;
    rises_twice_type: number;
    rises_type: number;
    server_id: number;
    server_name: string;
    text: string;
    title: string;
    total: string;
    type_id2: number;
    price: string;
  }

  // 商品轮播实例
  export interface IProductCarouselInstance extends IDBBase {
    name: string; // 名称
    picture: string; // 图片
    desc: string; // 备注
    sort: number; // 排序
    status: Status; // 状态
    product?: IProductInstance; // 商品
    productId: number; // 关联商品id
  }

  export interface TreeParams {

  }
}
