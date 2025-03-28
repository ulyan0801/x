import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, Modal, Row, message, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { adddrugsAPI, updatedrugsAPI } from "../../../apis/api";
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';


interface Values {
  title: string;
  drugData?: DrugDataType;
  columns: Array<DataType>;
  queryFunc: (optionData?: optionsDataType) => void;
}

type DataType = {
  title: string;
  dataIndex: string;
  align: string;
}

type DrugDataType = {
  drugsId?: number;
  drugsType: string;
  drugsName: string;
  productionLocation: string;
  productionDate: string;
  termValidity: string;
  therapeuticEfficacy: string;
  inventoryNum: number;
  receiptPrice: number;
  deliveryPrice: number;
  duresPosition: string;
}


const { confirm } = Modal;

const App: React.FC<Values> = ({ title, drugData, columns, queryFunc }) => {
  const { t } = useTranslation();

  // 控制开启关闭
  const [open, setOpen] = useState(false);
  console.log(drugData)
  // 提交表单
  const onCreate = (values: DrugDataType) => {
    const submitObj = values;
    if (title !== t('drug.stock_management') && drugData) {
      submitObj.drugsId = drugData?.drugsId
    }
    console.log(values)
    confirm({
      title: title === t('drug.stock_management') ? t('drug.stock_confirm') : t('system.editConfirm'+'?'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      icon: <ExclamationCircleFilled />,
      content: title === t('drug.stock_management') 
        ? t('drug.stock_content', { name: values?.drugsName }) 
        : t('common.modify_warning'),
      async onOk() {
        const flagData = title === t('drug.stock_management') ? await adddrugsAPI(submitObj) : await updatedrugsAPI(submitObj)
        message.success(flagData?.msg);
        setTimeout(() => {
          setOpen(false);
          form.resetFields();
        }, 300);
        queryFunc()
      },
      onCancel() {
        // 取消操作无需处理
      },
    });
  };

  // 取消按钮
  const onCancel = () => {
    form.resetFields();
    setOpen(false);
  }

  // 表单布局
  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 19 },
    },
  };

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
  // 按钮

  return (
    <div>
      {title === t('drug.stock_management') ? (
        <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => setOpen(true)} />
      ) : (
        <Button size="small" type="link" onClick={() => setOpen(true)}>
          {t('common.modify')}
        </Button>
      )}
      <Modal
        open={open}
        title={title}
        width={900}
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
          style={formStyle}
          layout={window.innerWidth < 700 ? 'horizontal' : 'inline'}
          initialValues={drugData}
          name={'form_in_modal' + drugData?.drugsId}
          labelAlign='left'
        >
          {columns.map((res, index) => {
            if (res.title !== t('common.operation') && res.title !== 'ID') {
              return <Col style={{ width: '100%' }} span={window.innerWidth < 700 ? 24 : 12} key={index}>
                <Form.Item
                  style={window.innerWidth < 700 ?{}:{ margin: '10px ' }}
                  key={index}
                  name={res.dataIndex as string}
                  label={res.title as string}
                >
                  <Input placeholder={t(t('common.pleaseEnter'), { field: t(`form.label.${res.dataIndex}`) })} />
                </Form.Item>
              </Col>
            }
          })}
        </Form>
      </Modal>
    </div >
  );
};

export default App;
