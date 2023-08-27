import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí podrías implementar la lógica de autenticación
    // Por ahora, vamos a asumir que el inicio de sesión es exitoso
    navigation.navigate('Home');
    console.log('Registrando usuario:', email);
    console.log('Contraseña:', password);
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Hola de nuevo!</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={COLORS.LIGHT_GRAY}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={COLORS.LIGHT_GRAY}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress}>
        <Text style={styles.registerButtonText}>Crear una cuenta</Text>
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
  input: {
    width: '80%',
    height: 50,
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 20,
    color: COLORS.DARK_GRAY,
    borderRadius: 10,
  },
  loginButton: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  registerButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;
