import React, { useContext } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity, Keyboard, Alert } from 'react-native'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { Icon, CheckBox } from 'react-native-elements'
import Constants from 'expo-constants'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { useTogglePasswordVisibility } from '../hooks/useTogglePassVisibility'
import { COLORS } from '../constants'
import { AuthContext } from '../context/AuthContext'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'

const validationSchema = yup.object().shape({
  username: yup.string().required('El usuario es requerido'),
  password: yup.string().required('La contraseña es requerida')
});

export default function LoginScreen ({ navigation }) {
    const { login } = useContext(AuthContext)
    const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility()
    const [isSelected, setSelection] = useState(true)
    const toggleCheckbox = () => setSelection(!isSelected)

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },

    onSubmit: (values) => {
      login({ username: values.username, password: values.password })
    }
  })

  const handleLoginButtonPress = () => {
    /* Keyboard.dismiss()
    if(isSelected){
      formik.handleSubmit()
    } */
    navigation.navigate('Home');
  }
  
  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola de nuevo!</Text>
      <View style={styles.form}>
        <Text style={{ fontWeight: 'bold' }}>Usuario</Text>
        <View style={styles.inputContainer}>
          <FontAwesome style={styles.searchIcon} name='user-o' size={20} color='black' />
          <TextInput
            style={styles.input}
            placeholder='Ingrese su usuario'
            onChangeText={formik.handleChange('username')}
            onBlur={formik.handleBlur('username')}
            value={formik.values.username}
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
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            value={formik.values.password}
          />
          <Pressable style={styles.iconEyeButton} onPress={handlePasswordVisibility}>
            <MaterialCommunityIcons name={rightIcon} size={22} style={styles.icono} color='#232323' />
          </Pressable>
        </View>

        <View style={styles.containerRecuerdame}>
          <View style={styles.row}>
            <CheckBox
              checked={isSelected}
              onPress={toggleCheckbox}
              iconType='material-community'
              checkedIcon='checkbox-marked'
              title='Acepto los términos.'
              titleProps={{ style: { color: 'black', backgroundColor: COLORS.WHITE } }}
              containerStyle={{ backgroundColor: COLORS.WHITE, borderWidth: 0, padding: 0, margin: 0, marginLeft: 0 }}
              uncheckedIcon='checkbox-blank-outline'
              checkedColor={COLORS.GREEN}
            />
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.textOlvidaste}>¿Olvidaste tu contraseña?</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.biniciar, {opacity: isSelected ? 1 :0.5}]} onPress={handleLoginButtonPress} disabled={!isSelected}>
          <Text style={{ color: 'white' }}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.errorContainer}>
        {formik.touched.username && formik.errors.username ? (<Text style={styles.error}>* {formik.errors.username}</Text>) : null}
        {formik.touched.password && formik.errors.password ? (<Text style={styles.error}>* {formik.errors.password}</Text>) : null}
      </View>

      <View style={styles.separatorContainer}>
        <Text style={styles.separatorText}>O Inicia Sesión con</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonWrapperf}>
          <FontAwesome name='facebook' size={30} color='#335CA6FF' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrapperg}>
          <FontAwesome name='google' size={30} color='#C71610FF' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrappera}>
          <FontAwesome name='apple' size={30} color='#565E6CFF' />
        </TouchableOpacity>
      </View>

      <View style={styles.final}>
        <Text>¿No tienes una cuenta? </Text>
        <Text onPress={handleRegisterPress} style={styles.registrar}>
          Regístrate
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: Constants.statusBarHeight,
      backgroundColor: COLORS.WHITE
    },
    form: {
      width: '90%',
      marginTop: 30
    },
    title: {
      fontSize: 30,
      fontWeight: '900',
      marginTop: '20%',
      marginBottom: 24
    },
    inputContainer: {
      backgroundColor: COLORS.GRAY,
      flexDirection: 'row',
      borderRadius: 4,
      borderWidth: 0
    },
    iconEyeButton: {
      justifyContent: 'center',
      alignItems: 'center'
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
    containerRecuerdame: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    flexRow: {
      flexDirection: 'row'
    },
    textOlvidaste: {
      color: COLORS.GREEN
    },
    separatorContainer: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 16
    },
    separatorText: {
      marginHorizontal: 8,
      fontSize: 14,
      color: COLORS.GRAY_EXTRA_SOFT
    },
    biniciar: {
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
    buttonWrapperg: {
      backgroundColor: '#FEF1F1FF',
      alignItems: 'center',
      padding: '2%',
      width: '18%',
      marginRight: 10,
      borderRadius: 20
    },
    buttonWrappera: {
      backgroundColor: '#F3F4F6FF',
      alignItems: 'center',
      padding: '2%',
      width: '18%',
      marginRight: 10,
      borderRadius: 20
    },
    buttonWrapperf: {
      backgroundColor: '#F3F6FBFF',
      alignItems: 'center',
      padding: '2%',
      width: '18%',
      marginRight: 10,
      borderRadius: 20
    },
    final: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 16,
      marginTop: 70
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
  