import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, Button, StyleSheet, Text, Image } from "react-native";
import io from "socket.io-client";

const HomeScreen = () => {
  const [connected, setConnected] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [socket, setSocket] = useState(null);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const [imageData, setImageData] = useState(null);
  const VIDEO_WIDTH = 1280; // Ancho en píxeles
  const VIDEO_HEIGHT = 720; // Alto en píxeles

  const registrationToken1 =
    "fS3iQ0H_Rsu1uuILxtYhV9:APA91bEXLeq-bHbFVgiNGWIs0IckjFKYrjS1PArGr8tFDeFjBnqb49k_Za8Nw1ZkwltLzo06FWP7PJygKumUUcdoyiU8tvMlHghQ_AfJr5DPreT4kDweJ8zgNhGVVlvYib7aiMMB-qLg";
  const registrationToken2 =
    "eOXMWqQiR9yyNQjAR3YszP:APA91bE1hVISel447vDx2_6IB9tCEpbO1AlfpzgEQl9s-P8dQKCu8PCHtidCSE2kig1ys41kFJHad21W1EzVRxN12yOF8mcrhOrqB-JbVTXMJuHXA3QyqfilHqv9P2f_6aoAPs4ZytML";

  let isSendingNotification = false;

  const webcamRef = useRef(null);

  const [cameraInfo, setCameraInfo] = useState({
    usuario: "",
    contrasena: "",
    ip: "",
    port: "",
    numCameras: 0,
  });

  const handleInputChange = (field, value) => {
    setCameraInfo({
      ...cameraInfo,
      [field]: value,
    });
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter((device) => device.kind === "videoinput");
      setDevices(cameras);
    });
  }, []);

  useEffect(() => {
    if (socket) {
      handleConnectCamera();
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("camera_feed", (data) => {
        setImageData(data.image);
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

  const handleDisconnectCamera = () => {
    if (socket) {
      socket.emit("disconnect_camera");
      setConnected(false); // Actualiza el estado de la cámara
    }
  };

  const handleConnectCamera = () => {
    console.log("Conectando la camara");
    if (socket) {
      socket.emit(
        "connect_camera",
        cameraInfo.usuario,
        cameraInfo.contrasena,
        cameraInfo.ip,
        cameraInfo.port,
        cameraInfo.numCameras
      );
    }
  };

  return (
    <View style={styles.container}>
      {!connected ? (
        <View style={styles.formContainer}>
          <Text>Usuario:</Text>
          <TextInput
            style={styles.input}
            value={cameraInfo.usuario}
            onChangeText={(text) => handleInputChange("usuario", text)}
          />
          <Text>Contraseña:</Text>
          <TextInput
            style={styles.input}
            value={cameraInfo.contrasena}
            onChangeText={(text) => handleInputChange("contrasena", text)}
          />
          <Text>IP:</Text>
          <TextInput
            style={styles.input}
            value={cameraInfo.ip}
            onChangeText={(text) => handleInputChange("ip", text)}
          />
          <Text>Puerto:</Text>
          <TextInput
            style={styles.input}
            value={cameraInfo.port}
            onChangeText={(text) => handleInputChange("port", text)}
          />
          <Text>Cantidad de cámaras:</Text>
          <TextInput
            style={styles.input}
            value={cameraInfo.numCameras}
            onChangeText={(text) => handleInputChange("numCameras", text)}
            keyboardType="numeric"
          />
          <Button
            title="Conectar a la cámara"
            onPress={handleConnect}
            disabled={
              !cameraInfo.usuario ||
              !cameraInfo.contrasena ||
              !cameraInfo.ip ||
              !cameraInfo.port ||
              !cameraInfo.numCameras
            }
          />
        </View>
      ) : (
        <View style={styles.container}>
          {imageData && (
            <Image
              source={{ uri: `data:image/jpeg;base64, ${imageData}` }}
              style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT }}
            />
          )}
          {connected && ( // Mostrar el botón de desconexión solo si la cámara está conectada
            <Button
              title="Desconectar Cámara"
              onPress={handleDisconnectCamera}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%", // Ajusta el ancho del formulario al 80% del contenedor principal
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
    padding: 5,
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
