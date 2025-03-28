import request from "../utils/request"

// 拿所有医生
export const getDoctorAPI = (params) => request.get("/doctor", { params });

export const getDoctorsWithOrdered = () => request.get("/doctor/getDoctorsWithOrdered")
