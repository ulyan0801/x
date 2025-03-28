import { StyleSheet, Text, View,TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getDoctorAPI } from '../../../api/doctor'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

export default function DoctorPage() {

  const [doctorList, setDoctorList] = useState([]);
  const [searchStr, setSearchStr] = useState('');

  const {t} = useTranslation()

  useEffect(() => {
    getDoctors()
  }, [])

  const getDoctors = () => {
    const params = {
      key:'doctor_name',
      value:searchStr,
      pageNum: 1,
      pageSize: 99,
    }
    getDoctorAPI(params).then(({ data }) => {
      setDoctorList(data.data);
    })
  }
  return (
    <ScrollView style={styles.allPage}>
      <View style={styles.action}>
        <Ionicons name='search-outline' size={20} color='#333' />
        <TextInput
          style={styles.input}
          placeholder={t("PleaseEnterDoctorName")}
          value={searchStr}
          onChangeText={(val) => setSearchStr(val)}
          onSubmitEditing={()=>getDoctors()}
        />
      </View>
      {
        doctorList.length > 0 ?
          doctorList.map((item, index) => {
            return (
              <View key={index} style={styles.itemBox}>
                <View style={styles.itemTopBox}>
                  <Text style={styles.itemTopSize}>{item.doctorName}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>{t("Department")}</Text>
                  <Text style={styles.rightTextStyle}>{item.departmentName}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>{t("sex")}</Text>
                  <Text style={styles.rightTextStyle}>{item.doctorSex == 1 ? '男' : '女'}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>{t("age")}</Text>
                  <Text style={styles.rightTextStyle}>{item.doctorAge}</Text>
                </View>
                <View style={styles.itemTopBox}>
                  <Text>{t("phone")}</Text>
                  <Text style={styles.rightTextStyle}>{item.doctorTel}</Text>
                </View>
              </View>
            )
          })
          : <Text>{t("NotFound")}</Text>
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
    margin:15,
    marginBottom:0
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
    lineHeight: 24
  },
  btnStyle: {
    marginTop: 10,
  },
})