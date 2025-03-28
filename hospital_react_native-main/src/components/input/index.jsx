import { StyleSheet, View,TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react'
import { useTranslation } from 'react-i18next';

export default function Input(props) {

  const {t} = useTranslation()
  const {
    iconName,
    placeholder,
    onChangeText
  } = props

  return (
    <View style={styles.action}>
      <Ionicons name='phone-portrait-outline' size={20} color='#333' />
      <TextInput
        style={styles.input}
        placeholder={t("PleaseEnterAValidPhoneNumber")}
        value={loginData.tel}
        onChangeText={(val) => setLoginData({ ...loginData, tel: val })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 5,
  },
  input: {
    width: '100%'
  },
})