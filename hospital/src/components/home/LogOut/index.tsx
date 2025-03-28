import React from 'react';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Avatar } from 'antd';
import style from './index.module.scss'
import { useTranslation } from 'react-i18next';

// 路由
import { useNavigate } from 'react-router-dom'

// 引入cookie
import cookie from 'react-cookies'


const App: React.FC = () => {
  // 拿路由hook
  let navigateTo = useNavigate();

  const { t,i18n } = useTranslation();

  const items: MenuProps['items'] = [
    {
      label: t('system.modifyPersonInfo'),
      key: '0',
    },
    {
      label: '切换中文',
      key: '1',
    },
    {
      label: 'English',
      key: '2'
    },
    {
      label:'Русский',
      key: '4'
    },
    {
      type: 'divider',
    },
    {
      label: t('login.logout'),
      key: '3',
    },
  ];

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // 获取用户名
  let userName
  const userData = cookie.load('userData')
  if (userData.userIdentity == 1) {
    userName = t('system.admin')+'  ' + userData.adminName + " "
  } else if (userData.userIdentity == 2) {
    userName = t('system.doctor')+ '  ' + userData.doctorName + " "
  } else if (userData.userIdentity == 3) {
    userName = t('system.patient')+ '  ' + userData.patientName + " "
  }

  // 点击事件
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '0') {
      const nowRouter = "/personalInformationManagement"
      // 跳转
      navigateTo(nowRouter)
    } else if (key === '3') {
      // 存储用户信息
      cookie.remove('userData')
      // 跳转
      // navigateTo("/login")
      // message.success("退出登录成功!")
      window.location.href = '/login'; // 跳转到当前路由
      window.location.reload(); // 刷新页面
    }
    changeLanguage(key)
  };

  const changeLanguage = (key) => {
    if (key === '1') {
      localStorage.setItem('i18nextLng', 'zh_CN')
      i18n.changeLanguage('zh_CN')
    } else if (key === '2') {
      localStorage.setItem('i18nextLng', 'en_US')
      i18n.changeLanguage('en_US')
    }else if (key === '4') {
      localStorage.setItem('i18nextLng', 'ru_RU')
      i18n.changeLanguage('ru_RU')
    }
  }
  return (
    <div>
      <Dropdown menu={{ items, onClick }} trigger={['click']} className={style.allPage} >
        <a onClick={(e) => e.preventDefault()}>
          <Avatar src={userData.headImg ? baseUrl + userData.headImg : null}  icon={<UserOutlined />} />
          <div style={window.innerWidth < 700 ? { display: 'none' } : { margin: '0 10px' }}>{t('login.welcome',{name:userName})}</div>
          <DownOutlined style={window.innerWidth < 700 ? { display: 'none' } : {}} />
        </a>
      </Dropdown>
    </div>
  )
}

export default App;