import { Camera, CameraType } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
const IP = "172.20.10.2:8000";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [ws, setWs] = useState(null);
  const [imageData, setImageData] = useState(null);

  // const [cameraRef, setCameraRef] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    function setWsConnection() {
      const newWs = new WebSocket(`ws://${IP}/stream`);
      setWs(newWs);
    }
    setWsConnection();
  }, [ws]);

  const startStreaming = async () => {
    try {
      if (cameraRef.current && ws) {
        // Take picture with camera
        const picture = await cameraRef.current.takePictureAsync();

        // Resize image to YOLOv5 size (640x640)
        const resizedPicture = await ImageManipulator.manipulateAsync(
          picture.uri,
          [{ resize: { width: 640, height: 640 } }],
          { format: "jpeg" }
        );

        // Convert image to base64 format
        const response = await fetch(resizedPicture.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          const base64data = reader.result.split(",")[1];
          ws.send(JSON.stringify({ type: "image", data: base64data }));
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (ws) {
      setInterval(startStreaming, 500);
      ws.onmessage = (event) => {
        console.log("hi");
        const current_photo = JSON.parse(event.data).current_photo;
        // console.log(current_photo);
        setImageData(current_photo);
      };
    }
  }, [ws]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function toggleCameraType() {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${imageData}`}}
          style={styles.image}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff00",
    flexDirection: "column", // Changed to column
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
    height: "50%", // Adjusted height to 50%
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#000",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: {
    flex: 1,
    height: "50%", // Adjusted height to 50%
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#000",
  },
  image: {
    flex: 1,
  },
});