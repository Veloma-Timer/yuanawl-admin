/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

/**
 * @description:  是否为函数
 */
export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, "Function");
}

/**
 * @description: 是否已定义
 */
export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== "undefined";
};

/**
 * @description: 是否未定义
 */
export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val);
};

/**
 * @description: 是否为对象
 */
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, "Object");
};

/**
 * @description:  是否为时间
 */
export function isDate(val: unknown): val is Date {
  return is(val, "Date");
}

/**
 * @description:  是否为数值
 */
export function isNumber(val: unknown): val is number {
  return is(val, "Number");
}

/**
 * @description:  是否为AsyncFunction
 */
export function isAsyncFunction<T = any>(val: unknown): val is Promise<T> {
  return is(val, "AsyncFunction");
}

/**
 * @description:  是否为promise
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, "Promise") && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

/**
 * @description:  是否为字符串
 */
export function isString(val: unknown): val is string {
  return is(val, "String");
}

/**
 * @description:  是否为boolean类型
 */
export function isBoolean(val: unknown): val is boolean {
  return is(val, "Boolean");
}

/**
 * @description:  是否为数组
 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

/**
 * @description: 是否客户端
 */
export const isClient = () => {
  return typeof window !== "undefined";
};

/**
 * @description: 是否为浏览器
 */
export const isWindow = (val: any): val is Window => {
  return typeof window !== "undefined" && is(val, "Window");
};

/**
 * @description: 是否为 element 元素
 */
export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!val.tagName;
};

/**
 * @description: 是否为 null
 */
export function isNull(val: unknown): val is null {
  return val === null;
}

/**
 * @description: 是否为 null || undefined
 */
export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

/**
 * @description: 是否为 16 进制颜色
 */
export const isHexColor = (str: string) => {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str);
};
export function parseTime(time: any, cFormat: string) {
  if (arguments.length === 0 || !time) {
    return "--";
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  return format?.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];

    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
}

export const isObj = (v: any) => typeof v === "object" && v !== null;

export const isEmptyNotStrict = (val: unknown) => {
  return val === "" || val === undefined || val == null || (typeof val === "number" && val === 0);
};

// 判断对象是否是一个"空"对象
export const isEmptyObj = (obj: any = {}, deep?: boolean): boolean => {
  if (isObj(obj)) {
    return Object.keys(obj).every(key => {
      const val = obj[key];
      // 如果不是深度判空, 则直接返回
      if (!deep) {
        return isEmptyNotStrict(val);
      } else {
        // 如果是深度判空, 并且obj[key]是对象, 则递归调用
        if (isObj(val)) {
          return isEmptyObj(val, true);
        } else {
          // 如果不是对象则直接返回
          return isEmptyNotStrict(val);
        }
      }
    });
  }
  return true;
};

export function isEmpty(v: any) {
  if (isObj(v)) return isEmptyObj(v);
  if (Array.isArray(v)) return v.length === 0;
  return isEmptyNotStrict(v);
}
