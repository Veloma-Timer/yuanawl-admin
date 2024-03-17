import { IDBBase, Status } from "@/typings/index";
import { Branch } from "@/typings/branch";
import { User } from "@/typings/user";
import { Dict } from "@/typings/dict";

export namespace Account {
  export interface IAccountItem extends IDBBase {
    accountCode: string; // 账号编码(用户输入，唯一)
    accountType: number[]; // 账号分类(游戏分类)
    recycleOrder: string; // 回收订单号
    recycleMethod: string; // 回收方式
    branchId: number; // 所属门店ID
    branch?: Branch.IBranchItem; // 所属门店
    storeId: string; // 回收门店ID
    accountRecyclerId: number; // 回收人ID
    accountRecycler: User.IUserItem; // 回收人
    accountRecyclerTime: Date | string; // 回收时间
    accountRecyclerPrice: number; // 回收价格
    publishRemark: string; // 发布备注
    accountPublisherId: number; // 发布人ID
    accountPublisher: User.IUserItem; // 发布人
    accountPublisherTimer: Date | string; // 发布时间
    publishPlatform: number[]; // 发布平台
    rollBackTimer: Date | string; // 回滚时间
    rollBackPlatform: number[]; // 回滚平台
    publishPrice: number; // 商品首次定价/发布价格
    account: string; // 账号
    qq: string; // QQ号
    accountPassword: string; // 密码
    phoneRemark: string; // 手机卡备注
    accountTel: string; // 密保手机
    buyerTel: string; // 买家手机号
    email: string; // 邮箱
    emailSecret: string; // 邮箱密保
    systemId: string; // 系统ID
    accountDesc: string; // 描述
    accountHandle: string; // 账号处理
    handleUserId: number; // 账号处理人ID
    handleUser: User.IUserItem; // 账号处理人
    handleTime?: Date | string; // 账号处理时间
    haveSecondary: string; // 实名情况
    accountRemark: string; // 账号备注
    recycleRemark: string; // 回收备注
    salesRemark: string; // 销售备注
    salesCode: string; // 销售订单编号
    addPriceRate: number; // 商品加价率
    conversionCycle: number; // 商品周转周期
    campId: string; // 营地号
    netUpload: Status; // 网络上传
    transCatUid: string; // 交易猫uid
    noSaleResidenceTime: number; // 滞留时间(回收时间-当前日期)
    unsoldReason: string; // 未售原因
    accountPrice: number; // 账号实付金额
    userCompensationPrice: number; // 用户赔付金额
    platformCompensationPrice: number; // 平台赔付金额
    salePeopleId: number; // 出售人ID
    salePeople: User.IUserItem; // 出售人
    salePrice: number; // 出售金额
    salePlatformId: string; // 出售平台ID
    diffPrice: number; // 差值(出售金额-实际回收金额)
    saleResidenceTime: number; // 滞留天数
    saleTime: Date; // 出售时间
    isSave: Status; // 资料是否存档
    isSales: Status; // 是否已售
    orderId: number; // 工单id
    orderCode: string; // 工单编号
    isWorkOrder: Status; // 是否存在工单
    isPublish: Status; // 是否发布
    groupingId: string; // 回收组ID
    publishSetId: number; // 发布组ID
    publishSet: Dict.IDataItem; // 发布组
    salesSetId: number; // 销售组ID
    salesSet: Dict.IDataItem; // 销售组
    workOrderSetId: number; // 工单组ID
    workOrderSet: Dict.IDataItem; // 工单组
  }
}
