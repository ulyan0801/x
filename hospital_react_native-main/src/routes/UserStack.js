import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from '../screens/UserPage'
import OrdersScreen from '../screens/UserPage/OrdersPage'
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();



export default function UserStack() {

  const {t} = useTranslation()
  return (
    <Stack.Navigator initialRouteName="UserPage">
      <Stack.Screen name="UserPage" component={UserScreen} options={{ title: t("PersonalInformation"), headerBackVisible: false }} />
      <Stack.Screen name="OrdersPage" component={OrdersScreen} options={{ title: t("Orders") }} />
    </Stack.Navigator>
  );
}