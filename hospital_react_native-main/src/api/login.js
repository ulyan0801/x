import request from '../utils/request'

// 登录
export const LoginAPI = (params) => request.post("/user/login", params);

// 注册
export const RegisterAPI = (params) => request.post("/user/register", params);

export const IndexTest = (params) => request.get("/user/indexTest")
