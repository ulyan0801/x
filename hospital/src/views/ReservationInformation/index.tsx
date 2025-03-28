import { Button, Card, Popconfirm, Space, Table, Tag, message } from "antd";
import { useTranslation } from 'react-i18next';
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import SearchForm from "../../components/SearchForm";
import { AxiosRequestConfig } from "axios";
import { getReservationPatients, queryDoctorPageAPI, stateChangeAPI } from "../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";
// 引入cookie
import cookie from 'react-cookies'

type RegisterDataType = {
  registerId: number;
  patientName: string;
  patientTel: string;
  completionStatus: number;
  registerDate: string;
  createTime: string;
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
    { value: 'register_date', label: t('reservation.time') },
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

  const getResPatients = async() => {
    let userInfo = cookie.load('userData')
    console.log(userInfo);
    const res = await getReservationPatients(userInfo.doctorId)
    console.log(res);
    let list = []
    for (let i = 0; i < res.data.length; i++) {
      let element = res.data[i];
      
      element.patientName = element.patient.patientName
      element.patientTel = element.patient.patientTel
      
    }
    setTableList(res)
    
    
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
    const tableList = await queryDoctorPageAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  /* 查找列表结束 */

  /* 表格开始 */

  // 挂号取消
  const deleteBtn = async (id: number) => {
    const deleteFlag = await stateChangeAPI(id)
    deleteFlag.code === 0 ? message.success(deleteFlag.msg) : message?.success(deleteFlag.msg);
    queryFunc()
  }

  // 表头
  const columns: ColumnsType<RegisterDataType> = [
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
      title: t('patient.phone'),
      dataIndex: 'patientTel',
      align: 'center',
    },
    {
      title: t('pages.reservation.registrationTime'),
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: t('reservation.scheduledTime'),
      dataIndex: 'registerDate',
      align: 'center',
    },
    {
      title: t('status.processing'),
      dataIndex: 'completionStatus',
      align: 'center',
      render: (_, record) => {
        return (
          <Tag color={record.completionStatus == 1 ? "success" : "warning"}>
            {record.completionStatus == 1 ? t('status.visited') : t('status.unvisited')}
          </Tag>
        )
      }
    },
    {
      title: t('common.operation'),
      align: 'center',
      render: (_, record) => {
        return (
          <Popconfirm
            placement="bottomRight"
            title={t('pages.reservationInformation.completionStatus')}
            description={t('pages.reservationInformation.confirmCompletion')}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            disabled={record.completionStatus===1}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
            onConfirm={() => deleteBtn(record.registerId as number)}
          >
            <Button size='small' type="link" disabled={record.completionStatus===1}>{t('status.changeStatus')}</Button>
          </Popconfirm >
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

  // 顶部按钮
  const topBtn = <Space>
    <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => open === null ? setOpen(true) : setOpen(!open)} />
  </Space>
  /* 表格结束 */

  return (
    <Card className={style.allPage} size='small' title={t('pages.reservationInformation.title')} extra={topBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* 搜索组件 */}
      <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} open={open} />
      <Button type="primary" onClick={() =>{getResPatients()}}>获取今天预约名单</Button>
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
