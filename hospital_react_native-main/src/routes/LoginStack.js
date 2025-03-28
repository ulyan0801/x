import React, {useEffect, useState} from 'react';
import LoginScreen from '../screens/LoginPage';
import IndexTabNavigator from './IndexTabNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterPage';
import storage from '../utils/storage';

const Stack = createNativeStackNavigator();

export default function LoginStack(params) {
  const [initRouteName, setInitRouteName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const {patientId} = await storage.load({
        key: 'userData',
        autoSync: true,
        syncInBackground: true,
      });
      if (patientId) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    console.log(isLoggedIn);

    checkLoginStatus();
    console.log('params', params);
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <Stack.Navigator initialRouteName="Index">
          <Stack.Screen
            name="Index"
            component={IndexTabNavigator}
            options={{headerShown: false, tabBarStyle: {display: 'none'}}}
          />
          <Stack.Screen name="LoginPage" component={LoginScreen} />
          <Stack.Screen name="RegisterPage" component={RegisterScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="LoginPage">
          <Stack.Screen name="LoginPage" component={LoginScreen} />
          <Stack.Screen name="RegisterPage" component={RegisterScreen} />
          <Stack.Screen
            name="Index"
            component={IndexTabNavigator}
            options={{headerShown: false, tabBarStyle: {display: 'none'}}}
          />
        </Stack.Navigator>
      )}
    </>
  );
}
