import { defineStore } from "pinia";
import { GlobalState } from "@/stores/interface";
import { DEFAULT_PRIMARY } from "@/config";
import piniaPersistConfig from "@/config/piniaPersist";
import {ObjToKeyValArray} from "@/typings/global";

export const useGlobalStore = defineStore({
  id: "global",
  // 修改默认值之后，需清除 localStorage 数据
  state: (): GlobalState => ({
    // 布局模式 (纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns)
    layout: "classic",
    // element 组件大小
    assemblySize: "default",
    platform: '',
    // 当前系统语言
    language: null,
    // 当前页面是否全屏
    maximize: false,
    // 主题颜色
    primary: DEFAULT_PRIMARY,
    // 深色模式
    isDark: false,
    // 灰色模式
    isGrey: false,
    // 色弱模式
    isWeak: false,
    // 侧边栏反转 (目前仅支持 'vertical' 模式)
    asideInverted: false,
    // 折叠菜单
    isCollapse: false,
    // 面包屑导航
    breadcrumb: true,
    // 面包屑导航图标
    breadcrumbIcon: false,
    // 标签页
    tabs: false,
    // 标签页图标
    tabsIcon: true,
    // 页脚
    footer: true,
    // 是否全屏
    isFull: false,
    macAddress: ""
  }),
  getters: {},
  actions: {
    setIsFull(val: boolean) {
      this.isFull = val;
    },
    // Set GlobalState
    setGlobalState(...args: ObjToKeyValArray<GlobalState>) {
      this.$patch({ [args[0]]: args[1] });
    },
    setMacAddress(val: string) {
      this.macAddress = val;
    },
    setPlatform(val: string) {
      this.platform = val;
    }
  },
  persist: piniaPersistConfig("global")
});
