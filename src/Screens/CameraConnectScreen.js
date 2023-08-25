import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";

const CameraConnectScreen = () => {
  const [cameraIp, setCameraIp] = useState("");
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    // Conectar a la cámara agregando "/video" a la URL
    setConnected(true);
  };

  return (
    <View>
      {!connected ? (
        <View>
          <TextInput
            placeholder="Ingrese la IP de la cámara"
            value={cameraIp}
            onChangeText={setCameraIp}
          />
          <Button title="Conectar" onPress={handleConnect} />
        </View>
      ) : (
        <View>
          <video autoPlay controls>
            <source
              src={`http://${cameraIp}:4747/video`}
              type="video/mp4"
              crossOrigin="anonymous"
            />
            Su navegador no admite la etiqueta de video.
          </video>
        </View>
      )}
    </View>
  );
};

export default CameraConnectScreen;
