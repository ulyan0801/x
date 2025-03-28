import { Button, Card, Popconfirm, Space, Table, message } from "antd";
import { useTranslation } from 'react-i18next';
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import SearchForm from "../../../components/SearchForm";
import { AxiosRequestConfig } from "axios";
import { quertdrugsAPI, deldrugsAPI } from "../../../apis/api";
import style from './index.module.scss'
import { ColumnsType } from "antd/es/table";
import DrugManageForm from "../../../components/drugManagement/DrugManageForm";
type DrugDataType = {
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
    { value: 'drugs_name', label: t('drug.name') },
    { value: 'drugs_type', label: t('drug.type') },
    { value: 'production_location', label: t('drug.manufacturer') }
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
    const tableList = await quertdrugsAPI(searchForm)
    setTableList(tableList)
    setLoading(false)
  };

  // 初始查找
  useEffect(() => {
    queryAPI(searchForm as AxiosRequestConfig<QueryAPIReq>)
  }, [])

  /* 查找列表结束 */

  /* 表格开始 */

  // 删除
  const deleteBtn = async (id: number) => {
    const deleteFlag = await deldrugsAPI(id)
    deleteFlag.code === 0 ? message.success(deleteFlag.msg) : message?.success(deleteFlag.msg);
    queryFunc()
  }

  // 表头
  const columns: ColumnsType<DrugDataType> = [
    {
      title: 'ID',
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
      width: window.innerWidth < 700 ? 0 : 80,
      ellipsis: true, // 使用ellipsis类实现超出隐藏
    },
    {
      title: t('common.operation'),
      align: 'center',
      render: (_, record) => {
        console.log(record)
        return (
          <Space>
            <DrugManageForm title={t('drug.edit') + record.drugsName} drugData={record} columns={columns as Array<ColumnsDataType>} queryFunc={queryFunc} />
            <Popconfirm
              placement="bottomRight"
            title={t('common.delete')}
            description={t('system.deletePrompt', { name: record.drugsName })}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText={t('system.deleteConfirm')}
              cancelText={t('common.cancel')}
              onConfirm={() => deleteBtn(record.drugsId as number)}
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
  const topBtn = <Space>
    <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => open === null ? setOpen(true) : setOpen(!open)} />
    <DrugManageForm title={t('drug.warehousing')} columns={columns as Array<ColumnsDataType>} queryFunc={queryFunc} />
  </Space>
  /* 表格结束 */


  return (
    <Card className={style.allPage} size='small' title={t('pages.drugManagement.drugEntryExit')} extra={topBtn} bordered={false} style={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      {/* 搜索组件 */}
      <SearchForm options={options} queryFunc={queryFunc} queryAPI={queryAPI} open={open} />
      <Table
        columns={columns}
        dataSource={tableList?.data}
        rowKey='drugsId'
        size='middle' bordered
        loading={loading}
        pagination={paginationProps}
        scroll={{ x: 1250, }}
      />
    </Card>
  )
}
