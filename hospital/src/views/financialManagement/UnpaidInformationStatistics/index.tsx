import { Button, Card, Space, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { queryAdminUnpayPageAPI } from "../../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";
// 引入cookie
import SearchForm from "../../../components/SearchForm";
import { useTranslation } from "react-i18next";


type UnpayDataType = {
  prescriptionId: number;
  departmentName: string;
  doctorName: string;
  patientName: string;
  patientTel: string;
  paymentStatus: number;
  prescriptionTime: string;
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
  let options: Array<optionsType> = [
    { value: 'prescription_time', label: t('financial.order') },
  ]

  // 查找表单
  let searchForm = {
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
    const tableList = await queryAdminUnpayPageAPI(searchForm)
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
  const columns: ColumnsType<UnpayDataType> = [
    {
      title: t('prescription.id'),
      dataIndex: 'prescriptionId',
      align: 'center',
    },
    {
      title: t('doctor.department'),
      dataIndex: 'departmentName',
      align: 'center',
    },
    {
      title: t('doctor.name'),
      dataIndex: 'doctorName',
      align: 'center',
    },
    {
      title: t('patient.name'),
      dataIndex: 'patientName',
      align: 'center',
    },
    {
      title: t('patient.phone'),
      dataIndex: 'patientTel',
      align: 'center',
    },
    {
      title: t('financial.status'),
      dataIndex: 'paymentStatus',
      align: 'center',
      render: (_, record) => {
        return (
          <Tag color={"error"}>{t('financial.unpaid')}</Tag>
        )
      }
    },
    {
      title: t('prescription.time'),
      dataIndex: 'prescriptionTime',
      align: 'center',
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
  const topBtn = <Space>
    <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => open === null ? setOpen(true) : setOpen(!open)} />
  </Space>
  /* 表格结束 */


  return (
    <Card className={style.allPage} size='small' title={t('financial.info')} extra={topBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* 搜索组件 */}
      <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} open={open} />
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='collectorId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 1250, }}
      />
    </Card>
  )
}
