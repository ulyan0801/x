import React from 'react'
import ReactDOM from 'react-dom/client'
// 样式初始化
import "reset-css"
// 全局样式
import "@/assets/style/global.module.scss"
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import "./i18n";

// import Router from './router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
