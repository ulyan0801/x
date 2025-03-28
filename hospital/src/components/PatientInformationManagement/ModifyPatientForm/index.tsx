import React, { useState } from 'react';
import { Button, Divider, Form, Input, Modal, Radio, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { updatePatientAPI } from '../../../apis/api';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';


interface Values {
  title: string;
  patientData: PatientDataType;
  columns: Array<ColumnsDataType>;
  queryFunc: (optionData?: optionsDataType) => void;
}

type ColumnsDataType = {
  title: string;
  dataIndex: string;
  align: string;
}

interface PatientDataType {
  patientId: number;
  patientName: string;
  patientSex: number;
  patientAge: number;
  patientNumber: number;
  patientTel: string;
  patientPassword: string;
  userIdentity: number;
}

const { confirm } = Modal;

const App: React.FC<Values> = ({ title, patientData, columns, queryFunc }) => {

  // 控制开启关闭
  const [open, setOpen] = useState(false);

  const {t} = useTranslation()

  // 提交表单
  const onCreate = (values: any) => {
    let submitObj = values;
    submitObj["userIdentity"] = 2;
    confirm({
      title: t('system.editConfirm'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      icon: <ExclamationCircleFilled />,
      content: t('system.deleteConfirm'+'?'),
      async onOk() {
        const flagData = await updatePatientAPI(submitObj)
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
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
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
          initialValues={patientData}
          name={'form_in_modal' + patientData.patientId}
          labelAlign='right'
        >
          <Divider />
          {columns.map((res, index) => {
            const a = <Radio.Group options={optionsSex} name='patientSex' />
            const b = <Input placeholder={t('common.pleaseEnter') + res.title} disabled={res.dataIndex === "patientId" ? true : false} />
            let formItem
            if (res.title != '操作') {
              formItem = <Form.Item
                key={index}
                name={res.dataIndex as string}
                label={res.title as string}
              >
                {res.dataIndex === 'patientSex' ? a : b}
              </Form.Item>
            }
            return formItem
          })}
          <Form.Item
            label={t('common.password')}
            name="patientPassword"
            hasFeedback
          >
            <Input.Password placeholder={t('common.passwordPlaceholder')} />
          </Form.Item>
        </Form>
        <Divider />
      </Modal>
    </div >
  );
};

export default App;