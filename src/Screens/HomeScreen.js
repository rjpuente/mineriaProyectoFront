import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { View, Picker, Button, StyleSheet, Text } from "react-native";
import io from "socket.io-client";
import axios from 'axios';

const HomeScreen = () => {
  const [connected, setConnected] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [socket, setSocket] = useState(null);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const registrationToken = 'fS3iQ0H_Rsu1uuILxtYhV9:APA91bEXLeq-bHbFVgiNGWIs0IckjFKYrjS1PArGr8tFDeFjBnqb49k_Za8Nw1ZkwltLzo06FWP7PJygKumUUcdoyiU8tvMlHghQ_AfJr5DPreT4kDweJ8zgNhGVVlvYib7aiMMB-qLg'; 

  const webcamRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter((device) => device.kind === "videoinput");
      setDevices(cameras);
    });
  }, []);

  useEffect(() => {
    if (socket) {
      const imageSendingInterval = setInterval(() => {
        handleSendImage();
      }, 5000);

      return () => {
        clearInterval(imageSendingInterval);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("prediction", async (response) => {
        console.log("Prediction received:", response);
        const clase = response.class_index
        // Verificar si el class_index es diferente de 3
        if (response.class_index == 3 ||  response.class_index == 6) {
          setSuspiciousActivity(false);
        } else {
          const notificationData = {
            token: registrationToken,
            title: 'Evento detectado',
            body: 'Se ha detectado un evento sospechoso',
            categoria: response.class_index
          };
          try {
            const response = await axios.post('http://localhost:3000/send-notification', notificationData);
            console.log('Notification sent:', response.data.message);
          } catch (error) {
            console.error('Error sending notification:', error);
          }
          setSuspiciousActivity(true);
        }
      });
    }
  }, [socket]);

  const handleConnect = () => {
    setConnected(true);
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    console.log("Connected successfully", newSocket);
  };

  const handleSendImage = () => {
    console.log("Sending image");
    if (socket && selectedDevice && webcamRef.current) {
      const newImageSrc = webcamRef.current.getScreenshot();

      fetch(newImageSrc)
        .then((response) => response.blob())
        .then((blob) => {
          if (blob.size > 0) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const imageData = event.target.result;
              socket.emit("image", imageData); // Enviar la cadena base64
            };
            reader.readAsDataURL(blob);
          } else {
            console.warn("Image blob is empty");
          }
        })
        .catch((error) => {
          console.error("Error sending image:", error);
        });
    }
  };

  return (
    <View>
      {!connected ? (
        <View>
          <Picker
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
          <Button
            title="Conectar a la cámara"
            onPress={handleConnect}
            disabled={!selectedDevice}
          />
        </View>
      ) : (
        <View style={styles.webcamContainer}>
          <Webcam
            audio={false}
            videoConstraints={{ deviceId: selectedDevice }}
            ref={webcamRef}
          />
          {suspiciousActivity && (
            <View style={styles.popup}>
              <Text style={styles.suspiciousMessage}>
                ¡Actividad sospechosa detectada!
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webcamContainer: {
    flex: 1,
  },
  popup: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  suspiciousMessage: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default HomeScreen;
