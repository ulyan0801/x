import { useRoutes,useLocation,useNavigate } from 'react-router-dom'
import {useEffect} from 'react'
import router from './router'
// 引入cookie
import cookie from 'react-cookies'

import { useTranslation } from 'react-i18next'

// 去登录页的组件
function ToLogin(){
  const navigateTo = useNavigate();
  useEffect(()=>{
    navigateTo("/login")
  },[])
  return <div></div>
}

// 去首页的组件
function ToIndex(){
  const navigateTo = useNavigate();
  useEffect(()=>{
    navigateTo("/index")
  },[])
  return <div></div>
}



// 路由守卫
function BeforeRouterEnter(){
  const outlet = useRoutes(router); 

  // 拿当前路由信息
  const location = useLocation();   
  // 拿cookie
  let nowCookie = cookie.load("userData")

  if (location.pathname !== "/login"  && !nowCookie) {
    return <ToLogin />
  }

  if (location.pathname === "/login"  && nowCookie) {
    return <ToIndex />
  }

  return outlet
}

function App() {
  const {t} = useTranslation()
  return (
    <div style={{overflow:'hidden'}}>
      <BeforeRouterEnter />
    </div>
  )
}

export default App
