import { StyleSheet, Text, TextInput, View, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import { addRegisterAPI, findDoctorAPI, queryAllDepartmentAPI } from '../../../api/register'
import { Button } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import storage from '../../../utils/storage'
import Dialog from '../../../components/dialog'
import { useTranslation } from 'react-i18next';


export default function OrderPage({navigation}) {
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [departmentItems, setDepartmentItems] = useState([]);
  const [doctorItems, setDoctorItems] = useState([]);
  const [departmentId, setDepartmentId] = useState();
  const [doctorId, setDoctorId] = useState();
  // 日期时间选择器
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [registerDate, setRegisterDate] = useState('');
  // 挂号费
  const [registerCost, setRegisterCost] = useState('');
  // 消息弹窗
  const [dialogVisible, setDialogVisible] = useState(false);
  const [warningDialogVisible, setWarningDialogVisible] = useState(false)

  const { height } = useWindowDimensions();

  const {t} = useTranslation()

  const onDepartmentOpen = useCallback(() => {
    setDoctorOpen(false);
    setDepartmentOpen(true);

  }, []);

  const onDoctorOpen = useCallback(() => {
    setDoctorOpen(true);
    setDepartmentOpen(false);
  }, []);

  useEffect(() => {
    getAllDepartment()
  }, [])

  useEffect(() => {
    if (departmentId) {
      getDoctor(departmentId)
    }
  }, [departmentId])

  // 拿科室
  const getAllDepartment = () => {
    queryAllDepartmentAPI().then(({ data }) => {
      setDepartmentItems(data.data)
    }).catch(err => {
      console.log(err);
    })
  }

  // 科室改变
  const changeDepartments = (value) => {
    setDepartmentId(value)
  }

  // 拿医生
  const getDoctor = (id) => {
    findDoctorAPI(id).then(({ data }) => {
      setDoctorItems(data?.data)
    })
  }

  // 日期时间选择器
  const handleConfirm = (date:Date) => {
    let str = date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    let number = Date.parse(date.toISOString(),"yyyy-MM-dd HH:mm")
    date = new Date(number).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    setRegisterDate(date);
    setIsDatePickerVisible(false);
  };

  // 提交
  const submit = () => {
    storage.load({
      key: 'userData',
      autoSync: true,
      syncInBackground: true,
    }).then(ret => {
      const params = {
        doctorId,
        registerCost,
        registerDate,
        patientId: ret.patientId,
        completionStatus: 0,
        prescriptionStatus: 0,
      }
      console.log(params);
      
      addRegisterAPI(params).then(({data})=>{
        
        console.log(data);
        if (data.code===0) {
          setDialogVisible(!dialogVisible);
        }else{
          setWarningDialogVisible(!warningDialogVisible)
        }
      })
    }).catch(err => {
      console.log(err);
    });
  }

  // 弹窗确认  
  const onDetermine = () => {
    navigation.push('HomePage');
    setDialogVisible(!dialogVisible);
  }

  return (
    <View style={{ ...styles.cardBox, minHeight: height - 157, }}>
      <Text style={styles.lableStyle}>{t("SelectDepartment")}</Text>
      <DropDownPicker
        zIndex={2000}
        open={departmentOpen}
        value={departmentId}
        items={departmentItems}
        onOpen={onDepartmentOpen}
        setOpen={setDepartmentOpen}
        setValue={changeDepartments}
        placeholder={t("SelectDepartment")}
      />
      <Text style={styles.lableStyle}>{t("SelectDoctor")}</Text>
      <DropDownPicker
        zIndex={1000}
        open={doctorOpen}
        value={doctorId}
        items={doctorItems}
        onOpen={onDoctorOpen}
        setOpen={setDoctorOpen}
        setValue={setDoctorId}
        placeholder={t("SelectDoctor")}
      />
      <Text style={styles.lableStyle}>{t("AppointmentDate")}</Text>
      <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
        <TextInput
          value={registerDate}
          style={styles.inputStyle}
          editable={false}
          placeholder={t("AppointmentDate")}
        ></TextInput>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        minuteInterval={30}
        is24Hour={true}
        onConfirm={handleConfirm}
        minimumDate={new Date()}
        timeZoneOffsetInMinutes={-0}
        onCancel={() => setIsDatePickerVisible(false)}
        
      />
      <Text style={styles.lableStyle}>{t("RegistrationFee")}</Text>
      <TextInput
        style={styles.inputStyle}
        placeholder={t("PleaseEnterRegistrationFee")}
        value={registerCost}
        onChangeText={(val) => setRegisterCost(val)}
      ></TextInput>
      <Button onPress={submit} mode='contained-tonal'>
      {t("ConfirmAppointment") }
      </Button>
      <Dialog
        onDetermine={onDetermine}
        onCancel={()=>setDialogVisible(!dialogVisible)}
        dialogIsVisible={dialogVisible}
        dialogTitle={t("AppointmentSuccessful")}
        dialogContent={t("PleaseVisitAtScheduledTime")}
      />
      <Dialog
        onDetermine={onDetermine}
        onCancel={()=>setWarningDialogVisible(!warningDialogVisible)}
        dialogIsVisible={warningDialogVisible}
        dialogTitle={t("AppointmentFailed")}
        dialogContent={t("isRegistered")}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  cardBox: {
    borderColor: '#EBEDF0',
    borderStyle: 'solid',
    borderWidth: 3,
    margin: 15,
    padding: 15,
    backgroundColor: '#fff'
  },
  lableStyle: {
    color: '#333',
    fontSize: 19,
    marginTop: 10,
    marginBottom: 10
  },
  inputStyle: {
    borderColor: '#000',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 7,
    paddingLeft: 15,
    paddingRight: 15
  },
  btnStyle: {
    marginTop: 20
  }
})