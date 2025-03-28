import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, InputNumber, Modal, Select, Space, message } from 'antd';
import { ExclamationCircleFilled, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { addPrescriptionAPI, getAllDrugsPageAPI } from '../../../apis/api';
import TextArea from 'antd/es/input/TextArea';

import { useTranslation } from 'react-i18next';

interface MedicineDataType {
  registerId: number;
  drugsId: number;
  medicineNum: number;
  medicineNotes: string;
}

const { confirm } = Modal;

interface RegistrationDataType {
  registerId: number;
  doctorId: number;
  patientId: number;
  prescriptionDiagnosis?:string;
  medicineList?: Array<MedicineDataType>
}

interface Values {
  title: string;
  RegistrationData: RegistrationDataType
  queryFunc: (optionData?: optionsDataType) => void;
}

interface OptionsType {
  label: string;
  value: number;
}

const App: React.FC<Values> = ({ title, RegistrationData, queryFunc }) => {

  const {t} = useTranslation()

  // 控制开启关闭
  const [open, setOpen] = useState(false);
  // 药物选择
  const [options, setOptions] = useState<Array<OptionsType>>();

  // 查询全部药物
  const findAllDrugs = async () => {
    const { data } = await getAllDrugsPageAPI();
    setOptions(data as Array<OptionsType>)
  }

  // 调用接口
  useEffect(() => {
    findAllDrugs()
  }, [])


  // 提交表单
  const onCreate = (values: any) => {
    let submitForm = {
      ...RegistrationData,
      prescriptionDiagnosis:values.prescriptionDiagnosis,
      children: values.children
    }
    for (let i = 0; i < submitForm.children.length; i++) {
      submitForm.children[i].registerId = RegistrationData.registerId;
    }
    confirm({
      title: t('common.add'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      icon: <ExclamationCircleFilled />,
      content: t('common.confirmAdd'),
      async onOk() {
        const flagData = await addPrescriptionAPI(submitForm)
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

  // 表单信息
  const [form] = Form.useForm();

  return (
    <div>
      <Button
        size='small'
        type="link"
        onClick={() => setOpen(true)}
      >
        {t('prescription.title')}
      </Button>
      <Modal
        open={open}
        title={title}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
        onCancel={onCancel}
        width={800}
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
        <Divider />
        <Form
          form={form}
          name="dynamic_form_nest_item"
          style={{ maxWidth: 800 }}
        >
          <Form.Item
            name='prescriptionDiagnosis'
            label='诊断结果'
          >
            <TextArea rows={4} placeholder="请输入诊断结果" />
          </Form.Item>
          <Form.List name="children">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'drugsId']}
                      label={t('components.prescription.medicineSelection')}
                    >
                      <Select style={{ width: window.innerWidth < 700 ? 90 : 150 }} options={options} placeholder={t('components.prescription.medicineSelection')} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'medicineNum']}
                      label={t('components.prescription.drugCount')}
                    >
                      <InputNumber style={{ width: window.innerWidth < 700 ? 80 : 100 }} min={1} placeholder={t('components.prescription.drugCount')} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'medicineNotes']}
                      label={t('components.prescription.drugUsage')}
                    >
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'medicineNotes']}
                      label={t('components.prescription.drugUsage')}
                    >
                      <Input placeholder={t('compoents.prescription.drugUsage')} style={{ width: window.innerWidth < 700 ? 90 : 260 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    {t('components.prescription.addMedicine')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
        <Divider />
      </Modal>
    </div >
  );
};

export default App;