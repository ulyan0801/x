import request from '../utils/request'

export const queryPatientCasePageAPI = (params ) => request.get(`/prescription/patient/${params}`);

export const commonPay = (params) => request.post('/common/pay', params)
