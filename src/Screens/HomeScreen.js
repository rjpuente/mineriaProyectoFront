import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import io from "socket.io-client";

const HomeScreen = () => {
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const [imageDataList, setImageDataList] = useState([]);
  const VIDEO_WIDTH = 1280; // Ancho en píxeles
  const VIDEO_HEIGHT = 720; // Alto en píxeles
  const windowWidth = Dimensions.get("window").width; // Ancho de la ventana
  const NUM_CAMERAS_PER_ROW = 2; // Número de cámaras por fila
  const CAMERA_WIDTH = windowWidth / NUM_CAMERAS_PER_ROW;
  const CAMERA_HEIGHT = (CAMERA_WIDTH * VIDEO_HEIGHT) / VIDEO_WIDTH;

  const registrationToken1 =
    "fS3iQ0H_Rsu1uuILxtYhV9:APA91bEXLeq-bHbFVgiNGWIs0IckjFKYrjS1PArGr8tFDeFjBnqb49k_Za8Nw1ZkwltLzo06FWP7PJygKumUUcdoyiU8tvMlHghQ_AfJr5DPreT4kDweJ8zgNhGVVlvYib7aiMMB-qLg";
  const registrationToken2 =
    "eOXMWqQiR9yyNQjAR3YszP:APA91bE1hVISel447vDx2_6IB9tCEpbO1AlfpzgEQl9s-P8dQKCu8PCHtidCSE2kig1ys41kFJHad21W1EzVRxN12yOF8mcrhOrqB-JbVTXMJuHXA3QyqfilHqv9P2f_6aoAPs4ZytML";

  const [cameraInfo, setCameraInfo] = useState({
    usuario: "",
    contrasena: "",
    ip: "",
    port: "",
    numCameras: 0,
    cameraToConnect: 0,
  });

  const handleInputChange = (field, value) => {
    setCameraInfo({
      ...cameraInfo,
      [field]: value,
    });
  };

  useEffect(() => {
    if (socket) {
      handleConnectCamera();
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("camera_feed", (data) => {
        const updatedImageDataList = [...imageDataList];
        updatedImageDataList.push(data.image);
        setImageDataList(updatedImageDataList);

        console.log("Prediction recived", data.prediction);
        const clase = data.class_index;
        const probabilidad = data.class_confidence;

        socket.emit("sendImage", data.image);
      });
    }
  }, [socket]);

  const handleConnect = () => {
    setConnected(true);
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    console.log("Connected successfully", newSocket);
  };

  const handleDisconnectCamera = () => {
    if (socket) {
      socket.emit("disconnect_camera");
      setConnected(false); // Actualiza el estado de la cámara
    }
  };

  const handleConnectCamera = () => {
    console.log("Conectando las cámaras");
    if (socket) {
      socket.emit(
        "connect_camera",
        cameraInfo.usuario,
        cameraInfo.contrasena,
        cameraInfo.ip,
        cameraInfo.port,
        cameraInfo.numCameras,
        cameraInfo.cameraToConnect
      );
    }
  };

  // Calcula el tamaño de cada cámara en función del número de cámaras y el tamaño de la ventana
  const cameraWidth = windowWidth / cameraInfo.numCameras;
  const cameraHeight = (cameraWidth * VIDEO_HEIGHT) / VIDEO_WIDTH;

  // Calcula el número de columnas en función del número de cámaras
  const numColumns = cameraInfo.numCameras;

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
          {cameraInfo.numCameras === "1" && (
            <Text>Camara a la que desea conectarse</Text>,
            <TextInput
              style={styles.input}
              value={cameraInfo.cameraToConnect}
              onChangeText={(text) =>
                handleInputChange("cameraToConnect", text)
              }
              keyboardType="numeric"
            />
          )}
          <Button
            title="Conectar a la cámara"
            onPress={handleConnect}
            disabled={
              !cameraInfo.ip || !cameraInfo.port || !cameraInfo.numCameras
            }
          />
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={imageDataList}
            numColumns={NUM_CAMERAS_PER_ROW}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: `data:image/jpeg;base64, ${item}` }}
                style={{
                  width: CAMERA_WIDTH,
                  height: CAMERA_HEIGHT,
                  margin: 5,
                }}
              />
            )}
          />
          {connected && (
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
    width: "60%",
  },
  cameraGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
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
