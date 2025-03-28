// 定义请求、响应类型

// 注册接口
// 请求
interface RegisterAPIReq {
  patientTel: string;
  patientPassword: string;
  userIdentity:number
}
// 响应
interface RegisterAPIRes {
  code: number;
  data: object;
  msg: string;
}

// 登录接口
// 请求
interface LoginAPIReq {
  tel: string;
  password: string;
}
// 响应
interface LoginAPIRes {
  code: number;
  data: object;
  msg: string;
}


// 通用查询接口
// 请求
interface QueryAPIReq {
  key: string;
  value: string;
  pageNum: number;
  pageSize: number;
}

// 查询条件Key接口
interface optionsType {
  value: string,
  label: string
}
// 查询条件data接口
interface optionsDataType{
  key:string,
  value:string
  flag?:number
}

// 响应
interface QueryAPIRes {
  pageNum: number,
  pageSize: number,
  total: number,
  code: number;
  data?: Array<T>;
  msg: string;
}

// 通用响应接口
interface CurrentAPIRes {
  code: number;
  data?: null | Array<T> | object;
  msg: string;
}

// 查管理
interface UpdatePasswordType{
  adminId:number
  adminPassword:string
}
interface DepartmentNameType {
  departmentId: number;
  departmentName: string;
}