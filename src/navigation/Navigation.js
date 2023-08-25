import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CameraConnectScreen from '../Screens/CameraConnectScreen'; // Importa la nueva pantalla
import CameraDetailsScreen from '../Screens/CameraDetailsScreen';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Connect" component={CameraConnectScreen} /> 
      <Tab.Screen name="CameraDetails" component={CameraDetailsScreen} />
    </Tab.Navigator>
  );
};

export default Navigation;
