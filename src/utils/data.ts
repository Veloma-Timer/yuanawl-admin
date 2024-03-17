import router from "@/routers/index";
import { Menu } from "@/typings/menu";
import { useAuthStore } from "@/stores/modules/auth";

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
