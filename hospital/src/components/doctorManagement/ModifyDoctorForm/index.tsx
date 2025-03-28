import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, Modal, Radio, Select, message,DatePicker,DatePickerProps,Upload,UploadProps } from 'antd';
import { queryOneDoctorAPI, queryAllDepartmentAPI, updateDoctorAPI } from "../../../apis/api";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import locale from 'antd/locale/zh_CN';
const {TextArea} = Input;

interface Values {
  title: string;
  doctorId: number;
  columns: Array<DataType>;
  queryFunc: (optionData?: optionsDataType) => void;
}

type DataType = {
  title: string;
  dataIndex: string;
  align: string;
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
  birthday: string;
  workingAge: number;
  workDate: string;
  headImg:string;
  info:string;
}

interface DepartmentDataType {
  value: number
  label: string;
}

const { confirm } = Modal;

const App: React.FC<Values> = ({ title, doctorId, columns, queryFunc }) => {

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

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const {t} = useTranslation();
  // 医生
  const [doctorData, setDoctorData] = useState<DoctorDataType>();
  // 科室
  const [departmentData, setDepartmentData] = useState<Array<DepartmentDataType>>();

  // 查医生接口
  const getDoctorData = async () => {
    const { data } = await queryOneDoctorAPI(doctorId)
    setDoctorData(data as DoctorDataType)
    console.log(data);
    data.birthday = dayjs(data.birthday, 'YYYY-MM-DD')
    data.workDate = dayjs(data.workDate, 'YYYY-MM-DD')
    setImageUrl(data.headImg)
    form.setFieldsValue({...data})
    
  }

  // 查科室接口
  const getDepartmentData = async () => {
    const { data } = await queryAllDepartmentAPI()
    setDepartmentData(data as Array<DepartmentDataType>)
    console.log(data);
    
  }

  // 查医生,科室
  useEffect(() => {
    getDoctorData()
    getDepartmentData()
  }, [])

  // 控制开启关闭
  const [open, setOpen] = useState(false);

  // 提交表单
  const onCreate = (values: any) => {
    let submitObj = values;
    submitObj["userIdentity"] = 2;
    confirm({
      title: t('system.editConfirm'+'?'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      icon: <ExclamationCircleFilled />,
      content: t('common.modify_warning'),
      async onOk() {
        const flagData = await updateDoctorAPI(submitObj)
        message.success(flagData.msg);
        setTimeout(() => {
          setOpen(false);
        }, 300);
        queryFunc()
      },
      onCancel() {
        console.log('取消');
      },
    });
  };

  // 取消按钮
  const onCancel = () => {
    setOpen(false);
  }

  // 表单布局  
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  // 性别选择
  const optionsSex = [
    { label: t('common.gender.male'), value: 1 },
    { label: t('common.gender.female'), value: 2 },
  ];

  // 表单信息
  const [form] = Form.useForm();
  return (
    <div>
      <Button
        size='small'
        type="link"
        onClick={() => setOpen(true)}
      >
        {t('common.edit')}
      </Button>
      <Modal
        open={open}
        title={title}
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
          {...formItemLayout}
          form={form}
          initialValues={doctorData}
          name={'form_in_modal' + doctorId}
          labelAlign='left'
        >
          <Divider />
          {columns.map((res, index) => {
            const a = <Radio.Group options={optionsSex} name='doctorSex' />
            const b = <Input placeholder={t('common.pleaseEnter') + res.title} disabled={res.dataIndex === "doctorId" ? true : false} />
            const c = <Select placeholder={t('components.prescription.pleaseSelectDepartment')} allowClear style={{ width: 200 }} options={departmentData} />
            let formItem
            if (res.title != t('common.operation')) {
              formItem = <Form.Item
                key={index}
                name={res.title === '所属科室' ? 'departmentId' :res.dataIndex as string}
                label={res.title as string}
              >
                {res.dataIndex === 'doctorSex' ? a : (res.title === '所属科室' ? c : b)}
              </Form.Item>
            }
            return formItem
          })}
          <Form.Item
            label={t('common.password')}
            name="doctorPassword"
            hasFeedback
          >
            <Input.Password placeholder={t('common.pleaseEnter')} />
          </Form.Item>
          <Form.Item label={t('doctor.birthday')} name='birthday' >
              <DatePicker  format='YYYY-MM-DD'  />
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
        </Form>
        <Divider />
      </Modal>
    </div >
  );
};

export default App;