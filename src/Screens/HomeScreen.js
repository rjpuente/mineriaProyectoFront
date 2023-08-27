import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Cámaras</Text>
      <TouchableOpacity
        style={styles.connectButton}
        onPress={() => navigation.navigate('Connect')} // Navegar a la pantalla de conexión
      >
        <Text style={styles.buttonText}>Conectar con Cámara</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  connectButton: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
