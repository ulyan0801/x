import style from './index.module.scss'
// 引入cookie
import cookie from 'react-cookies'
import DoctorPage from '../../components/index/DoctorPage'
import AdminPage from '../../components/index/AdminPage'
import PatientPage from '../../components/index/PatientPage'
import IndexCommon from '../../components/index/IndexCommon'
export default function View() {

  // 拿用户信息
  let userData = cookie.load("userData")

  // 判断哪个用户登录
  let showPage
  if (userData.userIdentity === 1) {
    showPage = <AdminPage />
  } else {
    showPage = userData.userIdentity === 2 ? <DoctorPage /> : <PatientPage />
  }

  return (
    <div>
      <IndexCommon />
      {showPage}
    </div>
  )
}