import { Paging, Status } from "./index";

export namespace Website {
  export interface Notice extends Paging {
    id?: number | string;
    createdTime: string;
    title: string; // 标题
    content: string; // 内容
    cover: string; // 封面图
    issuer: string; // 发布人
    isAffixTop: Status; // 0没置顶 1置顶
    star: number; // 点赞数量
    collect: number; // 收藏数量
    comment: number; // 评论数量
    type: Status; // 公告类型 0 公告 1 攻略
    status: Status; // 是否可用 0禁用 1正常
  }
}
