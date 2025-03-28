import { Button, Card, Space, Table, Tag } from "antd";
import { useTranslation } from 'react-i18next';
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import SearchForm from "../../components/SearchForm";
import { AxiosRequestConfig } from "axios";
import { queryPrescriptionPageAPI } from "../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";
// 引入cookie
import cookie from 'react-cookies'
import RegistrationForm from "../../components/patientRegistration/RegistrationForm";
import AddPrescriptionForm from "../../components/prescriptionManagement/AddPrescriptionForm";

type PrescriptionDataType = {
  registerId: number;
  patientId:number;
  patientName: string;
  patientSex: number;
  patientAge: number;
  patientTel: string;
  patientNumber: number;
  prescriptionStatus: number;
  registerDate: string;
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
    { value: 'register_date', label: t('table.columns.register_date') },
  ]

  // 拿用户信息
  const userData = cookie.load("userData")

  // 查找表单
  const searchForm = {
    key: options[0].value,
    value: "",
    flag: userData.doctorId,
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
    const tableList = await queryPrescriptionPageAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };


  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  /* 查找列表结束 */

  /* 表格开始 */

  // 表头
  const columns: ColumnsType<PrescriptionDataType> = [
    {
      title: 'ID',
      dataIndex: 'registerId',
      align: 'center',
      width: 50,
    },
    {
      title: t('patient.name'),
      dataIndex: 'patientName',
      align: 'center',
    },
    {
      title: t('patient.gender'),
      dataIndex: 'patientSex',
      align: 'center',
      render: (_, record) => {
        return (
          <p>{record.patientSex == 1 ? t('common.gender.male') : t('common.gender.female')}</p>
        )
      }
    },
    {
      title: t('patient.age'),
      dataIndex: 'patientAge',
      align: 'center',
    },
    {
      title: t('patient.phone'),
      dataIndex: 'patientTel',
      align: 'center',
    },
    {
      title: t('patient.idNumber'),
      dataIndex: 'patientNumber',
      align: 'center',
    },
    {
      title: t('patient.appointment'),
      dataIndex: 'registerDate',
      align: 'center',
    },
    {
      title: t('prescription.status'),
      dataIndex: 'prescriptionStatus',
      align: 'center',
      render: (_, record) => {
        return (
          <Tag color={record.prescriptionStatus == 1 ? "success" : "warning"}>{`${record.prescriptionStatus == 1 ? t('prescription.issued') : t('prescription.unisused')}`}</Tag>
        )
      }
    },
    {
      title: t('common.operation'),
      align: 'center',
      render: (_, record) => {
        const RegistrationData = {
          registerId: record.registerId,
          doctorId: userData.doctorId,
          patientId: record.patientId
        }
        return (
          <AddPrescriptionForm title={t('prescription.title')} RegistrationData={RegistrationData} queryFunc={queryFunc} />
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
      <span>{t('common.totalItems',{total: tableList?.total})}</span>
    ),
    onChange: (page: number) => handlePageChange(page), //改变页码的函数
    showQuickJumper: true,
  }
  const handlePageChange = (page: number) => {
    searchForm.pageNum = page
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>);
  }

  // 顶部按钮
  const topBtn = <Space>
    <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => open === null ? setOpen(true) : setOpen(!open)} />
  </Space>
  /* 表格结束 */

  return (
    <Card className={style.allPage} size='small' title={t('pages.prescriptionManagement')} extra={topBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* 搜索组件 */}
      <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} open={open} />
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='registerId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 1250, }}
      />
    </Card>
  )
}
