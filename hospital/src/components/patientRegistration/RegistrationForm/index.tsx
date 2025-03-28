import React, { useEffect, useState } from 'react';
import { Alert, Button, DatePicker, Form, InputNumber, Modal, Select, message, theme } from 'antd';
import { addRegisterAPI, findDoctorAPI, queryAllDepartmentAPI } from "../../../apis/api";
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// 引入cookie
import cookie from 'react-cookies'

import { useTranslation } from 'react-i18next';


interface Values {
  title: string;
  queryFunc: (optionData?: optionsDataType) => void;
}

interface RegistrationDataType {
  patientId: string;
  doctorId: string;
  registerCost: number;
  completionStatus: number;
  registerDate: string;
}

type DoctorDataType = {
  doctorId: number | null;
  departmentId: number;
  doctorName: string;
  doctorSex: number;
  doctorAge: number;
  doctorTel: string;
  doctorPassword: string;
  userIdentity: number;
}

interface DepartmentDataType {
  value: number
  label: string;
}
const { confirm } = Modal;

const App: React.FC<Values> = ({ title, queryFunc }) => {
  // 拿cookie
  let userData = cookie.load("userData")

  const { t } = useTranslation();

  // 医生
  const [doctorData, setDoctorData] = useState<Array<DoctorDataType>>();
  // 科室
  const [departmentData, setDepartmentData] = useState<Array<DepartmentDataType>>();
  const [registerDate, setRegisterDate] = useState('2023-01-01 12:00:00');


  // 查医生接口
  const getDoctorData = async (departmentId: number) => {
    const { data } = await findDoctorAPI(departmentId)
    setDoctorData(data as Array<DoctorDataType>)
  }

  // 查科室接口
  const getDepartmentData = async () => {
    const { data } = await queryAllDepartmentAPI()
    setDepartmentData(data as Array<DepartmentDataType>)
  }

  // 查医生,科室
  useEffect(() => {
    getDepartmentData()
  }, [])


  // 控制开启关闭
  const [open, setOpen] = useState(false);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (warning) {
      displayWarning()
      console.log("warning",warning);
      
    }
  },[warning])

  // 提交表单
  const onCreate = (values: RegistrationDataType) => {
    let submitObj = {
      ...values,
      patientId: userData.patientId,
      completionStatus: 0,
      prescriptionStatus: 0,
      registerDate: registerDate
    };
    confirm({
      title: t('common.confirmRegister'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      icon: <ExclamationCircleFilled />,
      content: t('common.confirmRegister'),
      async onOk() {
        const flagData = await addRegisterAPI(submitObj)
        console.log(flagData);
        
        if (flagData.code === -1) {
          setWarning((res) => {
            res = true
            return res
          })
          console.log(warning);
          
        } else {
          setWarning(false)
          message.success(flagData?.msg);
          setTimeout(() => {
            setOpen(false);
            form.resetFields();
          }, 300);
          queryFunc()
          form.resetFields();
        }

      },
      onCancel() {
        form.resetFields();
      },
    });
  };

  // 取消按钮
  const onCancel = () => {
    form.resetFields();
    setOpen(false);
  }

  const [messageApi, contextHolder] = message.useMessage();

  const displayWarning = () => {
      messageApi.open({
        type: 'warning',
        content: t('components.registration.warning'),
        duration: 3,
      })
  }

  // 主题
  const { token } = theme.useToken();
  const formStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };
  // 表单信息
  const [form] = Form.useForm();

  return (
    <div>
      <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => setOpen(true)} />
      {contextHolder}
      <Modal
        open={open}
        title={title}
        width={500}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          style={formStyle}
          initialValues={{ registerCost: '5.5' }}
          name='form'
          labelAlign='left'
        >
          <Form.Item
            label={t('components.registration.department')}
          >
            <Select placeholder={t('components.prescription.pleaseSelectDepartment')} allowClear style={{ width: '100%' }} options={departmentData} onSelect={(value) => getDoctorData(value)} />
          </Form.Item>
          <Form.Item
            name='doctorId'
            label={t('components.registration.doctorName')}
          >
            <Select placeholder={t('components.registration.pleaseSelectDoctor')} allowClear style={{ width: '100%' }} options={doctorData} disabled={doctorData == null} />
          </Form.Item>
          <Form.Item
            label={t('components.registration.appointmentTime')}
          >
            <DatePicker showTime={{ minuteStep: 30, format: 'HH:mm' }} onChange={(_, dateString: [string, string] | string) => setRegisterDate(dateString as string)} format={"YYYY-MM-DD HH:mm:00"} defaultValue={dayjs()} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name='registerCost'
            label={t('components.registration.cost')}
          >
            <InputNumber<string> addonAfter="元" min="0" max="20" step="0.1" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

    </div >
  );
};

export default App;