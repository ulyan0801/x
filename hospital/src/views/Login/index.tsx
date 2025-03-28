import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './index.module.scss'
import { Card, Button, Checkbox, Form, Input, message } from 'antd';
import {
  LockOutlined,
  RedoOutlined,
  SendOutlined,
  UserOutlined
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom'

// 引入cookie
import cookie from 'react-cookies'

// 拿接口
import { RegisterAPI, LoginAPI } from "../../apis/api.ts";

import { CheckboxChangeEvent } from 'antd/es/checkbox';

export default function View() {
  const { t,i18n } = useTranslation();


  // 拿路由hook
  const navigateTo = useNavigate();

  // 登陆注册标志
  const [flag, setFlag] = useState(true);
  // 记住我标志
  const [remember, setRemember] = useState(true);
  // 重置
  const [reset, setReset] = useState(false);

  // 登录缓存
  let login = {
    tel: "",
    password: ""
  }
  // 检查有无登录缓存
  const user = JSON.parse(localStorage.getItem("userData")!);
  if (user) {
    login = { ...user };
  }

  // 切换患者注册
  const changeType = () => {
    flag ? setFlag(false) : setFlag(true)
    onReset()
  }
  // 控制检查密码框显示
  let checkPassword
  if (!flag) {
    checkPassword =
      <Form.Item
        // label={t('login.confirmPassword')}
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: t('common.confirmPasswordPlaceholder'),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t('common.passwordMismatch')));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined className={style.siteFormItemIcon} />} placeholder={t('login.confirmPassword')} />
      </Form.Item>
  }

  // 记住我选择框
  const onChange = (e: CheckboxChangeEvent) => {
    setRemember(e.target.checked)
  };

  // 请求成功
  const onFinish = async (values = { tel: "", password: "", userIdentity: 3 }) => {
    if (flag) {
      // 发起登录请求
      const loginAPIRes: LoginAPIRes = await LoginAPI(values)
      // 提示
      if (loginAPIRes.code === 0) {
        message.success(loginAPIRes.msg)
        // 存储用户信息
        cookie.save('userData', loginAPIRes.data, { path: "/" })
        // 跳转
        navigateTo("/index")
      } else {
        message.error(loginAPIRes.msg);
      }
    } else {
      // 发起注册请求
      const registerAPIRes: RegisterAPIRes = await RegisterAPI({
        patientTel: values.tel,
        patientPassword: values.password,
        userIdentity: 3
      })
      // 提示
      registerAPIRes.code === 0 ? message.success(registerAPIRes.msg) : message.error(registerAPIRes.msg);
      // 切换登录状态
      changeType()
    }
    // 是否选择记住我
    if (remember) {
      localStorage.setItem('userData', JSON.stringify(values));
    } else {
      localStorage.removeItem('userData');
    }
  };

  // 登录失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // 重置表单
  const onReset = () => {
    setReset(true);
    setTimeout(() => {
      form.resetFields();
    }, 1);
  };

  const [form] = Form.useForm();

  return (
    <div className={style.allPage}>
      <div className={style.loginBox}>
        <div className={style.title}>{t('login.systemName')}</div>
        <Card title={t('login.systemLogin')} bordered={false} className={style.loginCard}>
          <Form
            name="basic"
            form={form}
            labelAlign='left'
            wrapperCol={{ span: 23 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              initialValue={reset ? "" : login.tel}
              // label={t('login.phoneNumber')}
              name="tel"
              rules={[{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: t('common.phoneInvalid') }]}
              hasFeedback
            >
              <Input prefix={<UserOutlined className={style.siteFormItemIcon} />} placeholder={t('login.phoneNumber')} />
            </Form.Item>
            <Form.Item
              initialValue={reset ? "" : login.password}
              // label={t('login.password')}
              name="password"
              rules={[
                {
                  required: true,
                  message: t('common.passwordPlaceholder'),
                },
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined className={style.siteFormItemIcon} />} placeholder={t('login.password')} />
            </Form.Item>

            {checkPassword}

            <Form.Item valuePropName="checked">
              <Checkbox checked={remember} onChange={onChange}>{t('login.rememberMe')}</Checkbox>
              <Button type="text" style={{ color: '#1677ff' }} onClick={changeType}>
                {t(`patient.${flag ? 'register' : 'login'}`)}
              </Button>
            </Form.Item>

            <Form.Item style={{float:'right',width:'190px'}}>
              <Button type="primary" htmlType="submit">
                {/* <CheckOutlined /> */}
                <SendOutlined />
                {flag ? t('login.loginButton') : t('login.registerButton')}
              </Button>
              <Button htmlType="button" onClick={onReset} style={{ marginLeft: "10px" }}>
                <RedoOutlined />
                {t('login.resetButton')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <div className={style.bottomBox}>
        </div>
      </div>
    </div>
  )
}
