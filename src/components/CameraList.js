import React from 'react';
import { View, Text, FlatList } from 'react-native';
import CameraItem from './CameraItem';

const CameraList = ({ cameras, navigation }) => {
  return (
    <View>
      <FlatList
        data={cameras}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CameraItem
            camera={item}
            onPress={() => navigation.navigate('CameraDetails', { camera: item })}
          />
        )}
      />
    </View>
  );
};

export default CameraList;
