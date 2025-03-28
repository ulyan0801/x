import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { queryRegisterAPI, delRegisterAPI } from '../../../api/orders'
import storage from '../../../utils/storage'
import { Button } from '@rneui/themed';
import Dialog from '../../../components/dialog'

export default function OrdersPage({ navigation }) {

  const [registerList, setRegisterList] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    getRegisterList()
  }, [])

  // 拿挂号订单
  const getRegisterList = () => {
    storage.load({
      key: 'userData',
      autoSync: true,
      syncInBackground: true,
    }).then(ret => {
      const params = {
        pageNum: 1,
        pageSize: 99,
        flag: ret.patientId,
      }
      console.log(params);
      
      queryRegisterAPI(params).then(({ data }) => {
        setRegisterList(data.data);
      })
    }).catch(err => {
      console.log(err);
    });
  }

  const cancel=(id)=>{
    delRegisterAPI(id).then(({data})=>{
      if(data.code===0){
        setDialogVisible(!dialogVisible);
      }
    })
  }

  const onDetermine=()=>{
    getRegisterList();
    setDialogVisible(!dialogVisible);
  }
  return (
    <ScrollView style={styles.allPage}>
      {
        registerList.length > 0 ?
          registerList.map((item, index) => {
            return (
              <View key={index} style={styles.itemBox}>
                <View style={styles.itemTopBox}>
                  <Text style={styles.itemTopSize}>订单信息</Text>
                  <Text style={styles.itemTopBoxRight}>{`订单状态：${item.completionStatus ? '已完成' : '未完成'}`}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>下单时间：</Text>
                  <Text style={styles.rightTextStyle}>{item.createTime}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>科室：</Text>
                  <Text style={styles.rightTextStyle}>{item.departmentName}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>主治医生：</Text>
                  <Text style={styles.rightTextStyle}>{item.doctorName}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>预约时间：</Text>
                  <Text style={styles.rightTextStyle}>{item.registerDate}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>挂号费：</Text>
                  <Text style={styles.rightTextStyle}>{item.registerCost} 元</Text>
                </View>
                {
                  item.completionStatus === 0 ?
                    <Button buttonStyle={styles.btnStyle} title={'取消预约'} color="warning" onPress={()=>cancel(item.registerId)}></Button>
                    : null
                }
              </View>
            )
          })
          : <Text>暂无挂号信息</Text>
      }
      <Dialog
        onDetermine={onDetermine}
        onCancel={(onDetermine)}
        dialogIsVisible={dialogVisible}
        dialogTitle='通知'
        dialogContent='取消预约成功'
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  allPage: {
    marginBottom: 10
  },
  itemBox: {
    borderColor: '#DEDEDE',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 0,
    padding: 10
  },
  itemTopBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTopSize: {
    lineHeight: 40,
    fontSize: 19,
    color: '#333'
  },
  itemTopBoxRight: {
    lineHeight: 40,
  },
  rightTextStyle:{
    color:'#333',
    lineHeight:24
  },
  btnStyle: {
    marginTop: 10,
  },
})