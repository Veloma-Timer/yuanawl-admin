import { Menu } from "@/typings/menu";
import { User } from "@/typings/user";

export type LayoutType = "vertical" | "classic" | "transverse" | "columns";

export type AssemblySizeType = "large" | "default" | "small";

export type LanguageType = "zh" | "en" | null;

/* GlobalState */
export interface GlobalState {
  layout: LayoutType;
  assemblySize: AssemblySizeType;
  language: LanguageType;
  maximize: boolean;
  primary: string;
  isDark: boolean;
  isGrey: boolean;
  isWeak: boolean;
  asideInverted: boolean;
  isCollapse: boolean;
  breadcrumb: boolean;
  breadcrumbIcon: boolean;
  tabs: boolean;
  tabsIcon: boolean;
  footer: boolean;
  isFull: boolean;
  macAddress: string;
}

/* UserState */
export interface UserState {
  token: string;
  userInfo: User.IUserItem;
}

/* ProTableState */
export interface ProTableColoum {
  fixed?: string;
  isFilterEnum: boolean;
  isShow: boolean;
  sortable: boolean;
  type: string;
  width: number;
  prop?: string;
  render?: () => {};
  search?: () => {};
}

export interface ColoumItem {
  key: string;
  value: ProTableColoum[];
}

export interface ProTableState {
  list: ColoumItem[];
}

/* tabsMenuProps */
export interface TabsMenuProps {
  icon: string;
  title: string;
  path: string;
  name: string;
  close: boolean;
}

/* TabsState */
export interface TabsState {
  tabsMenuList: TabsMenuProps[];
}

/* AuthState */
export interface AuthState {
  routeName: string;
  authButtonList: any[];
  authMenuList: Menu.MenuRoute[];
}

/* KeepAliveState */
export interface KeepAliveState {
  keepAliveName: string[];
}
