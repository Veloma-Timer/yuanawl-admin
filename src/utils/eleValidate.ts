// ? Element 常用表单校验规则

import { typeCode } from "@/api/modules/account";

/**
 *  @rule 手机号
 */
export function checkPhoneNumber(rule: any, value: any, callback: any) {
  const regexp = /^1[3-9]\d{9}$/;
  if (value === "") return callback("请输入手机号码");
  if (!regexp.test(value)) return callback(new Error("请输入正确的手机号码"));
  const params = {
    type: "accountTel",
    value
  };
  if (value) {
    typeCode(params).then(res => {
      const { data } = res;
      if (data === "0") {
        return callback(new Error("该手机号以存在"));
      } else {
        return callback();
      }
    });
  }
}
export function checkEmail(rule: any, value: any, callback: any) {
  const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (regEmail.test(value)) {
    // 合法的邮箱
    return callback();
  }
  callback(new Error("请输入合法的邮箱"));
}
