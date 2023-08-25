import React from 'react';
import { View, Text, Image } from 'react-native';

const CameraDetailsScreen = ({ route }) => {
  const { camera } = route.params;

  return (
    <View>
      <Text>Camera Details</Text>
      <Text>IP Address: {camera.ip}</Text>
      <Text>Camera URL: {camera.url}</Text>
      <Image style={{ width: 300, height: 200 }} source={{ uri: camera.url }} />
      {/* Puedes agregar más detalles y elementos aquí */}
    </View>
  );
};

export default CameraDetailsScreen;
