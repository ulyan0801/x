import { Card } from 'antd'
import style from './index.module.scss'
// 引入cookie
import cookie from 'react-cookies'
import AdminPage from '../../../components/systemSettings/AdminPage'
import DoctorPage from '../../../components/systemSettings/DoctorPage'
import PatientPage from '../../../components/systemSettings/PatientPage'
import { useTranslation } from 'react-i18next'
export default function View() {

  // 拿用户信息
  let userData = cookie.load("userData")

  const {t} = useTranslation()

  // 判断哪个用户登录
  let showPage
  if (userData.userIdentity === 1) {
    showPage = <AdminPage />
  } else {
    showPage = userData.userIdentity === 2 ? <DoctorPage /> : <PatientPage />
  }

  return (
    <Card className={style.allPage} size='small' title={t('page.personalInformationManagement')} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {showPage}
    </Card>
  )
}