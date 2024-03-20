import {FieldNamesProps} from "@/components/ProTable/interface";
import {isArray} from "@/utils/is";
import currency from "currency.js";
import {Menu} from "@/typings/menu";
import {useDateFormat} from "@vueuse/core";

/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @returns {String}
 */
export function localGet(key: string) {
  const value = window.localStorage.getItem(key);
  try {
    return JSON.parse(window.localStorage.getItem(key) as string);
  } catch (error) {
    return value;
  }
}

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {*} value Storage值
 * @returns {void}
 */
export function localSet(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @returns {void}
 */
export function localRemove(key: string) {
  window.localStorage.removeItem(key);
}

/**
 * @description 清除所有localStorage
 * @returns {void}
 */
export function localClear() {
  window.localStorage.clear();
}

/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export function generateUUID() {
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    let random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-";
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
}

/**
 * @description 获取当前时间对应的提示语
 * @returns {String}
 */
export function getTimeState() {
  let timeNow = new Date();
  let hours = timeNow.getHours();
  if (hours >= 6 && hours <= 10) return `早上好 ⛅`;
  if (hours >= 10 && hours <= 14) return `中午好 🌞`;
  if (hours >= 14 && hours <= 18) return `下午好 🌞`;
  if (hours >= 18 && hours <= 24) return `晚上好 🌛`;
  if (hours >= 0 && hours <= 6) return `凌晨好 🌛`;
}

/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export function getBrowserLang() {
  let browserLang = navigator.language;
  let defaultBrowserLang = "";
  if (["cn", "zh", "zh-cn"].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = "zh";
  } else {
    defaultBrowserLang = "en";
  }
  return defaultBrowserLang;
}

/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList: Menu.MenuRoute[]): (Menu.Item & Menu.MenuRoute)[] {
  let newMenuList: Menu.MenuRoute[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])]) as any as (Menu.Item &
    Menu.MenuRoute)[];
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList: (Menu.Item & Menu.MenuRoute)[]) {
  let newMenuList: (Menu.Item & Menu.MenuRoute)[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter(item => {
    item.children?.length && (item.children = getShowMenuList(item.children));
    return !item.meta?.isHide;
  });
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (menuList: Menu.MenuRoute[], parent = [], result: { [key: string]: any } = {}) => {
  for (const item of menuList) {
    result[item.path] = [...parent, item];
    if (item.children) getAllBreadcrumbList(item.children, result[item.path], result);
  }
  return result;
};

/**
 * @description 使用递归过滤需要缓存的菜单 name (该函数暂未使用)
 * @param {Array} menuList 所有菜单列表
 * @param {Array} keepAliveNameArr 缓存的菜单 name ['**','**']
 * @returns {Array}
 * */
export function getKeepAliveRouterName(menuList: Menu.MenuRoute[], keepAliveNameArr: string[] = []) {
  menuList.forEach(item => {
    item.meta.isKeepAlive && item.name && keepAliveNameArr.push(item.name);
    item.children?.length && getKeepAliveRouterName(item.children, keepAliveNameArr);
  });
  return keepAliveNameArr;
}

/**
 * @description 处理值无数据情况
 * @param {*} callValue 需要处理的值
 * @returns {String}
 * */
export function formatValue(callValue: any) {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
  return callValue ?? "--";
}

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @returns {*}
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
  if (!prop.includes(".")) return row[prop] ?? "--";
  prop.split(".").forEach(item => (row = row[item] ?? "--"));
  return row;
}

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @returns {String}
 * */
export function handleProp(prop: string) {
  const propArr = prop.split(".");
  if (propArr.length == 1) return prop;
  return propArr[propArr.length - 1];
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export function filterEnum(callValue: any, enumData?: any, fieldNames?: FieldNamesProps, type?: "tag") {
  const value = fieldNames?.value ?? "value";
  const label = fieldNames?.label ?? "label";
  const children = fieldNames?.children ?? "children";
  let filterData: { [key: string]: any } = {};
  // 判断 enumData 是否为数组
  if (Array.isArray(enumData)) filterData = findItemNested(enumData, callValue, value, children);
  // 判断是否输出的结果为 tag 类型
  if (type == "tag") {
    return filterData?.tagType ? filterData.tagType : "";
  } else {
    return filterData ? filterData[label] : "--";
  }
}

/**
 * @description 递归查找 callValue 对应的 enum 值
 * */
export function findItemNested(enumData: any, callValue: any, value: string, children: string) {
  return enumData?.reduce((accumulator: any, current: any) => {
    if (accumulator) return accumulator;
    if (current[value] === callValue) return current;
    if (current[children]) return findItemNested(current[children], callValue, value, children);
  }, null);
}

/**
 * @description 列举了常见音乐、视频、图片各4种格式 用做不同文件预览区分
 * @param {fileName} string 过滤类型（目前只有 tag）
 * */
export function findFileType(fileName: string) {
  const extension = fileName?.split(".").pop()!.toLowerCase();
  const imageFile = ["jpeg", "png", "gif", "webp", "jpg"];
  const audioFile = ["mpeg", "mp3", "wav", "ogg"];
  const videoFile = ["mp4", "avi", "mov", "m4v"];

  if (imageFile.includes(extension)) {
    return "img";
  } else if (audioFile.includes(extension)) {
    return "audio";
  } else if (videoFile.includes(extension)) {
    return "video";
  } else {
    return extension || "";
  }
}
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

export const formatParams = (obj: any) => {
  let params = "";
  for (let key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        params = params + key + "=" + obj[key].join(",") + "&";
      } else {
        params = params + key + "=" + obj[key] + "&";
      }
    }
  }
  return `?${params.slice(0, -1)}`;
};
export const setPhone = (accountTel: string) => {
  return accountTel?.replace(/^[0-9]*$/g, "***********");
};
export const getPhone = (phone: string) => {
  if (!phone) return "--";
  return phone;
};

export const shortcuts = [
  {
    text: "本日",
    value: () => {
      const end = new Date();
      const start = new Date();
      return [start, end];
    }
  },
  {
    text: "近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: "近三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];

export const getFixed = (str: string | number, symbol = true) => {
  if (str != null && str != undefined) {
    if (symbol) {
      return currency(str).format({ symbol: "¥", precision: 2 });
    }
    return currency(str, { separator: ",", symbol: "", precision: 0 }).format();
  }
  return "--";
};

export const isObj = (v: any) => typeof v === "object" && v !== null;

export const isArr = <T = any[]>(v: any): v is T => Array.isArray(v);

export const keys = (o: any): string[] => (isObj(o) ? Object.keys(o) : []);

// 取默认值
export const def = <T = any>(v: any, d: T): T => {
  if (isArr<any>(v) && v.length > 0) return v;

  if (typeof v === "object" && v !== null) {
    return keys(v).length > 0 ? v : (d as T);
  }
  return v ?? (d as T);
};

// 不严格的判空
export const isEmptyNotStrict = (val: unknown) => {
  return val === "" || val === undefined || val == null || (typeof val === "number" && val == -1);
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

// 计算和
export const getSum = <T extends Record<string, any>>(list: T[], key: string) => {
  return list.reduce((total, account) => currency(total).add(def(account[key], 0)).value, 0); // 出售金额
};

// 计算除法
export const getDiv = (dividend: number, divisor: number) => {
  if (dividend == 0 && divisor == 0) return 0;
  return def(currency(dividend).divide(divisor).value, 0);
};

export const formatUrl = (url: string) => {
  const prefix = url[0] === "/" ? "" : "/";
  const symbol = url.includes("uploads/images") ? "" : "uploads/images";
  return `https://yuanawl.oss-cn-hangzhou.aliyuncs.com/${symbol}${prefix}${url}`;
};

// 防抖(debounce)(多次点击执行最后一次, 前面的不执行): 定时执行回调, 如果在设定时间内回调再次执行, 则清除上一个定时, 重新开启一个定时
export const debounce = (cb: (...args: any[]) => any, timeout: number = 300, immediate: boolean = false) => {
  let timer: any = null,
    _immediate = immediate,
    res: any = null;

  return async (...args: any[]) => {
    if (_immediate) {
      res = await cb(...args);
      _immediate = false;
      return res;
    }

    if (timer) clearTimeout(timer);

    timer = setTimeout(async () => {
      res = await cb(...args);
      timer = null;
    }, timeout);
  };
};

// 通过背景颜色获取文字颜色
export function getTextColorFromBackgroundColor(backgroundColor: string) {
  const regex = /rgb\((\d+),(\d+),(\d+)\)/;
  const match = backgroundColor.match(regex)! || [];

  // 提取 RGB 分量
  const red = Number(match[1] || 0);
  const green = Number(match[2] || 0);
  const blue = Number(match[3] || 0);

  // 计算亮度值
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  // 根据亮度值选择合适的文字颜色
  return brightness > 128 ? "black" : "white";
}

interface TreeNode<T> {
  [key: string]: any; // 允许 TreeNode 包含任意属性
}

export function handleTree<T extends TreeNode<T>>(
  data: T[],
  id: keyof T = "id",
  parentId: keyof T = "parentId",
  children: keyof T = "children",
  hasSort: boolean = true,
  sortField: keyof T = "sort"
): T[] {
  let config = {
    id: id,
    parentId: parentId,
    childrenList: children,
    sortField: sortField
  };

  let childrenListMap: Record<string, T[]> = {};
  let nodeIds: Record<string, T> = {};
  let tree: T[] = [];

  // 使用 as string 断言，因为 keyof T 类型不保证一定是 string
  for (let d of data) {
    let parentIdKey = (d[config.parentId] ?? "") as string;
    if (!childrenListMap[parentIdKey]) {
      childrenListMap[parentIdKey] = [];
    }
    nodeIds[d[config.id] as unknown as string] = d;
    childrenListMap[parentIdKey].push(d);
  }

  for (let d of data) {
    let parentIdKey = (d[config.parentId] ?? "") as string;
    if (!nodeIds[parentIdKey]) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o: T) {
    let childrenKey = o[config.id] as unknown as string;

    // 使用类型断言确保 TypeScript 理解这个赋值是合法的
    (o[config.childrenList] as unknown) = childrenListMap[childrenKey] ?? [];

    let childrenArray: T[] = o[config.childrenList] as T[];
    childrenArray.forEach(adaptToChildrenList);
  }

  function sortTree(nodes: T[]): T[] {
    // 对每个节点的子节点数组进行排序
    return nodes
      .sort((a, b) => {
        // 比较逻辑可能需要根据实际数据类型进行调整
        return (a[config.sortField] as number) - (b[config.sortField] as number);
      })
      .map(node => {
        // 如果存在子节点，则递归排序
        if (node[config.childrenList] && node[config.childrenList].length > 0) {
          (node as any)[config.childrenList] = sortTree(node[config.childrenList] as T[]);
        }
        return node;
      });
  }

  return hasSort ? sortTree(tree) : tree;
}

/**
 * @description 是否可见操作列
 * @param {string[]} powerButtons 权限按钮
 * @param {string[]} buttons 页面上的按钮
 */
export const visibleOperationCol = (powerButtons: string[], buttons: string[]) => {
  // 权限按钮存在于页面按钮
  return powerButtons?.some(btn => buttons?.includes(btn));
};

/**
 * @description 操作列的列宽
 * @param {string[]} powerButtons 权限按钮
 * @param {string[]} buttons 页面上的按钮
 */
export const getOperationColWidth = (powerButtons: string[], buttons: string[]) => {
  return powerButtons
    ?.filter(btn => buttons?.includes(btn))
    ?.reduce((total, btn) => {
      const txt = btn?.split(":")?.pop();
      if (txt === "create-ticket") {
        return total + 100;
      }
      return total + 100;
    }, 0);
};

export const getTime = (date: string) => {
  const currentDate = new Date();

  if (useDateFormat(date, 'YYYY-MM-DD').value === useDateFormat(currentDate, 'YYYY-MM-DD').value) {
    return useDateFormat(date, 'hh:mm').value
  }
  return useDateFormat(date, 'YYYY/MM/DD').value
}
