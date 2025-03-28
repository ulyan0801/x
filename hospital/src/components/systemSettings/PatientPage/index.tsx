import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Card, Col, Descriptions, Divider, Form, Input, Modal, Radio, Row, Space, message, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { findPatientByIdAPI, updatePatientAPI } from "../../../apis/api";
import style from './index.module.scss'
// 引入cookie
import cookie from 'react-cookies'
import { RedoOutlined, CheckOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import UploadHeadImg from '../components/UploadHeadImg';

// 类型接口定义
interface PatientDataType {
  patientId: number;
  headImg:string;
  patientName: string;
  patientSex: number;
  patientAge: number;
  patientNumber: number;
  patientTel: string;
  patientPassword: string;
  userIdentity: number;
  createTime: string;
  updateTime: string;
  checkPassword?: string
}

const App: React.FC = () => {
// 拿cookie
const { t } = useTranslation();
const userData = cookie.load("userData");

  // 患者信息
  const [patientData, setpatientData] = useState<PatientDataType>();
  const [changeForm, setChangeForm] = useState<ReactNode>();

  // 性别选择
  const optionsSex = [
    { label: t('common.gender.male'), value: 1 },
    { label: t('common.gender.female'), value: 2 },
  ];

  // 根据id查患者
  const findPatient = async () => {
    const { data } = await findPatientByIdAPI(userData.patientId)
    // 存储用户信息
    cookie.save('userData', data as PatientDataType, { path: "/" })
    setpatientData(data as PatientDataType)
    setChangeForm(
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        initialValues={data as PatientDataType}
        autoComplete="off"
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="ID"
              name="patientId"
            >
              <Input allowClear disabled />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label={t('patient.name')}
              name="patientName"
            >
              <Input allowClear placeholder={t('patient.namePlaceholder')} />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label={t('patient.gender')}
              name="patientSex"
            >
              <Radio.Group options={optionsSex} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label={t('patient.phone')}
              name="patientTel"
            >
              <Input allowClear placeholder={t('patient.phonePlaceholder')} />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label={t('patient.age')}
              name="patientAge"
            >
              <Input allowClear placeholder={t('patient.agePlaceholder')} />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label={t('patient.idNumber')}
              name="patientNumber"
            >
              <Input allowClear placeholder={t('patient.idPlaceholder')} />
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ marginTop: '-10px' }} />
        <Space style={{ float: 'right' }}>
          <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
            {t('common.confirm')}
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()} icon={<RedoOutlined />}>
            {t('common.reset')}
          </Button>
        </Space>
      </Form>
    )
  }

  // 调接口
  useEffect(() => {
    findPatient()
  }, [])

  // 表单
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const { confirm } = Modal;

  // 提交表单
  const onFinish = (values: PatientDataType) => {
  const { checkPassword, ...submitForm } = values;
    'patientId' in values ? null : submitForm.patientId = patientData?.patientId as number;
    confirm({
      title: t('system.editConfirm'+'?'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      icon: <ExclamationCircleFilled />,
      content: t('common.modify_warning'),
      async onOk() {
        const flagData = await updatePatientAPI(submitForm)
        message.success(flagData.msg);
        findPatient()
      },
      onCancel() {
        console.log('取消');
      },
    });

  };

  return (
    <div className={style.allPage}>
      <UploadHeadImg refresh={findPatient} headImgUrl={userData.headImg}  />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Descriptions size='middle' layout="horizontal" bordered >
          <Descriptions.Item label="ID">{patientData?.patientId}</Descriptions.Item>
          <Descriptions.Item label={t('patient.name')}>{patientData?.patientName}</Descriptions.Item>
          <Descriptions.Item label={t('patient.phone')}>{patientData?.patientTel}</Descriptions.Item>
          <Descriptions.Item label={t('common.password')}>{patientData?.patientPassword}</Descriptions.Item>
          <Descriptions.Item label={t('patient.gender')}>{patientData?.patientSex ? t('common.gender.male'): t('common.gender.female')}</Descriptions.Item>
          <Descriptions.Item label={t('patient.age')}>{patientData?.patientAge}</Descriptions.Item>
          <Descriptions.Item label={t('patient.idNumber')}>{patientData?.patientNumber}</Descriptions.Item>
          <Descriptions.Item label={t('common.createTime')}>{patientData?.createTime}</Descriptions.Item>
          <Descriptions.Item label={t('common.updateTime')}>{patientData?.updateTime}</Descriptions.Item>
        </Descriptions>
        <div>
          <Card size='small' title={t('patient.modifyInfo')} bordered={true} >
            {changeForm}
          </Card>
          <Card size='small' title={t('patient.modifyPassword')} bordered={true} style={{ marginTop: '15px' }}>
            <Form
              form={changePasswordForm}
              onFinish={onFinish}
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              initialValues={patientData}
              autoComplete="off"
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xl={8} md={8} sm={24} >
                  <Form.Item
                    label={t('common.password')}
                    name="patientPassword"
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
                <Col xl={8} md={6} sm={24} >
                  <Form.Item
                    label={t('common.confirmPasswordPlaceholder')}
                    name="checkPassword"
                    dependencies={['patientPassword']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: t('common.confirmPasswordRequired'),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('patientPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error(t('common.passwordMismatch')));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder={t('common.confirmPasswordPlaceholder')} />
                  </Form.Item>
                </Col>
              </Row>
              <Divider style={{ marginTop: '-10px' }} />
              <Space style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                  {t('common.confirm')}
                </Button>
                <Button htmlType="button" onClick={() => changePasswordForm.resetFields()} icon={<RedoOutlined />}>
                  {t('common.reset')}
                </Button>
              </Space>
            </Form>
          </Card>
        </div>
      </Space>
    </div>
  )
};

export default App;
