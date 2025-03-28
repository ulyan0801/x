import React, { lazy } from 'react'
// 加载组件
import LoadingPage from '../components/LoadingPage'

// 懒加载
const Home = lazy(() => import("../views/Home"))
const Login = lazy(() => import("../views/Login"))
const Index = lazy(() => import("../views/Index"))
const InformationManagement = lazy(() => import("../views/departmentManagement/InformationManagement"))
const PatientInformationManagement = lazy(() => import("../views/PatientInformationManagement"))
const DoctorJobTransfer = lazy(() => import("../views/departmentManagement/DoctorJobTransfer"))
const DoctorRegistration = lazy(() => import("../views/doctorManagement/DoctorRegistration"))
const DoctorInformationManagement = lazy(() => import("../views/doctorManagement/DoctorInformationManagement"))
const PersonalInformationManagement = lazy(() => import("../views/systemSettings/PersonalInformationManagement"))

// 重定向组件
import { Navigate, RouteObject } from 'react-router-dom'
import DrugEntryAndExit from '../views/drugManagement/DrugEntryAndExit'
import OutOfStockStatistics from '../views/drugManagement/OutOfStockStatistics'
import UnpaidInformationStatistics from '../views/financialManagement/UnpaidInformationStatistics'
import FinancialInformationManagement from '../views/financialManagement/FinancialInformationManagement'
import PatientRegistration from '../views/PatientRegistration'
import PrescriptionInformation from '../views/PrescriptionInformation'
import PaymentInformation from '../views/PaymentInformation'
import CaseFiling from '../views/CaseFiling'
import PrescriptionManagement from '../views/PrescriptionManagement'
import ReservationInformation from '../views/ReservationInformation'
import OrderingInformation from '../views/OrderingInformation'
// 写法简化
const withLoadingComponent = (comp: JSX.Element) => (
    // 懒加载
    <React.Suspense fallback={<LoadingPage />}>
        {comp}
    </React.Suspense>
)


// 医生路由
const adminRouter: RouteObject[] = [
    {
        // 首页
        path: "/index",
        element: withLoadingComponent(<Index />)
    },
    {
        // 科室信息管理
        path: "/informationManagement",
        element: withLoadingComponent(<InformationManagement />)
    },
    {
        // 医生岗位迁移
        path: "/doctorJobTransfer",
        element: withLoadingComponent(<DoctorJobTransfer />)
    },
    {
        // 医生注册登记
        path: "/doctorRegistration",
        element: withLoadingComponent(<DoctorRegistration />)
    },
    {
        // 医生信息管理
        path: "/doctorInformationManagement",
        element: withLoadingComponent(<DoctorInformationManagement />)
    },
    {
        // 患者信息管理
        path: "/patientInformationManagement",
        element: withLoadingComponent(<PatientInformationManagement />)
    },
    {
        // 缺货统计
        path: "/drugEntryAndExit",
        element: withLoadingComponent(<DrugEntryAndExit />)
    },
    {
        // 药品出入库
        path: "/outOfStockStatistics",
        element: withLoadingComponent(<OutOfStockStatistics />)
    },
    {
        // 个人信息管理
        path: "/personalInformationManagement",
        element: withLoadingComponent(<PersonalInformationManagement />)
    },
    {
        // 未缴费信息统计
        path: "/unpaidInformationStatistics",
        element: withLoadingComponent(<UnpaidInformationStatistics />)
    },
    {
        // 财务信息管理
        path: "/financialInformationManagement",
        element: withLoadingComponent(<FinancialInformationManagement />)
    },
    {
        // 患者预约挂号
        path: "/patientRegistration",
        element: withLoadingComponent(<PatientRegistration />)
    },
    {
        // 患者处方信息
        path: "/prescriptionInformation",
        element: withLoadingComponent(<PrescriptionInformation />)
    },
    {
        // 患者缴费信息
        path: "/paymentInformation",
        element: withLoadingComponent(<PaymentInformation />)
    },
    {
        // 患者顶单信息
        path: "/orderingInformation",
        element: withLoadingComponent(<OrderingInformation />)
    },
    {
        // 医生病例归档
        path: "/caseFiling",
        element: withLoadingComponent(<CaseFiling />)
    },
    {
        // 医生处方管理
        path: "/prescriptionManagement",
        element: withLoadingComponent(<PrescriptionManagement />)
    },
    {
        // 医生预约信息
        path: "/reservationInformation",
        element: withLoadingComponent(<ReservationInformation />)
    },
    
    
]

const routes = [
    // 嵌套路由
    {
        path: "/",
        element: <Navigate to="/login" />
    },
    {
        path: "/",
        element: <Home />,
        children: [{}]
    },
    {
        path: "/login",
        element: withLoadingComponent(<Login />)
    },
]

routes[1].children = adminRouter


export default routes


