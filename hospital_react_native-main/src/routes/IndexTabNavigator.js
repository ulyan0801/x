import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomeScreen from "../screens/HomePage";
import HomeStack from "./HomeStack";
import UserStack from "./UserStack";
import Ionicons from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator()
export default function IndexTabNavigator(props) {
    const { initialRouteName } = props;
  return (
    <Tab.Navigator initialRouteName={initialRouteName} 
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
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="User" component={UserStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}