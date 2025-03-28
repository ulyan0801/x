import { Button, Card, Form, Input, InputNumber, Popover, Space, Table, message } from "antd";
import { useTranslation } from 'react-i18next';
import { CheckOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import SearchForm from "../../../components/drugManagement/DrugEntryAndExitSearchForm";
import { AxiosRequestConfig } from "axios";
import { getScarceDrugsAPI,drugReplenishment } from "../../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";

type DataType = {
  drugsId: number;
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

export default function View() {
  const { t } = useTranslation();
  /* 查找列表开始 */

  // 搜索框
  const [open, setOpen] = useState<boolean | null>(null);
  // 查到的数据
  const [tableList, setTableList] = useState<QueryAPIRes>();
  // 加载状态
  const [loading, setLoading] = useState(true);

  // 字段数组
  const options: Array<optionsType> = [
    { value: 'drugs_name', label: t('drug.name') },
    { value: 'drugs_type', label: t('drug.type') },
    { value: 'production_location', label: t('drug.manufacturer') }
  ]

  // 查找表单
  const searchForm = {
    key: options[0].value,
    value: "",
    flag: 20,
    pageNum: 1,
    pageSize: 10
  }

  // 查找方法
  const queryFunc = (optionData: optionsDataType = { key: options[0].value, value: "", flag: 20 }) => {
    searchForm.key = optionData.key
    searchForm.value = optionData.value
    searchForm.flag = optionData.flag!
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }

  // 查找接口
  const queryAPI = async (searchForm: AxiosRequestConfig<QueryAPIReq>) => {
    // 发起查找请求
    const tableList = await getScarceDrugsAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  // 顶部按钮
  const topBtn = <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => open === null ? setOpen(true) : setOpen(!open)} />

  /* 查找列表结束 */

  /* 表格开始 */

  // 表头
  const columns: ColumnsType<DataType> = [
    {
      title: t('common.id'),
      dataIndex: 'drugsId',
      align: 'center',
      width: 50,
    },
    {
      title: t('drug.type'),
      dataIndex: 'drugsType',
      align: 'center',
    },
    {
      title: t('drug.name'),
      dataIndex: 'drugsName',
      align: 'center',
      ellipsis: true, // 使用ellipsis类实现超出隐藏
    },
    {
      title: t('drug.manufacturer'),
      dataIndex: 'productionLocation',
      align: 'center',
      ellipsis: true, // 使用ellipsis类实现超出隐藏
    },
    {
      title: t('drug.productionDate'),
      dataIndex: 'productionDate',
      align: 'center',
    },
    {
      title: t('drug.termValidity'),
      dataIndex: 'termValidity',
      align: 'center',
    },
    {
      title: t('drug.therapeuticEfficacy'),
      dataIndex: 'therapeuticEfficacy',
      align: 'center',
      width: window.innerWidth < 700 ? 150 : 200,
      ellipsis: true, // 使用ellipsis类实现超出隐藏
    },
    {
      title: t('drug.inventory'),
      dataIndex: 'inventoryNum',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 80,
    },
    {
      title: t('drug.wholesale'),
      dataIndex: 'receiptPrice',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 80,
    },
    {
      title: t('drug.retail'),
      dataIndex: 'deliveryPrice',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 80,
    },
    {
      title: t('drug.position'),
      dataIndex: 'duresPosition',
      align: 'center',
    },
    {
      title: t('common.operation'),
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 100,
      render: (_, record) => {
        return (
          <Space>
            <Popover placement="bottomRight" title={record.drugsName} content={formContent()} trigger="click">
              <Button size='small' type="link">{t('buttons.instock')}</Button>
            </Popover>
          </Space>
        )
      },
    },
  ];
  // 分页
  const paginationProps = {
    current: tableList?.pageNum, //当前页码
    pageSize: tableList?.pageSize, // 每页数据条数
    total: tableList?.total, // 总条数
    showTotal: () => (
      <span>{t('common.totalItems', { total: tableList?.total })}</span>
    ),
    onChange: (page: number) => handlePageChange(page), //改变页码的函数
    showQuickJumper: true,
  }

  const handlePageChange = (page: number) => {
    searchForm.pageNum = page
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>);
  }
  /* 表格结束 */
  interface ChildMethods {
    onReset: () => void;
  }
  // 拿子组件方法
  const childRef = useRef<ChildMethods>(null);
  // 每行的数据修改
  const [selectedRow, setSelectedRow] = useState<DataType>();
  // 新增修改按钮
  const onFinish = async (values: { drugsId: number, drugsAddNum: number }) => {
    const returnData = await drugReplenishment(values)
    returnData.code === 0 ? message.success(returnData.msg) : message.success(returnData.msg);
    childRef.current!.onReset();
    form.setFieldsValue({drugsAddNum:null})
  };
  // 更新数据
  const handleFormChange = (changedValues: DataType) => {
    // 更新选中行的数据状态
    const updatedRow = { ...selectedRow, ...changedValues };
    setSelectedRow(updatedRow);
  };
  // 重置表单
  const onReset = () => {
    form.resetFields()
  }
  // 新增修改表单信息
  const [form] = Form.useForm();
  // 新增修改表单
  const formContent = () => {
    return (
      <div>
        <Form form={form}
          labelAlign='left'
          onFinish={onFinish}
          labelCol={{ xs: { span: 7 }, sm: { span: 7 } }}
          wrapperCol={{ xs: { span: 17 }, sm: { span: 17 } }}
          onValuesChange={handleFormChange}>
          <Form.Item label="ID" name="drugsId" style={{ marginTop: '20px' }}>
            <Input disabled />
          </Form.Item>
          <Form.Item label={t('drugManagement.instock')} name='drugsAddNum' style={{ marginTop: '20px' }}>
            <InputNumber min={0} style={{width:'100%'}} placeholder={t('drugManagement.instockPlaceholder')} />
          </Form.Item>
          <div className={style.btnBox}>
            <Button type="primary" icon={<CheckOutlined />} htmlType="submit"> {t('common.confirm')} </Button>
            <Button onClick={onReset} icon={<RedoOutlined />}>{t('common.reset')}</Button>
          </div>
        </Form>
      </div>
    )
  }
  return (
    <Card className={style.allPage} size='small' title={t('drug.outOfStock')} extra={topBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* 搜索组件 */}
      <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} open={open}  ref={childRef}/>
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='drugsId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 1200, }}
        onRow={(record: DataType) => ({
          onClick: () => {
            form.setFieldsValue(record)
          }
        })}
      />
    </Card>
  )
}
