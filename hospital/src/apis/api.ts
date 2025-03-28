// 统一管理项目中所有的请求路径 api
import { AxiosRequestConfig } from "axios";
import request from "./index"
// 引入cookie
import cookie from 'react-cookies'
// 拿cookie
const userData = cookie.load("userData");


/* 登录页面开始 */
// 登录
export const LoginAPI = (params: LoginAPIReq): Promise<LoginAPIRes> => request.post("/user/login", params);
// 注册
export const RegisterAPI = (params: RegisterAPIReq): Promise<RegisterAPIRes> => request.post("/user/register", params);
/* 登录页面结束 */

/* 科室管理开始 */
// 科室信息管理
// 增
export const addInformationManagementAPI = (params: object): Promise<CurrentAPIRes> => request.post("/department", params);
// 删
export const delInformationManagementAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/department/" + params);
// 改
export const updateInformationManagementAPI = (params: object): Promise<CurrentAPIRes> => request.put("/department", params);
// 查
export const getInformationManagementAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/department", { params });
/* 科室管理结束 */

/* 医生管理开始 */
// 医生注册
export const addDoctorAPI = (params: object): Promise<CurrentAPIRes> => request.post("/doctor", params);
//查全部科室
export const queryAllDepartmentAPI = (): Promise<QueryAPIRes> => request.get("/department/queryAllDepartment");
// 根据科室id查全部医生
export const queryDepartmentDoctorAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/doctor/queryDepartmentDoctor", { params });
// 根据id查医生
export const queryOneDoctorAPI = (params: number): Promise<CurrentAPIRes> => request.get("doctor/queryOneDoctor/" + params);
// 修改医生科室
export const updateDoctorDepartmentAPI = (params: object): Promise<CurrentAPIRes> => request.put("/doctor/updateDoctorDepartment", params);
// 删
export const delDoctorAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/doctor/" + params);
// 改
export const updateDoctorAPI = (params: object): Promise<CurrentAPIRes> => request.put("/doctor", params);
// 查
export const getDoctorAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/doctor", { params });
/* 医生管理结束 */

/* 患者信息管理开始 */
// 增
export const addPatientAPI = (params: object): Promise<CurrentAPIRes> => request.post("/patient", params);
// 删
export const delPatientAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/patient/" + params);
// 改
export const updatePatientAPI = (params: object): Promise<CurrentAPIRes> => request.put("/patient", params);
// 查
export const quertPatientAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/patient", { params });
/* 患者信息管理结束 */

/* 药品管理开始 */
// 缺货统计
// 查少于一定数量的药品
export const getScarceDrugsAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("drugs/getScarceDrugs", { params });
// 补货
export const drugReplenishment = (params: object): Promise<CurrentAPIRes> => request.put("/drugs/drugReplenishment", params);
// 药品出入库
// 增
export const adddrugsAPI = (params: object): Promise<CurrentAPIRes> => request.post("/drugs", params);
// 删
export const deldrugsAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/drugs/" + params);
// 改
export const updatedrugsAPI = (params: object): Promise<CurrentAPIRes> => request.put("/drugs", params);
// 查
export const quertdrugsAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/drugs", { params });
/* 药品管理结束 */

/* 系统设置开始 */
// 个人信息管理
// 恢复默认头像
export const restoreDefaultAvatarAPI = (): Promise<CurrentAPIRes> => {
  request.interceptors.request.use(config =>{
    config.headers['userId'] = userData.adminId || userData.patientId || userData.doctorId,
    config.headers['userIdentity'] = userData.userIdentity;
    return config;
  })
  return request.put("/file/restoreDefaultAvatar")
};

// 查管理员信息
export const findAdminByIdAPI = (params: number): Promise<CurrentAPIRes> => request.get("/userAdmin/findAdminById/" + params);
// 改管理员信息
export const updateAdminAPI = (params: object): Promise<CurrentAPIRes> => request.put("/userAdmin/", params);
// 查患者
export const findPatientByIdAPI = (params: number): Promise<CurrentAPIRes> => request.get("/patient/findPatientById/" + params);
// 根据科室id查科室
export const queryDepartmentNameAPI = (params: number) => request.get("/department/queryDepartmentName/" + params);
/* 系统设置结束 */

/* 预约挂号-患者 */
// 增
export const addRegisterAPI = (params: object): Promise<CurrentAPIRes> => request.post("/register", params);
// 删
export const delRegisterAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/register/" + params);
// 改
export const updateRegisterAPI = (params: object): Promise<CurrentAPIRes> => request.put("/register", params);
// 查
export const queryRegisterAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/register", { params });
// 根据科室id查医生
export const findDoctorAPI = (params: number): Promise<CurrentAPIRes> => request.get("/register/" + params);
/* 预约挂号-患者 */

/* 预约信息-医生 */
// 查
export const queryDoctorPageAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/register/queryDoctorPage", { params });
// 更改状态
export const stateChangeAPI = (params: number): Promise<CurrentAPIRes> => request.put("/register/stateChange/" + params);
/* 预约信息-医生 */

/* 处方开具-医生 */
// 查
export const queryPrescriptionPageAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/register/queryPrescriptionPage", { params });
// 查全部药品
export const getAllDrugsPageAPI = (): Promise<CurrentAPIRes> => request.get("/drugs/getAllDrugs");
// 新增处方
export const addPrescriptionAPI = (params: object): Promise<CurrentAPIRes> => request.post("/prescription", params);
/* 处方开具-医生 */

/* 病例归档-医生 */
// 病例分页查看
export const queryCasePageAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/prescription", { params });
// 删
export const delPrescriptionAPI = (params: number): Promise<CurrentAPIRes> => request.delete("/prescription/" + params);
// 根据挂号id查处方药品
export const findPrescriptionDrugAPI = (params: number): Promise<CurrentAPIRes> => request.get("/prescription/" + params);
/* 病例归档-医生 */

/* 处方信息-患者 */
// 处方分页查看
export const queryPatientCasePageAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/prescription/queryPatientCasePage", { params });
/* 处方信息-患者 */

/* 缴费信息-患者 */
// 缴费信息查看
export const queryPatientPayPageAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/prescription/queryPatientPayPage", { params });
// 支付宝沙箱
export const alipayAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/alipay/pay", { params });
/* 缴费信息-患者 */

/* 订单信息-患者 */
// 查询患者订单
export const collectorPatientPageAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/collector/collectorPatientPage", { params });
/* 订单信息-患者 */

/* 未缴费统计-管理员 */
// 未缴费统计
export const queryAdminUnpayPageAPI = (params: AxiosRequestConfig<QueryAPIReq>): Promise<QueryAPIRes> => request.get("/prescription/queryAdminUnpayPage", { params });
/* 未缴费统计-管理员 */

export const commonPayAPI = (params):Promise<QueryAPIRes> => request.post("/common/pay", params);

export const getReservationPatients = (doctorId):Promise<QueryAPIRes> => request.get(`/register/getReservationPatients/${doctorId}`)