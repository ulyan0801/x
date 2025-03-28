import { Button, Card, Popconfirm, Space, Table, Tag, message } from "antd";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import SearchForm from "../../components/SearchForm";
import { AxiosRequestConfig } from "axios";
import { queryRegisterAPI, stateChangeAPI } from "../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";
// 引入cookie
import cookie from 'react-cookies'
import RegistrationForm from "../../components/patientRegistration/RegistrationForm";
import { useTranslation } from "react-i18next";

type RegisterDataType = {
  registerId: number;
  departmentName: string;
  doctorName: string;
  registerCost: number;
  completionStatus: number;
  registerDate: string;
  createTime: string;
}

export default function View() {
  /* 查找列表开始 */
  const { t } = useTranslation()

  // 搜索框
  const [open, setOpen] = useState<boolean | null>(null);
  // 查到的数据
  const [tableList, setTableList] = useState<QueryAPIRes>();
  // 加载状态
  const [loading, setLoading] = useState(true);

  // 字段数组
  let options: Array<optionsType> = [
    { value: 'register_date', label: '预约时间' },
  ]

  // 拿用户信息
  let userData = cookie.load("userData")

  // 查找表单
  let searchForm = {
    key: options[0].value,
    value: "",
    flag: userData.patientId,
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
    const tableList = await queryRegisterAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  const getResPatients = () => {
    let userInfo = cookie.load("userData")
    console.log(userInfo);
    
  }

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  /* 查找列表结束 */

  /* 表格开始 */

  // 挂号取消
  const deleteBtn = async (id: number) => {
    const updateFlag = await stateChangeAPI(id)
    updateFlag.code === 0 ? message.success(updateFlag.msg) : message?.success(updateFlag.msg);
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
      title: t('components.registration.cost'),
      dataIndex: 'registerCost',
      align: 'center',
    },
    {
      title: t('components.registration.createTime'),
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: t('components.registration.appointmentTime'),
      dataIndex: 'registerDate',
      align: 'center',
    },
    {
      title: t('components.registration.completionStatus'),
      dataIndex: 'completionStatus',
      align: 'center',
      render: (_, record) => {
        return (

          <Tag color={record.completionStatus == 1 ? "success" : "warning"}>{record.completionStatus == 1 ? t('components.registration.completed') : t('components.registration.uncompleted')}</Tag>
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
            title={t('components.registration.registration')+t('common.cancel')}
            description={t('system.cancelPrompt',{name:t('components.registration.registration')})}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
            onConfirm={() => deleteBtn(record.registerId as number)}
            disabled={record.completionStatus==1}
          >
            <Button size='small' danger type="link" disabled={record.completionStatus==1} >{t('registration.cancelRegistration')}</Button>
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
    <RegistrationForm title={'预约挂号'} queryFunc={queryFunc} />
  </Space>
  /* 表格结束 */


  return (
    <Card className={style.allPage} size='small' title="预约挂号" extra={topBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
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
