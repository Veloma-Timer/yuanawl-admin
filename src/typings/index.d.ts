export interface IDigitBoard {
  icon: any;
  current: number | string;
  yesterday: number | string;
  year: number | string;
}

export interface IAccountType {
  id: number;
  typeName: string;
}

export interface Paging {
  pageNum: number;
  pageSize: number;
}

export interface IDBBase {
  id: number;
  isDelete?: string; // 是否删除
  createdBy?: number; // 创建人
  createdTime?: Date; // 创建时间
  updatedBy?: number; // 更新人
  updatedTime?: Date; // 更新时间
}

export type Status = "1" | "0";
