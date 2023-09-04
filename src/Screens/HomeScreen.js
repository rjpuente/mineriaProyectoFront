import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { View, Picker, Button, StyleSheet, Text } from "react-native";
import io from "socket.io-client";
import axios from "axios";

const HomeScreen = () => {
  const [connected, setConnected] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [socket, setSocket] = useState(null);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const registrationToken1 =
    "fS3iQ0H_Rsu1uuILxtYhV9:APA91bEXLeq-bHbFVgiNGWIs0IckjFKYrjS1PArGr8tFDeFjBnqb49k_Za8Nw1ZkwltLzo06FWP7PJygKumUUcdoyiU8tvMlHghQ_AfJr5DPreT4kDweJ8zgNhGVVlvYib7aiMMB-qLg";
  const registrationToken2 =
    "eOXMWqQiR9yyNQjAR3YszP:APA91bE1hVISel447vDx2_6IB9tCEpbO1AlfpzgEQl9s-P8dQKCu8PCHtidCSE2kig1ys41kFJHad21W1EzVRxN12yOF8mcrhOrqB-JbVTXMJuHXA3QyqfilHqv9P2f_6aoAPs4ZytML";

  let isSendingNotification = false;

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
      }, 500);

      return () => {
        clearInterval(imageSendingInterval);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("prediction", async (response) => {
        console.log("Prediction received:", response);
        const clase = response.class_index;
        // Verificar si el class_index es diferente de 6
        if (response.class_index == 6) {
          if (!isSendingNotification) {
            setTimeout(() => {
              isSendingNotification = false;
            }, 6000); // Espera 5 segundos antes de permitir el próximo envío
            setSuspiciousActivity(false);
          }
        } else {
          if (!isSendingNotification) {
            isSendingNotification = true;

            const notificationData = {
              tokens: [registrationToken1, registrationToken2],
              title: "Evento detectado",
              body: "Se ha detectado un evento sospechoso",
              categoria: response.class_index,
            };

            try {
              const response = await axios.post(
                "https://verbose-dollop-g667rwgj9xwhwj6q-3000.app.github.dev/send-notification",
                notificationData
              );
              console.log("Notification sent:", response.data.message);
            } catch (error) {
              console.error("Error sending notification:", error);
            }

            setTimeout(() => {
              isSendingNotification = false;
            }, 6000); // Espera 5 segundos antes de permitir el próximo envío
            setSuspiciousActivity(true);
          }
        }
      });
    }
  }, [socket]);

  const handleConnect = () => {
    setConnected(true);
    const newSocket = io("http://192.168.0.69:5000");
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
        <View style={styles.container}>
          <View style={styles.webcamContainer}>
            <Webcam
              audio={false}
              videoConstraints={{ deviceId: selectedDevice }}
              ref={webcamRef}
            />
          </View>
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
  container: {
    flex: 1, // Esto asegura que el contenedor ocupe toda la pantalla
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
  },
  webcamContainer: {
    flex: 1,
    width: 780,
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
