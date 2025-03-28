import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Card, Button, Space, Table, Popover, Form, Input, Popconfirm, message } from 'antd';
import style from './index.module.scss'
import {
  SearchOutlined,
  PlusOutlined,
  RedoOutlined,
  CheckOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

// 拿搜索表单
import SearchForm from '../../../components/SearchForm'

// 拿接口
import { addInformationManagementAPI, delInformationManagementAPI, updateInformationManagementAPI, getInformationManagementAPI } from "../../../apis/api.ts";
import { AxiosRequestConfig } from 'axios';
import { ColumnsType } from 'antd/es/table/InternalTable';

interface DataType {
  departmentId: number | null;
  departmentName: string;
}

export default function View() {
  const { t } = useTranslation();
  // 搜索框
  const [open, setOpen] = useState<boolean | null>(null);

  const options: Array<optionsType> = [
    { value: 'department_name', label: t('departmentManagement.departmentName') },
  ]

  const searchForm = {
    key: options[0].value,
    value: "",
    pageNum: 1,
    pageSize: 10
  }

  // 查到的数据
  const [tableList, setTableList] = useState<QueryAPIRes>();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 搜索框
  const [showSearch, setShowSearch] = useState(true);
  // 每行的数据修改
  const [selectedRow, setSelectedRow] = useState<DataType>();
  // 修改新增标志
  const [changeFlag, setChangeFlag] = useState(true);

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  // 查找方法
  const queryFunc = (optionData: optionsDataType = { key: options[0].value, value: "" }) => {
    searchForm.key = optionData.key
    searchForm.value = optionData.value
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }

  // 查找接口
  const queryAPI = async (searchForm: AxiosRequestConfig<QueryAPIReq>) => {
    // 发起查找请求
    const tableList = await getInformationManagementAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  // 新增修改按钮
  const onFinish = async (values: DataType) => {
    const sumbitForm = {
      departmentId: values.departmentId,
      departmentName: selectedRow?.departmentName
    }
    const returnData = changeFlag ? await addInformationManagementAPI({ departmentName: selectedRow?.departmentName }) : await updateInformationManagementAPI(sumbitForm)
    returnData.code === 0 ? message.success(returnData.msg) : message.success(returnData.msg);
    queryFunc()
    form.setFieldsValue(sumbitForm)
  };
  // 更新数据
  const handleFormChange = (changedValues: DataType) => {
    // 更新选中行的数据状态
    const updatedRow = { ...selectedRow, ...changedValues };
    setSelectedRow(updatedRow);
  };

  // 新增修改表单信息
  const [form] = Form.useForm();
  // 新增修改表单
  const formContent = (record?: DataType) => {
    return (
      <div>
        <Form form={form}
          labelAlign='left'
          onFinish={onFinish}
          labelCol={{ xs: { span: 7 }, sm: { span: 7 } }}
          wrapperCol={{ xs: { span: 17 }, sm: { span: 17 } }}
          onValuesChange={handleFormChange}>
          <Form.Item hidden={record ? false : true} label={t('departmentManagement.departmentID')} name="departmentId" style={{ marginTop: '20px' }}>
            <Input disabled />
          </Form.Item>
          <Form.Item label={t('departmentManagement.departmentName')} name='departmentName' style={{ marginTop: '20px' }}>
            <Input placeholder={t('common.confirm') + t('departmentManagement.departmentName')} />
          </Form.Item>
          <div className={style.btnBox}>
            <Button type="primary" icon={<CheckOutlined />} htmlType="submit"> {record ? t('common.modify') : t('common.add')} </Button>
            <Button onClick={onReset} icon={<RedoOutlined />}>{t('common.reset')}</Button>
          </div>
        </Form>
      </div>
    )
  }

  // 删除
  const deleteBtn = async (id: number) => {
    const deleteFlag = await delInformationManagementAPI(id)
    deleteFlag.code === 0 ? message.success(deleteFlag.msg) : message.success(deleteFlag.msg);
    queryFunc()
  }

  // 重置表单
  const onReset = () => {
    form.resetFields()
  }

  // 表头
  const columns: ColumnsType<DataType> = [
    {
      title: t('departmentManagement.ID'),
      dataIndex: 'departmentId',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 80,
    },
    {
      title: t('departmentManagement.departmentName'),
      dataIndex: 'departmentName',
      align: 'center',
    },
    {
      title: t('common.operation'),
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 200,
      render: (_, record) => {
        return (
          <Space>
            <Popover placement="bottom" title={t('departmentManagement.modifyDepartment') + '：' + record.departmentName} content={formContent(record)} trigger="click">
              <Button size='small' type="link" onClick={() => setChangeFlag(false)}>{t('common.modify')}</Button>
            </Popover>
            <Popconfirm
              placement="bottomRight"
              title={t('common.delete')}
              description={t('system.deleteConfirm', { name: record.departmentName })}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText={t('common.confirmDelete')}
              cancelText={t('common.cancel')}
              onConfirm={() => deleteBtn(record.departmentId as number)}
            >
              <Button size='small' danger type="link" >{t('common.delete')}</Button>
            </Popconfirm >
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
      <span>{t('common.totalItems',{total:tableList?.total})}</span>
    ),
    onChange: (page: number) => handlePageChange(page), //改变页码的函数
    showQuickJumper: true,
  }

  const handlePageChange = (page: number) => {
    searchForm.pageNum = page
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>);
  }

  // 顶部按钮
  // pc端
  const pcTopBtn =
    <Space>
      <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => open === null ? setOpen(true) : setOpen(!open)} />
      <Popover placement="bottomRight" title={t('departmentManagement.addDepartment')} content={formContent} trigger="click">
        <Button type="primary" shape="circle" onClick={() => { setChangeFlag(true); form.setFieldsValue({ departmentName: "" }) }} icon={<PlusOutlined />} />
      </Popover>
    </Space>
  return (
    <Card className={style.allPage} size='small' title={t('departmentManagement.departmentInfoManagement')} extra={pcTopBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* 搜索组件 */}
      <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} open={open} />
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='departmentId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        onRow={(record: DataType) => ({
          onClick: () => {
            form.setFieldsValue(record)
          }
        })}
      />
    </Card>
  )
}
