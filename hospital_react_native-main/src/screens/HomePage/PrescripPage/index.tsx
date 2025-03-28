import React, {useEffect, useState} from 'react';
import {Text, Card,DataTable, Button} from 'react-native-paper';
import {commonPay, queryPatientCasePageAPI} from '../../../api/prescrip';
import storage from '../../../utils/storage';
import {Prescription} from '../../../api/type/prescrip';
import { ScrollView, StyleSheet } from 'react-native';

export default function PrescripPage() {
  const [list, setList] = useState<Prescription[]>([]);

  const queryAPI = () => {
    storage
      .load({
        key: 'userData',
        autoSync: true,
        syncInBackground: true,
      })
      .then(res => {
        queryPatientCasePageAPI(res.patientId).then(res => {
          console.log(res.data);
          if (res.data.code === 0) {
            setList(res.data.data);
            list.forEach(l => {
              console.log(l);
            });
          }
        });
      });
  };

  const pay = (prescripId) => {
        const params = {
            tradeNo:prescripId
        }
        console.log(params);
        
        commonPay(params).then(res => {
            if (res.data.code === 0) {
                queryAPI();
            }
        })
  }

  useEffect(() => {
    queryAPI();
  }, []);
  return (
    <>
      <ScrollView>
        {list.map(item => {
          return (
            <>
              <Card style={styles.cardStyle}>
                <Card.Title
                  title={item.prescriptionDiagnosis}
                  subtitle={item.prescriptionTime?.toString()}
                />
                <Card.Content>
                  <Text>{item.doctor?.doctorName}</Text>
                  <DataTable.Header style={styles.tableStyle}>
                    <DataTable.Title>药品名称</DataTable.Title>
                    <DataTable.Title numeric>数量</DataTable.Title>
                    <DataTable.Title numeric>价格</DataTable.Title>
                  </DataTable.Header>
                  {item.drugsList &&
                    item.drugsList.map(drug => {
                      return (
                        <DataTable.Row key={drug.medicineId} style={styles.rowStyle}>
                            <DataTable.Cell style={styles.cellStyle}>{drug.drug?.drugsName}</DataTable.Cell>
                            <DataTable.Cell style={styles.cellStyle}>{drug.medicineNum}</DataTable.Cell>
                            <DataTable.Cell style={styles.cellStyle}>{drug.drug?.deliveryPrice}</DataTable.Cell>
                        </DataTable.Row>
                    );
                    })}
                </Card.Content>
                <Card.Actions>
                    <Button disabled={item.paymentStatus === 1} onPress={() => pay(item.prescriptionId)}>{item.paymentStatus === 1?'已缴费':'缴费'}</Button>
                </Card.Actions>
              </Card>
            </>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
    cardStyle: {
        display:'flex',
        flexDirection:'row',
        width:400
    },
    tableStyle:{
        width:300
    },
    rowStyle: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        width:400
    },
    cellStyle:{
        width:300,
        marginRight:50
    }
})
