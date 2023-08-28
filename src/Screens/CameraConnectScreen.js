import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { View, Picker, Button, StyleSheet } from "react-native";
import io from "socket.io-client";

const CameraConnectScreen = () => {
  const [connected, setConnected] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [socket, setSocket] = useState(null);
  const [imageSrc, setImageSrc] = useState("");

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
      // Manejar el evento de predicción recibida
      socket.on("prediction", (response) => {
        console.log("Prediction received:", response); // Mostrar la predicción por consola
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  webcamContainer: {
    flex: 1,
  },
});

export default CameraConnectScreen;
