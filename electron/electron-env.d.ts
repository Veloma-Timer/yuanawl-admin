/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    DIST_ELECTRON: string
    DIST: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

declare interface OpenFileParams {
  title?: string;
  type?: 'img' | 'sheet' | 'all'
}

declare type Platform = "aix" | "android" | "darwin" | "freebsd" | "haiku" | "linux" | "openbsd" | "sunos" | "win32" | "cygwin" | "netbsd"

declare interface NotificationParams {
  id?: number; // id
  type?: 'base' | 'message' | 'notification'; // 通知类型 base不需要处理, message来自app的消息 需要处理, notification 通知类需要处理， 例如工单
  extras?: any; // 附加信息
  title: string; // 标题
  body: string; // 正文
  icon?: string; // 图标 string | NativeImage
  hasReply?: boolean; // 是否在通知中添加一个答复选项 macOS
  timeoutType?: 'default' | 'never'; // 通知超时时间，'default' 默认，'never' 永不超时
  replyPlaceholder?: string; // 回复输入框中的占位符 macOS
  reply?: string; // 回复消息
}
