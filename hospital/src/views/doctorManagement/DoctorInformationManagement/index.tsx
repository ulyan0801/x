import { Button, Card, Popconfirm, Space, Table, message } from "antd";
import { useTranslation } from 'react-i18next';
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import SearchForm from "../../../components/SearchForm";
import { AxiosRequestConfig } from "axios";
import { getDoctorAPI, delDoctorAPI } from "../../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";
import ModifyForm from '../../../components/doctorManagement/ModifyDoctorForm'

type DataType = {
  doctorId: number | null;
  departmentId: number;
  doctorName: string;
  doctorSex: number;
  doctorAge: number;
  doctorTel: string;
  doctorPassword: string;
  userIdentity: number;
}

type ColumnsDataType = {
  title: string;
  dataIndex: string;
  align: string;
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
    { value: 'doctor_name', label: t('doctor.name') },
    { value: 'doctor_tel', label: t('doctor.phone') },
  ]

  // 查找表单
  const searchForm = {
    key: options[0].value,
    value: "",
    pageNum: 1,
    pageSize: 10
  }

  // 查找方法
  const queryFunc = (optionData: optionsDataType = { key: options[0].value, value: "" }) => {
    searchForm.key = optionData.key
    searchForm.value = optionData.value
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }

  // 查找接口
  const queryAPI = async (searchForm: AxiosRequestConfig<QueryAPIReq>) => {
    // 发起查找请求
    const tableList = await getDoctorAPI(searchForm)
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

  // 删除
  const deleteBtn = async (id: number) => {
    const deleteFlag = await delDoctorAPI(id)
    deleteFlag.code === 0 ? message.success(deleteFlag.msg) : message?.success(deleteFlag.msg);
    queryFunc()
  }

  // 表头
  const columns: ColumnsType<DataType> = [
    {
      title: t('common.id'),
      dataIndex: 'doctorId',
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 80,
    },
    {
      title: t('doctor.name'),
      dataIndex: 'doctorName',
      align: 'center',
    },
    {
      title: t('doctor.department'),
      dataIndex: 'departmentName',
      align: 'center',
    },
    {
      title: t('doctor.gender'),
      dataIndex: 'doctorSex',
      align: 'center',
      render: (_, record) => {
        return (
          <div>{record.doctorSex === 1 ? t('common.gender.male') : t('common.gender.female')}</div>
        )
      }
    },
    {
      title: t('doctor.age'),
      dataIndex: 'doctorAge',
      align: 'center',
    },
    {
      title: t('doctor.phone'),
      dataIndex: 'doctorTel',
      align: 'center',
    },
    {
      title: t('common.operation'),
      align: 'center',
      width: window.innerWidth < 700 ? 0 : 200,
      render: (_, record) => {
        return (
          <Space>
            <ModifyForm title={t('doctor.modifyDoctorInfo') + record.doctorName} doctorId={record.doctorId as number} columns={columns as Array<ColumnsDataType>} queryFunc={queryFunc} />
            <Popconfirm
              placement="bottomRight"
              title={t('common.delete')}
              description={t('system.deletePrompt', { name: record.doctorName })}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText={t('system.deleteConfirm')}
              cancelText={t('common.cancel')}
              onConfirm={() => deleteBtn(record.doctorId as number)}
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


  return (
    <Card className={style.allPage} size='small' title={t('doctor.management')} extra={topBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* 搜索组件 */}
      <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} open={open} />
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='doctorId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 600, }}
      />
    </Card>
  )
}
