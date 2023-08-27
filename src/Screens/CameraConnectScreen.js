import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import { View, Button, Picker } from "react-native";

const CameraConnectScreen = () => {
  const [connected, setConnected] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");

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
          <Webcam audio={false} videoConstraints={{ deviceId: selectedDevice }} />
        </View>
      )}
    </View>
  );
};

export default CameraConnectScreen;
