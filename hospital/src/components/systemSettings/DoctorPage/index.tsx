import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Card, Col, Descriptions, Divider, Form, Input, Modal, Radio, Row, Space, message, theme } from 'antd';
import { queryOneDoctorAPI, updateDoctorAPI, queryDepartmentNameAPI } from "../../../apis/api";
import style from './index.module.scss'
// 引入cookie
import cookie from 'react-cookies'
import { RedoOutlined, CheckOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import UploadHeadImg from '../components/UploadHeadImg';
import { useTranslation } from 'react-i18next';
// 类型接口定义
interface DoctorDataType {
  doctorId: number;
  headImg:string;
  departmentId: number;
  doctorName: string;
  doctorSex: number;
  doctorAge: number;
  doctorTel: string;
  doctorPassword: string;
  userIdentity: number;
  createTime: string;
  updateTime: string;
  checkPassword?: string
}

const App: React.FC = () => {

  const {t} = useTranslation()
  // 拿cookie
  let userData:DoctorDataType = cookie.load("userData")

  // 医生信息
  const [doctorData, setdoctorData] = useState<DoctorDataType>();
  const [changeForm, setChangeForm] = useState<ReactNode>();
  const [departmentName, setDepartmentName] = useState<string>();
  // 查科室函数

  const queryDepartmentName = async () => {
     const res = await queryDepartmentNameAPI(userData.departmentId)
     setDepartmentName(res.data?.departmentName);
  }
  // 查科室
  useEffect(() => {
    queryDepartmentName()
  }, [])
  console.log(departmentName);
  
  // 性别选择
  const optionsSex = [
    { label: t('common.gender.male'), value: 1 },
    { label: t('common.gender.female'), value: 2 },
  ];

  // 根据id查医生
  const findDoctor = async () => {
    const { data } = await queryOneDoctorAPI(userData.doctorId)
    // 存储用户信息
    cookie.save('userData', data as DoctorDataType, { path: "/" })
    setdoctorData(data as DoctorDataType)
    setChangeForm(
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        initialValues={data as DoctorDataType}
        autoComplete="off"
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label="ID"
              name="doctorId"
            >
              <Input allowClear disabled />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label={t('doctor.name')}
              name="doctorName"
            >
              <Input allowClear placeholder={t('doctorManagement.namePlaceholder')} />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label={t('doctor.gender')}
              name="doctorSex"
            >
              <Radio.Group options={optionsSex} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label={t('doctor.phone')}
              name="doctorTel"
            >
              <Input allowClear placeholder={t('doctorManagement.phonePlaceholder')} />
            </Form.Item>
          </Col>
          <Col xl={8} md={8} sm={24} >
            <Form.Item
              label={t('doctor.age')}
              name="doctorAge"
            >
              <Input allowClear placeholder={t('doctorRegistration.age')} />
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ marginTop: '-10px' }} />
        <Space style={{ float: 'right' }}>
          <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
            {t('common.confirm')}
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()} icon={<RedoOutlined />}>
            {t('common.cancel')}
          </Button>
        </Space>
      </Form>
    )
  }

  // 调接口
  useEffect(() => {
    findDoctor()
  }, [])

  // 表单
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const { confirm } = Modal;

  // 提交表单
  const onFinish = (values: DoctorDataType) => {
    let { checkPassword, ...submitForm } = values;
    'doctorId' in values ? null : submitForm.doctorId = doctorData?.doctorId as number;
    confirm({
      title: t('system.editConfirm'+'?'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      icon: <ExclamationCircleFilled />,
      content: t('system.editConfirm'+'!'),
      async onOk() {
        const flagData = await updateDoctorAPI(submitForm)
        message.success(flagData.msg);
        findDoctor()
      },
      onCancel() {
        console.log('取消');
      },
    });

  };

  return (
    <div className={style.allPage}>
      <UploadHeadImg refresh={findDoctor} headImgUrl={userData.headImg}  />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Descriptions size='middle' layout="horizontal" bordered >
          <Descriptions.Item label="ID">{doctorData?.doctorId}</Descriptions.Item>
          <Descriptions.Item label={t('doctor.department')}>{departmentName}</Descriptions.Item>
          <Descriptions.Item label={t('doctor.name')}>{doctorData?.doctorName}</Descriptions.Item>
          <Descriptions.Item label={t('doctor.phone')}>{doctorData?.doctorTel}</Descriptions.Item>
          <Descriptions.Item label={t('common.password')}>{doctorData?.doctorPassword}</Descriptions.Item>
          <Descriptions.Item label={t('doctor.gender')}>{doctorData?.doctorSex ? t('common.gender.male') : t('common.gender.female')}</Descriptions.Item>
          <Descriptions.Item label={t('doctor.age')}>{doctorData?.doctorAge}</Descriptions.Item>
          <Descriptions.Item label={t('common.createTime')}>{doctorData?.createTime}</Descriptions.Item>
          <Descriptions.Item label={t('common.updateTime')}>{doctorData?.updateTime}</Descriptions.Item>
        </Descriptions>
        <div>
          <Card size='small' title={t('doctor.modifyDoctorInfo')} bordered={true} >
            {changeForm}
          </Card>
          <Card size='small' title={t('doctor.modifyPassword')} bordered={true} style={{ marginTop: '15px' }}>
            <Form
              form={changePasswordForm}
              onFinish={onFinish}
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
              initialValues={doctorData}
              autoComplete="off"
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xl={8} md={8} sm={24} >
                  <Form.Item
                    label={t('common.password')}
                    name="doctorPassword"
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
                    dependencies={['doctorPassword']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: t('common.confirmPasswordPlaceholder'),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('doctorPassword') === value) {
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