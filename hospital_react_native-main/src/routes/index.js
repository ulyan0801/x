import React,{useEffect, useState} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeStack'
import UserScreen from './UserStack'
import LoginScreen from './LoginStack'
import storage from '../utils/storage';
import LoginPage from '../screens/LoginPage';
import RegisterPage from '../screens/RegisterPage';

const Tab = createBottomTabNavigator();




export default function index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const initialRouteName="Index"

  useEffect(() => {
    const checkLoginStatus = async () => {
      const {patientId} = await storage.load({
        key:"userData",
        autoSync: true,
        syncInBackground: true,
      });
      if (patientId) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
    console.log(isLoggedIn);
    
    checkLoginStatus();
  },[])
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'User') {
            iconName = focused ? 'person' : 'person-outline';
          }else{
            console.log(route.name);
            
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      // initialRouteName='Home'
    >
      {
        isLoggedIn ? (
          <>
          {/* <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Tab.Screen name="User" component={UserScreen} options={{ headerShown: false }} /> */}
          <Tab.Screen name="index" component={LoginScreen} options={{headerShown:false,tabBarStyle:{display:'none'}}} initialParams={isLoggedIn}></Tab.Screen>
          </>
        ) : (
          <>
          <Tab.Screen name="LoginPage" component={LoginScreen} options={{ headerShown: false,tabBarStyle:{display:'none'}}}  />
          </>
        )
      }
      
        {/* <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="User" component={UserScreen} options={{ headerShown: false }} /> */}
    </Tab.Navigator>
  );
}