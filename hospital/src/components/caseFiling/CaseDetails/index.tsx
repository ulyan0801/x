import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
import { Card, Descriptions, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { findPrescriptionDrugAPI } from "../../../apis/api";
import { useTranslation } from 'react-i18next';

interface PropsType {
  registerId: number;
}

interface DrugDataType {
  medicineId: number;
  registerId: number;
  drugsName: string;
  medicineNum: number;
  medicineNotes: string;
}

interface PrescriptionDrugType {
  patientName: string;
  patientSex: number;
  patientAge: number;
  patientNumber: number;
  patientTel: string;
  prescriptionDiagnosis: string;
  prescriptionTime: string;
  children: DrugDataType[];
}




const View: React.FC<PropsType> = ({ registerId }) => {

  const { t } = useTranslation()

  const [prescriptionDrug, setPrescriptionDrug] = useState<PrescriptionDrugType>();

  const findPrescriptionDrug = async () => {
    const { data } = await findPrescriptionDrugAPI(registerId)
    setPrescriptionDrug(data as PrescriptionDrugType);
  }

  const columns: ColumnsType<DrugDataType> = [
    {
      title: 'id',
      align: 'center',
      render: (checked, record, index) => <p>{index + 1}</p>,
      width: 80
    },
    {
      title: t('drug.name'),
      dataIndex: 'drugsName',
      key: 'drugsName',
      align: 'center',
      width: 200
    },
    {
      title: t('components.caseFiling.medicineQuantity'),
      dataIndex: 'medicineNum',
      key: 'medicineNum',
      align: 'center',
      width: 200
    },
    {
      title: t('components.caseFiling.usageMethod'),
      dataIndex: 'medicineNotes',
      key: 'medicineNotes',
      align: 'center',
    },
  ];

  useEffect(() => { findPrescriptionDrug() }, [])

  return (

    <Card className={style.allPage}>
      <Descriptions layout="vertical" bordered size='small'>
        <Descriptions.Item label={t('patient.name')}>{prescriptionDrug?.patientName}</Descriptions.Item>
        <Descriptions.Item label={t('patient.gender')}>{prescriptionDrug?.patientSex == 1 ? t('common.gender.male') : t('common.gender.female')}</Descriptions.Item>
        <Descriptions.Item label={t('patient.age')}>{prescriptionDrug?.patientAge}</Descriptions.Item>
        <Descriptions.Item label={t('patient.phone')}>{prescriptionDrug?.patientTel}</Descriptions.Item>
        <Descriptions.Item label={t('patient.idNumber')}>{prescriptionDrug?.patientNumber}</Descriptions.Item>
        <Descriptions.Item label={t('prescription.time')}>{prescriptionDrug?.prescriptionTime}</Descriptions.Item>
        <Descriptions.Item label={t('prescription.diagnosis')}>{prescriptionDrug?.prescriptionDiagnosis}</Descriptions.Item>
      </Descriptions>
      <Table style={{ marginTop: '15px' }} rowKey='medicineId' pagination={false} bordered size='small' columns={columns} dataSource={prescriptionDrug?.children} />
    </Card>
  )
}

export default View;