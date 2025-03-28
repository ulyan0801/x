import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { quertdrugsAPI } from '../../../api/medicant'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MedicantPage() {

  const [DrugList, setDrugList] = useState([]);
  const [searchStr, setSearchStr] = useState('');

  useEffect(() => {
    getDrugs()
  }, [])

  const getDrugs = () => {
    const params = {
      key: 'drugs_name',
      value: searchStr,
      pageNum: 1,
      pageSize: 99,
    }
    quertdrugsAPI(params).then(({ data }) => {
      setDrugList(data.data);
    })
  }
  return (
    <ScrollView style={styles.allPage}>
      <View style={styles.action}>
        <Ionicons name='search-outline' size={20} color='#333' />
        <TextInput
          style={styles.input}
          placeholder='请输入药品名查询'
          value={searchStr}
          onChangeText={(val) => setSearchStr(val)}
          onSubmitEditing={() => getDrugs()}
        />
      </View>
      {
        DrugList.length > 0 ?
          DrugList.map((item, index) => {
            return (
              <View key={index} style={styles.itemBox}>
                <View style={styles.itemTopBox}>
                  <Text style={styles.itemTopSize}>{item.drugsName}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>药物类型：</Text>
                  <Text style={styles.rightTextStyle}>{item.drugsType}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>治疗功效：</Text>
                  <Text style={styles.rightTextStyle}>{item.therapeuticEfficacy}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>库存数量：</Text>
                  <Text style={styles.rightTextStyle}>{item.inventoryNum}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>零售价格：</Text>
                  <Text style={styles.rightTextStyle}>{item.deliveryPrice} 元</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>生产厂家：</Text>
                  <Text style={styles.rightTextStyle}>{item.productionLocation}</Text>
                </View>
              </View>
            )
          })
          : <Text>暂无药品信息</Text>
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  allPage: {
    marginBottom: 10
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderColor: '#ddd',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 22,
    backgroundColor: '#fff',
    paddingLeft: 15,
    margin: 15,
    marginBottom: 0
  },
  input: {
    width: '100%',
    fontSize: 16,
    paddingLeft: 8,
    paddingRight: 15
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
  rightTextStyle: {
    color: '#333',
    lineHeight: 24,
  },
  btnStyle: {
    marginTop: 10,
  },
})