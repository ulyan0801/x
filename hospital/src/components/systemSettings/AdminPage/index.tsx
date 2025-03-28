import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Col, Descriptions, Divider, Form, Input, Modal, Row, Space, message, theme } from 'antd';
import { findAdminByIdAPI, updateAdminAPI } from "../../../apis/api";
import UploadHeadImg from '../components/UploadHeadImg';
// 引入cookie
import cookie from 'react-cookies'
import { RedoOutlined, CheckOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import styles from './index.module.scss'


// 类型接口定义
interface AdminDataType {
  adminId: number;
  adminTel: string;
  adminPassword: string;
  adminName: string;
  userIdentity: number;
  createTime: string;
  updateTime: string;
  checkPassword?: string
}

interface UserDataType {
  headImg?: string | null;
  adminId: number;
}

const App: React.FC = () => {
  const { t } = useTranslation();
  // 拿cookie
  const userData: UserDataType = cookie.load("userData");

  // 主题
  const { token } = theme.useToken();
  const formStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 10,
  };

  // 管理员信息
  const [adminData, setAdminData] = useState<AdminDataType>();
  const [changeForm, setChangeForm] = useState<ReactNode>();

  // 根据id查管理员
  const findAdmin = async () => {
    const { data } = await findAdminByIdAPI(userData.adminId)
    // 存储用户信息
    cookie.save('userData', data as AdminDataType, { path: "/" })
    setAdminData(data as AdminDataType)
    setChangeForm(
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={data as AdminDataType}
        autoComplete="off"
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={5} md={6} sm={24} style={{ width: '100%' }} >
            <Form.Item
              label={t('components.systemSettings.AdminPage.adminId')}
              name="adminId"
            >
              <Input allowClear disabled />
            </Form.Item>
          </Col>
          <Col xl={5} md={6} sm={24} style={{ width: '100%' }} >
            <Form.Item
              label={t('components.systemSettings.AdminPage.adminName')}
              name="adminName"
            >
              <Input allowClear placeholder={t('components.systemSettings.AdminPage.adminNamePlaceholder')} />
            </Form.Item>
          </Col>
          <Col xl={5} md={6} sm={24} style={{ width: '100%' }} >
            <Form.Item
              label={t('components.systemSettings.phone')}
              name="adminTel"
            >
              <Input allowClear placeholder={t('components.systemSettings.phonePlaceholder')} />
            </Form.Item>
          </Col>
          <Col xl={9} md={6} sm={24} >
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                  {t('common.confirm')}
                </Button>
                <Button htmlType="button" onClick={() => form.resetFields()} icon={<RedoOutlined />}>
                  {t('common.reset')}
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }

  // 调接口
  useEffect(() => {
    findAdmin()
  }, [])

  // 表单
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const { confirm } = Modal;

  // 提交表单
  const onFinish = (values: AdminDataType) => {
    const { checkPassword, ...submitForm } = values;
    'adminId' in values ? null : submitForm.adminId = adminData?.adminId as number;
    confirm({
      title: t('system.editConfirm'+'?'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      icon: <ExclamationCircleFilled />,
      content: t('common.modify_warning'),
      async onOk() {
        const flagData = await updateAdminAPI(submitForm)
        message.success(flagData.msg);
        findAdmin()
      },
      onCancel() {
        console.log('取消');
      },
    });

  };

  return (
    <div className={styles.allPage}>
      <UploadHeadImg refresh={findAdmin} headImgUrl={userData.headImg} />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Descriptions size='middle' layout="vertical" bordered >
          <Descriptions.Item label={t('components.systemSettings.AdminPage.adminId')}>{adminData?.adminId}</Descriptions.Item>
          <Descriptions.Item label={t('components.systemSettings.name')}>{adminData?.adminName}</Descriptions.Item>
          <Descriptions.Item label={t('components.systemSettings.phone')}>{adminData?.adminTel}</Descriptions.Item>
          <Descriptions.Item label={t('common.password')}>{adminData?.adminPassword}</Descriptions.Item>
          <Descriptions.Item label={t('common.createTime')}>{adminData?.createTime}</Descriptions.Item>
          <Descriptions.Item label={t('common.updateTime')}>{adminData?.updateTime}</Descriptions.Item>
        </Descriptions>
        <div style={formStyle}>
          <div style={{ fontWeight: '600', fontSize: '14px', color: 'rgba(0, 0, 0, 0.88)' }}>{t('components.systemSettings.AdminPage.infoModify')}</div>
          <Divider style={{margin:"15px  0"}} />
          {changeForm}
        </div>
        <div style={formStyle}>
          <div style={{ fontWeight: '600', fontSize: '14px', color: 'rgba(0, 0, 0, 0.88)' }}>{t('components.systemSettings.AdminPage.passwordModify')}</div>
          <Divider style={{margin:"15px  0"}} />
          <Form
            form={changePasswordForm}
            onFinish={onFinish}
            initialValues={adminData}
            autoComplete="off"
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col xl={6} md={6} sm={24} style={{ width: '100%' }} >
                <Form.Item
                  label={t('common.password')}
                  name="adminPassword"
                  rules={[
                    {
                      required: true,
                      message: t('common.passwordPlaceholder'),
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password placeholder={t('common.passwordPlaceholder')} />
                </Form.Item>
              </Col>
              <Col xl={6} md={6} sm={24} style={{ width: '100%' }} >
                <Form.Item
                  label={t('common.confirmPasswordPlaceholder')}
                  name="checkPassword"
                  dependencies={['adminPassword']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: t('common.confirmPasswordRequired'),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('adminPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(t('common.passwordMismatch')));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder={t('common.passwordPlaceholder')} />
                </Form.Item>
              </Col>
              <Col xl={12} md={6} sm={24} >
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                      {t('common.confirm')}
                    </Button>
                    <Button htmlType="button" onClick={() => changePasswordForm.resetFields()} icon={<RedoOutlined />}>
                      {t('common.reset')}
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Space>
    </div>
  )
};

export default App;
