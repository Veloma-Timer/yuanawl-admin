export namespace Commodity {
  export interface accountClass {
    id: string;
    typeCode: string;
    typeName: string;
  }

  export interface phoneLibrary {
    id: string;
    index?: number;
    openAccountName: string;
    openAccountNumber: string;
    isBindingEmail: string;
    isBindingWechat: string;
    isBindingYuanshen: string;
    bindingTimes: number;
    bindingQQTimes: number;
    VNO: string;
    openAccountTime: string;
    remark: string;
  }

  export interface Account {
    id: number;
    accountType: number[]; // 账号分类(游戏分类)
    orderId: number; // 工单id
    recycleOrder: string;
    account: string;
    isPublish: "1" | "0"; // 是否发布
    accountTypeNames: string;
    salesCode: string;
    publishPlatform: string[]; // 发布平台
    accountCode: string; // 账号编码(用户输入，唯一)
    storeId: number; // 回收门店
    groupingId: string; // 回收组
    accountTitle: string; // 账号标题
    recycleMethod: string; // 回收方式
    accountRecyclerId: string; // 回收人
    accountRecyclerTime: string; // 回收时间
    accountRecyclerPrice: number; // 回收价格
    accountPublisherId: number; // 发布人
    accountPublisherTimer: Date; // 发布时间
    accountNumber: string; // 账号
    accountPassword: string; // 密码
    accountTel: string; // 手机号
    accountDesc: string; // 描述
    isWorkOrder: string; // 是否有工单
    haveSecondary: string; // 有无二次
    accountRemark: string; // 备注
    campId: string; // 营地号
    netUpload: number; // 网络上传
    // transCatUploaded: number; // 交易猫是否上架
    transCatUid: string; // 交易猫uid'
    // accountLevel: string; // 账号等级
    noSaleResidenceTime: number; // 滞留时间(回收时间-当前日期)
    unsoldReason: string; // 未售原因
    salePrice: number; // 出售金额
    salePlatformId: string; // 出售平台
    diffPrice: number; // 差值(出售金额-实际回收金额)
    saleResidenceTime: number; // 滞留时间(回收时间-出售时间)
    saleTime: Date; // 出售时间
    isSave: string; // 资料是否存档
    accountPrice: number; // 账号实付金额
    userCompensationPrice: number; // 用户赔付金额
    platformCompensationPrice: number; // 平台赔付金额
    branchId: number; // 门店id
    branchName: string; // 门店名称
    salePeopleId: string;
  }

  export interface Recovery {
    accountTypeNames: string;
    accountTitle: string; // 账号标题
    branchId: number; // 所属门店ID
    isWorkOrder: "1" | "0";
    orderId: number;
    accountCode: string; // 账号编码
    accountType: number[]; // 账号分类
    account: string;
    groupingId: string; // 回收组
    accountDesc: string; // 账号描述
    accountNumber: string; // 账号
    accountPassword: string; // 密码
    phoneRemark: string; // 手机卡备注
    email: string; // 邮箱
    recycleMethod: string; // 回收方式
    isSave: string; // 是否保存
    emailSecret: string; // 邮箱密保
    // system?: SysMapEntity; // 系统
    systemId: number; // 系统ID
    accountRemark: string; // 账号备注
    campId: string; // 营地号
    haveSecondary: string; // 实名情况
    accountRecyclerPrice: number; // 回收价格
    recycleOrder: string; // 回收订单号
    recycleRemark: string; // 回收备注
    storeId: number; // 回收门店ID
    // store?: SysMapEntity; // 回收门店
    accountTel: string; // 密保手机
    accountRecyclerTime: string; // 回收时间
    // accountRecycler?: SysUserEntity; // 回收人
    accountRecyclerId: number; // 回收人ID
  }
  export interface Sales {
    id: number;
    orderId: number;
    isWorkOrder: "1" | "0";
    accountType: number[]; // 账号分类
    noSaleResidenceTime: string;
    isSales: "1" | "0";
    isPublish: "1" | "0";
    // "salePeople"?: SysUserEntity; // 出售人
    salePeopleId: number; // 出售人ID
    saleTime: string; // 出售时间
    salePrice: string; // 出售金额
    salePlatformId: string; // 出售平台
    salesCode: string; // 销售订单编号
    buyerTel: string; // 买家手机号
    salesRemark: string; // 销售备注
    accountTitle: string; // 账号标题
    branchId: number; // 所属门店ID
    accountCode: string; // 账号编码
    accountNumber: string; // 账号
    accountPassword: string; // 密码
    phoneRemark: string; // 手机卡备注
    email: string; // 邮箱
    emailSecret: string; // 邮箱密保
    // system?: SysMapEntity; // 系统
    systemId: number; // 系统ID
    accountRemark: string; // 账号备注
    campId: string; // 营地号
    haveSecondary: string; // 实名情况
    accountRecyclerPrice: number; // 回收价格
    recycleOrder: string; // 回收订单号
    recycleRemark: string; // 回收备注
    storeId: number; // 回收门店ID
    // store?: SysMapEntity; // 回收门店
    accountTel: string; // 密保手机
    accountRecyclerTime: string; // 回收时间
    // accountRecycler?: SysUserEntity; // 回收人
    accountRecyclerId: number; // 回收人ID
    // "addPriceRate"?: number; // 商品加价率
    // "conversionCycle"?: number; // 商品周转周期
  }
  export interface Release {
    id: number;
    isWorkOrder: "1" | "0";
    orderId: number;
    publishRemark: string; // 发布备注
    isSales: "1" | "0";
    accountPublisherId: number; // 发布人ID
    accountTitle: string; // 账号标题
    branchId: number; // 所属门店ID
    accountCode: string; // 账号编码
    accountType: number; // 账号分类
    accountNumber: string; // 账号
    accountPassword: string; // 密码
    phoneRemark: string; // 手机卡备注
    email: string; // 邮箱
    emailSecret: string; // 邮箱密保
    // system?: SysMapEntity; // 系统
    systemId: number; // 系统ID
    accountRemark: string; // 账号备注
    campId: string; // 营地号
    haveSecondary: string; // 实名情况
    accountRecyclerPrice: number; // 回收价格
    recycleOrder: string; // 回收订单号
    recycleRemark: string; // 回收备注
    storeId: number; // 回收门店ID
    // store?: SysMapEntity; // 回收门店
    accountTel: string; // 密保手机
    accountRecyclerTime: string; // 回收时间
    rollBackTimer: string; // 回滚时间
    // accountRecycler?: SysUserEntity; // 回收人
    accountRecyclerId: number; // 回收人ID
    // "accountPublisher"?: SysUserEntity; // 发布人
    accountPublisherTimer: string; // 发布时间
    isPublish: string; // 状态
    publishPrice: string; // 商品首次定价
    accountDesc: string; // 账户描述
    publishPlatform: string[]; // 发布平台(可以是多个)
    rollBackPlatform: string[]; // 发布平台(可以是多个)
    // "accountHandle": string; // 账号处理
    // "handleUserId": number; // 账号处理人ID
    // "handleUser"?: SysUserEntity; // 账号处理人
    // "handleTime": string; // 账号处理时间
  }
}
