import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import { CheckBox, Icon } from 'react-native-elements'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'

import { useTogglePasswordVisibility } from '../hooks/useTogglePassVisibility'
import { COLORS } from '../constants'
import firebase from '../../database/firebase'

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility()
  const [isSelected, setSelection] = useState(true);
  const toggleCheckbox = () => setSelection(!isSelected)

  const handleRegister = async () => {
    try {
      if (email === '' || password === '' || username === '') {
        console.log('Error', 'Completa todos los campos.');
        return;
      }
  
      const existingUserSnapshot = await firebase.db
        .collection('users')
        .where('email', '==', email)
        .get();
  
      if (!existingUserSnapshot.empty) {
        console.log('Error', 'Ya existe un usuario con este correo electrónico.');
        return;
      }
  
      await firebase.db.collection('users').add({
        email: email,
        password: password,
        username: username
      });
  
      console.log('Registro exitoso');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error', 'Ocurrió un error al registrarse.', error);
    }
  };

  const handleBackLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style='dark' backgroundColor='white' />
      <Text style={styles.title}>Regístrate</Text>
      <View style={styles.form}>
        <Text style={{ fontWeight: 'bold' }}>Usuario</Text>
        <View style={styles.inputContainer}>
          <FontAwesome style={styles.searchIcon} name='user-o' size={20} color='black' />
          <TextInput
            style={styles.input}
            placeholder='Ingrese un nombre de usuario'
            onChangeText={setUsername}
            value={username}
          />
        </View>

        <Text style={{ fontWeight: 'bold', marginTop: '3%' }}>Correo</Text>
        <View style={styles.inputContainer}>
          <Icon style={styles.searchIcon} name='mail-outline' />
          <TextInput
            style={styles.input}
            placeholder='Ingrese su correo'
            onChangeText={setEmail}
            value={email}
          />
        </View>

        <Text style={{ fontWeight: 'bold', marginTop: '3%' }}>Contraseña</Text>
        <View style={styles.inputContainer}>
          <Icon style={styles.searchIcon} name='lock-open' />
          <TextInput
            style={styles.input}
            placeholder='Ingrese su contraseña'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={passwordVisibility}
            /* enablesReturnKeyAutomatically */
            onChangeText={setPassword}
            value={password}
          />
          <Pressable style={styles.iconEyeButton} onPress={handlePasswordVisibility}>
            <MaterialCommunityIcons name={rightIcon} size={22} style={styles.icono} color='#232323' />
          </Pressable>
        </View>

        <View style={styles.condiciones}>
          <CheckBox
            checked={isSelected}
            onPress={toggleCheckbox}
            iconType='material-community'
            checkedIcon='checkbox-marked'
            titleProps={{ style: { color: 'black', backgroundColor: COLORS.WHITE } }}
            containerStyle={{ backgroundColor: COLORS.WHITE, borderWidth: 0, padding: 0, margin: 0, marginLeft: 0 }}
            uncheckedIcon='checkbox-blank-outline'
            checkedColor={COLORS.GREEN}
            title={
              <Text style={{ color: 'black' }}>
                Acepto los{' '}
                <Text style={{ color: COLORS.GREEN, fontWeight: 'bold' }}>términos de uso</Text> y la{' '}
                <Text style={{ color: COLORS.GREEN, fontWeight: 'bold' }}>política de privacidad</Text>
              </Text>
            }
          />
        </View>

        <TouchableOpacity style={[styles.bregistrarse, {opacity: isSelected ? 1 :0.5}]} onPress={handleRegister} disabled={!isSelected}>
          <Text style={{ color: 'white' }}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.final}>
        <Text>¿Ya tienes una cuenta? </Text>
        <Text onPress={handleBackLogin} style={styles.registrar}>
          Inicia Sesión
        </Text>
      </View>
    </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: COLORS.WHITE
  },
  form: {
    marginTop: 30,
    width: '90%'
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: '20%',
    marginBottom: 24
  },
  iconEyeButton: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    backgroundColor: COLORS.GRAY,
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 0
  },
  condiciones: {
    marginTop: 20,
    width: '95%'
  },
  icono: {
    padding: 10
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.GRAY,
    borderRadius: 4
  },
  checkbox: {
    paddingRight: 0
  },
  terminos: {
    // flexDirection: 'row',
    // alignItems: 'center',
    marginTop: 20
  },
  bregistrarse: {
    marginTop: 20,
    backgroundColor: COLORS.GREEN,
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.GREEN,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10

  },
  searchIcon: {
    padding: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '3%'

  },
  buttonWrapper: {
    marginRight: 25,
    borderRadius: 20
  },
  final: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 93
  },
  registrar: {
    fontWeight: 'bold',
    color: COLORS.GREEN
  },
  errorContainer: {
    height: 50,
    marginTop: 10,
    alignSelf: 'flex-start',
    marginLeft: 20
  },
  error: {
    color: COLORS.DANGER
  }
})
