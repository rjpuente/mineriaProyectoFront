import React, { useContext, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity, Keyboard } from 'react-native'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { CheckBox, Icon } from 'react-native-elements'
import Constants from 'expo-constants'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { AuthContext } from '../context/AuthContext'
import { useTogglePasswordVisibility } from '../hooks/useTogglePassVisibility'
import { COLORS } from '../constants'
import { StatusBar } from 'expo-status-bar'

const validationSchema = yup.object().shape({
  username: yup.string().required('El usuario es requerido'),
  email: yup.string().email('Correo electrónico inválido').required('El correo electrónico es requerido'),
  password: yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida')
})

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext)
  const [isSelected, setSelection] = useState(true)
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      isSelected: true
    },
    validationSchema,
    onSubmit: values => {
      register(
        {
          username: values.username,
          email: values.email,
          password: values.password
        }
      )
    }
  })

  const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility()

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } = formik

  const toggleCheckbox = () => {
    formik.setFieldValue('isSelected', !values.isSelected)
  }

  const handleRegisterButtonPress = () => {
    Keyboard.dismiss()
    if(isSelected){
      formik. handleSubmit()
    }
  }

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
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
            value={values.username}
          />
        </View>

        <Text style={{ fontWeight: 'bold', marginTop: '3%' }}>Correo</Text>
        <View style={styles.inputContainer}>
          <Icon style={styles.searchIcon} name='mail-outline' />
          <TextInput
            style={styles.input}
            placeholder='Ingrese su correo'
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
        </View>

        <Text style={{ fontWeight: 'bold', marginTop: '3%' }}>Contraseña</Text>
        <View style={styles.inputContainer}>
          <Icon style={styles.searchIcon} name='lock-open' />
          <TextInput
            id='clave1'
            style={styles.input}
            placeholder='Ingrese su contraseña'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={passwordVisibility}
            enablesReturnKeyAutomatically
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
          />
          <Pressable style={styles.iconEyeButton} onPress={handlePasswordVisibility}>
            <MaterialCommunityIcons name={rightIcon} size={22} style={styles.icono} color='#232323' />
          </Pressable>
        </View>

        <View style={styles.condiciones}>
          <CheckBox
            checked={values.isSelected}
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

        <TouchableOpacity style={[styles.bregistrarse, {opacity: values.isSelected ? 1 :0.5}]} onPress={handleRegisterButtonPress} disabled={!values.isSelected}>
          <Text style={{ color: 'white' }}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.errorContainer}>
        {touched.username && errors.username && <Text style={styles.error}>* {errors.username}</Text>}
        {touched.email && errors.email && <Text style={styles.error}>* {errors.email}</Text>}
        {touched.password && errors.password && <Text style={styles.error}>* {errors.password}</Text>}
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
