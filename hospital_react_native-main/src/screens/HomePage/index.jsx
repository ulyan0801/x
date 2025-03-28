import React, { useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, TextInput, Text, View } from 'react-native'
import Swiper from 'react-native-swiper';
import storage from '../../utils/storage';
import LoginPage from '../LoginPage';
import { Icon, MD3Colors, MD3LightTheme,DataTable } from 'react-native-paper'
import { useTranslation } from 'react-i18next';

import { getDoctorsWithOrdered } from '../../api/doctor';
import { table } from 'console';


export default function Home({ navigation }) {
  const { t } = useTranslation()

  const topList = [
    {
      pageName: 'OrderPage',
      name: t("appointment"),
      bgColor: MD3Colors.secondary80,
      icon: 'clock-alert',
    },
    {
      pageName: 'DoctorPage',
      name: t("Doctor"),
      bgColor: MD3Colors.primary80,
      icon: 'account-circle',
    },
    // {
    //   pageName: 'MedicantPage',
    //   name: '药品查询',
    //   bgColor: '#0f0',
    //   icon: 'search-outline',
    // },
    {
      pageName: 'PrescripPage',
      name: t("Prescription"),
      bgColor: MD3Colors.neutral80,
      icon: 'briefcase-edit',
    }
  ]
  const gotoPage = (pageName) => {
    navigation.push(pageName);
  }

  const useUserData = () => {
    const [patientId, setPatientId] = useState('');
    storage.load({
      key: 'userData',
      autoSync: true,
    }).then(res => {
      if (res.patientId) {
        setPatientId(res.patientId)
      }
    })
    return patientId;
  }

  const patientId = useUserData();
  if (!patientId) {
    // gotoPage('LoginPage')
    // navigation.navigate('LoginPage')
  }

  const [doctors, setDoctors] = useState([{doctorId:0,doctorName:'暂无医生',departmentName:'暂无科室'}]);

  const getDoctors = async () => {
    console.log('getDoctors');
    
    const res = await getDoctorsWithOrdered()
    console.log(res);
    
    if (res.data.code = 200) {

      setDoctors(res.data.data)
    }
  }

  useEffect(() => {
    getDoctors()
  },[])





  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.wrapper}>
          <Swiper style={styles.wrapperBox} showsButtons={false}>
            <View style={styles.slide1}>
              <Text style={styles.text}>Hello Swiper</Text>
            </View>
            <View style={styles.slide2}>
              <Text style={styles.text}>Beautiful</Text>
            </View>
            <View style={styles.slide3}>
              <Text style={styles.text}>And simple</Text>
            </View>
          </Swiper>
        </View>

        <View style={styles.listBox}>
          {
            topList.map((item, index) => {
              return (
                <View style={styles.listItem} key={index} onTouchEnd={() => gotoPage(item?.pageName)}>
                  <View style={{ ...styles.listItemIcon, backgroundColor: item.bgColor }}>
                    <Icon source={item.icon} size={28} color={MD3Colors.primary0} />
                  </View>
                  <Text style={styles.listItemText}>{item.name}</Text>
                </View>
              )
            })
          }
        </View>
        <View style={styles.title}>
          <Text style={styles.titleText}>
          今天出诊的医生
          </Text>
        </View>
        <DataTable >
          <DataTable.Header style={styles.table}>
            <DataTable.Title><Text style={styles.tableText}>{t('Department')}</Text></DataTable.Title>
            <DataTable.Title><Text style={styles.tableText}>{t('DoctorName')}</Text></DataTable.Title>
          </DataTable.Header>

          {doctors.map((item) => (
            <DataTable.Row key={item.doctorId}>
              <DataTable.Cell style={styles.tableItem}><Text style={styles.titleText}>{item.departmentName}</Text></DataTable.Cell>
              <DataTable.Cell style={styles.tableItem}><Text style={styles.titleText}>{item.doctorName}</Text></DataTable.Cell>
            </DataTable.Row>
          ))}


        </DataTable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 14
  },
  listBox: {
    padding: 15,
    borderRadius: 20,
    marginTop: 14,
    backgroundColor: '#fff',
    elevation: 1, // 适配android的
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listItem: {
  },
  listItemIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItemText: {
    marginTop: 5,
    textAlign: 'center'
  },
  wrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  wrapperBox: {
    height: 200,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  tableText: {
    marginTop: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 1, // 适配android的
    fontWeight: 'bold',
    fontSize: 20,
    backgroundColor: 'transparent'
  },
  table: {
    height: 50,
  },
  tableItem: {
    padding: 10,
    color: 'black'
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 14,
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
  
  
})