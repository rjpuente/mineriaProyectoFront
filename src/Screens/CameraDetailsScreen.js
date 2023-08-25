import React from 'react';
import { View, Text } from 'react-native';

const CameraDetailsScreen = ({ route }) => {
  const { camera } = route.params;

  return (
    <View>
      <Text>Camera ID: {camera.id}</Text>
      <Text>IP Address: {camera.ip}</Text>
      {/* Agrega más detalles de la cámara aquí */}
    </View>
  );
};

export default CameraDetailsScreen;
