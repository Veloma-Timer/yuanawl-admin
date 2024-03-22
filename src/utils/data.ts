import router from "@/routers/index";
import { Menu } from "@/typings/menu";
import { useAuthStore } from "@/stores/modules/auth";
import {Commodity} from "@/api/interface/commodity/commodity";
import {TableColumnCtx} from "element-plus";
import currency from "currency.js";

/**
 * @desc 获取列表的label
 *  @param list 列表
 *  @param value 匹配的值
 *  @param byKey 通过什么key去找
 *  @param valueKey 返回什么key
 *  @returns 返回匹配的label
 * */
export const getLabel = <T>(
  list: T[],
  value: string | number,
  byKey: keyof T = "value" as keyof T,
  valueKey: keyof T = "label" as keyof T
) => {
  if (!value) return "";
  const item = list.find(item => {
    return item[byKey] == value;
  });

  return item?.[valueKey];
};

// 判断路由是否合法或存在
export const isExistRoute = (name: string) => {
  const routes = router.getRoutes();
  return routes.some(item => item.name === name);
};

export const getParentRoute = (route: Menu.Item) => {
  const authStore = useAuthStore();
  const recursion = (route: Menu.Item): Menu.Item => {
    if (!route.parentId) return route;
    const currentRoute = authStore.flatMenuListGet.find(item => item.id === route.parentId)!;
    return recursion(currentRoute);
  };

  return recursion(route);
};

interface SummaryMethodProps<T = any> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

export const getSummaries = (param: SummaryMethodProps, props: string[] = []) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    // 第一列返回合计
    if (index === 0) {
      sums[index] = '合计'
      return
    }

    if (props.includes(column.property)) {
      const values = data.map((item) => Number(item[column.property]))
      if (!values.every((value) => Number.isNaN(value))) {
        const total = `${values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)}`;
        sums[index] = currency(total).format({ symbol: "¥" });
      }
    } else {
      sums[index] = 'N/A';
    }
  });

  return sums
}
