import { IDBBase } from "@/typings/index";

export namespace Branch {
  export interface IBranchItem extends IDBBase {
    branchName: string; // 分店名称
    branchCode: string; // 分店编号
    branchContactId: number; // 分店联系人ID
    branchContact: SysUserEntity; // 分店联系人
    branchAddress: string; // 分店地址
    branchTel: string; // 分店联系方式
  }
}
