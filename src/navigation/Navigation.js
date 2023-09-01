import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../Screens/HomeScreen'
import CameraDetailsScreen from '../screens/CameraDetailsScreen';
import SuspiciusActivityScreen from '../Screens/SuspiciousActivityScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" headerMode="none">
        <Stack.Screen name="Home" component={MainScreenStack} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Activity" component={SuspiciusActivityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainScreenStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Actividades Sospechosas"
        component={SuspiciusActivityScreen}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
