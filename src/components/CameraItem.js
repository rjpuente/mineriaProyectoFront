import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const CameraItem = ({ camera, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Text>Id de la camara: {camera.id}</Text>
        <Text>IP Address: {camera.ip}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CameraItem;
