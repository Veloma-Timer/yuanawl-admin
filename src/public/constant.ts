// 一些公用常量

type KeyValue = Record<string, string>;

export const CHECK_RESULT: KeyValue = {
  0: "未通过",
  1: "通过"
};

export const ORDER_STATUS: KeyValue = {
  0: "待处理",
  1: "已处理"
};

export const INSURE_STATUS: KeyValue = {
  0: "否",
  1: "是"
};
