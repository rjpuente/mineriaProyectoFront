import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CameraList from '../components/CameraList';

const HomeScreen = ({ navigation }) => {
  const [cameras, setCameras] = useState([
    { id: 1, ip: '192.168.1.101' },
    { id: 2, ip: '192.168.1.102' },
    // Agrega más cámaras aquí
  ]);

  return (
    <View>
      <Text>Camera List</Text>
      <CameraList cameras={cameras} navigation={navigation} />
    </View>
  );
};

export default HomeScreen;
