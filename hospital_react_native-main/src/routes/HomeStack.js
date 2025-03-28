import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomePage'
import OrderScreen from '../screens/HomePage/OrderPage'
import DoctorScreen from '../screens/HomePage/DoctorPage'
import PrescripScreen from '../screens/HomePage/PrescripPage'
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  const {t,i18n} = useTranslation()
  return (
    <Stack.Navigator initialRouteName="HomePage">
      <Stack.Screen name="HomePage" component={HomeScreen} options={{ title: t("index"), headerBackVisible: false }} />
      <Stack.Screen name="OrderPage" component={OrderScreen} options={{ title: t("appointment")}} />
      <Stack.Screen name="DoctorPage" component={DoctorScreen} options={{ title: t("Doctor")}} />
      <Stack.Screen name="PrescripPage" component={PrescripScreen} options={{ title: t("Prescription")}} />
    </Stack.Navigator>
  );
}