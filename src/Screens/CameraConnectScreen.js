import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { View, Button, Picker } from "react-native";
import io from "socket.io-client";

const CameraConnectScreen = () => {
  const [connected, setConnected] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [socket, setSocket] = useState(null);

  const webcamRef = useRef(null); // Referencia a la webcam

  useEffect(() => {
    // Obtener la lista de dispositivos de entrada disponibles
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter((device) => device.kind === "videoinput");
      setDevices(cameras);
    });
  }, []);

  const handleConnect = () => {
    // Conectar a la cámara seleccionada
    setConnected(true);

    // Establecer la conexión WebSocket
    const newSocket = io("http://localhost:5000"); // Cambia la URL a tu backend
    setSocket(newSocket);
  };

  useEffect(() => {
    if (socket) {
      // Escuchar eventos desde el backend
      socket.on("prediction", (prediction) => {
        console.log("Prediction received:", prediction);
        // Aquí puedes mostrar la notificación o realizar otras acciones según la predicción
      });

      socket.on("error", (error) => {
        console.error("Error received:", error);
      });
    }
  }, [socket]);

  const handleSendImage = () => {
    if (socket && selectedDevice && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      // Enviar la imagen al backend a través del socket
      socket.emit("image", imageSrc);
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
        <View>
          <Webcam audio={false} videoConstraints={{ deviceId: selectedDevice }} ref={webcamRef} />
          <Button title="Enviar Imagen" onPress={handleSendImage} />
        </View>
      )}
    </View>
  );
};

export default CameraConnectScreen;
