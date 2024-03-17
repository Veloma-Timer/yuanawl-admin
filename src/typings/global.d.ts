/* FileType */
import type {Electron} from "@/typings/electron";

declare namespace File {
  type ImageMimeType =
    | "image/apng"
    | "image/bmp"
    | "image/gif"
    | "image/jpeg"
    | "image/pjpeg"
    | "image/png"
    | "image/svg+xml"
    | "image/tiff"
    | "image/webp"
    | "image/x-icon";

  // image video audio 各4种类型
  type FileMimeType =
    | "audio/mpeg"
    | "audio/mp3"
    | "audio/wav"
    | "audio/ogg"
    | "video/mp4"
    | "video/avi"
    | "video/mov"
    | "video/m4v"
    | "image/gif"
    | "image/jpeg"
    | "image/png"
    | "image/webp";

  type ExcelMimeType = "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
}

/* Vite */
declare type Recordable<T = any> = Record<string, T>;

declare interface ViteEnv {
  VITE_USER_NODE_ENV: "development" | "production" | "test";
  VITE_GLOB_APP_TITLE: string;
  VITE_PORT: number;
  VITE_OPEN: boolean;
  VITE_REPORT: boolean;
  VITE_BUILD_COMPRESS: "gzip" | "brotli" | "gzip,brotli" | "none";
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
  VITE_DROP_CONSOLE: boolean;
  VITE_PWA: boolean;
  VITE_PUBLIC_PATH: string;
  VITE_API_URL: string;
  VITE_PROXY: [string, string][];
}

/* __APP_INFO__ */
declare const __APP_INFO__: {
  pkg: {
    name: string;
    version: string;
    dependencies: Recordable<string>;
    devDependencies: Recordable<string>;
  };
  lastBuildTime: string;
};

type ObjToKeyValArray<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

declare interface IListPure<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

interface DelParams {
  ids: number[];
}
