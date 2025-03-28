import React, { forwardRef } from 'react';
import { Button, Space, Select, Form, Input, Col, Row } from 'antd';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons/lib/icons';
import { AxiosRequestConfig } from 'axios';
import styles from './index.module.scss'
import { useTranslation } from 'react-i18next';

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

type propsType = {
  options: optionsType[];
  queryFunc: (optionData?: optionsDataType) => void;
  queryAPI: (searchForm: AxiosRequestConfig<QueryAPIReq>) => Promise<void>;
  open: boolean | null;
  ref:any
}

const App: React.FC<propsType> = forwardRef((props: propsType,ref) => {

  const { t } = useTranslation()

  // 表单信息
  const [form] = Form.useForm();

  // 重置查找
  const onReset = () => {
    // 重置表单
    form.resetFields();
    // 重新查找
    props.queryFunc({ key: props.options[0].value, value: '',flag:20 })
  };
  
  // 暴露给父组件
  React.useImperativeHandle(ref, () => ({
    onReset
  }));

  // 查找
  const onFinish = (values: any) => {
    // 调用父级的查找方法
    props.queryFunc(values)
  };

  const optionsNum=[
    { value: 20, label: '20' },
    { value: 40, label: '40' },
    { value: 80, label: '80' },
    { value: 100, label: '100' },
  ] 

  return (
    <div className={`${styles.allPage} ${props.open === null ? styles.allPageFirst :props.open ? styles.allPageOpen : styles.allPageClose}`}>
      <Form
        form={form}
        style={{ maxWidth: 850 }}
        initialValues={{ key: props.options[0].value, flag:20}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xl={7} md={9} xs={24} >
            <Form.Item
              label={t('components.searchForm.label')}
              name="key"
            >
              <Select
                style={{ width: '100%' }}
                options={props.options}
              />
            </Form.Item>
          </Col>
          <Col xl={7} md={9} sm={24} style={{ width: '100%' }} >
            <Form.Item
              label={t('components.searchForm.value')}
              name="value"
            >
              <Input allowClear placeholder={t('components.searchForm.placeholder')} />
            </Form.Item>
          </Col>
          <Col xl={7} md={9} sm={24} style={{ width: '100%' }} >
            <Form.Item
              label={t('components.searchForm.min_num')}
              name="flag"
            >
            <Select
              style={{ width: '100%' }}
              options={optionsNum}
            />
            </Form.Item>
          </Col>
          <Col xl={3} md={6} sm={24} >
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  {t('common.search')}
                </Button>
                <Button htmlType="button" onClick={onReset} icon={<RedoOutlined />}>
                  {t('common.reset')}
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form></div>
  )
})

export default App;