import axios, {Axios, AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {useGlobalStore} from "@/stores/modules/global";
import {useUserStore} from "@/stores/modules/user";
import {checkStatus} from "./helper/checkStatus";
import {ResultEnum} from "@/enums/httpEnum";
import {ResultData} from "@/api/interface";
import {LOGIN_URL} from "@/config";
import router from "@/routers";

export interface CustomAxiosRequestConfig {
  noLoading?: boolean;
  query?: any;
  _url?: string;
}

const config = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: import.meta.env.VITE_API_URL + import.meta.env.VITE_API_PREFIX,
  // baseURL: '/api',
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true
};


class RequestHttp {
  service: Axios;

  public constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
     */

    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig & CustomAxiosRequestConfig) => {
        const userStore = useUserStore();
        const globalStore = useGlobalStore();
        // 当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { noLoading: true } 来控制

        // config.noLoading || showFullScreenLoading();

        if (!config.url?.includes("chat_message")) {
          config.noLoading || window.osApi?.loading();
        }

        config.headers?.set('Authorization', userStore.token);
        config.headers?.set('platform', globalStore.platform);

        if (config.url?.includes("login")) {
          config.headers?.set('MacAddress', globalStore.macAddress);
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      async (response: AxiosResponse) => {
        const {data} = response;

        if (!data) return Promise.reject(data);
        const userStore = useUserStore();
        setTimeout(window.osApi?.done, 300);
        // tryHideFullScreenLoading();
        if (data?.statusCode === 500) {
          // 服务异常
          alert(`请联系开发者处理 ${data.message}`);
          return Promise.reject(data);
        }
        // 登陆失效
        if (data?.code == ResultEnum.OVERDUE) {
          alert(data.message);
          userStore.setToken("");
          router?.replace(LOGIN_URL);
          return Promise.reject(data);
        }
        if (data?.data === "warning") {
          alert(`【编码变更】: ${data.message}`)
          return data;
        }
        if (data?.success === undefined && data?.code === undefined) return data;
        // 如果data本身是空则也代表成功
        if (!data) return data;
        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (!data?.success) {
          alert(data.message)
          return Promise.reject(data);
        }
        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data;
      },
      async (error: AxiosError) => {
        const {response} = error;
        setTimeout(window.osApi?.done, 300);
        // tryHideFullScreenLoading();
        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.indexOf("timeout") !== -1) alert("请求超时！请您稍后重试");
        if (error.message.indexOf("Network Error") !== -1) alert("网络错误！请您稍后重试");
        // 根据服务器响应的错误状态码，做不同的处理
        if (response) checkStatus(response.status);
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) router?.replace("/500");
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description 常用请求方法封装
   */
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    // @ts-ignore
    return this.service.get(url, {params, ..._object});
  }

  post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    // @ts-ignore
    return this.service.post(url, params, _object);
  }

  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    // @ts-ignore
    return this.service.put(url, params, _object);
  }

  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    // @ts-ignore
    return this.service.delete(url, params, {..._object});
  }

  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    // @ts-ignore
    return this.service.post(url, params, {..._object, responseType: 'blob'});
  }

  downloadGet(url: string, params?: object, _object = {}) {
    return this.service.get(url, {params, ..._object, responseType: 'blob'});
  }
}

export default new RequestHttp(config);
