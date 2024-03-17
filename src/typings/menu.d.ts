import { Status } from "@/typings/index";

export namespace Menu {
  export interface Item {
    id: number;
    parentId: number; // 上级菜单id
    parentName?: string; // 上级名称 可选
    title: string; // 菜单名称 ｜ 按钮名称
    type: string; //类型  M: 菜单 B: 按钮
    name: string; // 路由名称
    path: string; // 路由地址
    redirect?: string; // 重定向到
    component: string; // 组件路径
    isFull?: boolean; // 是否全屏
    isLink?: boolean; // 是否外链
    isHide?: boolean; // 是否隐藏
    isAffix?: boolean; // 是否吸附
    isKeepAlive?: boolean; // 是否缓存
    icon?: string; // 图标
    perms: string; // 菜单 ｜ 按钮权限标识 可为空串
    sort: number; // 排序
    createdTime: string;
    status: Status; // 系统字典 common_status '0' -> 停用 '1' -> 正常
    children?: (Item & MenuRoute)[];
    workflowId?: number;
  }

  export interface MenuRoute {
    id: number;
    name: string; // 路由名称
    path: string; // 路由地址
    title: string;
    redirect?: string; // 重定向到
    component: string; // 组件路径
    children?: (MenuRoute & Item)[];
    meta: {
      title: string; // 菜单名称 ｜ 按钮名称
      isFull?: boolean; // 是否全屏
      isLink?: string; // 是否外链
      isHide?: boolean; // 是否隐藏
      isAffix?: boolean; // 是否吸附
      isKeepAlive?: boolean; // 是否缓存
      icon?: string; // 图标
      workflowId?: number;
    };
  }
}
