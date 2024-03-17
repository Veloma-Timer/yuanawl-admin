import { Status } from "@/typings/index";

export namespace Dict {
  export interface ITypeItem {
    id: number;
    name: string; // 字典名称
    type: string; // 字典类型
    remark: string; // 说明
    status: Status; // 系统字典 common_status '0' -> 停用 '1' -> 正常
    createdTime: string;
  }

  export interface IDataItem {
    id: number;
    label: string; // 键名
    value: string | boolean; // 键值
    dictType: string; // 字典类型
    tagType: string;
    sort: number;
    status: Status; // 系统字典 common_status '0' -> 停用 '1' -> 正常
    createdTime: string;
  }

  export type Detail = ITypeItem & { dictData: IDataItem[] };
}
