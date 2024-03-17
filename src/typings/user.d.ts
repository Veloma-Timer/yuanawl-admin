import { IDBBase, Status } from "@/typings/index";
import { Branch } from "@/typings/branch";
import { Dict } from "@/typings/dict";

export namespace User {
  interface IUserItem extends IDBBase {
    code: string; // 用户编码（工号）
    isAdmin: Status; // 是否管理员
    isManager: Status; // 是否主管
    name: string; // 用户名称
    tel: string; // 手机号码
    password: string; // 用户密码
    roleId: number; // 用户角色ID
    branchId: number; // 用户所属门店ID
    deptId: string; // 部门ID
    jobStatus: string; // 员工在职状态
    set: Dict.IDataItem; // 用户所属组
    branch: Branch.IBranchItem; // 用户所属门店
    orderCount: number; // 工单计数
    orderStartCount: number; // 工单星级计数
  }
}
