import request from "../utils/request"

// 拿所有药物
export const quertdrugsAPI = (params) => request.get("/drugs", { params });
