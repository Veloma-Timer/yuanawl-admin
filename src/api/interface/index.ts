// 请求响应参数（不包含data）
export interface Result {
  success: string;
  message: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    path: string;
    id: number;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    code: string;
    password: string;
  }
  export interface ResLogin {
    data: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    name: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    name: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResUser {
    id: number;
    isManager: string; // 是否主管
    code: string; // 用户编码（工号）
    name: string; // 用户名称
    tel: string; // 手机号码
    account: string; // 登录账号
    jobStatus: string; // 在职状态
    password: string; // 用户密码
    roleId: number; // 用户角色ID
    branchId: number; // 用户所属门店ID
    deptId: number; // 用户所在组
    isAdmin: number; // 是否为管理员
  }
  export interface Tree {
    id: string;
    name: string;
    leaf?: boolean;
    isLeaf?: boolean;
    children?: Tree[];
  }
}

// 售后工单管理模块
export namespace SalesOrder {
  export interface AccountType {
    accountCode: string;
    accountNumber: number;
    branchId: number;
  }
  export interface ResSalesList {
    accountBranch: string;
    assets: any;
    detail: any[];
    id: string;
    problemTypeId: string;
    accountId: string;
    accountNumber: number;
    reportPersonId: number;
    newHandleId: number;
    orderCheckerId: number;
    branchId: number;
    reason: string;
    name: string;
    accountCode: string;
    accountPrice: string;
    userCompensationPrice: string;
    platformCompensationPrice: string;
    reportPerson: string;
    newHandle: string;
    handleTimes: string;
    newHandleResult: string;
    insure: string;
    recycleBranch: string;
    handleTime: number;
    createdTime: number;
    remark: string;
    orderChecker: string;
    checkerResult: string;
    submitOrderTime: string;
    newHandleTime: string;
    orderStatus: string;
    recycleBranchId: number;
    orderStar: number;
    submitTime: string;
    account: AccountType;
    orderCode: string;
  }
  export interface AddWorkOrder {
    // 基本信息
    basicOrderCode: string; // 工单编号
    basicOrderStar: number; // 工单星级
    basicAccountId: number | string; // 游戏账号
    basicQuestionType: string; // 问题类型
    basicInsure: number | string; // 是否在保
    basicHandleTime: any; // 处理失效
    basicAccSaleInfoAellerName: string; // 出售人姓名
    basicAccSaleInfoSellerTime: string; // 出售时间
    basicAccSaleInfoSellerChannel: string; // 出售渠道
    basicAccSaleInfoOrderNo: string; // 订单编号
    basicAccSaleInfoProductMarkupRate: number; // 商品加价率
    basicAccSaleInfoProductTurnoverCycle: number; // 商品周转周期
    basicAccSaleInfoBuyerPhoneNumber: number; // 买家手机号
    basicAccSaleInfoSellerMark: string; // 销售备注
    basicMessage: string; // 留言
    baiscAnnex: any[]; // 附件
    assets: any[];
    // 售后部门
    afterCustomerServiceId: number; // 处理客服
    afterHandleTime: string; // 处理时间
    afterHandleResult: number; // 处理结果
    afterNotifyOtherDepartments?: number; // 通知其他部门
    afterSalesAssignUsers?: any[]; // 通知他人
    afterSalesCompensationMoney?: number; // 赔付金额
    afterNewSecurityPhone?: number; // 新密保手机
    afterNewSecurityPassword?: number; // 新密码
    afterSpecHandleResult: string; // 售后处理结果备注
    afterSalesInformDeptId: number;
    afterSalesRemark: string; // 售后备注
    afterAnnex: any[]; // 附件
    // 回收部门
    recycleHandleCustomerServiceId: number; // 处理客服
    recycleHandleTime: string; // 处理时间
    recycleHandleResult: number; // 处理结果
    recycleResultRemark: string; // 发布处理结果备注
    recycleRemark: string; // 发布备注
    recycleInformDeptId: number;
    recycleAssignUsers?: any[]; // 通知他人
    recycleAnnex: any[]; // 附件
    // 发布部门
    publishHandleCustomerServiceId: number; // 处理客服
    publishHandleTime: string; // 处理时间
    publishHandleResult: number; // 处理结果
    publishResultRemark: string; // 发布处理结果备注
    publishRemark: string; // 发布备注
    publishInformDeptId: number;
    publishAssignUsers?: any[]; // 通知他人
    publishAnnex: any[]; // 附件
    // 销售部门
    saleHandleCustomerService: number; // 处理客服
    saleHandleTime: string; // 处理时间
    saleHandleResult: number; // 处理结果
    saleCompensationUserMoney: number;
    saleCompensationUserAmount?: number; // 赔付用户金额
    saleNotifyOtherDepartments?: string; // 通知其他部门
    salesAssignUsers?: any[]; // 通知他人
    saleChangeUserNumber: string; // 给用户换号
    sallerName: string; // 出售人姓名
    sallerTime: string; // 出售时间
    sallerChannel: string; // 出售渠道
    saleAccorderNo: string; // 订单编号
    saleAccproductMarkupRate: number; // 商品加价率
    saleAccproductTurnoverCycle: number; // 商品周转周期
    saleAccbuyerPhoneNumber: number; // 买家手机号
    saleAccsellerMark: string; // 销售备注
    salesResultRemark: string; // 销售处理结果备注
    salesRemark: string; // 销售备注填的
    salesInformDeptId: number;
    saleannex: any[]; // 附件
  }

  export interface HistogramValue {
    name: string;
    value: number;
  }
  export interface WorkReport {
    totalNumber: number;
    incrementNumber: number;
    approveNumber: number;
    unApproveNumber: number;
  }
  export interface WorOrderkLine {
    current: HistogramValue[];
    preCurrent: HistogramValue[];
  }
}
// 权限管理模块
export namespace Author {
  export interface RoleList {
    id: string;
    name: string;
    powerId: number;
    roleDesc: string;
    isDelete: string;
    createdBy: string;
    createdTime: string;
    updatedBy: string;
    updatedTime: string;
    disabled: "0" | "1";
  }
  export interface RoleObj {
    name: string; // 角色名
    powerId: number; // 权限表id
    roleDesc: string; // 角色描述
  }
}
// 设置管理模块
export namespace Set {
  export interface ResSalesList {
    sysModule: string;
    handleType: string;
    handleUser: any;
    branch: any;
    handleRole: any;
    handleTime: string;
    status: string;
    handleStatus: string;
    handleDesc: string;
  }

  export interface ResStoreList {
    branchCode: string;
    branchName: string;
  }
  export interface ResAddStore {
    id?: string;
    branchName: string;
    branchCode: string;
    branchContact: { name: string };
    branchAddress: string;
    branchTel: string;
    branchContactId: number;
  }
}
// 首页模块
export namespace HomeSet {
  export interface HistogramValue {
    name: string;
    value: number;
  }

  export interface IDataComparison extends HistogramValue {
    number: number; // 数量
  }

  export interface SalasRanking {
    index: number; // 排名
    name: string; // 客服名称
    salas: number; // 销售额
    branch: string; // 门店名
  }

  export interface Home {
    totalSales: {
      value: number;
      preValue: string; // 昨日同比
    }; // 今日销售总额
    salesQuantity: {
      value: number;
      preValue: string;
    }; // 今日销售数量
    recyclingQuantity: {
      value: number;
      preValue: string;
    }; // 今日回收数量
    averageSellingPrice: {
      value: number;
      preValue: string;
    }; // 今日销售均价
    recoveryAveragePrice: {
      value: number;
      preValue: string;
    }; // 今日回收均价
    totalRecovery: {
      value: number;
      preValue: string;
    }; // 今日回收总额
    totalSalesVolume: {
      value: number;
    }; // 平台总销售量
    overallRecovery: {
      value: number;
    }; // 平台总回收量
    averageDailyNewSales: {
      value: number;
    }; // 平台日均新增销售量
    dailyAverageNewRecyclingVolume: {
      value: number;
    }; // 平台日均新增回收量
    salesPriceMap: Record<string, number>; // 账号销售占比
    recyclingPriceMap: Record<string, number>; // 账号回收占比
    // 工单占比
    workOrderProp: {
      saleAccountNumber: HistogramValue[]; // 已售账号
      workOrderNumber: HistogramValue[]; // 工单数量
    };
    // 平台销售总额
    platformSalas: { name: string; salas: number }[];
    // 销售额排名
    salasRanking: SalasRanking[];
    // 销售组数据对比 -> 统计销售数据
    salesUnit: IDataComparison[];
    // 回收组数据对比 -> 统计回收数据
    recycleUnit: IDataComparison[];
    // 售后组数据对比 -> 统计售后数据
    afterSaleUnit: IDataComparison[];
    // 发布组数据对比 -> 统计发布数据
    publishUnit: IDataComparison[];
  }
  export interface INameAndAmountAndMonty {
    id: number;
    name: string;
    amount: number | string;
    money: number | string;
  }
  export interface mapList {
    id?: number;
    label: string;
    value: number;
  }
  // 销售数据
  export interface ISalesStatistics {
    [x: string]: any;
    salesMoney: number; //   今日销售金额
    salesAmount: number; //   今日销售数量
    markupPercentage: string; //   今日销售加价率

    salesYesterdayAmount: number; // 昨日销售数量
    salesYesterdayMoney: number; // 昨日销售额
    markupPercentageYesterday: string; // 昨日加价率

    salesYearAmount: number; // 同比销售数量
    salesYearMoney: number; // 同比销售额
    markupPercentageYear: string; // 同比加价率

    salesRatio: INameAndAmountAndMonty[]; //   账号销售占比：按照游戏分类，有数量和金额
    salesRanking: INameAndAmountAndMonty[]; //   平台销售额排名：姓名 销售额 销售数量
    salesRankingByAmount: INameAndAmountAndMonty[]; // 平台销售数量排名: 姓名 销售额 销售数量
    salesSetComparison: INameAndAmountAndMonty[]; //   销售组数据对比：按照员工分类 有数量和金额
    salesChannelStatistics: INameAndAmountAndMonty[]; //   渠道销售统计：按照渠道分类(publishPlatform) 有数量和金额
  }
  // 回收数据
  export interface IRecycleStatistics {
    [x: string]: any;
    recycleMoney: number; // 今日回收金额
    recycleAmount: number; // 今日回收数量
    recycleAveMoney: number; // 今日回收均价
    salesAmount: number; // 出售数量
    salesMoney: number; // 出售金额
    unsoldAmount: number; // 未售数量
    unsoldMoney: number; // 未售金额
    ayerRecycleMoney: number; // 昨日回收金额
    ayerRecycleAmount: number; // 昨日回收数量
    ayerRecycleAveMoney: number; // 昨日回收均价
    ayerSalesAmount: number; // 昨日出售数量
    ayerSalesMoney: number; // 昨日出售金额
    ayerUnsoldAmount: number; // 昨日未售数量
    ayerUnsoldMoney: number; // 昨日未售金额
    yoyRecycleMoney: number; // 同比回收金额
    yoyRecycleAmount: number; // 同比回收数量
    yoyRecycleAveMoney: number; // 同比回收均价
    yoySalesAmount: number; // 同比出售数量
    yoySalesMoney: number; // 同比出售金额
    yoyUnsoldAmount: number; // 同比未售数量
    yoyUnsoldMoney: number; // 同比未售金额
    channelList: mapList[];
    recycleChannels: (ComparisonAmount & ComparisonMoney)[];
    recycleService: INameAndAmountAndMonty[]; // 区服
    recycleRankingByProblem: INameAndAmountAndMonty[]; // 区服
    recycleGameType: INameAndAmountAndMonty[]; // 游戏类型
    recycleRatio: INameAndAmountAndMonty[]; // 账号回收占比：游戏分类 数量 金额
    recycleRanking: INameAndAmountAndMonty[]; // 回收排名：用户 数量 金额
    recycleSetComparison: INameAndAmountAndMonty[]; // 回收组数据对比：用户 金额 数量
  }
  // 发布数据
  export interface IPublishStatistics {
    publishMoney: number; // 发布金额
    publishAmount: number; // 发布数量
    publishAveMoney: number; // 发布均价

    ayerPublishMoney: number; // 昨日发布金额
    ayerPublishAmount: number; // 昨日发布数量
    ayerPublishAveMoney: number; // 昨日发布均价

    yoyPublishMoney: number; // 同比发布金额
    yoyPublishAmount: number; // 同比发布数量
    yoyPublishAveMoney: number; // 同比发布均价

    publishRatio: INameAndAmountAndMonty[]; // 账号发布占比：用户 金额 数量
    publishRanking: INameAndAmountAndMonty[]; // 发布额排名：用户 金额 数量
    publishSetComparison?: INameAndAmountAndMonty[]; // 发布组数据对比 按照渠道分类：用户 金额 数量
  }
  export interface BaseWorkOrderEntity {
    account: null;
    accountId: number;
    checkerResult: null;
    createdBy: null;
    createdTime: string;
    detail: string[];
    handleTime: number;
    handleTimes: number;
    id: number;
    insure: string;
    isDelete: string;
    newHandleId: null;
    newHandleResult: null;
    newHandleTime: string;
    orderChecker: null;
    orderCheckerId: null;
    orderCode: string;
    orderStar: number;
    orderStatus: string;
    problemTypeId: number;
    reason: null;
    reportPersonId: number;
    submitOrderTime: string;
    updatedBy: null;
    updatedTime: string;
  }
  // 售后数据
  export interface IAfterSalesStatistics {
    awaitWorkOrder: {
      untreatedAmount: number; // 总共未处理
      finishedAmount: number; // 今日已完成
      pendingList: BaseWorkOrderEntity[]; // 待处理工单列表
    }; // 待办工单
    afterSales: ComparisonAmount[];
    workOrderTypes: INameAndAmountAndMonty[]; // 售后工单类型：按照星级筛选 显示 工单类型 工单数量
    afterSalesSetComparison: INameAndAmountAndMonty[]; // 售后组数据对比：按照星级筛选，显示人 和 数量
  }
  // 数量比较
  export type ComparisonAmount = {
    name: string;
    amount: number; // 当前时间数量
    ringAmount: number; // 环比数量
    yoyAmount: number; // 同比数量
  };
  // 金额比较
  export type ComparisonMoney = {
    name: string;
    money: number; // 当前时间金额
    ringMoney: number; // 环比金额
    yoyMoney: number; // 同比金额
  };
  // 首页销售组数据对比&售后组数据对比
  export interface ISalesAndAfter {
    sales: (ComparisonAmount & ComparisonMoney)[];
    afterSales: ComparisonAmount[];
  }
}

// 数据统计
export namespace Data {
  export interface DateRange {
    [key: string]: number;
  }
  export interface INameAndValue {
    name: string;
    value: number;
  }
  export interface TodaySales {
    salesTotalMoney: number; // 销售总额
    salesTotalNumber: number; // 销售订单量
    markupPercentage: string; // 商品加价率
    platformNumber: number; // 出售渠道个数

    chat: {
      salesTotalMoney: INameAndValue[];
      salesTotalNumber: INameAndValue[];
      markupPercentage: INameAndValue[];
      platformNumber: INameAndValue[];
    }; // 图表数据
  }
  export interface TodayPublish {
    tenTenTotalNumber: number; // 转转发布总数
    webTotalNumber: number; // 网站发布总数
    cycleTotalNumber: number; // 循环发布总数
    totalNumber: number; // 总发布数
    chat: {
      tenTenTotalNumber: INameAndValue[]; // 回收金额
      webTotalNumber: INameAndValue[]; // 回收订单总量
      cycleTotalNumber: INameAndValue[]; // 回收游戏品类
      totalNumber: INameAndValue[]; // 七日未售出数量
    }; // 图表数据
  }
  export interface TodayRecycles {
    recycleTotalMoney: number; // 回收金额
    recycleTotalNumber: number; // 回收订单总量
    gameCategory: number; // 回收游戏品类
    sevenDaysTotalNumber: number; // 七日未售出数量

    chat: {
      recycleTotalMoney: INameAndValue[]; // 回收金额
      recycleTotalNumber: INameAndValue[]; // 回收订单总量
      gameCategory: INameAndValue[]; // 回收游戏品类
      sevenDaysTotalNumber: INameAndValue[]; // 七日未售出数量
    }; // 图表数据
  }
  export interface TodayRecycle {
    recycleNumber: {
      current: keyValue[];
      preCurrent: keyValue[];
    };
    recyclePrice: number;
    arpa: number;
    recycleOrders: number;
    buyNumber: number;
  }
  export interface AccountPublisher {
    name: string;
  }
  export interface SaleList {
    accountCode: string;
    accountType: string;
    accountRecyclerPrice: string;
    salePrice: string;
    accountPublisher: AccountPublisher;
    saleTime: string;
  }
  export interface RecycleList {
    accountCode: string;
    accountType: string;
    accountRecycler: AccountPublisher;
    accountRecyclerTime: string;
    accountRecyclerPrice: string;
  }
  export interface keyValue {
    label: string;
    value: number;
    id?: number;
  }

  export interface SetList {
    set: keyValue[];
  }
  export interface HandleTypeList {
    handleTypes: keyValue[];
  }
}
// 短信管理
export namespace Message {
  export interface Template {
    signature: string;
    corporateName: string;
    content: string;
    status: string;
    time: string;
    text: string;
    phone: string;
  }
  export interface Sending {
    accountId: string;
    reduction: boolean;
    openAccountTime: string;
    message: string;
    phones: string[];
    sendingTime: number;
  }
}

// 字典
export namespace Dict {
  export interface DictParams {
    id: string;
    name: string; //名称
    displayName: string; //展示名称
    description: string; //描述
    pageSize: number;
  }

  export interface Dict {
    name: string; //名称
    code: string; //编码
    key: string;
    displayName: string; //展示名称
    description: string; //描述
    parentId: null | string; //父Id
    isStatic: boolean; //是否静态
    items: any[]; //结果集合
    lastModificationTime: null | string; //最后
    lastModifierId: null | string; //最后修改人id
    creationTime: string; //创建时间
    creatorId: null | string; //创建人Id
    id: string; //id
    extraProperties: any;
  }

  export interface DictItem {
    name: string;
    code: string;
    value: number;
    label: string;
    displayName: string;
    description: null | string;
    parentId: null | string;
    isStatic: boolean;
    items: {
      name: string;
      displayName: string;
      defaultValue: string;
      description: string;
      allowBeNull: boolean;
      valueType: number;
      id: string;
    }[];
    lastModificationTime: string;
    lastModifierId: null | string;
    creationTime: string;
    creatorId: null | string;
    id: string | number;
    extraProperties: any;
  }

  export interface DictItemParams {
    key: string;
    value: {
      label: string;
      id: number;
    }[];
  }
}
