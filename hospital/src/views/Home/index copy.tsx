import React, { useEffect, useState } from 'react';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AntDesignOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button, Avatar } from 'antd';
import style from './index.module.scss'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import type { SubMenuType } from 'rc-menu/lib/interface';

import { useTranslation } from 'react-i18next';


// 导入退出登录组件
import LogOut from '../../components/home/LogOut'
// 引入cookie
import cookie from 'react-cookies'

const { Header, Content, Sider } = Layout;

type MenuItem = SubMenuType;

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// 拿用户信息
let userData = cookie.load("userData")

// 管理员侧边栏
const adminPage = [
  getItem(t('index.home'), '/index', <UserOutlined />),
  getItem(t('departmentManagement.departmentManagement'), '/departmentManagement', <UserOutlined />, [
    getItem(t('departmentManagement.departmentInfoManagement'), '/informationManagement', <UserOutlined />),
    getItem(t('doctor.transfer'), '/doctorJobTransfer', <UserOutlined />),
  ]),
  getItem(t('doctor.management'), '/doctorManagement', <UserOutlined />, [
    getItem(t('doctorManagement.registration'), '/doctorRegistration', <UserOutlined />),
    getItem(t('doctorManagement.informationManagement'), '/doctorInformationManagement', <UserOutlined />),
  ]),
  getItem(t('patient.management'), '/patientInformationManagement', <UserOutlined />),
  getItem(t('page.financialManagement'), '/financialManagement', <UserOutlined />, [
    getItem(t('page.unpaidInformationStatistics'), '/unpaidInformationStatistics', <UserOutlined />),
    getItem(t('page.paymentInformation'), '/financialInformationManagement', <UserOutlined />),
  ]),
  getItem(t('page.drugManagement'), '/drugManagement', <UserOutlined />, [
    getItem(t('page.statistics'), '/drugEntryAndExit', <UserOutlined />),
    getItem(t('page.drugEntryExit'), '/outOfStockStatistics', <UserOutlined />),
  ]),
  getItem(t('page.systemSettings'), '/systemSettings', <UserOutlined />, [
    getItem(t('page.personalInformationManagement'), '/personalInformationManagement', <UserOutlined />),
  ]),
];

// 医生侧边栏
const doctorPage = [
  getItem('系统首页', '/index', <UserOutlined />),
  getItem('预约信息', '/reservationInformation', <UserOutlined />),
  getItem('处方开具', '/prescriptionManagement', <UserOutlined />),
  getItem('病例归档', '/caseFiling', <UserOutlined />),
  getItem('系统设置', '/systemSettings', <UserOutlined />, [
    getItem('个人信息管理', '/personalInformationManagement', <UserOutlined />),
  ]),
];

// 患者侧边栏
const patientPage = [
  getItem(t('page.home'), '/index', <UserOutlined />),
  getItem(t('page.registration'), '/patientRegistration', <UserOutlined />),
  getItem(t('page.prescriptionInformation'), '/prescriptionInformation', <UserOutlined />),
  getItem(t('page.paymentEntry'), '/paymentInformation', <UserOutlined />),
  getItem(t('page.financialInfo'), '/orderingInformation', <UserOutlined />),
  getItem(t('page.systemSettings'), '/systemSettings', <UserOutlined />, [
    getItem(t('page.personalInformationManagement'), '/personalInformationManagement', <UserOutlined />),
  ]),
];

// 侧边栏数据源
const items: MenuItem[] = userData.userIdentity == 1 ? adminPage : userData.userIdentity == 2 ? doctorPage : patientPage

const View: React.FC = () => {
  // 拿当前路由
  const location = useLocation()

  // 跳转路由hook
  const navigateTo = useNavigate();

  // 面包屑列表  
  const [nowBreadcrumbList, setNowBreadcrumbList] = useState([{ title: '系统首页', href: '/index' }]);
  // 初次加载面包屑
  useEffect(() => {
    showBreadcrumbList(location.pathname)
    changeSelect(location.pathname)
  }, [location.pathname])

  // 显示面包屑
  const showBreadcrumbList = (nowPath: string) => {
    // 初始化面包屑
    let nowBreadcrumbListList = [{ title: t('page.home'), href: '/index' }]
    // 寻找面包屑路径下标题      
    for (let i = 0; i < items.length; i++) {
      const element = items[i];
      if (element.key === nowPath && element.key !== "/index") {
        nowBreadcrumbListList.push({ title: element.label as string, href: nowPath })
        break
      }
      if (element.children != null) {
        for (let j = 0; j < element.children.length; j++) {
          const elementChildren: any = element.children[j];
          if (elementChildren.key === nowPath && elementChildren.key !== "/index") {
            nowBreadcrumbListList.push({ title: element.label as string, href: "/index" })
            nowBreadcrumbListList.push({ title: elementChildren?.label, href: nowPath })
            break
          }
        }
      }
    }
    setNowBreadcrumbList(nowBreadcrumbListList)
  }

  // 展开菜单
  let fatherMenuItem: Array<string> = [];
  // 找父级菜单  
  const findFatherMenu = (nowPath: string) => {
    // 现在的路由
    for (let i = 0; i < items.length; i++) {
      const element: any = items[i];
      if (element?.key !== nowPath) {
        if (element?.children != null) {
          for (let j = 0; j < element.children.length; j++) {
            const elementChildren = element.children[j];
            if (elementChildren.key === nowPath) {
              fatherMenuItem.push(element.key);
              break
            }
          }
        }
      }
    }
    return fatherMenuItem
  }
  findFatherMenu(location.pathname)

  // 菜单点击事件
  const menuClick = (e: { key: string, keyPath: Array<string> }) => {
    // 显示面包屑
    showBreadcrumbList(e.keyPath[0]);
    // 修改当前选中
    setNowSelect(e.key)
    // 跳转
    navigateTo(e.key);
  }
  // 当前选中
  const [nowSelect, setNowSelect] = useState(location.pathname);
  // 选中方法
  const changeSelect = (nowPath: string) => {
    setNowSelect(nowPath)
    setOpenKeys(findFatherMenu(nowPath))
  }

  // 当前展开菜单
  const [openKeys, setOpenKeys] = useState(fatherMenuItem)
  const [oldOpenKeys, setOldOpenKeys] = useState([""])
  // 菜单收缩事件
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys([keys[keys.length - 1]])
  }

  // 展开收回菜单
  const [collapsed, setCollapsed] = useState(false);
  // 展开收回事件
  const collapseMenu = () => {
    // 合上前的路由
    setCollapsed(!collapsed)
    // 展开时展开之前的菜单项
    collapsed ? setOpenKeys(oldOpenKeys) : setOldOpenKeys(openKeys)
  }

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    // 布局容器
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider breakpoint="lg" collapsedWidth={window.innerWidth < 700 ? 0 : 75} trigger={null} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className={style.logo} >
          <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
          <div style={collapsed ? { display: 'none' } : { height: '20px', width: '110px', overflow: 'hidden' }}>综合诊所</div>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[nowSelect]}
          selectedKeys={[nowSelect]}
          mode="inline"
          items={items}
          onClick={menuClick}
          onOpenChange={handleOpenChange}
          openKeys={openKeys}
        />
      </Sider>
      {/* 右侧布局 */}
      <Layout style={{ width: "100%" }}>
        {/* 头部布局 */}
        <Header style={{ padding: 0, background: colorBgContainer }} >
          {/* 收起菜单按钮 */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={collapseMenu}
            style={{
              fontSize: '16px',
              width: 50,
              height: 50,
            }}
          />
          {/* 面包屑 */}
          <Breadcrumb
            style={{ margin: ' 0 5px', width: "500px" }}
            separator="/"
            items={nowBreadcrumbList}
          />

          {/* 下拉菜单 */}
          <div style={{ marginLeft: 'auto' }}>
            <LogOut></LogOut>
          </div>

        </Header>
        {/* 内容布局 */}
        <Content style={{ overflowY: 'scroll', maxHeight: 'calc(100vh - 50px)' }}>
          <div style={{ margin: '14px' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default View;

