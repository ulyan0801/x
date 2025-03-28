import request from "../utils/request"

// 增
export const addRegisterAPI = (params) => request.post("/register", params);

// 根据科室id查医生
export const findDoctorAPI = (params) => request.get("/register/" + params);

//查全部科室
export const queryAllDepartmentAPI = () => request.get("/department/queryAllDepartment");