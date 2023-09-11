import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  FlatList,
  Picker,
} from "react-native";
import Webcam from "react-webcam";
import io from "socket.io-client";
import axios from "axios";

const HomeScreen = () => {
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const [imageDataList, setImageDataList] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(
    "b188d8b180c5cfef42c9b8e1a225a0590f77d1bf58b15571c2b19f10b37e0da2"
  );
  const CONTROL_VALUE = "192";
  const PROB_CONTROL = 0.71;
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
  const [recording, setRecording] = useState(false);
  const chunks = [];
  let isSendingNotification = false;
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [timer, setTimer] = useState(null);
  let _recording = false;
  let start = false;

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
      if (cameraInfo.ip.includes(CONTROL_VALUE)) {
        start = true;
        const imageSendingInterval = setInterval(() => {
          handleSendImage();
        }, 500);
        return () => {
          clearInterval(imageSendingInterval);
        };
      } else {
        handleConnectCamera();
      }
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("camera_feed", async (data) => {
        const updatedImageDataList = [...imageDataList];
        updatedImageDataList.push(data.image);
        setImageDataList(updatedImageDataList);

        console.log("Prediction recived", data.prediction);
        const classIndex = data.prediction.class_index;
        const classConfidence = data.prediction.class_confidence;

        console.log("La clase es:", classIndex);
        handleSendPredict(classIndex, classConfidence);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("prediction", async (response) => {
        console.log("Prediction received:", response);
        const clase = response.class_index;
        const probabilidad = response.class_confidence;
        // Verificar si el class_index es diferente de 6
        handleSendPredict(clase, probabilidad);
      });
    }
  }, [socket]);

  const handleSendPredict = async (clase, prob) => {
    try {
      if (clase === 6 || prob <= PROB_CONTROL || typeof clase === "undefined") {
        if (!isSendingNotification) {
          setTimeout(() => {
            isSendingNotification = false;
          }, 300000); // Espera 5 minutos antes de permitir el próximo envío
          setSuspiciousActivity(false);
        }
      } else {
        if (!isSendingNotification) {
          isSendingNotification = true;
          const notificationData = {
            tokens: [registrationToken1, registrationToken2],
            title: "Evento detectado",
            body: "Se ha detectado un evento sospechoso",
            categoria: clase,
          };

          const response = await axios.post(
            "https://verbose-dollop-g667rwgj9xwhwj6q-3000.app.github.dev/send-notification",
            notificationData
          );

          if (start) {
            startRecording();
          } else {
          }

          console.log("Notification sent:", response.data.message);

          setTimeout(() => {
            isSendingNotification = false;
          }, 300000); // Espera 5 segundos antes de permitir el próximo envío
          setSuspiciousActivity(true);
        }
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleConnect = () => {
    setConnected(true);
    const newSocket = io("http://200.7.217.114:5000");
    setSocket(newSocket);
    console.log("Connected successfully", newSocket);
  };

  const handleDisconnectCamera = () => {
    if (socket) {
      socket.emit("disconnect_camera");
      setConnected(false); // Actualiza el estado de la cámara
      setSocket(false);
    }
  };

  const handleConnectCamera = async () => {
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

      const cameraData = {
        user: cameraInfo.usuario,
        password: cameraInfo.contrasena,
        ip: cameraInfo.ip,
        port: cameraInfo.port,
      };

      const response = await axios.post(
        "https://verbose-dollop-g667rwgj9xwhwj6q-3000.app.github.dev/update-camera",
        cameraData
      );

      console.log("Notification sent:", response.data.message);
    }
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

  const startRecording = () => {
    console.log("enviando video");
    if (webcamRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          webcamRef.current.srcObject = stream;
          mediaRecorderRef.current = new MediaRecorder(stream);

          mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
          };

          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const videoFile = new File([blob], `${Date.now()}.webm`, {
              type: "video/webm",
            });

            const formData = new FormData();
            formData.append("video", videoFile);

            fetch(
              "https://verbose-dollop-g667rwgj9xwhwj6q-3000.app.github.dev/upload",
              {
                method: "POST",
                body: formData,
              }
            )
              .then((response) => response.json())
              .then((data) => {
                console.log(data.message); // Debería mostrar "Video guardado correctamente" desde el servidor
              })
              .catch((error) => {
                console.error("Error al enviar el video:", error);
              });
          };

          mediaRecorderRef.current.start();
          setTimeout(() => {
            mediaRecorderRef.current.stop();
            stream.getTracks().forEach((track) => track.stop());
          }, 5000); // Grabar durante 5 segundos
          setRecording(true);
        })
        .catch((error) => {
          console.error("Error accessing webcam:", error);
        });
    }
  };

  const startRecording3 = () => {
    _recording = true;

    setTimeout(() => {
      _recording = false;
    }, 5000); // 5000 milisegundos (5 segundos)

    setTimeout(() => {
      console.log(capturedImages);
    }, 6000);
  };

  const capturarImages = (image) => {
    if (_recording) {
      capturedImages.push(image);
    }
  };

  // Calcula el tamaño de cada cámara en función del número de cámaras y el tamaño de la ventana
  const cameraWidth = windowWidth / cameraInfo.numCameras;
  const cameraHeight = (cameraWidth * VIDEO_HEIGHT) / VIDEO_WIDTH;

  // Calcula el número de columnas en función del número de cámaras
  const numColumns = cameraInfo.numCameras;

  return (
    <View style={styles.container}>
      {suspiciousActivity && (
        <View style={styles.popup}>
          <Text style={styles.suspiciousMessage}>
            Se ha detectado una actividad sospechosa
          </Text>
        </View>
      )}
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
          {cameraInfo.numCameras === "1" &&
            ((<Text>Camara a la que desea conectarse</Text>),
            (
              <TextInput
                style={styles.input}
                value={cameraInfo.cameraToConnect}
                onChangeText={(text) =>
                  handleInputChange("cameraToConnect", text)
                }
                keyboardType="numeric"
                placeholder="Camara a la que desea conectarse"
              />
            ))}
          <Button
            title="Conectar a la cámara"
            onPress={handleConnect}
            disabled={
              !cameraInfo.ip || !cameraInfo.port || !cameraInfo.numCameras
            }
          />
        </View>
      ) : cameraInfo.ip.includes(CONTROL_VALUE) ? (
        <View style={styles.webcamContainer}>
          <Webcam
            audio={false}
            videoConstraints={{ deviceId: selectedDevice }}
            ref={webcamRef}
          />
          {connected && (
            <Button
              title="Desconectar Cámara"
              onPress={handleDisconnectCamera}
            />
          )}
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
    position: "absolute",
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
