import { User } from "./user";
import { Status } from "@/typings/index";

export namespace Role {
  export interface Item {
    id: number;
    name: string; // 角色名称
    remark?: string; // 备注
    permissions?: number[]; // 权限ids
    status: Status; // 系统字典 common_status '0' -> 停用 '1' -> 正常
    createdTime: string;
  }

  export interface RoleAndStaff extends Item {
    children: User.IUserItem[];
  }
}
