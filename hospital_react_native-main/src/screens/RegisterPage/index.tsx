import React, { useEffect, useState } from "react";
import { View,ScrollView } from "react-native";
import  Patient  from '../../api/type/patient';
import { Text,Button,TextInput,RadioButton } from "react-native-paper";
import {Formik} from 'formik'
import * as Yup from 'yup'
import { RegisterAPI } from "../../api/login";
import { useTranslation } from "react-i18next";
export default function RegisterPage({navigation}) {
  const [patient,setPatient] = useState<Patient>({});

  const {t} = useTranslation()
  const validateSchema = Yup.object().shape({
    patientName:Yup.string().required(t("NameCannotBeEmpty")),
    patientPassword:Yup.string().required(t("PasswordCannotBeEmpty")).min(6,t("PasswordMustBeAtLeast6Characters")).max(20,t("PasswordMustBeNoMoreThan20Characters")),
    rePassword:Yup.string().required(t("ConfirmPasswordCannotBeEmpty")).oneOf([Yup.ref('patientPassword'),t("PasswordsDoNotMatch")], t("PasswordsDoNotMatch")),
    patientTel:Yup.string().required(t("PhoneNumberCannotBeEmpty")).matches(/^1[3456789]\d{9}$/,t("PleaseEnterAValidPhoneNumber")),
    patientSex:Yup.string().required(t("GenderCannotBeEmpty")),
    patientAge:Yup.number().integer().typeError(t("AgeMustBeANumber")).required(t("AgeCannotBeEmpty")).min(1,t("AgeCannotBeLessThan1")).max(150,t("AgeCannotBeGreaterThan150")),
    patientNumber:Yup.string().required(t("IDCannotBeEmpty")).matches(/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,t("PleaseEnterAValidID")),
  })
  const checkPassword = () => {

  }
  const submit = (values) =>{
    setPatient((p) => { 
      console.log(p);
      RegisterAPI(values).then((res) => {
        console.log(res.data.code);
        if (res.data.code === 0) {
          navigation.goBack()
        }
      })
      return values
    });
    console.log(patient);
    // console.log(values);
    
    
    
  }
  
  return(
        
        <Formik initialValues={{...patient,rePassword:'',patientSex:patient.patientSex?String(patient.patientSex) : '1'}} validationSchema={validateSchema} onSubmit={(values,actions) => {actions.setSubmitting(true);submit(values)}}>
          
          {({handleChange,handleBlur,handleSubmit,values,touched,errors}) => (
            <ScrollView>
              <Text>{t("username")}</Text>
              <TextInput value={values.patientName} onChangeText={handleChange('patientName')} onBlur={handleBlur('patientName')}/>
              {touched.patientName && errors.patientName && <Text>{errors.patientName}</Text>}
              <Text>{t("password")}</Text>
              <TextInput value={values.patientPassword} onChangeText={handleChange('patientPassword')} onBlur={handleBlur('patientPassword')}/>
              {touched.patientPassword && errors.patientPassword && <Text>{errors.patientPassword}</Text>}
              <Text>{t("confirmPassword")}</Text>
              <TextInput value={values.rePassword} onChangeText={handleChange('rePassword')} onBlur={handleBlur('rePassword')}/>
              {touched.rePassword && errors.rePassword && <Text>{errors.rePassword}</Text>}
              <Text>{t("phone")}</Text>
              <TextInput value={values.patientTel} onChangeText={handleChange('patientTel')} onBlur={handleBlur('patientTel')}/>
              {touched.patientTel && errors.patientTel && <Text>{errors.patientTel}</Text>}
              <Text>{t("sex")}</Text>
              <RadioButton.Group value={!values.patientSex ? '1' : values.patientSex} onValueChange={handleChange('patientSex')} >
                <RadioButton.Item label={t("Male")} value="1" />
                <RadioButton.Item label={t("Female")} value="0" />
              </RadioButton.Group>
              {touched.patientSex && errors.patientSex && <Text>{errors.patientSex}</Text>}
              <Text>{t("ID")}</Text>
              <TextInput value={values.patientNumber} onChangeText={handleChange('patientNumber')} onBlur={handleBlur('patientNumber')}/>
              {touched.patientNumber && errors.patientNumber && <Text>{errors.patientNumber}</Text>}
              <Text>{t("age")}</Text>
              <TextInput value={values.patientAge} onChangeText={handleChange('patientAge')} onBlur={handleBlur('patientAge')}/>
              {touched.patientAge && errors.patientAge && <Text>{errors.patientAge}</Text>}
              <Button onPress={handleSubmit} mode="contained">{t("submit")}</Button>
            </ScrollView>
          )}
        </Formik>

  )
}