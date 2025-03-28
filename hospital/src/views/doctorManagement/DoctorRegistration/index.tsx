import { Button, Card, Form, Input, InputNumber, Radio, Select, Space, message, theme, DatePicker,DatePickerProps, Upload, Image } from 'antd'
import { useTranslation } from 'react-i18next';
import style from './index.module.scss'
import { SendOutlined, RedoOutlined } from '@ant-design/icons';
import { addDoctorAPI, queryAllDepartmentAPI } from "../../../apis/api.ts";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

type DoctorFormType = {
  departmentId: number,
  doctorName: string,
  doctorSex: 1 | 2,
  doctorAge: number,
  doctorTel: string,
  doctorPassword: string
  userIdentity: number,
  birthday:string,
  workingAge: number,
  headImg:string,
  workDate:string,
  info:string
}
interface DataType {
  value: number
  label: string;
}

const { TextArea } = Input;

export default function View() {

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const url = info.file.response.data
      setImageUrl(url)
      
    }
  };
  
  // 主题
  const { token } = theme.useToken();
  const formStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: '24px 0 0 0 ',
  };
  
  // 科室列表
  const [options, setOptions] = useState<Array<DataType>>();
  // 调查全部科室接口
  const getAllDepartment = async () => {
    const { data } = await queryAllDepartmentAPI();
    setOptions(data)
  }
  // 调用 
  useEffect(() => {
    getAllDepartment()
  }, [])
  // 拿路由hook
  const navigateTo = useNavigate();
  const { t } = useTranslation();
  // 表单提交
  const onFinish = async (values: DoctorFormType) => {
    const submitObj = values;
    submitObj["userIdentity"] = 2;
    submitObj['headImg'] = imageUrl
    const addFlag = await addDoctorAPI(submitObj)
    if (addFlag.code === 0) {
      message.success(addFlag.msg)
      navigateTo("/doctorInformationManagement")
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  // 性别选择
  const optionsSex = [
    { label: t('common.gender.male'), value: 1 },
    { label: t('common.gender.female'), value: 2 },
  ];

  // 重置表单
  const onReset = () => form.resetFields();
  // 拿表单
  const [form] = Form.useForm();
  return (
    <Card title={t('doctorManagement.registration')} bordered={false} size='small' style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      <div className={style.allPage}  style={formStyle}>
        <div className={style.contentBox}>
          <Form
            form={form}
            labelCol={{ span: 6 }}
            initialValues={{ doctorSex: 1 }}
            onFinish={onFinish}
          >
            <Form.Item
              label={t('doctor.name')}
              name='doctorName'
              rules={[{ required: true, message: t('doctorRegistration.nameRequired') }]}
            >
              <Input placeholder={t('doctorManagement.namePlaceholder')} allowClear />
            </Form.Item>
            <Form.Item
              label={t('doctorRegistration.phone')}
              name='doctorTel'
              rules={[{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: t('doctorRegistration.phoneInvalid') }]}
            >
              <Input placeholder={t('doctorManagement.phonePlaceholder')} allowClear />
            </Form.Item>
            <Form.Item
              label={t('doctor.department')}
              name='departmentId'
              rules={[{ required: true, message: t('doctorRegistration.departmentRequired') }]}
            >
              <Select
                placeholder={t('doctorManagement.departmentPlaceholder')}
                allowClear
                style={{ width: 200 }}
                options={options}
              />
            </Form.Item>
            <Form.Item label={t('doctor.gender')} name='doctorSex'>
              <Radio.Group options={optionsSex} />
            </Form.Item>
            <Form.Item label={t('doctor.birthday')} name='birthday'>
              <DatePicker format='YYYY-MM-DD' />
            </Form.Item>
            <Form.Item label={t('doctor.workDate')} name='workDate'>
              <DatePicker format='YYYY-MM-DD' /> 
            </Form.Item>
            <Form.Item label={t('doctor.info')} name='info'>
              <TextArea rows={4} />
            </Form.Item>
            {/* <Form.Item
              label={t('doctor.age')}
              name='doctorAge'>
              <InputNumber placeholder={t('doctorRegistration.age')} min={1} style={{ width: 120 }} value={dayjs(form.getFieldsValue().birthday).diff(dayjs(), 'year')} />
            </Form.Item> */}
            <Form.Item label={t('common.avatar')}>
              <Upload onChange={handleChange} action='http://localhost:28080/doctor/upload'>
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              label={t('common.password')}
              name="doctorPassword"
              rules={[
                {
                  required: true,
                  message: t('common.passwordRequired'),
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder={t('common.passwordPlaceholder')} />
            </Form.Item>
            <Form.Item
              label={t('login.confirmPassword')}
              name="confirm"
              dependencies={['doctorPassword']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: t('common.confirmPasswordRequired'),
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
            <Form.Item>
              <Space style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />}>{t('login.registerButton')}</Button>
                <Button htmlType="button" onClick={onReset} icon={<RedoOutlined />}>{t('common.reset')}</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Card>
  )
}
