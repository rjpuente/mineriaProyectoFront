import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { View, Text, Button, Picker, StyleSheet, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
import { COLORS } from '../constants';

const CameraConnectScreen = () => {
  const [connected, setConnected] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [socket, setSocket] = useState(null);

  const webcamRef = useRef(null); // Referencia a la webcam

  useEffect(() => {
    // Obtener la lista de dispositivos de entrada disponibles
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      setDevices(cameras);
    });
  }, []);

  const handleConnect = () => {
    // Conectar a la cámara seleccionada
    setConnected(true);

    // Establecer la conexión WebSocket
    const newSocket = io('http://localhost:5000'); // Cambia la URL a tu backend
    setSocket(newSocket);
  };

  useEffect(() => {
    if (socket) {
      // Escuchar eventos desde el backend
      socket.on('prediction', (prediction) => {
        console.log('Prediction received:', prediction);
        // Aquí puedes mostrar la notificación o realizar otras acciones según la predicción
      });

      socket.on('error', (error) => {
        console.error('Error received:', error);
      });
    }
  }, [socket]);

  const handleSendImage = () => {
    if (socket && selectedDevice && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      // Enviar la imagen al backend a través del socket
      socket.emit('image', imageSrc);
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Cámara</Text>
      {!connected ? (
        <View style={styles.formContainer}>
          <Picker
            style={[styles.picker, styles.input]}
            selectedValue={selectedDevice}
            onValueChange={(value) => setSelectedDevice(value)}
          >
            <Picker.Item label="Seleccionar cámara" value="" />
            {devices.map((device) => (
              <Picker.Item
                key={device.deviceId}
                label={device.label || `Cámara ${device.deviceId}`}
                value={device.deviceId}
              />
            ))}
          </Picker>
          
          <TouchableOpacity
            onPress={handleConnect}
            disabled={!selectedDevice}
            style={[
              styles.connectButton,
              !selectedDevice && styles.disabledButton,
            ]}
          >
            <Text style={styles.buttonText}>Conectar a la cámara</Text>
          </TouchableOpacity>

        </View>
      ) : (
        <View style={styles.webcamContainer}>
          <Webcam audio={false} videoConstraints={{ deviceId: selectedDevice }} ref={webcamRef} />
          <TouchableOpacity style={styles.connectButton} onPress={handleSendImage}>
            <Text style={styles.buttonText}>Enviar Imagen</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontSize: 25,
    marginTop: 20,
    marginBottom: 20,
    color: COLORS.GREEN,
  },
  webcamContainer: {
    alignItems: 'center',
  },
  formContainer: {
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sendImageButton: {
    marginTop: 10,
    backgroundColor: COLORS.SECONDARY,
    color: COLORS.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  connectButton: {
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
  disabledButton: {
    backgroundColor: COLORS.GREEN_SOFT
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    textAlign: 'center'
  },
});

export default CameraConnectScreen;
