import request from "../utils/request"

// 查
export const queryRegisterAPI = (params) => request.get("/register", { params });

// 删
export const delRegisterAPI = (params) => request.delete("/register/" + params);